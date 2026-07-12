import { Router } from 'express'
import { signAdminToken } from '../middleware/auth.js'

const router = Router()

/** POST /api/auth/login  { password } → { token } */
router.post('/login', (req, res) => {
  const { password } = req.body || {}
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD is not configured on the server' })
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Wrong password' })
  }
  res.json({ token: signAdminToken() })
})

export default router
