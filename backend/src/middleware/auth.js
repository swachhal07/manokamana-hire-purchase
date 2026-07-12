import jwt from 'jsonwebtoken'

/** Protects admin routes. Expects `Authorization: Bearer <token>`. */
export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Not authenticated' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (payload.role !== 'admin') throw new Error('bad role')
    req.admin = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Session expired — log in again' })
  }
}

export function signAdminToken() {
  return jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' })
}
