import { describe, expect, it } from "vitest";
import { isAllowedWritePath, isBlockedReadPath } from "../core/safePaths";

describe("safePaths", () => {
  it("blocks sensitive and generated read paths", () => {
    expect(isBlockedReadPath(".env")).toBe(true);
    expect(isBlockedReadPath(".env.local")).toBe(true);
    expect(isBlockedReadPath(".env.production")).toBe(true);
    expect(isBlockedReadPath("node_modules/pkg/index.js")).toBe(true);
    expect(isBlockedReadPath(".git/config")).toBe(true);
    expect(isBlockedReadPath("dist/app.js")).toBe(true);
    expect(isBlockedReadPath("build/app.js")).toBe(true);
    expect(isBlockedReadPath("out/app.js")).toBe(true);
    expect(isBlockedReadPath("assets/logo.png")).toBe(true);
    expect(isBlockedReadPath("archives/context.zip")).toBe(true);
  });

  it("allows writes only to approved tool and metadata paths", () => {
    expect(isAllowedWritePath("tools/project-control-center/src/main.ts")).toBe(true);
    expect(isAllowedWritePath("docs/projectStatus.md")).toBe(true);
    expect(isAllowedWritePath("docs/CHATBOT_HANDOFF.md")).toBe(true);
    expect(isAllowedWritePath(".project/status.snapshot.json")).toBe(true);
    expect(isAllowedWritePath(".ai/context-bundle.md")).toBe(true);
    expect(isAllowedWritePath("src/main.ts")).toBe(false);
  });
});
