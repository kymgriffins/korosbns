import { describe, expect, it } from "vitest";
import { resolveShellMode } from "@/components/lms/shell/types";

describe("resolveShellMode", () => {
  it("returns account for /learn/account routes", () => {
    expect(resolveShellMode("/learn/account/login")).toBe("account");
    expect(resolveShellMode("/learn/account/password")).toBe("account");
  });

  it("returns immersive for lesson routes (REQ-0012)", () => {
    expect(
      resolveShellMode("/learn/courses/foo/modules/bar/lessons/baz"),
    ).toBe("immersive");
  });

  it("returns hub for learn hub routes", () => {
    expect(resolveShellMode("/learn")).toBe("hub");
    expect(resolveShellMode("/learn/catalogue")).toBe("hub");
    expect(resolveShellMode("/learn/courses/foo")).toBe("hub");
  });
});
