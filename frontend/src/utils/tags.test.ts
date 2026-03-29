import { normalizeTag } from "./tags";

describe("normalizeTag", () => {
  it("lowercases and removes spaces", () => {
    expect(normalizeTag("  Cosplay  Group  ")).toBe("cosplaygroup");
  });

  it("removes newlines and tabs", () => {
    expect(normalizeTag("foo\n\tbar")).toBe("foobar");
  });

  it("handles empty string", () => {
    expect(normalizeTag("")).toBe("");
  });
});
