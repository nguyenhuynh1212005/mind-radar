import { describe, expect, it } from "vitest";
import { parseGitStatusOutput } from "../core/gitStatus";

describe("parseGitStatusOutput", () => {
  it("separates staged, unstaged, and untracked files", () => {
    const result = parseGitStatusOutput(["M  staged.ts", " M unstaged.ts", "?? new-file.ts"].join("\n"));

    expect(result.stagedFiles).toEqual(["staged.ts"]);
    expect(result.unstagedFiles).toEqual(["unstaged.ts"]);
    expect(result.untrackedFiles).toEqual(["new-file.ts"]);
  });

  it("normalizes rename paths to the destination path", () => {
    const result = parseGitStatusOutput("R  old.ts -> new.ts");

    expect(result.stagedFiles).toEqual(["new.ts"]);
  });
});
