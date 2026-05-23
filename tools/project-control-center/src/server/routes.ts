import type { Express, Request, RequestHandler, Response } from "express";
import { refreshContextExports } from "./contextService";
import { refreshGitSummary } from "./gitService";
import { refreshProjectStatus } from "./scanService";
import { readFileSync, existsSync } from "fs";
import path from "path";

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
    "/api/snapshot",
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

  app.get(
    "/api/logs",
    asyncRoute(async (_request, response) => {
      const readNdJson = (filePath: string) => {
        try {
          if (!existsSync(filePath)) return [];
          const content = readFileSync(filePath, "utf-8");
          return content
            .split("\n")
            .filter((line) => line.trim())
            .map((line) => JSON.parse(line));
        } catch {
          return [];
        }
      };

      const projectDir = path.resolve(__dirname, "../../../.project");
      const scanHistory = readNdJson(path.join(projectDir, "scan-history.ndjson"));
      const toolErrors = readNdJson(path.join(projectDir, "tool-errors.ndjson"));

      response.json({ scanHistory, toolErrors });
    })
  );
}
