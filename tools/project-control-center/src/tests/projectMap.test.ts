import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadProjectMap, REQUIRED_PHASE_IDS } from "../core/projectMap";
import type { ProjectMap, ProjectMapCheck } from "../core/types";

function check(id: string): ProjectMapCheck {
  return {
    id,
    labelVi: id,
    path: `${id}.ts`,
    type: "file",
    required: true
  };
}

function projectMap(): ProjectMap {
  return {
    schemaVersion: 1,
    generatedAt: "2026-05-22T00:00:00.000Z",
    phases: REQUIRED_PHASE_IDS.map((id) => ({
      id,
      name: `Phase ${id}`,
      weight: 1,
      checks: [check(`${id}-check`)]
    })),
    readiness: {
      codexReadinessChecks: [check("codex-ready")],
      productionReadinessChecks: [check("production-ready")]
    }
  };
}

async function writeTempProjectMap(map: unknown): Promise<string> {
  const repoRoot = await fs.mkdtemp(path.join(os.tmpdir(), "pcc-map-"));
  const mapPath = path.join(repoRoot, "project-map.json");
  await fs.writeFile(mapPath, JSON.stringify(map), "utf8");

  return mapPath;
}

describe("loadProjectMap", () => {
  it("loads machine-readable project-map.json with phases and readiness sections", async () => {
    const mapPath = await writeTempProjectMap(projectMap());

    const loaded = await loadProjectMap(mapPath);

    expect(loaded.phases.map((phase) => phase.id)).toEqual(Array.from(REQUIRED_PHASE_IDS));
    expect(loaded.readiness.codexReadinessChecks).toHaveLength(1);
    expect(loaded.readiness.productionReadinessChecks).toHaveLength(1);
  });

  it("rejects maps missing a required phase", async () => {
    const missingPhaseMap = projectMap();
    missingPhaseMap.phases = missingPhaseMap.phases.filter((phase) => phase.id !== "P0.5");
    const mapPath = await writeTempProjectMap(missingPhaseMap);

    await expect(loadProjectMap(mapPath)).rejects.toThrow("P0.5");
  });

  it("does not use projectMap.md as a runtime data source", async () => {
    const source = await fs.readFile(path.resolve(__dirname, "../core/projectMap.ts"), "utf8");

    expect(source).toContain("project-map.json");
    expect(source).not.toContain("projectMap.md");
  });
});
