import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadProjectMap, REQUIRED_PHASE_IDS } from "../core/projectMap";
import { scanRepository } from "../core/repoScanner";
import type { GitSummary, ProjectMap, ProjectMapCheck } from "../core/types";

async function makeTempRepo(): Promise<string> {
  return await fs.mkdtemp(path.join(os.tmpdir(), "pcc-scan-"));
}

const gitSummary: GitSummary = {
  schemaVersion: 1,
  capturedAt: "2026-05-22T00:00:00.000Z",
  branch: "main",
  isClean: false,
  stagedFiles: [],
  unstagedFiles: ["tracked.ts"],
  untrackedFiles: [],
  changedFiles: ["tracked.ts"],
  lastCommits: [],
  diffSummary: []
};

function check(id: string, path: string): ProjectMapCheck {
  return {
    id,
    labelVi: id,
    path,
    type: "file",
    required: true
  };
}

function directoryCheck(id: string, path: string): ProjectMapCheck {
  return {
    id,
    labelVi: id,
    path,
    type: "directory",
    required: true
  };
}

function makeProjectMap(overrides: Partial<ProjectMap> = {}): ProjectMap {
  const base: ProjectMap = {
    schemaVersion: 1,
    generatedAt: "2026-05-22T00:00:00.000Z",
    phases: REQUIRED_PHASE_IDS.map((id) => ({
      id,
      name: `Phase ${id}`,
      weight: 1,
      checks: [check(`${id}-check`, `${id}.missing.ts`)]
    })),
    readiness: {
      codexReadinessChecks: [check("codex-ready", "codex-ready.ts")],
      productionReadinessChecks: [check("production-ready", "production-ready.ts")]
    }
  };

  return { ...base, ...overrides };
}

