import { ArrowRight, ChevronDown, Play } from 'lucide-react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204103_f607742e-09da-4cf5-bb06-4e67b0a531de.mp4'

export default function Hero() {
  return (
    <section id="inicio" className="relative w-full h-screen overflow-hidden">
      {/* Video de fondo */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />

      {/* Capa de contenido */}
      <div className="relative z-10 flex flex-col h-full pt-24 md:pt-28">
        <div className="flex-1 flex flex-col items-center justify-start pt-4 sm:pt-6 md:pt-8 lg:pt-10 px-6 text-center">
          <h1 className="font-instrument-serif text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] max-w-5xl">
            DEL CAMPO <span className="italic font-instrument-serif">al</span> MERCADO
            <br />
            <span className="italic font-instrument-serif">para</span> TODO
            <br />
            EL ECUADOR
          </h1>
          <p className="mt-4 md:mt-5 text-white/70 text-sm md:text-base font-light max-w-md leading-relaxed">
            Conectamos a productores, empresas e instituciones del agro ecuatoriano
            <br className="hidden sm:block" />
            con conocimiento, comercio y oportunidades.
          </p>
          <div className="mt-5 md:mt-6 flex flex-col sm:flex-row items-center gap-4">
            <a
              href="#servicios"
              className="group inline-flex items-center gap-2 bg-white text-black rounded-full px-7 py-3 text-sm font-medium transition-colors duration-200 hover:bg-white/90"
            >
              Nuestros Servicios
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#nosotros"
              className="inline-flex items-center gap-2 border border-white/40 text-white rounded-full px-7 py-3 text-sm font-light transition-colors duration-200 hover:bg-white/10 hover:border-white/60"
            >
              <Play className="h-4 w-4" />
              Conócenos
            </a>
          </div>
        </div>

        {/* Indicador de scroll */}
        <a
          href="#nosotros"
          className="mb-8 flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors duration-200"
          aria-label="Bajar a la sección Nosotros"
        >
          <span className="text-[11px] font-light tracking-[0.25em] uppercase">Descubre más</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      </div>
    </section>
  )
}
