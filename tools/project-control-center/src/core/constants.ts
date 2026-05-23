import path from "node:path";

export const SCHEMA_VERSION = 1;

const CORE_DIR = __dirname;
const DEFAULT_TOOL_ROOT = path.resolve(CORE_DIR, "../..");

export const TOOL_ROOT = path.basename(DEFAULT_TOOL_ROOT) === "dist"
  ? path.dirname(DEFAULT_TOOL_ROOT)
  : DEFAULT_TOOL_ROOT;
export const REPO_ROOT = path.resolve(TOOL_ROOT, "../..");

export const PROJECT_DIR = path.join(REPO_ROOT, ".project");
export const AI_DIR = path.join(REPO_ROOT, ".ai");
export const DOCS_DIR = path.join(REPO_ROOT, "docs");

export const STATUS_SNAPSHOT_PATH = path.join(PROJECT_DIR, "status.snapshot.json");
export const SCAN_HISTORY_PATH = path.join(PROJECT_DIR, "scan-history.ndjson");
export const TOOL_ERRORS_PATH = path.join(PROJECT_DIR, "tool-errors.ndjson");
export const GIT_HISTORY_SNAPSHOT_PATH = path.join(PROJECT_DIR, "git-history.snapshot.json");

export const CONTEXT_BUNDLE_PATH = path.join(AI_DIR, "context-bundle.md");
export const CODE_INDEX_PATH = path.join(AI_DIR, "code-index.json");
export const PROJECT_STATUS_DOC_PATH = path.join(DOCS_DIR, "projectStatus.md");
export const CHATBOT_HANDOFF_DOC_PATH = path.join(DOCS_DIR, "CHATBOT_HANDOFF.md");

export const PROJECT_MAP_PATH = path.join(TOOL_ROOT, "project-map.json");
