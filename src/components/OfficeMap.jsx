import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

/* Manokamana Hire Purchase — Kamaladi, Kathmandu */
const OFFICE = [27.7108334, 85.31344]

/**
 * Bundled Leaflet map with CARTO's "Positron" minimal light basemap.
 * Rendered directly (no iframe), so it can't be blocked by browser
 * tracking-prevention or ad blockers the way third-party map embeds are.
 */
export default function OfficeMap({ className = '' }) {
  const elRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (mapRef.current || !elRef.current) return

    const map = L.map(elRef.current, {
      center: OFFICE,
      zoom: 16,
      scrollWheelZoom: false, // don't hijack page scroll
      zoomControl: true,
    })
    mapRef.current = map

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        subdomains: 'abcd',
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
    ).addTo(map)

    // Brand-red teardrop pin
    const pin = L.divIcon({
      className: '',
      html: `<svg width="34" height="46" viewBox="0 0 34 46" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M17 45C17 45 32 27.5 32 16A15 15 0 1 0 2 16C2 27.5 17 45 17 45Z"
                fill="#e11b22" stroke="#ffffff" stroke-width="2.5"
                style="filter: drop-shadow(0 4px 6px rgba(10,28,52,0.35))"/>
          <circle cx="17" cy="16" r="5.5" fill="#ffffff"/>
        </svg>`,
      iconSize: [34, 46],
      iconAnchor: [17, 45],
      popupAnchor: [0, -40],
    })

    L.marker(OFFICE, { icon: pin })
      .addTo(map)
      .bindPopup(
        '<strong>Manokamana Hire Purchase</strong><br>Kamaladi, Kathmandu',
      )

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return <div ref={elRef} className={className} role="application" aria-label="Map of the Manokamana Hire Purchase office" />
}
