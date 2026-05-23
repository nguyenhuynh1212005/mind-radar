import fs from 'node:fs/promises';
import path from 'node:path';
import { loadProjectMap } from './projectMap';
import type { ProjectMap, ProjectMapCheck } from './types';
import type { ProgressMetric, ProgressRatio, ProgressSummary } from '../types/projectControlCenter.js';

// Legacy implementation kept for auditability. The active scan pipeline calculates
// progress in repoScanner.ts from project-map.json and writes .project/status.snapshot.json.

interface CheckResult {
  readonly phaseId: string;
  readonly exists: boolean;
}

export async function calculateProgress(rootDir: string): Promise<ProgressSummary> {
  const projectMap = await loadProjectMap();
  const phaseResults = await Promise.all(
    projectMap.phases.flatMap((phase) =>
      phase.checks.map(async (check): Promise<CheckResult> => ({
        phaseId: phase.id,
        exists: await pathExists(rootDir, check)
      }))
    )
  );
  const codexReadinessResults = await resolveChecks(rootDir, projectMap.readiness.codexReadinessChecks);
  const productionReadinessResults = await resolveChecks(rootDir, projectMap.readiness.productionReadinessChecks);

  const totalChecklistProgress = calculateWeightedProgress(projectMap, phaseResults, () => true);
  const mainAppMvpProgress = calculateWeightedProgress(projectMap, phaseResults, (phaseId) => phaseId !== 'P0.5');
  const projectControlCenterProgress = calculateWeightedProgress(projectMap, phaseResults, (phaseId) => phaseId === 'P0.5');
  const metrics = projectMap.phases.map((phase) => {
    const phaseChecks = phaseResults.filter((result) => result.phaseId === phase.id);
    const completed = phaseChecks.filter((result) => result.exists).length;
    const total = phaseChecks.length;

    return {
      id: phase.id,
      label: phase.name,
      completed,
      total,
      status: completed === 0 ? 'not-started' : completed === total ? 'complete' : 'in-progress'
    } satisfies ProgressMetric;
  });

  return {
    overallPercent: totalChecklistProgress.percent,
    totalChecklistProgress,
    mainAppMvpProgress,
    projectControlCenterProgress,
    codexReadiness: calculateCountProgress(codexReadinessResults),
    productionReadiness: calculateCountProgress(productionReadinessResults),
    metrics,
    notes: buildNotes(metrics)
  };
}

async function resolveChecks(rootDir: string, checks: readonly ProjectMapCheck[]): Promise<Array<{ exists: boolean }>> {
  return await Promise.all(checks.map(async (check) => ({ exists: await pathExists(rootDir, check) })));
}

async function pathExists(rootDir: string, check: ProjectMapCheck): Promise<boolean> {
  try {
    const stat = await fs.stat(path.join(rootDir, check.path));
    return check.type === 'directory' || check.type === 'directory_exists' ? stat.isDirectory() : stat.isFile();
  } catch {
    return false;
  }
}

function calculateWeightedProgress(
  projectMap: ProjectMap,
  results: readonly CheckResult[],
  includePhase: (phaseId: string) => boolean
): ProgressRatio {
  const includedPhases = projectMap.phases.filter((phase) => includePhase(phase.id));
  const includedPhaseIds = new Set(includedPhases.map((phase) => phase.id));
  const includedResults = results.filter((result) => includedPhaseIds.has(result.phaseId));
  const completed = includedResults.filter((result) => result.exists).length;
  const total = includedResults.length;
  const totalWeight = includedPhases.reduce((sum, phase) => sum + phase.weight, 0);

  if (totalWeight === 0) {
    return { completed, total, percent: 0 };
  }

  const weightedCompletion = includedPhases.reduce((sum, phase) => {
    const phaseResults = results.filter((result) => result.phaseId === phase.id);
    const phaseTotal = phaseResults.length;
    const phaseCompleted = phaseResults.filter((result) => result.exists).length;
    const phasePercent = phaseTotal === 0 ? 0 : phaseCompleted / phaseTotal;

    return sum + phasePercent * phase.weight;
  }, 0);

  return {
    completed,
    total,
    percent: Math.round((weightedCompletion / totalWeight) * 100)
  };
}

function calculateCountProgress(results: ReadonlyArray<{ exists: boolean }>): ProgressRatio {
  const completed = results.filter((result) => result.exists).length;
  const total = results.length;

  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100)
  };
}

function buildNotes(metrics: readonly ProgressMetric[]): readonly string[] {
  const incomplete = metrics.filter((metric) => metric.status !== 'complete');

  if (incomplete.length === 0) {
    return ['Tracked project-map milestones are complete.'];
  }

  return incomplete.map((metric) => `${metric.label}: ${metric.completed}/${metric.total} detected.`);
}
