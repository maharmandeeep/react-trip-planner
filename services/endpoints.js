const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const ENDPOINTS = {
  trip: {
    plan: `${API_BASE}/api/trip/plan`,
  },
}
