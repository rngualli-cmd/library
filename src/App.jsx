import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import MobileMenu from './components/MobileMenu.jsx'
import Hero from './components/Hero.jsx'
import Nosotros from './components/Nosotros.jsx'
import Servicios from './components/Servicios.jsx'
import Contacto from './components/Contacto.jsx'
import Footer from './components/Footer.jsx'
import NosotrosPage from './pages/NosotrosPage.jsx'
import ContactoPage from './pages/ContactoPage.jsx'

/* Desplaza suavemente hacia el ancla (#seccion) o al inicio al cambiar de página */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return null
}

function HomePage() {
  return (
    <>
      <Hero />
      <Nosotros />
      <Servicios />
    </>
  )
}

function AppContent() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <>
      <ScrollManager />
      <Navbar menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nosotros" element={<NosotrosPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
        </Routes>
        {/* Bloque de contacto que cierra todas las páginas, excepto la de contacto */}
        {pathname !== '/contacto' && <Contacto />}
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
