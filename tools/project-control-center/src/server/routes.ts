import type { Express, Request, RequestHandler, Response } from "express";
import { refreshContextExports } from "./contextService";
import { refreshGitSummary } from "./gitService";
import { refreshProjectStatus } from "./scanService";

type AsyncHandler = (request: Request, response: Response) => Promise<void>;

function asyncRoute(handler: AsyncHandler): RequestHandler {
  return (request: Request, response: Response) => {
    void handler(request, response).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Unknown error.";
      response.status(500).json({ error: message });
    });
  };
}

export function registerRoutes(app: Express): void {
  app.get(
    "/api/status",
    asyncRoute(async (_request, response) => {
      const payload = await refreshProjectStatus();
      response.json(payload);
    })
  );

  app.get(
    "/api/git",
    asyncRoute(async (_request, response) => {
      const git = await refreshGitSummary();
      response.json({ git });
    })
  );

  app.get(
    "/api/context",
    asyncRoute(async (_request, response) => {
      const exports = await refreshContextExports();
      response.json({ exports });
    })
  );
}
