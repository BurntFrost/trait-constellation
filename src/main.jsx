import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SpectrumProfile from './SpectrumProfile.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SpectrumProfile />
  </StrictMode>,
)
