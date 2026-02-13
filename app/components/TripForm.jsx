"use client"

import { useSelector, useDispatch } from "react-redux"
import { updateFormValues, setLoading, setTripData, setError } from "@/store/slices/tripSlice"
import { planTrip } from "@/services/tripService"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function TripForm() {
  const dispatch = useDispatch()
  const { formValues, loading, error } = useSelector((state) => state.trip)

  const handleChange = (e) => {
    dispatch(updateFormValues({ [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(setLoading(true))

    try {
      const tripData = {
        ...formValues,
        current_cycle_hours: Number(formValues.current_cycle_hours),
      }
      const result = await planTrip(tripData)
      dispatch(setTripData(result))
    } catch (err) {
      dispatch(setError(err.message))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Plan Your Trip</CardTitle>
        <CardDescription>
          Enter your locations and current cycle hours to generate an HOS-compliant route.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="current_location">Current Location</Label>
            <Input
              id="current_location"
              name="current_location"
              placeholder="e.g. Los Angeles, CA"
              value={formValues.current_location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup_location">Pickup Location</Label>
            <Input
              id="pickup_location"
              name="pickup_location"
              placeholder="e.g. Phoenix, AZ"
              value={formValues.pickup_location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoff_location">Dropoff Location</Label>
            <Input
              id="dropoff_location"
              name="dropoff_location"
              placeholder="e.g. Dallas, TX"
              value={formValues.dropoff_location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_cycle_hours">Current Cycle Hours (0-70)</Label>
            <Input
              id="current_cycle_hours"
              name="current_cycle_hours"
              type="number"
              min="0"
              max="70"
              placeholder="e.g. 20"
              value={formValues.current_cycle_hours}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <div className="sm:col-span-2 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="sm:col-span-2 flex sm:justify-end">
            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Planning Trip...
                </>
              ) : (
                "Plan Trip"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
