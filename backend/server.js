import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './src/routes/auth.js'
import reportRoutes from './src/routes/reports.js'
import postRoutes from './src/routes/posts.js'
import teamRoutes from './src/routes/team.js'
import careerRoutes from './src/routes/careers.js'

const app = express()

// Deployed behind a single hosting proxy (Render/Vercel/etc.); trust one hop
// so express-rate-limit keys off the real client IP, not the proxy's.
app.set('trust proxy', 1)

const origins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

app.use(helmet())
app.use(cors({ origin: origins }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/careers', careerRoutes)

app.use((req, res) => res.status(404).json({ error: 'Not found' }))

// Central error handler — multer size errors, Cloudinary failures, etc.
// Client-facing messages are only surfaced for expected 4xx cases (bad
// uploads); genuine 500s log the detail server-side and return a generic
// message so internal errors never leak to the client.
app.use((err, _req, res, _next) => {
  console.error(err)
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: err.message })
  }
  res.status(500).json({ error: 'Server error' })
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Manokamana API listening on http://localhost:${port}`))
