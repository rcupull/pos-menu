import { odooAdapter } from "../adapters/odoo.adapter.js";
import type { MenuCatalog } from "../types/catalog.js";

class OdooService {
  async fetchCatalog(): Promise<MenuCatalog> {
    const [categories, products] = await Promise.all([
      odooAdapter.fetchCategories(),
      odooAdapter.fetchProducts(),
    ]);

    return {
      version: new Date().toISOString(),
      categories,
      products,
    };
  }

  async fetchImageBuffer(imageUrl: string): Promise<Buffer | null> {
    return odooAdapter.fetchImageBuffer(imageUrl);
  }
}

export const odooService = new OdooService();
