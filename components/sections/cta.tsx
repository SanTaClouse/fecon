import { Reveal, Eyebrow, WAButton } from "@/components/ui-bits";
import { WA_DISPLAY } from "@/lib/whatsapp";

export function CTA() {
  return (
    <section className="bg-grafito px-[22px] py-[70px]">
      <div className="mx-auto max-w-screen-sm">
        <Reveal>
          <Eyebrow className="text-bronce-light">Hablemos</Eyebrow>
        </Reveal>
        <Reveal delay={60}>
          <h2
            className="mt-[14px] font-display text-[40px] font-extrabold leading-[1.02] text-blanco"
            style={{ letterSpacing: "-0.04em" }}
          >
            Contanos tu proyecto.
          </h2>
        </Reveal>
        <Reveal delay={130}>
          <p className="mb-[28px] mt-[18px] max-w-[320px] font-sans text-[17px] leading-[1.5] text-blanco/[0.8]">
            Mandanos un WhatsApp y te respondemos nosotros mismos —no un bot— con
            las preguntas justas para darte un número real.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <WAButton big>Escribinos por WhatsApp</WAButton>
        </Reveal>
        <Reveal delay={260}>
          <div className="mt-[20px] font-mono text-[13.5px] text-bronce-light">
            {WA_DISPLAY}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
