import apiClient from './apiClient'

export async function planTrip(tripData) {
  const { data } = await apiClient.post('/api/trip/plan', tripData)
  return data
}
