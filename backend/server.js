import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './src/routes/auth.js'
import reportRoutes from './src/routes/reports.js'
import postRoutes from './src/routes/posts.js'
import teamRoutes from './src/routes/team.js'
import careerRoutes from './src/routes/careers.js'

const app = express()

const origins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

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
app.use((err, _req, res, _next) => {
  console.error(err)
  const status = err.name === 'MulterError' ? 400 : 500
  res.status(status).json({ error: err.message || 'Server error' })
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Manokamana API listening on http://localhost:${port}`))
