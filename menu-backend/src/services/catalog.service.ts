import fs from "node:fs/promises";
import path from "node:path";
import { env } from "../config/env.js";
import type { MenuCatalog } from "../types/catalog.js";
import { odooService } from "./odoo.service";

class CatalogService {
  private catalog: MenuCatalog | null = null;
  private timer: NodeJS.Timeout | null = null;

  async initialize() {
    await this.ensureDataFolders();
    await this.loadCache();

    try {
      await this.sync();
    } catch (error) {
      console.error("Initial sync failed:", error);
    }

    this.timer = setInterval(async () => {
      try {
        await this.sync();
      } catch (error) {
        console.error("Scheduled sync failed:", error);
      }
    }, env.SYNC_INTERVAL_SECONDS * 1000);
  }

  async getCatalog(): Promise<MenuCatalog> {
    if (!this.catalog) {
      await this.loadCache();
    }

    if (!this.catalog) {
      this.catalog = await this.sync();
    }

    return this.catalog;
  }

  async getVersion(): Promise<string> {
    const catalog = await this.getCatalog();
    return catalog.version;
  }

  async sync(): Promise<MenuCatalog> {
    const nextCatalog = await odooService.fetchCatalog();

    this.catalog = nextCatalog;

    await fs.writeFile(
      env.CACHE_FILE,
      JSON.stringify(nextCatalog, null, 2),
      "utf-8",
    );

    return nextCatalog;
  }

  private async loadCache() {
    try {
      const raw = await fs.readFile(env.CACHE_FILE, "utf-8");
      this.catalog = JSON.parse(raw) as MenuCatalog;
    } catch {
      this.catalog = null;
    }
  }

  private async ensureDataFolders() {
    await fs.mkdir(path.dirname(env.CACHE_FILE), { recursive: true });
    await fs.mkdir(env.IMAGES_DIR, { recursive: true });
  }
}

export const catalogService = new CatalogService();
