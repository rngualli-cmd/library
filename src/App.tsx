import {
  ArrowUpRight,
  CheckCircle2,
  Coffee,
  Globe2,
  Handshake,
  Mail,
  MapPin,
  Menu,
  Phone,
  Send,
  Sprout,
} from 'lucide-react';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import coffeeBeansHero from './assets/coffee-beans-hero.webp';
import coffeePlantsReveal from './assets/coffee-plants-reveal.webp';
import terraMarkWhite from './assets/terra-enlace-mark-white.png';

const BG_IMAGE_1 = coffeeBeansHero;
const BG_IMAGE_2 = coffeePlantsReveal;
const SPOTLIGHT_R = 260;

const missionVisionItems = [
  {
    icon: Sprout,
    label: 'Misión TerraEnlace',
    body: 'TerraEnlace contribuye al desarrollo sostenible y competitivo del sector agropecuario ecuatoriano mediante la articulación estratégica de productores, organizaciones, empresas e instituciones, ofreciendo servicios de consultoría, gestión empresarial, comercialización, producción, capacitación e investigación que faciliten el acceso a mercados, el fortalecimiento de capacidades y la generación de oportunidades.',
  },
  {
    icon: Handshake,
    label: 'Visión TerraEnlace',
    body: 'Ser el aliado estratégico líder del sector agropecuario ecuatoriano, reconocida por integrar conocimiento, innovación, producción y mercados para generar soluciones sostenibles que fortalezcan la competitividad, promuevan la asociatividad y mejoren la calidad de vida de los actores de las cadenas agroproductivas.',
  },
];

const contactItems = [
  {
    icon: MapPin,
    label: 'Oficina principal',
    value: 'Quito, Ecuador',
    detail: 'Atención a productores, aliados comerciales y compradores nacionales.',
  },
  {
    icon: Mail,
    label: 'Correo',
    value: 'alianzas@terraenlace.ec',
    detail: 'Cotizaciones, cooperación técnica y propuestas de comercialización.',
  },
  {
    icon: Phone,
    label: 'Teléfono',
    value: '+593 99 742 1830',
    detail: 'Lunes a viernes, 08:30 - 17:30.',
  },
  {
    icon: Globe2,
    label: 'Cobertura',
    value: 'Ecuador agroproductivo',
    detail: 'Café, cacao, asistencia empresarial y enlace con mercados.',
  },
];

type Point = {
  x: number;
  y: number;
};

type RevealLayerProps = {
  image: string;
  cursorX: number;
  cursorY: number;
};

function RevealLayer({ image, cursorX, cursorY }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const revealRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    return () => {
      window.removeEventListener('resize', sizeCanvas);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reveal = revealRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !reveal || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(
      cursorX,
      cursorY,
      0,
      cursorX,
      cursorY,
      SPOTLIGHT_R,
    );
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)');
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)');
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    const maskUrl = `url(${canvas.toDataURL()})`;
    reveal.style.maskImage = maskUrl;
    reveal.style.webkitMaskImage = maskUrl;
    reveal.style.maskSize = '100% 100%';
    reveal.style.webkitMaskSize = '100% 100%';
    reveal.style.maskRepeat = 'no-repeat';
    reveal.style.webkitMaskRepeat = 'no-repeat';
  }, [cursorX, cursorY]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
      />
      <div
        ref={revealRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
          opacity: cursorX < -900 ? 0 : 1,
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
        }}
      />
    </>
  );
}

