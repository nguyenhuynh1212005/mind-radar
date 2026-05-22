import path from 'node:path';
import type { SafetyFilterDecision } from '../types/projectControlCenter.js';

const WRITABLE_ROOTS = ['.project', '.ai'] as const;

export function normalizeRelativePath(rootDir: string, targetPath: string): string {
  return path.relative(rootDir, path.resolve(rootDir, targetPath)).replaceAll(path.sep, '/');
}

export function isWritableControlCenterPath(rootDir: string, targetPath: string): SafetyFilterDecision {
  const absoluteTarget = path.resolve(rootDir, targetPath);
  const relativePath = normalizeRelativePath(rootDir, absoluteTarget);
  const escapesRoot = relativePath.startsWith('..') || path.isAbsolute(relativePath);

  if (escapesRoot) {
    return {
      allowed: false,
      targetPath: absoluteTarget,
      reason: 'Target path resolves outside the project root.'
    };
  }

  const firstSegment = relativePath.split('/')[0] ?? '';
  if (!WRITABLE_ROOTS.includes(firstSegment as (typeof WRITABLE_ROOTS)[number])) {
    return {
      allowed: false,
      targetPath: absoluteTarget,
      reason: 'Project Control Center writers may only target .project or .ai.'
    };
  }

  return {
    allowed: true,
    targetPath: absoluteTarget,
    reason: 'Target path is inside an approved control-center output directory.'
  };
}

export function assertWritableControlCenterPath(rootDir: string, targetPath: string): string {
  const decision = isWritableControlCenterPath(rootDir, targetPath);

  if (!decision.allowed) {
    throw new Error(`Unsafe write blocked for ${decision.targetPath}: ${decision.reason}`);
  }

  return decision.targetPath;
}
