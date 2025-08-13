import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Healthcheck simples do backend usando VITE_API_URL
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
fetch(`${apiUrl}/health`).catch(() => {})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
