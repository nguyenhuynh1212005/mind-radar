import express from "express";
import { createServer as createViteServer } from "vite";
import { registerRoutes } from "./routes";

const PORT = Number(process.env.PORT ?? 5174);

async function start(): Promise<void> {
  const app = express();
  app.use(express.json());
  registerRoutes(app);

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa"
  });

  app.use(vite.middlewares);

  app.listen(PORT, "127.0.0.1", () => {
    console.log(`Project Control Center: http://127.0.0.1:${PORT}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
