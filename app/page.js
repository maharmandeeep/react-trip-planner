"use client"

import dynamic from "next/dynamic"
import { useSelector } from "react-redux"
import TripForm from "./components/TripForm"
import LogSheet from "./components/LogSheet"

// Dynamic import — Leaflet uses window/document, can't render server-side
const RouteMap = dynamic(() => import("./components/RouteMap"), { ssr: false })

export default function Home() {
  const data = useSelector((state) => state.trip.data)

  return (
    <div className="grid gap-6">
      <TripForm />
      {data && <RouteMap />}
      {data && <LogSheet />}
    </div>
  )
}
