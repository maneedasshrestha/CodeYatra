"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Button } from "@/components/ui/button"
import { useMap } from "../hooks/useMap"
import { Truck, Moon, Sun } from "lucide-react"

// Replace with your actual Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoiZ3dhY2giLCJhIjoiY200MTI4bnBtMDZpeDJqcjJodzlsbG12ayJ9.Xa2O7gqDu4IPYxSfjsY6WQ"

const LANDFILL_COORDINATES: [number, number] = [85.34281612330756, 27.70252062329233] // Kathmandu landfill site coordinates
const DUSTBIN_LOCATIONS = [
  { id: 1, coordinates: [85.34128890894436 , 27.703639040684504] },
  { id: 2, coordinates: [85.3417126315685 , 27.70086706042217] },
  { id: 3, coordinates: [85.3431527117119 , 27.6996338033092] },
  { id: 4, coordinates: [85.34397761193613 , 27.70199725320812] },
  { id: 5, coordinates: [85.34474937674 , 27.7048155617118] },
  { id: 6, coordinates: [85.33786848233 , 27.701880331901] },
  { id: 7, coordinates: [85.34560664362488 , 27.699341327965] },
]

export default function WasteMap() {
  const mapContainer = useRef(null)
  const { map, addMarker, toggleMarker, calculateOptimalRoute, drawRoute, toggleDarkMode } = useMap(
    mapContainer,
    LANDFILL_COORDINATES,
  )
  const [dustbins, setDustbins] = useState(DUSTBIN_LOCATIONS.map((bin) => ({ ...bin, isFull: false })))
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (!map) return

    // Add landfill marker
    addMarker(LANDFILL_COORDINATES, "landfill")

    // Add dustbin markers
    dustbins.forEach((bin) => {
      addMarker(bin.coordinates, "dustbin", bin.id, () => handleDustbinToggle(bin.id))
    })
  }, [map, addMarker, dustbins])

  const handleDustbinToggle = (id: number) => {
    setDustbins((prev) => prev.map((bin) => (bin.id === id ? { ...bin, isFull: !bin.isFull } : bin)))
    toggleMarker(id)
  }

  const handleCalculateRoute = () => {
    const fullBins = dustbins.filter((bin) => bin.isFull)
    if (fullBins.length === 0) {
      alert("No full dustbins to collect!")
      return
    }
    const optimalRoute = calculateOptimalRoute(
      LANDFILL_COORDINATES,
      fullBins.map((bin) => bin.coordinates as [number, number]),
    )
    drawRoute(optimalRoute)
  }

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
    toggleDarkMode()
  }

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <Button onClick={handleToggleDarkMode}>
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button onClick={handleCalculateRoute}>
          <Truck className="mr-2 h-4 w-4" />
          Calculate Route
        </Button>
      </div>
    </div>
  )
}

