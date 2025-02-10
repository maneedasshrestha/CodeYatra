"use client"

import { useEffect, useState, useRef, type MutableRefObject } from "react"
import mapboxgl from "mapbox-gl"

const emptyBinSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`

const fullBinSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`

const landfillSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#facc15" stroke="#854d0e" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`

export function useMap(container: MutableRefObject<null>, center: [number, number]) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({})

  useEffect(() => {
    if (container.current) {
      const mapInstance = new mapboxgl.Map({
        container: container.current,
        style: isDarkMode ? "mapbox://styles/mapbox/dark-v10" : "mapbox://styles/mapbox/light-v10",
        center: center,
        zoom: 17,
      })

      mapInstance.on("load", () => {
        setMap(mapInstance)
      })

      return () => mapInstance.remove()
    }
  }, [container, center, isDarkMode])

  const addMarker = (
    coordinates: [number, number],
    type: "landfill" | "dustbin",
    id?: number,
    onClick?: () => void,
  ) => {
    if (!map) return

    const el = document.createElement("div")
    el.className = `marker ${type}`

    if (type === "dustbin") {
      el.innerHTML = emptyBinSVG
      el.style.width = "40px"
      el.style.height = "40px"
    } else {
      el.innerHTML = landfillSVG
      el.style.width = "60px"
      el.style.height = "60px"
    }

    el.style.display = "flex"
    el.style.justifyContent = "center"
    el.style.alignItems = "center"
    el.style.cursor = "pointer"

    if (onClick) {
      el.addEventListener("click", onClick)
    }

    const marker = new mapboxgl.Marker(el).setLngLat(coordinates).addTo(map)

    if (id) {
      markersRef.current[id] = marker
    }

    if (type === "landfill") {
      animateLandfillMarker(el)
    }
  }

  const toggleMarker = (id: number) => {
    const marker = markersRef.current[id]
    if (marker) {
      const el = marker.getElement()
      if (el.classList.contains("full")) {
        el.innerHTML = emptyBinSVG;
        el.classList.remove("full");
        el.style.zIndex = "1000"; // Set a high z-index for the empty bin
      } else {
        el.innerHTML = fullBinSVG;
        el.classList.add("full");
        el.style.zIndex = "1000"; // Set a high z-index for the full bin
      }
      
    }
  }

  const calculateOptimalRoute = (start: [number, number], bins: [number, number][]) => {
    // Implementation of 2-opt algorithm for route optimization
    const route = [start, ...bins, start]
    let improvement = true

    while (improvement) {
      improvement = false
      for (let i = 1; i < route.length - 2; i++) {
        for (let j = i + 1; j < route.length - 1; j++) {
          if (j - i === 1) continue
          const d1 = getDistance(route[i - 1], route[i]) + getDistance(route[j], route[j + 1])
          const d2 = getDistance(route[i - 1], route[j]) + getDistance(route[i], route[j + 1])
          if (d2 < d1) {
            // Reverse the subpath from i to j
            route.splice(i, j - i + 1, ...route.slice(i, j + 1).reverse())
            improvement = true
          }
        }
      }
    }

    return route
  }

  const getDistance = (point1: [number, number], point2: [number, number]) => {
    const [x1, y1] = point1
    const [x2, y2] = point2
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  const drawRoute = async (coordinates: [number, number][]) => {
    if (!map) return

    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.map((coord) => coord.join(",")).join(";")}?geometries=geojson&access_token=${mapboxgl.accessToken}`,
    )
    const data = await response.json()

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0].geometry

      if (map.getSource("route")) {
        ;(map.getSource("route") as mapboxgl.GeoJSONSource).setData(route)
      } else {
        map.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: route,
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 6,
          },
        })
      }
    }
  }

  const animateLandfillMarker = (el: HTMLElement) => {
    const pulse = document.createElement("div")
    pulse.className = "pulse"
    el.appendChild(pulse)
  }

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
    if (map) {
      map.setStyle(isDarkMode ? "mapbox://styles/mapbox/light-v10" : "mapbox://styles/mapbox/dark-v10")
    }
  }

  return { map, addMarker, toggleMarker, calculateOptimalRoute, drawRoute, toggleDarkMode }
}