describe("scanRepository", () => {
  it("loads project-map.json and marks existing and missing checks", async () => {
    const repoRoot = await makeTempRepo();
    const mapPath = path.join(repoRoot, "project-map.json");
    await fs.writeFile(path.join(repoRoot, "tracked.ts"), "export const value = 1;\n", "utf8");
    await fs.mkdir(path.join(repoRoot, "node_modules"), { recursive: true });
    await fs.writeFile(path.join(repoRoot, "node_modules", "ignored.ts"), "ignored\n", "utf8");
    await fs.writeFile(
      mapPath,
      JSON.stringify(
        makeProjectMap({
          phases: REQUIRED_PHASE_IDS.map((id) => ({
            id,
            name: `Phase ${id}`,
            weight: 1,
            checks: id === "P0" ? [check("present", "tracked.ts"), check("missing", "missing.ts")] : []
          }))
        })
      ),
      "utf8"
    );

    const result = await scanRepository(repoRoot, gitSummary, mapPath);

    expect(result.summary.existingCheckCount).toBe(1);
    expect(result.summary.missingCheckCount).toBe(1);
    const nodeModules = result.tree.children.find((child) => child.path === "node_modules");
    expect(nodeModules?.excluded).toBe(true);
    expect(nodeModules?.children).toEqual([]);
    expect(result.tree.children.find((child) => child.path === "tracked.ts")?.gitChanged).toBe(true);
  });

  it("does not scan excluded files or descend into excluded directories", async () => {
    const repoRoot = await makeTempRepo();
    const mapPath = path.join(repoRoot, "project-map.json");
    await fs.writeFile(path.join(repoRoot, ".env"), "SECRET=value\n", "utf8");
    await fs.mkdir(path.join(repoRoot, "node_modules", "pkg"), { recursive: true });
    await fs.writeFile(path.join(repoRoot, "node_modules", "pkg", "index.ts"), "ignored\n", "utf8");
    await fs.writeFile(path.join(repoRoot, "logo.png"), "not a real png\n", "utf8");
    await fs.writeFile(mapPath, JSON.stringify(makeProjectMap()), "utf8");

    const result = await scanRepository(repoRoot, gitSummary, mapPath);

    expect(result.summary.fileCount).toBe(1);
    expect(result.tree.children.find((child) => child.path === ".env")?.excluded).toBe(true);
    expect(result.tree.children.find((child) => child.path === "logo.png")?.excluded).toBe(true);
    expect(result.tree.children.find((child) => child.path === "node_modules")?.children).toEqual([]);
    expect(JSON.stringify(result.tree)).not.toContain("node_modules/pkg/index.ts");
  });

  it("reports missing required checks as check records and tree nodes", async () => {
    const repoRoot = await makeTempRepo();
    const mapPath = path.join(repoRoot, "project-map.json");
    await fs.writeFile(
      mapPath,
      JSON.stringify(
        makeProjectMap({
          phases: REQUIRED_PHASE_IDS.map((id) => ({
            id,
            name: `Phase ${id}`,
            weight: 1,
            checks: id === "P0" ? [check("missing-required", "src/missing.ts")] : []
          }))
        })
      ),
      "utf8"
    );

    const result = await scanRepository(repoRoot, gitSummary, mapPath);
    const srcNode = result.tree.children.find((child) => child.path === "src");
    const missingNode = srcNode?.children.find((child) => child.path === "src/missing.ts");

    expect(result.checks.find((entry) => entry.id === "missing-required")?.missingRequired).toBe(true);
    expect(missingNode?.existsInProjectMap).toBe(true);
    expect(missingNode?.missingRequiredCheck).toBe(true);
    expect(missingNode?.missingCheckIds).toEqual(["missing-required"]);
  });

  it("supports directory and directory_exists checks", async () => {
    const repoRoot = await makeTempRepo();
    const mapPath = path.join(repoRoot, "project-map.json");
    await fs.mkdir(path.join(repoRoot, "src", "core"), { recursive: true });
    await fs.writeFile(
      mapPath,
      JSON.stringify(
        makeProjectMap({
          phases: REQUIRED_PHASE_IDS.map((id) => ({
            id,
            name: `Phase ${id}`,
            weight: 1,
            checks: id === "P0"
              ? [
                  directoryCheck("dir-present", "src/core"),
                  { ...directoryCheck("dir-exists-present", "src"), type: "directory_exists" },
                  { ...check("file-exists-missing", "src/missing.ts"), type: "file_exists" }
                ]
              : []
          }))
        })
      ),
      "utf8"
    );

    const result = await scanRepository(repoRoot, gitSummary, mapPath);

    expect(result.checks.find((entry) => entry.id === "dir-present")?.exists).toBe(true);
    expect(result.checks.find((entry) => entry.id === "dir-exists-present")?.exists).toBe(true);
    expect(result.checks.find((entry) => entry.id === "file-exists-missing")?.exists).toBe(false);
  });

  it("requires every planned project phase in project-map.json", async () => {
    const repoRoot = await makeTempRepo();
    const mapPath = path.join(repoRoot, "project-map.json");
    await fs.writeFile(mapPath, JSON.stringify(makeProjectMap()), "utf8");

    const projectMap = await loadProjectMap(mapPath);

    expect(projectMap.phases.map((phase) => phase.id)).toEqual(Array.from(REQUIRED_PHASE_IDS));
    expect(projectMap.phases.every((phase) => typeof phase.name === "string")).toBe(true);
    expect(projectMap.phases.every((phase) => typeof phase.weight === "number")).toBe(true);
    expect(projectMap.phases.every((phase) => Array.isArray(phase.checks))).toBe(true);
  });

  it("separates P0.5 from main app and Project Control Center progress", async () => {
    const repoRoot = await makeTempRepo();
    const mapPath = path.join(repoRoot, "project-map.json");
    await fs.writeFile(path.join(repoRoot, "pcc.ts"), "pcc\n", "utf8");
    await fs.writeFile(path.join(repoRoot, "main.ts"), "main\n", "utf8");
    await fs.writeFile(
      mapPath,
      JSON.stringify(
        makeProjectMap({
          phases: [
            { id: "P0", name: "P0", weight: 1, checks: [check("main-present", "main.ts")] },
            { id: "P0.5", name: "P0.5", weight: 1, checks: [check("pcc-present", "pcc.ts")] },
            { id: "P1", name: "P1", weight: 1, checks: [check("main-missing", "missing.ts")] },
            ...REQUIRED_PHASE_IDS.filter((id) => !["P0", "P0.5", "P1"].includes(id)).map((id) => ({
              id,
              name: id,
              weight: 0,
              checks: []
            }))
          ]
        })
      ),
      "utf8"
    );

    const result = await scanRepository(repoRoot, gitSummary, mapPath);

    expect(result.progress.totalChecklistProgress).toEqual({ completed: 2, total: 3, percent: 67 });
    expect(result.progress.mainAppMvpProgress).toEqual({ completed: 1, total: 2, percent: 50 });
    expect(result.progress.projectControlCenterProgress).toEqual({ completed: 1, total: 1, percent: 100 });
  });

  it("calculates Codex and production readiness separately", async () => {
    const repoRoot = await makeTempRepo();
    const mapPath = path.join(repoRoot, "project-map.json");
    await fs.writeFile(path.join(repoRoot, "codex.ts"), "codex\n", "utf8");
    await fs.writeFile(path.join(repoRoot, "production.ts"), "production\n", "utf8");
    await fs.writeFile(
      mapPath,
      JSON.stringify(
        makeProjectMap({
          readiness: {
            codexReadinessChecks: [check("codex-present", "codex.ts"), check("codex-missing", "codex-missing.ts")],
            productionReadinessChecks: [check("production-present", "production.ts")]
          }
        })
      ),
      "utf8"
    );

    const result = await scanRepository(repoRoot, gitSummary, mapPath);

    expect(result.progress.codexReadiness).toEqual({ completed: 1, total: 2, percent: 50 });
    expect(result.progress.productionReadiness).toEqual({ completed: 1, total: 1, percent: 100 });
  });
});
