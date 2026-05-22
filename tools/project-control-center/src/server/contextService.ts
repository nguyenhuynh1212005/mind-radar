import { appendToolError, toToolErrorRecord } from "../core/errors";
import { writeContextArtifacts } from "../core/contextExport";
import type { ContextExport } from "../core/types";
import { refreshProjectStatus } from "./scanService";

export async function refreshContextExports(): Promise<ContextExport[]> {
  try {
    const { status, git } = await refreshProjectStatus();
    return await writeContextArtifacts(status, git);
  } catch (error) {
    await appendToolError(toToolErrorRecord("context-export", error));
    throw error;
  }
}
