import { Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone, Send, Share2 } from 'lucide-react'
import { CONTACTO_DATOS } from '../components/Contacto.jsx'

/* Canales simulados — reemplazar con los canales oficiales */
const CANALES = [
  {
    icon: Mail,
    title: 'Escríbenos un correo',
    description: 'Respondemos en menos de 24 horas laborables.',
    action: 'info@terraenlace.ec',
    href: 'mailto:info@terraenlace.ec',
  },
  {
    icon: MessageCircle,
    title: 'Envíanos un WhatsApp',
    description: 'Atención directa para consultas y cotizaciones.',
    action: '+593 99 123 4567',
    href: 'https://wa.me/593991234567',
  },
  {
    icon: Phone,
    title: 'Llámanos',
    description: 'Lunes a viernes, de 08h30 a 17h30.',
    action: '+593 99 123 4567',
    href: 'tel:+593991234567',
  },
]

const REDES = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
]

const inputClasses =
  'w-full rounded-xl border border-terra-navy/15 bg-white px-4 py-3 text-sm font-light text-terra-navy placeholder:text-terra-navy/35 outline-none transition-colors duration-200 focus:border-terra-green'

export default function ContactoPage() {
  return (
    <>
      {/* Cabecera */}
      <section className="bg-terra-navy pt-32 md:pt-40 pb-16 md:pb-20">
        <div className="mx-auto max-w-6xl px-6 md:px-12 text-center">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-terra-green">
            Contacto
          </p>
          <h1 className="mt-4 font-instrument-serif text-white text-4xl md:text-6xl leading-[1.08]">
            Estamos <span className="italic">a un mensaje</span> de distancia
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-white/60 text-sm md:text-base font-light leading-relaxed">
            Elige el canal que prefieras: correo, WhatsApp, llamada o el
            formulario. Nuestro equipo te responderá lo antes posible.
          </p>
        </div>
      </section>

      {/* Menú de canales */}
      <section className="bg-terra-cream py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="grid gap-5 md:grid-cols-3">
            {CANALES.map(({ icon: Icon, title, description, action, href }) => (
              <a
                key={title}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="group rounded-3xl border border-terra-navy/10 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-terra-navy/10"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-terra-green/10 transition-colors duration-300 group-hover:bg-terra-green">
                  <Icon className="h-5 w-5 text-terra-green transition-colors duration-300 group-hover:text-white" strokeWidth={1.5} />
                </span>
                <h2 className="mt-5 font-instrument-serif text-2xl text-terra-navy">{title}</h2>
                <p className="mt-2 text-sm font-light leading-relaxed text-terra-navy/60">
                  {description}
                </p>
                <p className="mt-4 text-sm font-medium text-terra-leaf">{action}</p>
              </a>
            ))}
          </div>

          {/* Información + formulario */}
          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="font-instrument-serif text-terra-navy text-3xl md:text-4xl">
                Información <span className="italic">completa</span>
              </h2>
              <ul className="mt-8 space-y-6">
                {CONTACTO_DATOS.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                      <Icon className="h-4 w-4 text-terra-green" strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="text-[11px] font-light tracking-[0.2em] uppercase text-terra-navy/45">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="mt-1 block text-sm md:text-base font-light text-terra-navy hover:text-terra-leaf transition-colors duration-200"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm md:text-base font-light text-terra-navy">
                          {value}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
                <li className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                    <Share2 className="h-4 w-4 text-terra-green" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-[11px] font-light tracking-[0.2em] uppercase text-terra-navy/45">
                      Redes sociales
                    </p>
                    <div className="mt-2 flex gap-3">
                      {REDES.map(({ icon: Icon, label, href }) => (
                        <a
                          key={label}
                          href={href}
                          aria-label={label}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-terra-navy/15 text-terra-navy/60 transition-colors duration-200 hover:bg-terra-navy hover:text-white"
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.5} />
                        </a>
                      ))}
                    </div>
                  </div>
                </li>
              </ul>

              {/* Mapa simulado */}
              <div className="mt-10 flex h-52 items-center justify-center rounded-3xl border border-dashed border-terra-navy/20 bg-white/60">
                <p className="flex items-center gap-2 text-sm font-light text-terra-navy/50">
                  <MapPin className="h-4 w-4" />
                  Mapa de ubicación — próximamente
                </p>
              </div>
            </div>

            {/* Formulario simulado */}
            <form
              className="rounded-3xl border border-terra-navy/10 bg-white p-7 md:p-10 self-start"
              onSubmit={(e) => e.preventDefault()}
            >
              <h2 className="font-instrument-serif text-terra-navy text-3xl">
                Envíanos un mensaje
              </h2>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-light tracking-wide text-terra-navy/60">
                    Nombre
                  </span>
                  <input type="text" name="nombre" placeholder="Tu nombre" className={inputClasses} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-light tracking-wide text-terra-navy/60">
                    Correo electrónico
                  </span>
                  <input
                    type="email"
                    name="correo"
                    placeholder="tucorreo@ejemplo.com"
                    className={inputClasses}
                  />
                </label>
              </div>
              <label className="mt-5 block">
                <span className="mb-2 block text-xs font-light tracking-wide text-terra-navy/60">
                  Asunto
                </span>
                <input
                  type="text"
                  name="asunto"
                  placeholder="¿Sobre qué quieres conversar?"
                  className={inputClasses}
                />
              </label>
              <label className="mt-5 block">
                <span className="mb-2 block text-xs font-light tracking-wide text-terra-navy/60">
                  Mensaje
                </span>
                <textarea
                  name="mensaje"
                  rows={6}
                  placeholder="Cuéntanos sobre tu producción, proyecto o necesidad…"
                  className={`${inputClasses} resize-none`}
                />
              </label>
              <button
                type="submit"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-terra-green py-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-terra-leaf"
              >
                <Send className="h-4 w-4" />
                Enviar mensaje
              </button>
              <p className="mt-4 text-center text-[11px] font-light text-terra-navy/40">
                Formulario de demostración — los datos aún no se envían.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
