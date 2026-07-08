import { useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'

/* Imágenes de muestra — se reemplazan al subir las propias */
const IMAGENES_INICIALES = [
  'https://picsum.photos/seed/terra1/520/360',
  'https://picsum.photos/seed/terra2/520/360',
  'https://picsum.photos/seed/terra3/520/360',
  'https://picsum.photos/seed/terra4/520/360',
  'https://picsum.photos/seed/terra5/520/360',
  'https://picsum.photos/seed/terra6/520/360',
]

export default function Galeria() {
  const [imagenes, setImagenes] = useState(IMAGENES_INICIALES)
  const inputRef = useRef(null)

  const onUpload = (event) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return
    const urls = files.map((file) => URL.createObjectURL(file))
    setImagenes((prev) => [...urls, ...prev])
    event.target.value = ''
  }

  // Duplicamos la lista para que el bucle sea continuo
  const pista = [...imagenes, ...imagenes]

  return (
    <div className="mt-14 md:mt-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between px-6 md:px-12 mx-auto max-w-6xl">
        <div>
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-terra-green">
            Galería
          </p>
          <h3 className="mt-3 font-instrument-serif text-terra-navy text-3xl md:text-4xl">
            Nuestro trabajo <span className="italic">en el campo</span>
          </h3>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onUpload}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full border border-terra-navy/20 px-5 py-2.5 text-sm font-light text-terra-navy transition-colors duration-200 hover:bg-terra-navy hover:text-white"
          >
            <ImagePlus className="h-4 w-4" />
            Subir imágenes
          </button>
        </div>
      </div>

      {/* Carrusel continuo de izquierda a derecha (pausa al pasar el cursor) */}
      <div className="mt-8 overflow-hidden" aria-label="Galería de imágenes en movimiento">
        <div className="marquee-track flex w-max gap-5">
          {pista.map((src, index) => (
            <figure
              key={`${src}-${index}`}
              className="h-48 w-72 md:h-56 md:w-96 shrink-0 overflow-hidden rounded-2xl"
            >
              <img
                src={src}
                alt={`Imagen de galería ${(index % imagenes.length) + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
