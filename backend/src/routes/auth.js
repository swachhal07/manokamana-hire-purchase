import { Router } from 'express'
import { timingSafeEqual } from 'node:crypto'
import rateLimit from 'express-rate-limit'
import { signAdminToken } from '../middleware/auth.js'

const router = Router()

/**
 * Brute-force protection: cap login attempts per IP. Only failed attempts
 * count toward the limit (successful logins are skipped), so a legitimate
 * admin who types the right password is never locked out.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts. Try again in a few minutes.' },
})

/** Constant-time string comparison to avoid leaking the password via timing. */
function safeEqual(a, b) {
  const bufA = Buffer.from(String(a))
  const bufB = Buffer.from(String(b))
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

/** POST /api/auth/login  { password } → { token } */
router.post('/login', loginLimiter, (req, res) => {
  const { password } = req.body || {}
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD is not configured on the server' })
  }
  if (typeof password !== 'string' || !safeEqual(password, process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ error: 'Wrong password' })
  }
  res.json({ token: signAdminToken() })
})

export default router