export default function App() {
  const mouse = useRef<Point>({ x: -999, y: -999 });
  const smooth = useRef<Point>({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);
  const [cursorPos, setCursorPos] = useState<Point>({ x: -999, y: -999 });
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current = { x: event.clientX, y: event.clientY };
    };

    const animate = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessageSent(true);
  };

  return (
    <div
      className="min-h-screen bg-white tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <img
            src={terraMarkWhite}
            alt=""
            className="h-[26px] w-[26px] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
          />
          <span className="text-white text-2xl font-playfair italic">TerraEnlace</span>
        </div>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
          <button className="bg-white text-gray-900 px-4 py-1.5 rounded-full text-sm font-medium">
            Servicios
          </button>
          {['Productores', 'Café', 'Planes', 'Tour en vivo'].map((item) => (
            <button
              key={item}
              className="text-white/80 hover:bg-white/20 hover:text-white transition-colors px-4 py-1.5 rounded-full text-sm font-medium"
            >
              {item}
            </button>
          ))}
        </div>

        <a
          href="#contacto"
          className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100"
        >
          Contáctanos
        </a>

        <button
          className="md:hidden grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" strokeWidth={2.2} />
        </button>
      </nav>

      <section
        className="relative w-full overflow-hidden h-screen bg-black"
        style={{ height: '100dvh' }}
      >
        <div
          className="absolute inset-0 z-10 bg-center bg-cover bg-no-repeat hero-zoom"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />

        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

        <div className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50">
          <h1 className="text-white leading-[0.95]">
            <span
              className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
              style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
            >
              Café con
            </span>
            <span
              className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
              style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}
            >
              origen vivo
            </span>
          </h1>
        </div>

        <div
          className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.7s' }}
        >
          <p className="text-sm text-white/80 leading-relaxed">
            TerraEnlace contribuye al desarrollo sostenible y competitivo del sector
            agropecuario ecuatoriano, articulando productores, empresas e instituciones.
          </p>
        </div>

        <div
          className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.85s' }}
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Comercializamos café ecuatoriano con gestión empresarial, capacitación e
            investigación para abrir mercados y generar oportunidades.
          </p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30"
          >
            Iniciar alianza
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
          </a>
        </div>
      </section>

      <section
        id="mision-vision"
        className="relative min-h-screen overflow-hidden bg-[#080604] text-white"
      >
        <div
          className="absolute inset-y-0 right-0 hidden w-[42%] bg-cover bg-center opacity-25 lg:block"
          style={{ backgroundImage: `url(${BG_IMAGE_2})` }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-28 lg:py-32">
          <div className="grid w-full gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <div className="max-w-xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#e8702a]">
                Propósito
              </p>
              <h2 className="text-4xl font-semibold leading-[0.96] text-white sm:text-6xl">
                <span className="font-playfair italic font-normal">Misión y</span>
                <span className="block">visión</span>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/[0.68] sm:text-base">
                Conectamos conocimiento técnico, productores y mercados para que el café
                ecuatoriano llegue más lejos sin perder su origen.
              </p>

              <div className="mt-10 flex items-center gap-4 border-y border-white/10 py-5">
                <Coffee className="h-8 w-8 text-[#e8702a]" strokeWidth={1.8} />
                <p className="text-sm leading-relaxed text-white/[0.72]">
                  Una cadena con raíces: consultoría, gestión empresarial, capacitación y
                  comercialización al servicio del campo.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {missionVisionItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.label}
                    className="rounded-lg border border-white/10 bg-[#11100b] p-6 shadow-2xl shadow-black/20 sm:p-8"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e8702a]/15 text-[#f49a54]">
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{item.label}</h3>
                        <p className="mt-4 text-sm leading-7 text-white/[0.72] sm:text-[15px]">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        id="contacto"
        className="relative min-h-screen overflow-hidden bg-[#0b0704] text-white"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.18]"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />
        <div className="absolute inset-0 bg-[#0b0704]/[0.82]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-28 lg:py-32">
          <div className="grid w-full gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#e8702a]">
                Contacto
              </p>
              <h2 className="text-4xl font-semibold leading-[0.96] text-white sm:text-6xl">
                <span className="font-playfair italic font-normal">Hablemos</span>
                <span className="block">de una alianza</span>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
                Cuéntanos sobre tu finca, organización o proyecto comercial. Este formulario
                es una muestra para visualizar cómo podría funcionar el contacto del sitio.
              </p>

              <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
                {contactItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className="flex gap-4 py-5">
                      <div className="mt-1 text-[#f49a54]">
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/[0.45]">
                          {item.label}
                        </p>
                        <p className="mt-1 text-base font-semibold text-white">{item.value}</p>
                        <p className="mt-1 text-sm leading-relaxed text-white/[0.58]">{item.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <form
              onSubmit={handleContactSubmit}
              className="rounded-lg border border-white/10 bg-[#14100b] p-5 shadow-2xl shadow-black/30 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/[0.48]">
                    Nombre
                  </span>
                  <input
                    required
                    name="name"
                    defaultValue="María Calderón"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black/[0.28] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#e8702a]"
                    placeholder="Tu nombre"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/[0.48]">
                    Correo
                  </span>
                  <input
                    required
                    name="email"
                    type="email"
                    defaultValue="compras@ejemplo.ec"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black/[0.28] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#e8702a]"
                    placeholder="correo@empresa.ec"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/[0.48]">
                    Empresa o proyecto
                  </span>
                  <input
                    name="company"
                    defaultValue="Café Andino del Sur"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black/[0.28] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#e8702a]"
                    placeholder="Nombre de la finca, empresa u organización"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/[0.48]">
                    Mensaje
                  </span>
                  <textarea
                    required
                    name="message"
                    rows={6}
                    defaultValue="Hola TerraEnlace, nos interesa conocer opciones para comercializar café arábigo de altura y recibir asesoría para fortalecer nuestra cadena de productores."
                    className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-black/[0.28] px-4 py-3 text-sm leading-6 text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#e8702a]"
                    placeholder="Escribe tu mensaje"
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e8702a] px-7 py-3 text-sm font-medium text-white transition-all hover:scale-[1.03] hover:bg-[#d2611f] hover:shadow-lg hover:shadow-[#e8702a]/25 active:scale-95">
                  Enviar mensaje
                  <Send className="h-4 w-4" strokeWidth={2} />
                </button>

                {messageSent && (
                  <p
                    role="status"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#8fd26a]"
                  >
                    <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                    Mensaje enviado como ejemplo
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
