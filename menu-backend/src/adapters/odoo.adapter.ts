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
      throw new Error("No se pudo autenticar en Odoo");
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
        fields: ["name", "sequence"],
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
    const products = await this.executeKw<any[]>(
      "product.template",
      "search_read",
      [
        [
          ["available_in_pos", "=", true],
          ["sale_ok", "=", true],
          ["active", "=", true],
        ],
      ],
      {
        fields: [
          "name",
          "list_price",
          "description_sale",
          "image_1920",
          "pos_categ_id",
          "write_date",
          "available_in_pos",
        ],
      },
    );

    const categories = await this.fetchCategories();
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    return products.map((product, index) => {
      const categoryId = product.pos_categ_id ? product.pos_categ_id[0] : null;

      return {
        id: product.id,
        name: product.name,
        price: product.list_price,
        currency: "USD",
        description: product.description_sale || "",
        imageUrl: product.image_1920
          ? `${env.ODOO_URL}/web/image/product.template/${product.id}/image_1920`
          : null,
        categoryId,
        categoryName: categoryId ? (categoryMap.get(categoryId) ?? null) : null,
        isAvailable: product.available_in_pos,
        sortOrder: index + 1,
        updatedAt: product.write_date ?? new Date().toISOString(),
      };
    });
  }
}

export const odooAdapter = new OdooAdapter();
