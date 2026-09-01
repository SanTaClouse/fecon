import { Reveal, Eyebrow } from "@/components/ui-bits";
import { IconTecho, ArrowRight } from "@/components/marks";
import { ContactoTrigger } from "@/components/contacto";

const cards = [
  {
    n: "01",
    t: "Construcción llave en mano",
    d: "Nos hacemos cargo de todo el proceso de construcción.",
    ctx: "construccion" as const,
  },
  {
    n: "02",
    t: "Remodelaciones integrales",
    d: "Ampliar, renovar o transformar lo que ya tenés, con el mismo equipo de principio a fin.",
    ctx: "remodelacion" as const,
  },
];

export function Servicios() {
  return (
    <section
      id="servicios"
      className="scroll-mt-[90px] bg-blanco px-[22px] pb-[8px] pt-[64px]"
    >
      <div className="mx-auto max-w-screen-sm">
        <Reveal>
          <Eyebrow>Lo que hacemos</Eyebrow>
        </Reveal>
        <Reveal delay={60}>
          <h2
            className="mb-[28px] mt-[12px] font-display text-[33px] font-extrabold leading-[1.05] text-grafito"
            style={{ letterSpacing: "-0.035em" }}
          >
            Tres formas de trabajar con nosotros.
          </h2>
        </Reveal>

        <div className="flex flex-col gap-[14px]">
          {cards.map((c, i) => (
            <Reveal key={c.n} delay={i * 80}>
              <ContactoTrigger
                contexto={c.ctx}
                aria-label={`Consultar por ${c.t}`}
                className="block rounded-2xl bg-lino-2 px-[22px] py-[24px]"
              >
                <div className="mb-[14px] font-mono text-[12px] text-bronce">
                  {c.n}
                </div>
                <h3
                  className="font-display text-[22px] font-bold text-grafito"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {c.t}
                </h3>
                <p className="mt-[10px] font-sans text-[15px] leading-[1.5] text-muted">
                  {c.d}
                </p>
              </ContactoTrigger>
            </Reveal>
          ))}

          {/* Destacado: techos de tejas */}
          <Reveal delay={160}>
            <ContactoTrigger
              contexto="techo"
              aria-label="Consultar por mi techo"
              className="relative block overflow-hidden rounded-2xl bg-grafito px-[22px] py-[26px]"
            >
              <div className="absolute right-[20px] top-[20px]">
                <IconTecho c="#FAF6EE" a="#A2823F" />
              </div>
              <div
                className="mb-[16px] inline-block rounded-full bg-bronce-light px-[10px] py-[5px] font-mono text-[10.5px] uppercase text-grafito"
                style={{ letterSpacing: "0.12em" }}
              >
                Nuestra especialidad
              </div>
              <h3
                className="max-w-[240px] font-display text-[24px] font-extrabold text-blanco"
                style={{ letterSpacing: "-0.03em" }}
              >
                Techos de tejas
              </h3>
              <p className="mb-[18px] mt-[12px] max-w-[280px] font-sans text-[15px] leading-[1.5] text-blanco/[0.78]">
                Reparación, recambio total e impermeabilización.
              </p>
              <span className="inline-flex items-center gap-[7px] font-sans text-[14.5px] font-bold text-bronce-light">
                Consultar por mi techo <ArrowRight />
              </span>
            </ContactoTrigger>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
