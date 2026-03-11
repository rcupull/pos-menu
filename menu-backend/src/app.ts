import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health.routes";
import { menuRouter } from "./routes/menu.routes";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/menu", menuRouter);
