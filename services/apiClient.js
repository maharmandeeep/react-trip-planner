import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — log in development
apiClient.interceptors.request.use((config) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`)
  }
  return config
})

// Response interceptor — unwrap data, handle errors
apiClient.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[API] Response:', response.data)
    }
    return response
  },
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error(
        'Network error — is the backend server running? ' +
        'Start it with: cd danjo && source venv/bin/activate && python manage.py runserver'
      ))
    }

    const { data, status, statusText } = error.response

    // Django DRF error formats
    if (data?.error) return Promise.reject(new Error(data.error))
    if (data?.detail) return Promise.reject(new Error(data.detail))

    // Django DRF validation errors: { "field": ["error msg"] }
    if (typeof data === 'object') {
      const fieldErrors = Object.entries(data)
        .map(([field, errors]) =>
          `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
        )
        .join(' | ')
      if (fieldErrors) return Promise.reject(new Error(fieldErrors))
    }

    return Promise.reject(new Error(`Server error: ${status} ${statusText}`))
  }
)

// Wake up Render free-tier server (cold start takes ~30-60s)
// Call on app load so backend is ready by the time user submits the form
export function warmUpServer() {
  fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/trip/plan', {
    method: 'HEAD',
  }).catch(() => {})
}

export default apiClient
