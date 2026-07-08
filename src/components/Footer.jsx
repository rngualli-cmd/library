import { Link } from 'react-router-dom'
import { LogoMark, MOBILE_LINKS } from './Navbar.jsx'

export default function Footer() {
  return (
    <footer className="bg-terra-ink py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 md:flex-row md:justify-between md:px-12">
        <Link to="/#inicio" className="flex items-center gap-2">
          <LogoMark size="h-9 w-9" variant="light" />
          <span className="font-semibold text-white tracking-tight">
            Terra<span className="text-terra-green">Enlace</span>
          </span>
        </Link>
        <nav className="flex flex-wrap justify-center gap-6" aria-label="Enlaces del pie de página">
          {MOBILE_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-[11px] font-light tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-[11px] font-light text-white/35">
          © {new Date().getFullYear()} TerraEnlace Cía. Ltda. — Ecuador
        </p>
      </div>

      {/* Declaración de cumplimiento */}
      <div className="mx-auto mt-8 max-w-4xl border-t border-white/10 px-6 pt-6 md:px-12">
        <p className="text-center text-[11px] font-light leading-relaxed text-white/35">
          Operamos en estricto cumplimiento de la normativa societaria
          ecuatoriana, garantizando el origen legal 100&nbsp;% verificado de
          todo nuestro capital, activos y operaciones de la cadena de
          suministro internacional.
        </p>
      </div>
    </footer>
  )
}
