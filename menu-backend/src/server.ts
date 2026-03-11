import { app } from "./app.js";
import { env } from "./config/env.js";
import { catalogService } from "./services/catalog.service";

app.listen(env.PORT, async () => {
  console.log(`API running on http://localhost:${env.PORT}`);

  try {
    await catalogService.initialize();
  } catch (error) {
    console.error("Catalog init failed:", error);
  }
});
