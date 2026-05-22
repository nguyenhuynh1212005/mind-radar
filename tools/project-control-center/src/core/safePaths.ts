import path from "node:path";

const BLOCKED_DIRECTORY_NAMES = new Set([".git", "node_modules", "dist", "build", "out"]);
const BLOCKED_FILE_EXTENSIONS = new Set([
  ".7z",
  ".a",
  ".avi",
  ".bmp",
  ".bz2",
  ".dll",
  ".doc",
  ".docx",
  ".dylib",
  ".exe",
  ".gif",
  ".gz",
  ".ico",
  ".jpeg",
  ".jpg",
  ".mov",
  ".mp3",
  ".mp4",
  ".ogg",
  ".pdf",
  ".png",
  ".rar",
  ".so",
  ".tar",
  ".tgz",
  ".webm",
  ".webp",
  ".xls",
  ".xlsx",
  ".xz",
  ".zip"
]);

const ALLOWED_WRITE_FILES = new Set(["docs/projectStatus.md", "docs/CHATBOT_HANDOFF.md"]);
const ALLOWED_WRITE_ROOTS = ["tools/project-control-center", ".project", ".ai"] as const;

export function normalizeRepoPath(inputPath: string): string {
  const normalized = inputPath.replaceAll("\\", "/").replace(/\/+/g, "/");
  const withoutLeadingCurrent = normalized.replace(/^\.\//, "");
  const withoutTrailingSlash = withoutLeadingCurrent.replace(/\/$/, "");

  return withoutTrailingSlash.length === 0 ? "." : withoutTrailingSlash;
}

export function toRepoRelative(repoRoot: string, targetPath: string): string {
  return normalizeRepoPath(path.relative(repoRoot, targetPath));
}

export function isBlockedReadPath(relativePath: string): boolean {
  const normalized = normalizeRepoPath(relativePath);
  if (normalized === ".") {
    return false;
  }

  const parts = normalized.split("/");
  const name = parts.at(-1) ?? "";

  return (
    name === ".env" ||
    name.startsWith(".env.") ||
    parts.some((part) => BLOCKED_DIRECTORY_NAMES.has(part)) ||
    BLOCKED_FILE_EXTENSIONS.has(path.posix.extname(name).toLowerCase())
  );
}

export function assertSafeRead(repoRoot: string, targetPath: string): void {
  const absoluteTarget = path.resolve(targetPath);
  const relativePath = toRepoRelative(repoRoot, absoluteTarget);
  const escapesRoot = relativePath.startsWith("..") || path.isAbsolute(relativePath);

  if (escapesRoot) {
    throw new Error(`Unsafe read outside repository root: ${absoluteTarget}`);
  }

  if (isBlockedReadPath(relativePath)) {
    throw new Error(`Unsafe read blocked for excluded path: ${relativePath}`);
  }
}

export function isAllowedWritePath(relativePath: string): boolean {
  const normalized = normalizeRepoPath(relativePath);

  return (
    ALLOWED_WRITE_FILES.has(normalized) ||
    ALLOWED_WRITE_ROOTS.some((allowedRoot) => normalized === allowedRoot || normalized.startsWith(`${allowedRoot}/`))
  );
}

export function assertSafeWrite(repoRoot: string, targetPath: string): void {
  const absoluteTarget = path.resolve(targetPath);
  const relativePath = toRepoRelative(repoRoot, absoluteTarget);
  const escapesRoot = relativePath.startsWith("..") || path.isAbsolute(relativePath);

  if (escapesRoot) {
    throw new Error(`Unsafe write outside repository root: ${absoluteTarget}`);
  }

  if (!isAllowedWritePath(relativePath)) {
    throw new Error(`Unsafe write blocked for ${relativePath}`);
  }
}
