/**
 * Company financial-report source.
 *
 * Reports are published from the /admin dashboard and served by the backend
 * (see backend/README.md). This module only reads.
 *
 * Each report has this shape:
 *   { id, title, year, period, notes?, publishedAt (YYYY-MM-DD), fileUrl? }
 */
import { api } from './api'

export const PERIODS = ['Q1', 'Q2', 'Q3', 'Q4', 'Annual']

/** All reports, newest fiscal period first (backend sorts). */
export async function getReports() {
  try {
    return await api.getReports()
  } catch {
    // Backend unreachable — show the empty state rather than crash.
    return []
  }
}
