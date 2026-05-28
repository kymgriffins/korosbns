import { describe, it, expect } from "vitest";
import {
  generateUniqueNamePair,
  nextAvatarOrder,
  pickUniqueWords,
} from "@/lib/anonymous-identity";

describe("anonymous identity rotation", () => {
  it("generates two distinct names", () => {
    const [a, b] = generateUniqueNamePair(["alpha", "beta", "gamma"]);
    expect(a).not.toBe(b);
  });

  it("never repeats previously used names in a new pair", () => {
    const used = ["mkenyaalpha1234", "mkenyabeta5678"];
    const [a, b] = generateUniqueNamePair(["alpha", "beta", "gamma", "delta"], used);
    expect(used).not.toContain(a);
    expect(used).not.toContain(b);
  });

  it("picks unique patriotic words", () => {
    const words = pickUniqueWords(["one", "two", "three"], 2);
    expect(words).toHaveLength(2);
    expect(words[0]).not.toBe(words[1]);
  });

  it("rotates avatar order on refresh count", () => {
    expect(nextAvatarOrder(0)).toEqual(["female", "male"]);
    expect(nextAvatarOrder(1)).toEqual(["male", "female"]);
    expect(nextAvatarOrder(2)).toEqual(["female", "male"]);
  });
});
