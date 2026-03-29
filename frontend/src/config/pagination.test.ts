import { POSTS_PER_PAGE } from "./pagination";

describe("pagination config", () => {
  it("POSTS_PER_PAGE matches backend default (6)", () => {
    expect(POSTS_PER_PAGE).toBe(6);
  });
});
