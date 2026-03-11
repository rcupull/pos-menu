import express from "express";
import cors from "cors";
import path from "node:path";
import { menuRouter } from "./routes/menu.routes.js";
import { env } from "./config/env.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/images", express.static(path.resolve(env.IMAGES_DIR)));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/menu", menuRouter);

// Serve frontend
const frontendPath = path.join(__dirname, "../../menu-frontend/dist");
app.use(express.static(frontendPath));
