import type { Request, Response } from "express";
import { catalogService } from "../services/catalog.service";

export const menuController = {
  async getCatalog(_req: Request, res: Response) {
    const catalog = await catalogService.getCatalog();
    res.json(catalog);
  },

  async getVersion(_req: Request, res: Response) {
    const version = await catalogService.getVersion();
    res.json({ version });
  },

  async syncNow(_req: Request, res: Response) {
    const catalog = await catalogService.sync();
    res.json(catalog);
  },
};
