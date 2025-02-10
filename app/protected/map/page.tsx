"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Button } from "@/components/ui/button"
import { useMap } from "@/hooks/useMap"
import { Truck, Moon, Sun } from "lucide-react"

// Replace with your actual Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoiZ3dhY2giLCJhIjoiY200MTI4bnBtMDZpeDJqcjJodzlsbG12ayJ9.Xa2O7gqDu4IPYxSfjsY6WQ"

const LANDFILL_COORDINATES: [number, number] = [85.30033228536395 , 27.69405066813316] // Kathmandu landfill site coordinates
const DUSTBIN_LOCATIONS = [
  { id: 1, coordinates: [85.30005773358675 , 27.693631684961854] },
  { id: 2, coordinates: [85.30108847875864 , 27.69359973157507] },
  { id: 3, coordinates: [85.30129611325015 , 27.692696922210384] },
  { id: 4, coordinates: [85.29853880248082 , 27.6943118896085] },
  { id: 5, coordinates: [85.30185937708569 , 27.69366590551727] },
  { id: 6, coordinates: [85.30161261386787 , 27.694269140779436] },
  { id: 7, coordinates: [85.30043244195663 , 27.695038617141755] },
  { id: 7, coordinates: [85.29975652531529 , 27.692796670882156] },
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

