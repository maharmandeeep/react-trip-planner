"use client"

import dynamic from "next/dynamic"
import { useSelector } from "react-redux"
import TripForm from "./components/TripForm"
import LogSheet from "./components/LogSheet"
import Timeline from "./components/Timeline"
import TripSummary from "./components/TripSummary"

// Dynamic import — Leaflet uses window/document, can't render server-side
const RouteMap = dynamic(() => import("./components/RouteMap"), { ssr: false })

export default function Home() {
  const data = useSelector((state) => state.trip.data)

  return (
    <div className="grid gap-6">
      <TripForm />

      {data && (
        <>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <RouteMap />
            <div className="space-y-6">
              <TripSummary />
              <Timeline />
            </div>
          </div>
          <LogSheet />
        </>
      )}
    </div>
  )
}
