import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { FileKind, FileSummary, ProjectArea, ScanOptions } from '../types/projectControlCenter.js';

const DEFAULT_IGNORED_DIRECTORIES = new Set([
  '.git',
  '.vite',
  'coverage',
  'dist',
  'node_modules',
  'tmp'
]);

const GENERATED_PATH_PARTS = new Set(['dist', 'coverage', '.project', '.ai']);

export async function scanFiles(options: ScanOptions): Promise<readonly FileSummary[]> {
  const files: FileSummary[] = [];
  await visitDirectory(options.rootDir, options.rootDir, 0, options, files);
  return files.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}

async function visitDirectory(
  rootDir: string,
  currentDir: string,
  depth: number,
  options: ScanOptions,
  files: FileSummary[]
): Promise<void> {
  if (depth > options.maxDepth) {
    return;
  }

  const entries = await fs.readdir(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!options.includeHidden && entry.name.startsWith('.') && entry.name !== '.ai' && entry.name !== '.project') {
      continue;
    }

    if (entry.isDirectory() && DEFAULT_IGNORED_DIRECTORIES.has(entry.name)) {
      continue;
    }

    const absolutePath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      await visitDirectory(rootDir, absolutePath, depth + 1, options, files);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const stats = await fs.stat(absolutePath);
    const relativePath = path.relative(rootDir, absolutePath).replaceAll(path.sep, '/');
    const extension = path.extname(entry.name).toLowerCase();

    files.push({
      absolutePath,
      relativePath,
      name: entry.name,
      extension,
      kind: inferFileKind(relativePath, extension),
      area: inferProjectArea(relativePath),
      sizeBytes: stats.size,
      modifiedAt: stats.mtime.toISOString()
    });
  }
}

export function inferFileKind(relativePath: string, extension: string): FileKind {
  const normalized = relativePath.toLowerCase();
  const pathParts = normalized.split('/');

  if (pathParts.some((part) => GENERATED_PATH_PARTS.has(part))) {
    return 'generated';
  }

  if (normalized.includes('.test.') || normalized.includes('.spec.') || pathParts.includes('__tests__')) {
    return 'test';
  }

  if (['.ts', '.tsx', '.js', '.jsx', '.css', '.html'].includes(extension)) {
    return 'source';
  }

  if (['.json', '.toml', '.yml', '.yaml', '.config', '.lock'].includes(extension) || normalized.endsWith('package-lock.json')) {
    return 'config';
  }

  if (['.md', '.mdx', '.txt'].includes(extension)) {
    return 'documentation';
  }

  if (['.csv', '.jsonl'].includes(extension)) {
    return 'data';
  }

  return 'unknown';
}

export function inferProjectArea(relativePath: string): ProjectArea {
  const normalized = relativePath.toLowerCase();

  if (normalized.startsWith('tools/project-control-center/')) {
    return 'project-control-center';
  }

  if (normalized.startsWith('src/') || normalized.startsWith('server/')) {
    return 'assessment-app';
  }

  if (normalized.startsWith('docs/') || normalized.endsWith('.md')) {
    return 'documentation';
  }

  if (normalized.startsWith('.github/') || normalized.includes('automation')) {
    return 'automation';
  }

  return 'unknown';
}
