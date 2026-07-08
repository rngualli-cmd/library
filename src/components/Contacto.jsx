import { ArrowRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

/* Datos simulados — reemplazar con la información oficial */
export const CONTACTO_DATOS = [
  {
    icon: MapPin,
    label: 'Dirección',
    value: 'Cantón Rumiñahui, parroquia Cotogchoa, Pichincha — Ecuador',
  },
  {
    icon: Phone,
    label: 'Teléfono',
    value: '+593 99 123 4567',
    href: 'tel:+593991234567',
  },
  {
    icon: Mail,
    label: 'Correo',
    value: 'info@terraenlace.ec',
    href: 'mailto:info@terraenlace.ec',
  },
  {
    icon: Clock,
    label: 'Horario',
    value: 'Lunes a viernes, 08h30 – 17h30',
  },
]

/**
 * Bloque de contacto que cierra todas las páginas del sitio.
 * La página completa de contacto vive en /contacto.
 */
export default function Contacto() {
  return (
    <section id="contacto" className="scroll-mt-24 bg-terra-navy py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-terra-green">
              Contacto
            </p>
            <h2 className="mt-4 font-instrument-serif text-white text-4xl md:text-5xl leading-[1.08]">
              Hablemos <span className="italic">del campo</span>
            </h2>
            <p className="mt-5 text-white/60 text-sm md:text-base font-light leading-relaxed max-w-md">
              ¿Eres productor, empresa o institución? Escríbenos y encontremos
              juntos la mejor manera de llevar tu producción más lejos.
            </p>
            <Link
              to="/contacto"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-terra-green px-7 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-terra-leaf"
            >
              Ir a la página de contacto
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <ul className="space-y-6">
            {CONTACTO_DATOS.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Icon className="h-4 w-4 text-terra-green" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="text-[11px] font-light tracking-[0.2em] uppercase text-white/45">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="mt-1 block text-sm md:text-base font-light text-white hover:text-terra-green transition-colors duration-200"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm md:text-base font-light text-white">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
