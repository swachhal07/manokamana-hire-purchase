/**
 * Careers source: merges openings published via the /admin dashboard (backend
 * API) with the built-in default role in src/data/openings.js.
 *
 * API openings appear first (they're newer). The bundled default stays visible
 * so the page is never empty, even when the backend is unreachable.
 */
import { openings as staticOpenings } from '../data/openings'
import { api } from './api'

export async function getOpenings() {
  let apiOpenings = []
  try {
    apiOpenings = await api.getOpenings()
  } catch {
    // Backend unreachable — fall back to the built-in default only.
  }

  return [...apiOpenings, ...staticOpenings]
}
