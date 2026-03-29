import {
  geocodeLocationWithCanonical,
  mergeUserLocationWithCanonical,
  parseCanonicalFromNominatimAddress,
} from "./nominatimGeocode";

describe("parseCanonicalFromNominatimAddress", () => {
  it("returns null for undefined address", () => {
    expect(parseCanonicalFromNominatimAddress(undefined)).toBeNull();
  });

  it("extracts US city, state, country", () => {
    const r = parseCanonicalFromNominatimAddress({
      city: "Oakland",
      state: "California",
      country: "United States",
      country_code: "us",
    });
    expect(r).toEqual({
      country: "United States",
      state: "California",
      city: "Oakland",
    });
  });

  it("uses town when city missing", () => {
    const r = parseCanonicalFromNominatimAddress({
      town: "Springfield",
      state: "Illinois",
      country: "United States",
    });
    expect(r?.city).toBe("Springfield");
    expect(r?.state).toBe("Illinois");
  });

  it("uses province when state missing", () => {
    const r = parseCanonicalFromNominatimAddress({
      city: "Toronto",
      province: "Ontario",
      country: "Canada",
    });
    expect(r?.state).toBe("Ontario");
  });
});

describe("mergeUserLocationWithCanonical", () => {
  it("returns trimmed user input when canonical is null", () => {
    expect(
      mergeUserLocationWithCanonical(
        { country: " USA ", state: " CA ", city: " LA " },
        null,
      ),
    ).toEqual({ country: "USA", state: "CA", city: "LA" });
  });

  it("prefers canonical fields when present", () => {
    expect(
      mergeUserLocationWithCanonical(
        { country: "America", state: "CA", city: "Oakland" },
        { country: "United States", state: "California", city: "Oakland" },
      ),
    ).toEqual({
      country: "United States",
      state: "California",
      city: "Oakland",
    });
  });

  it("falls back to user text for missing canonical parts", () => {
    expect(
      mergeUserLocationWithCanonical(
        { country: "UK", state: "England", city: "Oxford" },
        { country: "United Kingdom" },
      ),
    ).toEqual({
      country: "United Kingdom",
      state: "England",
      city: "Oxford",
    });
  });

  it("treats undefined canonical partial like null", () => {
    expect(
      mergeUserLocationWithCanonical(
        { country: "USA", state: "TX", city: "Austin" },
        undefined,
      ),
    ).toEqual({ country: "USA", state: "TX", city: "Austin" });
  });
});

describe("parseCanonicalFromNominatimAddress edge cases", () => {
  it("uses municipality when city/town missing", () => {
    const r = parseCanonicalFromNominatimAddress({
      municipality: "Metroville",
      region: "Someregion",
      country: "Nowhere",
    });
    expect(r?.city).toBe("Metroville");
    expect(r?.state).toBe("Someregion");
  });

  it("returns null when address has no usable fields", () => {
    expect(parseCanonicalFromNominatimAddress({})).toBeNull();
  });
});

describe("geocodeLocationWithCanonical", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it("returns null when query is only commas/spaces", async () => {
    expect(await geocodeLocationWithCanonical(",,", "  ", "")).toBeNull();
  });

  it("returns null when fetch returns empty array", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => [],
    });
    expect(
      await geocodeLocationWithCanonical("X", "Y", "Z"),
    ).toBeNull();
  });

  it("returns lat, lng, and canonicalPartial from first result", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => [
        {
          lat: "40.7128",
          lon: "-74.0060",
          address: {
            city: "New York",
            state: "New York",
            country: "United States",
          },
        },
      ],
    });
    const r = await geocodeLocationWithCanonical("NYC", "NY", "USA");
    expect(r).not.toBeNull();
    expect(r!.lat).toBeCloseTo(40.7128);
    expect(r!.lng).toBeCloseTo(-74.006);
    expect(r!.canonicalPartial?.country).toBe("United States");
    expect(r!.canonicalPartial?.city).toBe("New York");
  });
});
