import { buildPageNumbers } from "./paginationPages";

describe("buildPageNumbers", () => {
  it("lists all pages when total <= 9", () => {
    expect(buildPageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(buildPageNumbers(3, 9)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("inserts gaps for large page counts", () => {
    const r = buildPageNumbers(10, 20);
    expect(r).toContain(1);
    expect(r).toContain(20);
    expect(r).toContain("gap");
    expect(r).toContain(10);
  });

  it("lists all pages when total is 9 (threshold for compact mode)", () => {
    expect(buildPageNumbers(5, 9)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("uses gap mode when total is 10", () => {
    const r = buildPageNumbers(5, 10);
    expect(r).toContain("gap");
    expect(r).toContain(1);
    expect(r).toContain(10);
  });

  it("includes first and last on many pages", () => {
    const r = buildPageNumbers(50, 100);
    expect(r[0]).toBe(1);
    expect(r[r.length - 1]).toBe(100);
  });
});
