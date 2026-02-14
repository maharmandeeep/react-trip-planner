"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { useSelector } from "react-redux"
import TripForm from "./components/TripForm"
import LogSheet from "./components/LogSheet"
import Timeline from "./components/Timeline"
import TripSummary from "./components/TripSummary"

// Dynamic import — Leaflet uses window/document, can't render server-side
const RouteMap = dynamic(() => import("./components/RouteMap"), { ssr: false })

const TABS = [
  { key: "route", label: "Route Map" },
  { key: "logs", label: "Log Sheets" },
  { key: "info", label: "Trip Info" },
]

export default function Home() {
  const data = useSelector((state) => state.trip.data)
  const [activeTab, setActiveTab] = useState("route")

  return (
    <div className="grid gap-6 min-w-0 overflow-hidden">
      <TripForm />

      {data && (
        <>
          {/* Mobile tabs — hidden on lg+ */}
          <div className="flex gap-1 p-1 rounded-lg bg-secondary/50 lg:hidden">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile: show active tab content only */}
          <div className="lg:hidden min-w-0 overflow-hidden">
            {activeTab === "route" && <RouteMap />}
            {activeTab === "logs" && <LogSheet />}
            {activeTab === "info" && (
              <div className="space-y-6">
                <TripSummary />
                <Timeline />
              </div>
            )}
          </div>

          {/* Desktop: full layout — hidden on mobile */}
          <div className="hidden lg:grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Left column: Map + Log Sheets */}
            <div className="space-y-6 min-w-0">
              <RouteMap />
              <LogSheet />
            </div>
            {/* Right sidebar: Summary + Timeline */}
            <div className="space-y-6">
              <TripSummary />
              <Timeline />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
