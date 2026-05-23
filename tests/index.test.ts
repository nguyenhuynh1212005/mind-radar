import { describe, it, expect } from "vitest";
import { greet } from "../src/index.js";

describe("greet", () => {
  it("should greet a user", () => {
    expect(greet("Mind Radar")).toBe("Hello, Mind Radar");
  });
});
