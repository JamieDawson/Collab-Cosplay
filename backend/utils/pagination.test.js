const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const {
  parsePagination,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} = require("./pagination");

describe("parsePagination", () => {
  test("defaults to page 1, default limit, offset 0", () => {
    const r = parsePagination({ query: {} });
    assert.equal(r.page, 1);
    assert.equal(r.limit, DEFAULT_PAGE_SIZE);
    assert.equal(r.offset, 0);
  });

  test("respects page and limit query params", () => {
    const r = parsePagination({ query: { page: "3", limit: "12" } });
    assert.equal(r.page, 3);
    assert.equal(r.limit, 12);
    assert.equal(r.offset, 24);
  });

  test("page is at least 1", () => {
    const r = parsePagination({ query: { page: "-5", limit: "6" } });
    assert.equal(r.page, 1);
  });

  test("caps limit at MAX_PAGE_SIZE", () => {
    const r = parsePagination({ query: { page: "1", limit: "999" } });
    assert.equal(r.limit, MAX_PAGE_SIZE);
    assert.equal(r.offset, 0);
  });

  test("invalid limit falls back to default", () => {
    const r = parsePagination({ query: { page: "2", limit: "abc" } });
    assert.equal(r.page, 2);
    assert.equal(r.limit, DEFAULT_PAGE_SIZE);
    assert.equal(r.offset, DEFAULT_PAGE_SIZE);
  });

  test("non-numeric page defaults to 1", () => {
    const r = parsePagination({ query: { page: "xyz", limit: "6" } });
    assert.equal(r.page, 1);
    assert.equal(r.offset, 0);
  });

  test("truncates float page via parseInt", () => {
    const r = parsePagination({ query: { page: "3.9", limit: "6" } });
    assert.equal(r.page, 3);
    assert.equal(r.offset, 12);
  });

  test("custom defaultLimit when no limit param", () => {
    const r = parsePagination({ query: { page: "1" } }, 12);
    assert.equal(r.limit, 12);
    assert.equal(r.offset, 0);
  });

  test("limit 0 is invalid and falls back to default", () => {
    const r = parsePagination({ query: { page: "1", limit: "0" } });
    assert.equal(r.limit, DEFAULT_PAGE_SIZE);
  });
});
