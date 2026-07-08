import { ArrowRight, Briefcase, Compass, LineChart, MapPin, Sprout, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'

const DIVISIONES = [
  {
    icon: Wallet,
    title: 'Administración y Finanzas',
    description: 'Gestión financiera rigurosa y control administrativo de todas las operaciones.',
  },
  {
    icon: Briefcase,
    title: 'Operaciones Técnico-Comerciales',
    description: 'Ejecución técnica y comercial de las cadenas de suministro agropecuarias.',
  },
  {
    icon: LineChart,
    title: 'Desarrollo de Negocios',
    description: 'Apertura de nuevos mercados y alianzas estratégicas para el sector.',
  },
]

export default function Nosotros({ showCta = true }) {
  return (
    <section id="nosotros" className="scroll-mt-24 bg-terra-cream py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        {/* Encabezado */}
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-terra-green">
              Nosotros
            </p>
            <h2 className="mt-4 font-instrument-serif text-terra-navy text-4xl md:text-5xl lg:text-6xl leading-[1.08]">
              El enlace <span className="italic">entre la tierra</span>
              <br />
              y quienes la trabajan
            </h2>
          </div>
          <p className="text-terra-navy/70 text-sm md:text-base font-light leading-relaxed">
            {/* Texto simulado — reemplazar con la descripción definitiva */}
            TerraEnlace Cía. Ltda. es una compañía ecuatoriana dedicada a la
            comercialización de productos agropecuarios, la intermediación
            comercial y la consultoría técnica. Trabajamos junto a productores,
            organizaciones, empresas e instituciones para acercar el campo
            ecuatoriano a los mercados.
          </p>
        </div>

        {/* Misión y Visión */}
        <div className="mt-14 md:mt-20">
          <h3 className="text-center font-instrument-serif text-terra-navy text-3xl md:text-4xl">
            Misión <span className="italic">y</span> Visión
          </h3>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="rounded-3xl border border-terra-navy/15 bg-white p-8 md:p-12">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-terra-green/10">
                <Sprout className="h-7 w-7 text-terra-green" strokeWidth={1.5} />
              </span>
              <h4 className="mt-6 font-instrument-serif text-3xl md:text-4xl text-terra-navy">
                Misión <span className="italic">TerraEnlace</span>
              </h4>
              <p className="mt-4 text-terra-navy/70 text-sm md:text-base font-light leading-relaxed">
                TerraEnlace contribuye al desarrollo sostenible y competitivo del
                sector agropecuario ecuatoriano mediante la articulación
                estratégica de productores, organizaciones, empresas e
                instituciones, ofreciendo servicios de consultoría, gestión
                empresarial, comercialización, producción, capacitación e
                investigación que faciliten el acceso a mercados, el
                fortalecimiento de capacidades y la generación de oportunidades.
              </p>
            </article>

            <article className="rounded-3xl border border-terra-navy/15 bg-white p-8 md:p-12">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-terra-sun/10">
                <Compass className="h-7 w-7 text-terra-sun" strokeWidth={1.5} />
              </span>
              <h4 className="mt-6 font-instrument-serif text-3xl md:text-4xl text-terra-navy">
                Visión <span className="italic">TerraEnlace</span>
              </h4>
              <p className="mt-4 text-terra-navy/70 text-sm md:text-base font-light leading-relaxed">
                Ser el aliado estratégico líder del sector agropecuario
                ecuatoriano, reconocida por integrar conocimiento, innovación,
                producción y mercados para generar soluciones sostenibles que
                fortalezcan la competitividad, promuevan la asociatividad y
                mejoren la calidad de vida de los actores de las cadenas
                agroproductivas.
              </p>
            </article>
          </div>
        </div>

        {/* Estructura corporativa */}
        <div className="mt-14 md:mt-20 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div>
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-terra-green">
              Estructura corporativa
            </p>
            <h3 className="mt-3 font-instrument-serif text-terra-navy text-3xl md:text-4xl leading-tight">
              Un directorio ejecutivo <span className="italic">especializado</span>
            </h3>
            <p className="mt-4 text-terra-navy/70 text-sm font-light leading-relaxed">
              La compañía opera bajo una estructura corporativa avanzada, con
              divisiones dedicadas que garantizan solidez y profesionalismo en
              cada operación.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3">
            {DIVISIONES.map(({ icon: Icon, title, description }) => (
              <li key={title} className="rounded-2xl border border-terra-navy/10 bg-white p-6">
                <Icon className="h-6 w-6 text-terra-green" strokeWidth={1.5} />
                <h4 className="mt-4 text-sm font-medium text-terra-navy leading-snug">{title}</h4>
                <p className="mt-2 text-xs font-light leading-relaxed text-terra-navy/60">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Centro logístico estratégico */}
        <div className="mt-10 flex flex-col gap-4 rounded-3xl bg-terra-green/10 p-8 md:flex-row md:items-center md:gap-6 md:p-10">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-terra-green">
            <MapPin className="h-5 w-5 text-white" strokeWidth={1.5} />
          </span>
          <div>
            <h4 className="font-instrument-serif text-2xl text-terra-navy">
              Centro logístico estratégico
            </h4>
            <p className="mt-2 text-sm font-light leading-relaxed text-terra-navy/70">
              Nuestra sede principal, ubicada en el cantón Rumiñahui (parroquia
              Cotogchoa, Pichincha), es una puerta de enlace centralizada e
              ideal para gestionar la logística y la distribución agropecuaria
              a nivel nacional.
            </p>
          </div>
        </div>

        {/* Datos simulados */}
        <dl className="mt-14 md:mt-20 grid grid-cols-2 gap-y-10 md:grid-cols-4 text-center md:text-left">
          {[
            { value: '+120', label: 'Productores aliados' },
            { value: '14', label: 'Provincias con presencia' },
            { value: '+35', label: 'Cadenas agroproductivas' },
            { value: '2024', label: 'Año de fundación' },
          ].map((item) => (
            <div key={item.label}>
              <dt className="sr-only">{item.label}</dt>
              <dd className="font-instrument-serif text-4xl md:text-5xl text-terra-navy">
                {item.value}
              </dd>
              <dd className="mt-2 text-xs font-light tracking-[0.15em] uppercase text-terra-navy/60">
                {item.label}
              </dd>
            </div>
          ))}
        </dl>

        {/* Enlace a la página completa de Nosotros */}
        {showCta && (
          <div className="mt-14 text-center">
            <Link
              to="/nosotros"
              className="group inline-flex items-center gap-2 rounded-full bg-terra-navy px-7 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-terra-ink"
            >
              Conoce más sobre nosotros
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
