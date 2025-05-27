import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {NavbarIndex} from './component/Navbar.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <NavbarIndex />
  </StrictMode>,
)
