import { promises as fs } from "node:fs";
import { PROJECT_MAP_PATH } from "./constants";
import type { ProjectMap, ProjectMapCheck, ProjectMapPhase, ProjectMapReadiness } from "./types";

export const REQUIRED_PHASE_IDS = ["P0", "P0.5", "P1", "P2", "P3", "P4", "P5", "P6", "P7"] as const;

export async function loadProjectMap(projectMapPath = PROJECT_MAP_PATH): Promise<ProjectMap> {
  const raw = await fs.readFile(projectMapPath, "utf8");
  const parsed = JSON.parse(raw) as Partial<ProjectMap>;

  if (
    !parsed ||
    typeof parsed.schemaVersion !== "number" ||
    typeof parsed.generatedAt !== "string" ||
    !Array.isArray(parsed.phases) ||
    !parsed.readiness ||
    !Array.isArray(parsed.readiness.codexReadinessChecks) ||
    !Array.isArray(parsed.readiness.productionReadinessChecks)
  ) {
    throw new Error("Invalid project-map.json schema.");
  }

  validatePhases(parsed.phases);
  validateReadiness(parsed.readiness);

  return parsed as ProjectMap;
}

export function getPhaseChecks(projectMap: ProjectMap): ProjectMapCheck[] {
  return projectMap.phases.flatMap((phase) => phase.checks);
}

function validatePhases(phases: readonly ProjectMapPhase[]): void {
  const phaseIds = new Set<string>();

  for (const phase of phases) {
    if (
      !phase ||
      typeof phase.id !== "string" ||
      typeof phase.name !== "string" ||
      typeof phase.weight !== "number" ||
      !Number.isFinite(phase.weight) ||
      phase.weight < 0 ||
      !Array.isArray(phase.checks)
    ) {
      throw new Error("Invalid project-map.json phase entry.");
    }

    phaseIds.add(phase.id);
    validateChecks(`phase ${phase.id}`, phase.checks);
  }

  for (const requiredPhaseId of REQUIRED_PHASE_IDS) {
    if (!phaseIds.has(requiredPhaseId)) {
      throw new Error(`project-map.json is missing required phase ${requiredPhaseId}.`);
    }
  }
}

function validateReadiness(readiness: ProjectMapReadiness): void {
  validateChecks("readiness.codexReadinessChecks", readiness.codexReadinessChecks);
  validateChecks("readiness.productionReadinessChecks", readiness.productionReadinessChecks);
}

function validateChecks(section: string, checks: readonly ProjectMapCheck[]): void {
  const checkIds = new Set<string>();

  for (const check of checks) {
    if (
      !check ||
      typeof check.id !== "string" ||
      typeof check.labelVi !== "string" ||
      typeof check.path !== "string" ||
      !["file", "directory", "file_exists", "directory_exists"].includes(check.type) ||
      typeof check.required !== "boolean"
    ) {
      throw new Error(`Invalid project-map.json check entry in ${section}.`);
    }

    if (checkIds.has(check.id)) {
      throw new Error(`Duplicate project-map.json check id ${check.id} in ${section}.`);
    }

    checkIds.add(check.id);
  }
}
