import { Link } from 'react-router-dom'
import { EASE, LogoMark, MOBILE_LINKS } from './Navbar.jsx'

export default function MobileMenu({ open, onClose }) {
  return (
    <div
      className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* Fondo */}
      <div
        className={`absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity duration-700 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionTimingFunction: EASE }}
      />

      {/* Contenido */}
      <div
        className={`relative flex h-full flex-col transition-opacity duration-700 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionTimingFunction: EASE }}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-5">
          <Link to="/#inicio" className="flex items-center gap-2" onClick={onClose}>
            <LogoMark variant="light" />
            <span className="text-white font-semibold text-lg tracking-tight font-sans">
              Terra<span className="text-terra-green">Enlace</span>
            </span>
          </Link>
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center"
            aria-label="Cerrar menú"
            onClick={onClose}
          >
            <span className="absolute block h-[2px] w-6 rotate-45 rounded-full bg-white" />
            <span className="absolute block h-[2px] w-6 -rotate-45 rounded-full bg-white" />
          </button>
        </div>

        {/* Enlaces */}
        <nav className="flex-1 flex flex-col justify-center px-8" aria-label="Menú móvil">
          {MOBILE_LINKS.map((link, index) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={onClose}
              className={`block text-center text-4xl sm:text-5xl font-instrument-serif text-white border-b border-white/10 py-4 transition-all duration-700 hover:pl-4 ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{
                transitionTimingFunction: EASE,
                transitionDelay: open ? `${150 + index * 80}ms` : '0ms',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Pie */}
        <div className="px-8 pb-10">
          <Link
            to="/contacto"
            onClick={onClose}
            className={`block w-full rounded-full bg-white py-4 text-center text-sm font-medium text-black transition-all duration-700 ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{
              transitionTimingFunction: EASE,
              transitionDelay: open ? '550ms' : '0ms',
            }}
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </div>
  )
}
