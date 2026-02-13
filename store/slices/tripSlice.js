import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  error: null,
  formValues: {
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_hours: '',
  },
  data: null,
}

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload
      if (action.payload) {
        state.error = null
      }
    },
    setError(state, action) {
      state.error = action.payload
      state.loading = false
    },
    setTripData(state, action) {
      state.data = action.payload
      state.loading = false
      state.error = null
    },
    updateFormValues(state, action) {
      state.formValues = { ...state.formValues, ...action.payload }
    },
    resetTrip(state) {
      state.data = null
      state.error = null
      state.loading = false
    },
  },
})

export const { setLoading, setError, setTripData, updateFormValues, resetTrip } = tripSlice.actions
export default tripSlice.reducer
