import { Router } from "express";
import { menuController } from "../controllers/menu.controller";

export const menuRouter = Router();

menuRouter.get("/catalog", menuController.getCatalog);
menuRouter.get("/version", menuController.getVersion);
menuRouter.post("/sync", menuController.syncNow);
