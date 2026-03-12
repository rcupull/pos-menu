import xmlrpc from "xmlrpc";
import { env } from "../config/env.js";
import type { MenuCategory, MenuProduct } from "../types/catalog.js";

class OdooAdapter {
  private uid: number | null = null;

  private common = xmlrpc.createClient({
    url: `${env.ODOO_URL}/xmlrpc/2/common`,
  });

  private object = xmlrpc.createClient({
    url: `${env.ODOO_URL}/xmlrpc/2/object`,
  });

  private async methodCall<T>(
    client: xmlrpc.Client,
    method: string,
    params: unknown[],
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      client.methodCall(method, params, (err, value) => {
        if (err) reject(err);
        else resolve(value as T);
      });
    });
  }

  private async authenticate(): Promise<number> {
    if (this.uid) return this.uid;

    const uid = await this.methodCall<number>(this.common, "authenticate", [
      env.ODOO_DATABASE,
      env.ODOO_USERNAME,
      env.ODOO_API_KEY,
      {},
    ]);

    if (!uid) {
      throw new Error(
        "No se pudo autenticar en Odoo 18. Verifique credenciales.",
      );
    }

    this.uid = uid;
    return uid;
  }

  private async executeKw<T>(
    model: string,
    method: string,
    args: unknown[] = [],
    kwargs: Record<string, unknown> = {},
  ): Promise<T> {
    const uid = await this.authenticate();

    return this.methodCall<T>(this.object, "execute_kw", [
      env.ODOO_DATABASE,
      uid,
      env.ODOO_API_KEY,
      model,
      method,
      args,
      kwargs,
    ]);
  }

  async fetchCategories(): Promise<MenuCategory[]> {
    const categories = await this.executeKw<any[]>(
      "pos.category",
      "search_read",
      [[]],
      {
        fields: ["id", "name", "sequence"],
        order: "sequence asc",
      },
    );

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      sortOrder: cat.sequence ?? 0,
    }));
  }

  async fetchProducts(): Promise<MenuProduct[]> {
    // En Odoo 18, 'available_in_pos' sigue siendo válido, pero 'active' es implícito en search_read a menos que se diga lo contrario
    const products = await this.executeKw<any[]>(
      "product.template",
      "search_read",
      [
        [
          ["available_in_pos", "=", true],
          ["sale_ok", "=", true],
        ],
      ],
      {
        fields: [
          "id",
          "name",
          "list_price",
          "description_sale",
          "image_128", // Optimización: Odoo 18 genera tamaños específicos. 128 o 256 suelen bastar para catálogos.
          "pos_categ_ids", // CAMBIO IMPORTANTE: Odoo moderno permite múltiples categorías POS
          "write_date",
        ],
      },
    );

    const categories = await this.fetchCategories();
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    return products.map((product, index) => {
      // Odoo 18 usa Many2many para categorías POS (pos_categ_ids), tomamos la primera si existe
      const categoryId =
        product.pos_categ_ids && product.pos_categ_ids.length > 0
          ? product.pos_categ_ids[0]
          : null;

      return {
        id: product.id,
        name: product.name,
        price: product.list_price,
        currency: "CUP",
        description: product.description_sale || "",
        // Las imágenes en Odoo 18 siguen viniendo en Base64 vía XML-RPC
        imageUrl: product.image_128
          ? `data:image/png;base64,${product.image_128.replace(/\s/g, "")}`
          : null,
        localImageUrl: null,
        categoryId,
        categoryName: categoryId ? (categoryMap.get(categoryId) ?? null) : null,
        isAvailable: true, // Si el search_read lo trajo, es porque cumple los filtros
        sortOrder: index + 1,
        updatedAt: product.write_date ?? new Date().toISOString(),
      };
    });
  }

  // Si vas a usar buffers, es mejor pedir la imagen directamente a Odoo mediante su ID
  async fetchImageBuffer(productId: number): Promise<Buffer | null> {
    const result = await this.executeKw<any[]>(
      "product.template",
      "read",
      [[productId]],
      { fields: ["image_1920"] },
    );

    if (!result || result.length === 0 || !result[0].image_1920) return null;

    return Buffer.from(result[0].image_1920, "base64");
  }
}

export const odooAdapter = new OdooAdapter();
