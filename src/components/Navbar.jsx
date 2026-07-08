import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import markWhite from '../assets/mark-white.png'

const NAV_LEFT = [
  { label: 'INICIO', href: '/#inicio' },
  { label: 'NOSOTROS', href: '/nosotros' },
]

const NAV_RIGHT = [
  { label: 'SERVICIOS', href: '/#servicios' },
  { label: 'CONTACTO', href: '/contacto' },
]

export const MOBILE_LINKS = [...NAV_LEFT, ...NAV_RIGHT]
export const EASE = 'cubic-bezier(0.76,0,0.24,1)'

/**
 * Isotipo oficial (blanco). Sobre fondos oscuros se muestra tal cual;
 * sobre fondos claros ("dark") va dentro de un círculo azul marino.
 */
export function LogoMark({ size = 'h-9 w-9', variant = 'light' }) {
  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center rounded-full ${
        variant === 'dark' ? 'bg-terra-navy' : ''
      }`}
      aria-hidden="true"
    >
      <img src={markWhite} alt="" className="h-full w-full object-contain p-1.5" />
    </span>
  )
}

function PillLink({ label, href, scrolled }) {
  return (
    <Link
      to={href}
      className={`text-xs font-light tracking-[0.2em] uppercase transition-colors duration-200 ${
        scrolled ? 'text-terra-navy/70 hover:text-terra-navy' : 'text-white/80 hover:text-white'
      }`}
    >
      {label}
    </Link>
  )
}

export default function Navbar({ menuOpen, onToggleMenu }) {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fuera de la página de inicio no hay video de fondo:
  // la píldora siempre usa el estilo claro con letras oscuras.
  const scrolled = !isHome || pastHero

  const pillClasses = scrolled
    ? 'bg-white/90 border-black/10 shadow-lg shadow-black/10'
    : 'bg-white/10 border-white/20'

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-6 md:px-12 lg:px-16 py-5 md:py-6">
      {/* Píldora de escritorio: enlaces divididos alrededor del logo */}
      <nav
        className={`hidden md:flex items-center gap-10 rounded-full border backdrop-blur-md px-10 py-3 transition-colors duration-300 ${pillClasses}`}
        aria-label="Navegación principal"
      >
        {NAV_LEFT.map((link) => (
          <PillLink key={link.label} {...link} scrolled={scrolled} />
        ))}
        <Link to="/#inicio" aria-label="TerraEnlace — Inicio">
          <LogoMark variant={scrolled ? 'dark' : 'light'} />
        </Link>
        {NAV_RIGHT.map((link) => (
          <PillLink key={link.label} {...link} scrolled={scrolled} />
        ))}
      </nav>

      {/* Píldora móvil: logo + nombre + hamburguesa */}
      <div
        className={`flex md:hidden w-full items-center justify-between rounded-full border backdrop-blur-md pl-3 pr-4 py-2 transition-colors duration-300 ${pillClasses}`}
      >
        <Link to="/#inicio" className="flex items-center gap-2" aria-label="TerraEnlace — Inicio">
          <LogoMark variant={scrolled ? 'dark' : 'light'} />
          <span
            className={`font-semibold text-lg tracking-tight font-sans transition-colors duration-300 ${
              scrolled ? 'text-terra-navy' : 'text-white'
            }`}
          >
            Terra<span className="text-terra-green">Enlace</span>
          </span>
        </Link>
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={onToggleMenu}
        >
          <span className="flex flex-col items-end gap-[5px]">
            {['w-6', 'w-4', 'w-6'].map((width, i) => (
              <span
                key={i}
                className={`block h-[2px] ${width} rounded-full transition-all duration-500 ${
                  scrolled ? 'bg-terra-navy' : 'bg-white'
                }`}
                style={{ transitionTimingFunction: EASE }}
              />
            ))}
          </span>
        </button>
      </div>
    </header>
  )
}
