"use client"

import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

export default function TripSummary() {
  const data = useSelector((state) => state.trip.data)

  if (!data) return null

  const { total_miles, total_driving_hours, total_days, cycle_summary } = data

  const cycleLimit = cycle_summary?.limit || 70
  const cycleBefore = cycle_summary?.cycle_before || 0
  const cycleAfter = cycle_summary?.cycle_after || 0
  const remaining = cycle_summary?.remaining || cycleLimit - cycleAfter
  const cyclePercent = Math.min((cycleAfter / cycleLimit) * 100, 100)

  const stats = [
    {
      label: "Total Miles",
      value: total_miles != null ? `${Math.round(total_miles)}` : "—",
      unit: "mi",
    },
    {
      label: "Driving Hours",
      value: total_driving_hours != null ? `${total_driving_hours.toFixed(1)}` : "—",
      unit: "hrs",
    },
    {
      label: "Total Days",
      value: total_days != null ? `${total_days}` : "—",
      unit: total_days === 1 ? "day" : "days",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trip Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-3 rounded-lg bg-secondary/50">
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <Separator />

        {/* 70-hour cycle progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">70-Hour Cycle</span>
            <span className="text-muted-foreground">
              {cycleAfter.toFixed(1)} / {cycleLimit} hrs used
            </span>
          </div>

          <Progress value={cyclePercent} />

          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div>
              <span className="block font-medium text-foreground">{cycleBefore.toFixed(1)}h</span>
              Before trip
            </div>
            <div className="text-center">
              <span className="block font-medium text-primary">
                {cycle_summary?.on_duty_this_trip?.toFixed(1) || "0.0"}h
              </span>
              This trip
            </div>
            <div className="text-right">
              <span className="block font-medium text-foreground">{remaining.toFixed(1)}h</span>
              Remaining
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
