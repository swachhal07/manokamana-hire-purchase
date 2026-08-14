import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Drop the no-JS fallback tags from index.html — the <Seo> component supplies
// per-route equivalents, and duplicates in <head> are ambiguous for crawlers.
document.querySelectorAll('head [data-fallback]').forEach((el) => el.remove())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
