"use client"

import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  fuel: "Fuel Stop",
  rest: "Rest Stop",
  dropoff: "Dropoff",
}

export default function Timeline() {
  const data = useSelector((state) => state.trip.data)

  if (!data?.stops?.length) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trip Stops</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {data.stops.map((stop, i) => {
            const color = STOP_COLORS[stop.type] || "#7C3AED"
            const isLast = i === data.stops.length - 1

            return (
              <div key={i} className="flex gap-4 pb-6 last:pb-0">
                {/* Dot + connecting line */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shrink-0 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  {!isLast && (
                    <div className="w-0.5 grow bg-border mt-1" />
                  )}
                </div>

                {/* Stop info */}
                <div className="flex-1 -mt-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">
                      {STOP_LABELS[stop.type] || stop.type}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs capitalize"
                      style={{ backgroundColor: color + "1A", color: color }}
                    >
                      {stop.type}
                    </Badge>
                  </div>
                  {stop.location && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {stop.location}
                    </p>
                  )}
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    {stop.time && <span>Time: {stop.time}</span>}
                    {stop.day && <span>Day {stop.day}</span>}
                    {stop.duration_hrs && (
                      <span>{stop.duration_hrs}hr{stop.duration_hrs !== 1 ? "s" : ""}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
