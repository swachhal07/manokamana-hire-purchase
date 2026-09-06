/* Manokamana Hire Purchase — Kamaladi, Kathmandu */
const OFFICE = { lat: 27.7108334, lng: 85.31344 }

/**
 * Google Maps embed of the office.
 *
 * Uses the keyless `output=embed` endpoint — no API key, no billing account,
 * and no "API KEY REQUIRED" watermark (the reason CARTO's basemap was dropped).
 * Visitors get Google's own street labels, zoom controls and a "View larger
 * map" link straight into the Maps app.
 *
 * `loading="lazy"` keeps it off the critical path; the iframe is sandboxed to
 * the permissions Maps actually needs, and referrer info is withheld.
 */
export default function OfficeMap({ className = '' }) {
  const src = `https://maps.google.com/maps?q=${OFFICE.lat},${OFFICE.lng}&z=16&hl=en&output=embed`

  return (
    <iframe
      src={src}
      title="Map of the Manokamana Hire Purchase office in Kamaladi, Kathmandu"
      className={`block border-0 ${className}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  )
}
