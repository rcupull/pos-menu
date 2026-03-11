import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.string().default("development"),
  ODOO_URL: z.string().url(),
  ODOO_DATABASE: z.string().min(1),
  ODOO_API_KEY: z.string().min(1),
  ODOO_USERNAME: z.string().min(1),
  SYNC_INTERVAL_SECONDS: z.coerce.number().default(300),
  CACHE_FILE: z.string().default("src/cache/catalog-cache.json"),
});

export const env = envSchema.parse(process.env);
