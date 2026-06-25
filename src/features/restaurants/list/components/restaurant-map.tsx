"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type {
  Map as MapLibreMap,
  Marker as MapLibreMarker,
} from "maplibre-gl";

import type { RestaurantListItem } from "../../shared/types";

const OPEN_FREE_MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

type RestaurantMapProps = {
  selectedRestaurant: RestaurantListItem | null;
};

function hasValidCoordinates(restaurant: RestaurantListItem) {
  return (
    Number.isFinite(restaurant.lat) &&
    Number.isFinite(restaurant.lng) &&
    !(restaurant.lat === 0 && restaurant.lng === 0)
  );
}

export function RestaurantMap({ selectedRestaurant }: RestaurantMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<MapLibreMarker | null>(null);

  useEffect(() => {
    if (!selectedRestaurant || !hasValidCoordinates(selectedRestaurant)) {
      markerRef.current?.remove();
      markerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      return;
    }

    let isCancelled = false;

    async function renderMap() {
      if (
        !mapContainerRef.current ||
        !selectedRestaurant ||
        !hasValidCoordinates(selectedRestaurant)
      ) {
        return;
      }

      const maplibregl = await import("maplibre-gl");

      if (isCancelled || !mapContainerRef.current) {
        return;
      }

      const center: [number, number] = [
        selectedRestaurant.lng as number,
        selectedRestaurant.lat as number,
      ];

      if (!mapRef.current) {
        mapRef.current = new maplibregl.Map({
          container: mapContainerRef.current,
          center,
          style: OPEN_FREE_MAP_STYLE_URL,
          zoom: 14,
        });

        mapRef.current.addControl(
          new maplibregl.NavigationControl({ showCompass: false }),
          "top-right",
        );
      } else {
        mapRef.current.flyTo({
          center,
          essential: true,
          zoom: 14,
        });
      }

      markerRef.current?.remove();
      markerRef.current = new maplibregl.Marker({ color: "#009dff" })
        .setLngLat(center)
        .addTo(mapRef.current);
    }

    renderMap();

    return () => {
      isCancelled = true;
    };
  }, [selectedRestaurant]);

  useEffect(() => {
    return () => {
      markerRef.current?.remove();
      mapRef.current?.remove();
    };
  }, []);

  if (!selectedRestaurant || !hasValidCoordinates(selectedRestaurant)) {
    return (
      <div className="flex flex-col h-full min-h-88 items-center justify-center bg-tailor-surface p-8">
        <Image
          alt="Tailor"
          className="h-auto w-40 opacity-80"
          height={72}
          priority
          src="/Logo.png"
          width={160}
        />
      </div>
    );
  }

  return (
    <div
      aria-label={`Map centered on ${selectedRestaurant.name}`}
      className="h-full min-h-88 w-full"
      ref={mapContainerRef}
      role="img"
    />
  );
}
