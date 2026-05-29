import { Reveal, Eyebrow, WAButton } from "@/components/ui-bits";

// Foto de Martín en obra: placeholder rayado por ahora (next/image cuando
// haya material real). Overlay gradiente para legibilidad del texto.
export function Hero() {
  return (
    <section className="relative bg-grafito">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#2A2620]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 13px, rgba(255,255,255,0.05) 13px 26px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(25,23,19,0.55) 0%, rgba(25,23,19,0.35) 35%, rgba(25,23,19,0.92) 100%)",
          }}
        />
        <div
          className="absolute left-[20px] top-[130px] font-mono text-[10.5px] uppercase text-blanco/[0.45]"
          style={{ letterSpacing: "0.1em" }}
        >
          [ Foto · Martín en obra ]
        </div>
      </div>

      <div className="relative mx-auto flex min-h-[600px] max-w-screen-sm flex-col justify-end px-[22px] pb-[56px] pt-[180px]">
        <Reveal>
          <Eyebrow className="text-bronce-light">
            Construcción · Santa Fe · 16 años
          </Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h1
            className="mt-[16px] text-balance font-display text-[34px] font-extrabold leading-[1.08] text-blanco"
            style={{ letterSpacing: "-0.035em" }}
          >
            Casas de cero, remodelaciones y especialistas en techos de tejas.
          </h1>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-[20px] max-w-[340px] font-sans text-[17px] leading-[1.5] text-blanco/[0.82]">
            Equipo propio, trato directo con el dueño y 16 años de oficio. De
            cero a llaves, o el techo que tu casa necesita.
          </p>
        </Reveal>
        <Reveal
          delay={220}
          className="mt-[30px] flex flex-wrap items-center gap-[18px]"
        >
          <WAButton big>Pedir presupuesto</WAButton>
          <a
            href="#servicios"
            className="border-b-[1.5px] border-bronce pb-[2px] font-sans text-[15px] font-semibold text-blanco no-underline"
          >
            Ver servicios
          </a>
        </Reveal>
      </div>
    </section>
  );
}
