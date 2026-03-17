import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default icon paths so markers don't 404
// (Create React App + Leaflet needs this override.)
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Ad {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  lat?: number | null;
  lng?: number | null;
}

type LatLng = [number, number];

const CosplayMap: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3000/api/ads/all");
        if (!response.ok) {
          throw new Error("Failed to load ads for map");
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setAds(data.data);
        } else {
          setError("Unexpected response from server");
        }
      } catch (err) {
        console.error("Error fetching ads for map:", err);
        setError(
          err instanceof Error ? err.message : "Error fetching ads for map"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  const markers = useMemo(() => {
    return ads
      .filter(
        (ad) =>
          ad.lat != null &&
          ad.lng != null &&
          !Number.isNaN(Number(ad.lat)) &&
          !Number.isNaN(Number(ad.lng))
      )
      .map((ad) => ({
        id: ad.id,
        position: [Number(ad.lat), Number(ad.lng)] as LatLng,
        title: ad.title,
        description: ad.description,
        city: ad.city,
        state: ad.state,
        country: ad.country,
      }));
  }, [ads]);

  const defaultCenter: LatLng = [37.7749, -122.4194];

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 text-center">
        Cosplayer Locations Map
      </h1>
      <p className="text-sm md:text-base text-gray-600 mb-4 text-center max-w-2xl mx-auto">
        Markers are shown for each ad that has a location (lat/lng) stored. Ads
        in the same area cluster together when zoomed out.
      </p>

      {loading && (
        <p className="text-center text-gray-600 mb-2">Loading locations…</p>
      )}
      {error && (
        <p className="text-center text-red-600 mb-2">
          {error} — please try again later.
        </p>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={4}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marker clustering is provided by leaflet.markercluster CSS/JS */}
        {markers.map((m) => (
          <Marker key={m.id} position={m.position}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold mb-1">{m.title}</div>
                {m.description && (
                  <div className="mb-1 text-gray-700 line-clamp-3">
                    {m.description}
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  {m.city}, {m.state}, {m.country}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CosplayMap;
