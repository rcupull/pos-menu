import type {
  MenuCatalog,
  MenuCategory,
  MenuProduct,
} from "../types/catalog.js";
import { odooAdapter } from "../adapters/odoo.adapter";

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
}

export const odooService = new OdooService();
