import { HeartHandshake, Leaf, Lightbulb, Users } from 'lucide-react'
import Nosotros from '../components/Nosotros.jsx'
import Galeria from '../components/Galeria.jsx'

const VALORES = [
  {
    icon: HeartHandshake,
    title: 'Compromiso',
    description:
      'Cumplimos lo que prometemos con productores, clientes y comunidades, en cada entrega, en cada proyecto y en cada acuerdo.',
  },
  {
    icon: Lightbulb,
    title: 'Innovación',
    description:
      'Integramos tecnología, conocimiento e investigación para transformar la manera en que el agro ecuatoriano produce y comercializa.',
  },
  {
    icon: Leaf,
    title: 'Sostenibilidad',
    description:
      'Promovemos prácticas responsables que cuidan el suelo, el agua y la biodiversidad, pensando en las generaciones que vienen.',
  },
  {
    icon: Users,
    title: 'Colaboración',
    description:
      'Creemos en la asociatividad: crecemos junto a productores, organizaciones, empresas e instituciones de todo el país.',
  },
]

/* Compromisos simulados — ajustar con la información definitiva */
const COMPROMISOS = [
  'Comercio justo y pagos puntuales a los pequeños y medianos productores.',
  'Generación de empleo local y desarrollo de talento en las zonas rurales.',
  'Capacitación continua y transferencia de conocimiento técnico al campo.',
  'Prácticas agrícolas responsables con el ambiente y las comunidades.',
]

export default function NosotrosPage() {
  return (
    <>
      {/* Cabecera */}
      <section className="bg-terra-navy pt-32 md:pt-40 pb-16 md:pb-20">
        <div className="mx-auto max-w-6xl px-6 md:px-12 text-center">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-terra-green">
            Nosotros
          </p>
          <h1 className="mt-4 font-instrument-serif text-white text-4xl md:text-6xl leading-[1.08]">
            Conoce a fondo <span className="italic">quiénes somos</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-white/60 text-sm md:text-base font-light leading-relaxed">
            Nuestra historia, nuestros valores y el compromiso que nos une con
            el campo ecuatoriano.
          </p>
        </div>
      </section>

      {/* Contenido principal: misión, visión, estructura, sede y cifras */}
      <Nosotros showCta={false} />

      {/* Galería con carga de imágenes */}
      <section className="bg-white py-16 md:py-20">
        <Galeria />
      </section>

      {/* Nuestros Valores */}
      <section className="bg-terra-cream py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="text-center">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-terra-green">
              Nuestros Valores
            </p>
            <h2 className="mt-4 font-instrument-serif text-terra-navy text-4xl md:text-5xl leading-[1.08]">
              Lo que nos <span className="italic">define</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALORES.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-3xl border border-terra-navy/10 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-terra-navy/10"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-terra-green/10">
                  <Icon className="h-5 w-5 text-terra-green" strokeWidth={1.5} />
                </span>
                <h3 className="mt-5 font-instrument-serif text-2xl text-terra-navy">{title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-terra-navy/65">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Compromiso con nuestra comunidad */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-medium tracking-[0.3em] uppercase text-terra-green">
                Comunidad
              </p>
              <h2 className="mt-4 font-instrument-serif text-terra-navy text-4xl md:text-5xl leading-[1.08]">
                Compromiso con <span className="italic">nuestra comunidad</span>
              </h2>
              <p className="mt-5 text-terra-navy/70 text-sm md:text-base font-light leading-relaxed">
                En TerraEnlace entendemos que el verdadero crecimiento solo es
                posible cuando el campo y su gente crecen con nosotros. Por eso
                asumimos compromisos concretos con las comunidades donde
                trabajamos:
              </p>
              <ul className="mt-6 space-y-3">
                {COMPROMISOS.map((compromiso) => (
                  <li key={compromiso} className="flex items-start gap-3">
                    <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-terra-green" />
                    <p className="text-sm font-light leading-relaxed text-terra-navy/70">
                      {compromiso}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <figure>
              {/* Imagen referencial — reemplazar por la fotografía oficial de los fundadores */}
              <div className="overflow-hidden rounded-3xl">
                <img
                  src="https://picsum.photos/seed/fundadores/800/600"
                  alt="Fundadores de TerraEnlace"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 text-center text-xs font-light text-terra-navy/45">
                Fundadores de TerraEnlace — fotografía referencial
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    </>
  )
}
