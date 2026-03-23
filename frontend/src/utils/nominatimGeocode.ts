/**
 * Geocode free-text location via Nominatim (OpenStreetMap).
 * Uses the response `address` object so country/state/city stored in the DB
 * match OSM naming — consistent /places/... links even if users type "USA", "America", "CA", etc.
 *
 * Respect Nominatim usage policy: max ~1 request/sec; descriptive User-Agent.
 */

export type CanonicalLocation = {
  country: string;
  state: string;
  city: string;
};

export type GeocodeLocationResult = {
  lat: number;
  lng: number;
  /** Present when Nominatim returned parseable address fields (may be partial). */
  canonicalPartial: Partial<Pick<CanonicalLocation, "country" | "state" | "city">> | null;
};

/** Extract best-effort canonical fields from a Nominatim `address` object. */
export function parseCanonicalFromNominatimAddress(
  addr: Record<string, string> | undefined,
): Partial<Pick<CanonicalLocation, "country" | "state" | "city">> | null {
  if (!addr || typeof addr !== "object") return null;

  const out: Partial<Pick<CanonicalLocation, "country" | "state" | "city">> = {};

  const country = (addr.country || "").trim();
  if (country) out.country = country;

  const stateRaw =
    addr.state ||
    addr.province ||
    addr.region ||
    addr.state_district ||
    "";
  const state = stateRaw.trim();
  if (state) out.state = state;

  const cityRaw =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.hamlet ||
    addr.municipality ||
    "";
  const city = (cityRaw || "").trim();
  if (city) out.city = city;

  return Object.keys(out).length > 0 ? out : null;
}

/**
 * Prefer OSM canonical strings when available; fall back to what the user typed.
 */
export function mergeUserLocationWithCanonical(
  user: { country: string; state: string; city: string },
  canonicalPartial:
    | Partial<Pick<CanonicalLocation, "country" | "state" | "city">>
    | null
    | undefined,
): CanonicalLocation {
  if (!canonicalPartial) {
    return {
      country: user.country.trim(),
      state: user.state.trim(),
      city: user.city.trim(),
    };
  }
  return {
    country: (canonicalPartial.country || user.country).trim(),
    state: (canonicalPartial.state || user.state).trim(),
    city: (canonicalPartial.city || user.city).trim(),
  };
}

export async function geocodeLocationWithCanonical(
  city: string,
  state: string,
  country: string,
): Promise<GeocodeLocationResult | null> {
  const query = `${city}, ${state}, ${country}`.trim();
  if (!query.replace(/,/g, "").trim()) return null;

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(query)}`,
    {
      headers: {
        "Accept-Language": "en",
        "User-Agent": "CosplayCollabs/1.0 (https://github.com/cosplay-collabs)",
      },
    },
  );
  const data = await res.json();
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const first = data[0] as {
    lat?: string;
    lon?: string;
    address?: Record<string, string>;
  };

  const lat = parseFloat(first.lat ?? "");
  const lng = parseFloat(first.lon ?? "");
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

  const canonicalPartial = parseCanonicalFromNominatimAddress(first.address);

  return { lat, lng, canonicalPartial };
}
