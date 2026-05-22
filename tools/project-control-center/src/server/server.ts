import { createReadStream, existsSync } from 'node:fs';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import path from 'node:path';
import { runScan } from '../cli/scan.js';

export interface ControlCenterServerOptions {
  readonly rootDir: string;
  readonly port: number;
  readonly staticDir?: string;
}

export function createControlCenterServer(options: ControlCenterServerOptions): Server {
  const staticDir = options.staticDir ?? path.resolve(__dirname, "../../ui");

  return createServer(async (request, response) => {
    try {
      await handleRequest(request, response, options.rootDir, staticDir);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown server error.';
      sendJson(response, 500, { error: message });
    }
  });
}

async function handleRequest(
  request: IncomingMessage,
  response: ServerResponse,
  rootDir: string,
  staticDir: string
): Promise<void> {
  const requestUrl = new URL(request.url ?? '/', 'http://127.0.0.1');

  if (requestUrl.pathname === '/api/snapshot') {
    const snapshot = await runScan(['--root', rootDir, '--dry-run']);
    sendJson(response, 200, snapshot);
    return;
  }

  const filePath = requestUrl.pathname === '/'
    ? path.join(staticDir, 'index.html')
    : path.join(staticDir, requestUrl.pathname);

  if (!filePath.startsWith(staticDir) || !existsSync(filePath)) {
    sendJson(response, 404, { error: 'Not found' });
    return;
  }

  response.writeHead(200, { 'Content-Type': contentTypeFor(filePath) });
  createReadStream(filePath).pipe(response);
}

function sendJson(response: ServerResponse, statusCode: number, body: unknown): void {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body, null, 2));
}

function contentTypeFor(filePath: string): string {
  if (filePath.endsWith('.html')) {
    return 'text/html; charset=utf-8';
  }
  if (filePath.endsWith('.js')) {
    return 'text/javascript; charset=utf-8';
  }
  if (filePath.endsWith('.css')) {
    return 'text/css; charset=utf-8';
  }
  return 'application/octet-stream';
}
