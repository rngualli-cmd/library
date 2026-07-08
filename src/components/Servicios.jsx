import {
  GraduationCap,
  Handshake,
  ShoppingBasket,
  Tractor,
  Truck,
} from 'lucide-react'

const SERVICIOS = [
  {
    icon: Truck,
    title: 'Distribución Mayorista y Cadena de Suministro',
    intro:
      'Logística de cadena de suministro a gran escala: actuamos como intermediarios comerciales de confianza para llevar materias primas agrícolas y productos frescos de primera calidad a los mercados nacionales e internacionales.',
    items: [
      {
        name: 'Productos agrícolas a granel',
        detail: 'Distribución mayorista de cultivos esenciales: arroz, cacao, café, granos y semillas.',
      },
      {
        name: 'Productos frescos y tubérculos',
        detail: 'Suministro al por mayor de papa, tubérculos y raíces de alta demanda.',
      },
      {
        name: 'Exportación y logística de frutas',
        detail: 'Distribución comercial a gran escala de banano, plátano y frutas frescas o en conserva.',
      },
      {
        name: 'Floricultura',
        detail: 'Distribución mayorista de flores frescas y plantas vivas.',
      },
      {
        name: 'Lácteos y productos pecuarios',
        detail: 'Suministro mayorista de lácteos premium y carnes frescas, incluidas aves de corral.',
      },
    ],
  },
  {
    icon: ShoppingBasket,
    title: 'Mercados Minoristas Especializados',
    intro:
      'A través de establecimientos comerciales especializados, ofrecemos acceso directo a alimentos premium, productos frescos y suministros especializados.',
    items: [
      {
        name: 'Tiendas de víveres boutique',
        detail: 'Frutas frescas, verduras, hortalizas y artículos esenciales del hogar de alta calidad.',
      },
      {
        name: 'Tiendas especializadas en lácteos',
        detail: 'Espacios dedicados a lácteos de alta calidad y productos derivados de la leche.',
      },
      {
        name: 'Nutrición y cuidado de mascotas',
        detail: 'Alimento premium, accesorios y productos de cuidado para animales domésticos.',
      },
      {
        name: 'Mercados de carnes y aves',
        detail: 'Mostradores especializados en carnes frescas y aves de corral de primera calidad.',
      },
    ],
  },
  {
    icon: Tractor,
    title: 'Insumos y Maquinaria Agroindustrial',
    intro:
      'Impulsamos a agricultores y empresas agrícolas con la tecnología, las herramientas y los insumos especializados que exige el campo moderno.',
    items: [
      {
        name: 'Maquinaria y equipo agrícola',
        detail:
          'Tractores, arados, cosechadoras, trilladoras, esparcidoras de estiércol, sembradoras y sistemas automatizados para avicultura y apicultura.',
      },
      {
        name: 'Agroquímicos y fertilizantes',
        detail: 'Fertilizantes especializados, abonos orgánicos e insumos de alto rendimiento para la nutrición y protección de cultivos.',
      },
      {
        name: 'Productos veterinarios',
        detail: 'Farmacéuticos veterinarios y suministros de salud para ganado y animales domésticos.',
      },
    ],
  },
  {
    icon: Handshake,
    title: 'Consultoría Técnica y Asesoría Empresarial',
    intro:
      'Brindamos consultoría técnica y operativa de alto nivel para que empresas privadas y administraciones públicas optimicen su eficiencia, estructura y planificación estratégica.',
    items: [
      {
        name: 'Consultoría agronómica',
        detail: 'Optimización del rendimiento de cultivos, salud del suelo y técnicas agrícolas avanzadas.',
      },
      {
        name: 'Planificación y organización corporativa',
        detail: 'Estructuración empresarial, diagnósticos de eficiencia, control operativo y sistemas de información administrativa.',
      },
      {
        name: 'Consultoría técnica especializada',
        detail: 'Evaluaciones técnicas multidisciplinarias y gestión de proyectos más allá de la ingeniería tradicional.',
      },
    ],
  },
  {
    icon: GraduationCap,
    title: 'Servicios Educativos y Gastronomía',
    intro:
      'Fomentamos el crecimiento de la comunidad y el desarrollo del sector mediante programas de formación a medida y experiencias gastronómicas de primer nivel.',
    items: [
      {
        name: 'Capacitación técnica y talleres',
        detail: 'Programas educativos y talleres de desarrollo de habilidades para el avance profesional y las operaciones de campo.',
      },
      {
        name: 'Servicios de alimentación y hospitalidad',
        detail: 'Experiencias gastronómicas de calidad: restaurantes especializados, cafeterías y picanterías o cevicherías tradicionales.',
      },
    ],
  },
]

export default function Servicios() {
  return (
    <section id="servicios" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-terra-green">
            Servicios
          </p>
          <h2 className="mt-4 font-instrument-serif text-terra-navy text-4xl md:text-5xl lg:text-6xl leading-[1.08]">
            Todo lo que el agro necesita,{' '}
            <span className="italic">en un solo lugar</span>
          </h2>
        </div>

        <ol className="mt-12 md:mt-16 space-y-16 md:space-y-20">
          {SERVICIOS.map(({ icon: Icon, title, intro, items }, index) => (
            <li
              key={title}
              className="grid gap-8 border-t border-terra-navy/10 pt-10 lg:grid-cols-[1fr_1.3fr]"
            >
              <div>
                <div className="flex items-center gap-4">
                  <span className="font-instrument-serif italic text-terra-green text-xl">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-terra-cream">
                    <Icon className="h-5 w-5 text-terra-navy" strokeWidth={1.5} />
                  </span>
                </div>
                <h3 className="mt-5 font-instrument-serif text-terra-navy text-3xl md:text-4xl leading-tight">
                  {title}
                </h3>
                <p className="mt-4 text-terra-navy/70 text-sm font-light leading-relaxed">
                  {intro}
                </p>
              </div>

              <ul className="divide-y divide-terra-navy/10 self-center">
                {items.map((item) => (
                  <li key={item.name} className="group py-4 transition-all duration-300 hover:pl-3">
                    <h4 className="text-sm font-medium text-terra-navy group-hover:text-terra-leaf transition-colors duration-300">
                      {item.name}
                    </h4>
                    <p className="mt-1 text-sm font-light leading-relaxed text-terra-navy/60">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
