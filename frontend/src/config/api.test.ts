describe("apiUrl", () => {
  const ORIGINAL = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL };
  });

  afterAll(() => {
    process.env = ORIGINAL;
  });

  it("in test/production-style env without REACT_APP_API_URL uses localhost:3000 base", async () => {
    process.env.NODE_ENV = "test";
    delete process.env.REACT_APP_API_URL;
    const { apiUrl } = await import("./api");
    expect(apiUrl("/api/ads")).toBe("http://localhost:3000/api/ads");
  });

  it("prefixes path without leading slash", async () => {
    process.env.NODE_ENV = "test";
    delete process.env.REACT_APP_API_URL;
    const { apiUrl } = await import("./api");
    expect(apiUrl("api/users")).toBe("http://localhost:3000/api/users");
  });

  it("in development without REACT_APP_API_URL returns relative path for proxy", async () => {
    process.env.NODE_ENV = "development";
    delete process.env.REACT_APP_API_URL;
    const { apiUrl } = await import("./api");
    expect(apiUrl("/api/ads")).toBe("/api/ads");
  });

  it("uses REACT_APP_API_URL when set (trailing slashes trimmed)", async () => {
    process.env.NODE_ENV = "development";
    process.env.REACT_APP_API_URL = "https://api.example.com///";
    const { apiUrl } = await import("./api");
    expect(apiUrl("/api/foo")).toBe("https://api.example.com/api/foo");
  });
});
