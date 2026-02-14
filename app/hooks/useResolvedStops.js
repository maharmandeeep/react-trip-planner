import { useEffect, useState, useMemo } from "react"
import { useSelector } from "react-redux"

// Convert "HH:MM AM/PM" to fractional hours (0-24)
function timeToHours(timeStr) {
  if (!timeStr) return 0
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return 0
  let h = parseInt(match[1], 10)
  const m = parseInt(match[2], 10)
  const period = match[3].toUpperCase()
  if (period === "AM" && h === 12) h = 0
  if (period === "PM" && h !== 12) h += 12
  return h + m / 60
}

// Get cumulative distances along route geometry
function getCumulativeDistances(geometry) {
  const distances = [0]
  for (let i = 1; i < geometry.length; i++) {
    const [lat1, lng1] = geometry[i - 1]
    const [lat2, lng2] = geometry[i]
    const dlat = lat2 - lat1
    const dlng = lng2 - lng1
    distances.push(distances[i - 1] + Math.sqrt(dlat * dlat + dlng * dlng))
  }
  return distances
}

// Given a fraction (0-1) along the route, return interpolated [lat, lng]
function interpolateRoute(geometry, distances, fraction) {
  const totalDist = distances[distances.length - 1]
  const targetDist = fraction * totalDist

  for (let i = 1; i < distances.length; i++) {
    if (distances[i] >= targetDist) {
      const segLen = distances[i] - distances[i - 1]
      const t = segLen > 0 ? (targetDist - distances[i - 1]) / segLen : 0
      const [lat1, lng1] = geometry[i - 1]
      const [lat2, lng2] = geometry[i]
      return [lat1 + t * (lat2 - lat1), lng1 + t * (lng2 - lng1)]
    }
  }
  return geometry[geometry.length - 1]
}

// Resolve missing lat/lng by interpolating position along the route
function resolveStopPositions(stops, geometry) {
  if (!stops || !geometry || geometry.length < 2) return stops || []

  const distances = getCumulativeDistances(geometry)

  const withTime = stops.map((s) => ({
    ...s,
    _absTime: ((s.day || 1) - 1) * 24 + timeToHours(s.time),
  }))

  const minTime = withTime[0]?._absTime || 0
  const maxTime = withTime[withTime.length - 1]?._absTime || 1
  const range = maxTime - minTime || 1

  return withTime.map((stop) => {
    if (stop.lat && stop.lng) return stop
    const fraction = (stop._absTime - minTime) / range
    const [lat, lng] = interpolateRoute(geometry, distances, Math.max(0, Math.min(1, fraction)))
    return { ...stop, lat, lng, _interpolated: true }
  })
}

// Reverse geocode a [lat, lng] via Nominatim
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`,
      { headers: { "Accept-Language": "en" } }
    )
    const json = await res.json()
    const addr = json.address || {}
    const place = addr.city || addr.town || addr.village || addr.county || ""
    const state = addr.state || ""
    if (place && state) return `${place}, ${state}`
    if (place) return place
    if (json.display_name) return json.display_name.split(",").slice(0, 2).join(",").trim()
    return null
  } catch {
    return null
  }
}

// Module-level cache so multiple hook instances share geocode results
const geoCache = {}
let listeners = new Set()
let fetchInProgress = false

function notifyListeners() {
  listeners.forEach((fn) => fn({ ...geoCache }))
}

async function fetchGeoNames(stops) {
  if (fetchInProgress) return
  fetchInProgress = true

  for (const stop of stops) {
    const key = `${stop.lat.toFixed(4)},${stop.lng.toFixed(4)}`
    if (geoCache[key]) continue
    const name = await reverseGeocode(stop.lat, stop.lng)
    if (name) {
      geoCache[key] = name
      notifyListeners()
    }
    // Nominatim rate limit: 1 req/sec
    await new Promise((r) => setTimeout(r, 1100))
  }

  fetchInProgress = false
}

// Shared hook: returns { resolvedStops, getDisplayName }
export default function useResolvedStops() {
  const data = useSelector((state) => state.trip.data)
  const [geocodedNames, setGeocodedNames] = useState(() => ({ ...geoCache }))

  const { route_geometry, stops } = data || {}

  const resolvedStops = useMemo(
    () => resolveStopPositions(stops, route_geometry),
    [stops, route_geometry]
  )

  // Subscribe to shared cache updates
  useEffect(() => {
    const handler = (names) => setGeocodedNames(names)
    listeners.add(handler)
    return () => listeners.delete(handler)
  }, [])

  // Trigger geocoding for rest/fuel stops
  useEffect(() => {
    if (!resolvedStops.length) return

    const toGeocode = resolvedStops.filter(
      (s) => (s.type === "rest" || s.type === "fuel") && s.lat && s.lng
    )

    if (toGeocode.length) fetchGeoNames(toGeocode)
  }, [resolvedStops])

  // Helper to get display name for a stop
  function getDisplayName(stop) {
    if (stop.lat && stop.lng) {
      const key = `${stop.lat.toFixed(4)},${stop.lng.toFixed(4)}`
      if (geocodedNames[key]) return geocodedNames[key]
    }
    return stop.location
  }

  return { resolvedStops, geocodedNames, getDisplayName }
}
