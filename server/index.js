import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3001

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

if (process.env.LOCAL_IP) {
  defaultAllowedOrigins.push(`http://${process.env.LOCAL_IP}:5173`)
}

const allowedOrigins = (process.env.FRONTEND_ORIGIN
  ? [process.env.FRONTEND_ORIGIN, ...defaultAllowedOrigins]
  : defaultAllowedOrigins)

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error(`Blocked by CORS: ${origin}`))
  },
  credentials: true,
}))

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'backend', time: new Date().toISOString() })
})

app.get('/api/example', (req, res) => {
  res.json({ message: 'API online com CORS habilitado.' })
})

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`)
})


