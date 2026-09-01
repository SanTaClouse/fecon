import { Reveal, Eyebrow } from "@/components/ui-bits";
import { WAButton } from "@/components/contacto";

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
            Mandanos un WhatsApp con tu proyecto y te respondemos nosotros mismos. Contacto directo con el dueño
          </p>
        </Reveal>
        <Reveal delay={200}>
          <WAButton big>Escribinos por WhatsApp</WAButton>
        </Reveal>
        {/* El número ya no se muestra suelto: a WhatsApp se llega solo pasando
            por el portero, que desvía las postulaciones al formulario. */}
        <Reveal delay={260}>
          <p className="mt-[22px] max-w-[330px] font-sans text-[14.5px] leading-[1.5] text-blanco/[0.62]">
            ¿Buscás trabajo? Este WhatsApp es de ventas —{" "}
            <a
              href="/trabaja-con-nosotros"
              className="font-semibold text-bronce-light underline underline-offset-[3px]"
            >
              anotate en la bolsa de trabajo
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
