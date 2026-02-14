"use client"

import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// Grid dimensions
const LEFT_LABEL_WIDTH = 90
const RIGHT_MARGIN = 16
const HOUR_WIDTH = 30
const GRID_WIDTH = HOUR_WIDTH * 24 // 720px
const ROW_HEIGHT = 28
const HEADER_HEIGHT = 24
const NUM_ROWS = 4
const GRID_HEIGHT = ROW_HEIGHT * NUM_ROWS

// Status row index (top to bottom, FMCSA standard order)
const STATUS_ROW = {
  off_duty: 0,
  sleeper: 1,
  driving: 2,
  on_duty: 3,
}

// Status colors (match globals.css)
const STATUS_COLORS = {
  off_duty: "#10B981",
  sleeper: "#3B82F6",
  driving: "#7C3AED",
  on_duty: "#F59E0B",
}

const STATUS_LABELS = ["Off Duty", "Sleeper", "Driving", "On Duty"]

// Hour labels for the top axis
const HOUR_LABELS = [
  "M", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11",
  "N", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11",
]

function SingleDayLog({ log }) {
  const { day, date, total_miles, segments, hours_summary } = log

  const svgWidth = LEFT_LABEL_WIDTH + GRID_WIDTH + RIGHT_MARGIN
  const svgHeight = HEADER_HEIGHT + GRID_HEIGHT + 4

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Day {day} — {date}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {total_miles != null ? `${Math.round(total_miles)} miles` : ""}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="min-w-[826px]"
        >
          {/* Hour labels */}
          {HOUR_LABELS.map((label, i) => (
            <text
              key={i}
              x={LEFT_LABEL_WIDTH + i * HOUR_WIDTH + HOUR_WIDTH / 2}
              y={HEADER_HEIGHT - 6}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize="10"
            >
              {label}
            </text>
          ))}

          {/* Grid background + row labels */}
          {STATUS_LABELS.map((label, row) => (
            <g key={row}>
              {/* Row background — alternating */}
              <rect
                x={LEFT_LABEL_WIDTH}
                y={HEADER_HEIGHT + row * ROW_HEIGHT}
                width={GRID_WIDTH}
                height={ROW_HEIGHT}
                fill={row % 2 === 0 ? "#f9fafb" : "#ffffff"}
              />
              {/* Row label */}
              <text
                x={LEFT_LABEL_WIDTH - 8}
                y={HEADER_HEIGHT + row * ROW_HEIGHT + ROW_HEIGHT / 2 + 4}
                textAnchor="end"
                fontSize="11"
                className="fill-foreground"
                fontWeight="500"
              >
                {label}
              </text>
            </g>
          ))}

          {/* Vertical hour lines */}
          {Array.from({ length: 25 }, (_, i) => (
            <line
              key={i}
              x1={LEFT_LABEL_WIDTH + i * HOUR_WIDTH}
              y1={HEADER_HEIGHT}
              x2={LEFT_LABEL_WIDTH + i * HOUR_WIDTH}
              y2={HEADER_HEIGHT + GRID_HEIGHT}
              stroke={i === 0 || i === 12 || i === 24 ? "#d1d5db" : "#e5e7eb"}
              strokeWidth={i === 0 || i === 12 || i === 24 ? 1.5 : 0.5}
            />
          ))}

          {/* Horizontal row dividers */}
          {Array.from({ length: NUM_ROWS + 1 }, (_, i) => (
            <line
              key={i}
              x1={LEFT_LABEL_WIDTH}
              y1={HEADER_HEIGHT + i * ROW_HEIGHT}
              x2={LEFT_LABEL_WIDTH + GRID_WIDTH}
              y2={HEADER_HEIGHT + i * ROW_HEIGHT}
              stroke="#d1d5db"
              strokeWidth={0.5}
            />
          ))}

          {/* Status bars from segments */}
          {segments && segments.map((seg, i) => {
            const row = STATUS_ROW[seg.status]
            if (row === undefined) return null

            const x = LEFT_LABEL_WIDTH + seg.start * HOUR_WIDTH
            const width = (seg.end - seg.start) * HOUR_WIDTH
            const y = HEADER_HEIGHT + row * ROW_HEIGHT + 6

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={Math.max(width, 1)}
                  height={ROW_HEIGHT - 12}
                  rx={3}
                  fill={STATUS_COLORS[seg.status]}
                  opacity={0.85}
                />
                {/* Tooltip title */}
                <title>
                  {seg.note || seg.status.replace("_", " ")} ({seg.start.toFixed(1)}h - {seg.end.toFixed(1)}h)
                </title>
              </g>
            )
          })}
        </svg>

        {/* Hours summary below the grid */}
        {hours_summary && (
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
            {Object.entries(STATUS_COLORS).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="capitalize">{status.replace("_", " ")}:</span>
                <span className="font-medium text-foreground">
                  {hours_summary[status] != null ? `${hours_summary[status].toFixed(1)}h` : "0.0h"}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function LogSheet() {
  const data = useSelector((state) => state.trip.data)

  if (!data?.daily_logs?.length) return null

  return (
    <div className="space-y-4 min-w-0 overflow-hidden">
      <h2 className="text-lg font-semibold">Daily Log Sheets</h2>
      {data.daily_logs.map((log) => (
        <SingleDayLog key={log.day} log={log} />
      ))}
    </div>
  )
}
