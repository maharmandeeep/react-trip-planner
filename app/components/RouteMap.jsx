"use client"

import { useSelector } from "react-redux"
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap } from "react-leaflet"
import { useEffect } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import useResolvedStops from "@/app/hooks/useResolvedStops"

// Fix Leaflet default marker icon paths for webpack
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
})

// Stop type → color mapping (matches globals.css)
const STOP_COLORS = {
  start: "#7C3AED",
  pickup: "#10B981",
  fuel: "#F59E0B",
  rest: "#3B82F6",
  dropoff: "#EF4444",
}

const STOP_LABELS = {
  start: "Start",
  pickup: "Pickup",
  fuel: "Fuel",
  rest: "Rest",
  dropoff: "Dropoff",
}

// Map legend overlay component
function MapLegend() {
  return (
    <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg border shadow-sm px-3 py-2">
      <p className="text-xs font-semibold mb-1.5 text-foreground">Legend</p>
      <div className="space-y-1">
        {Object.entries(STOP_LABELS).map(([type, label]) => (
          <div key={type} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: STOP_COLORS[type] }}
            />
            <span className="text-[11px] text-gray-700">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-1 pt-1 border-t border-gray-200">
          <span className="inline-block w-3 h-0.5 bg-purple-600" />
          <span className="text-[11px] text-gray-700">Route</span>
        </div>
      </div>
    </div>
  )
}

// Auto-fit map bounds to the route
function FitBounds({ geometry }) {
  const map = useMap()

  useEffect(() => {
    if (geometry && geometry.length > 0) {
      const bounds = L.latLngBounds(geometry)
      map.fitBounds(bounds, { padding: [40, 40] })
    }
  }, [map, geometry])

  return null
}

export default function RouteMap() {
  const data = useSelector((state) => state.trip.data)
  const { resolvedStops, getDisplayName } = useResolvedStops()

  if (!data) return null

  const { route_geometry } = data

  // Default center (US center) — FitBounds will override
  const center = route_geometry?.length > 0 ? route_geometry[0] : [39.8283, -98.5795]

  return (
    <div className="rounded-lg overflow-hidden border h-[300px] sm:h-[400px] lg:h-[500px] relative">
      <MapContainer
        center={center}
        zoom={5}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Route polyline */}
        {route_geometry && route_geometry.length > 0 && (
          <Polyline
            positions={route_geometry}
            pathOptions={{ color: "#7C3AED", weight: 4, opacity: 0.8 }}
          />
        )}

        {/* Stop markers */}
        {resolvedStops.map((stop, i) => {
          if (!stop.lat || !stop.lng) return null

          return (
            <CircleMarker
              key={i}
              center={[stop.lat, stop.lng]}
              radius={stop.type === "rest" || stop.type === "fuel" ? 8 : 10}
              pathOptions={{
                color: "#fff",
                weight: 2,
                fillColor: STOP_COLORS[stop.type] || "#7C3AED",
                fillOpacity: 1,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{STOP_LABELS[stop.type] || stop.type}</p>
                  <p>{getDisplayName(stop)}</p>
                  {stop.time && <p className="text-muted-foreground">Time: {stop.time}</p>}
                  {stop.day && <p className="text-muted-foreground">Day {stop.day}</p>}
                  {stop.duration_hrs && (
                    <p className="text-muted-foreground">
                      Duration: {stop.duration_hrs}hr{stop.duration_hrs !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          )
        })}

        {/* Auto-fit to route */}
        <FitBounds geometry={route_geometry} />
      </MapContainer>

      {/* Legend overlay */}
      <MapLegend />
    </div>
  )
}
