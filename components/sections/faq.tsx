"use client";

import { Reveal, Eyebrow } from "@/components/ui-bits";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const qs: [string, string][] = [
  [
    "¿El presupuesto es cerrado o por administración?",
    "Te damos un presupuesto detallado y cerrado antes de empezar. Sabés cuánto sale y en cuánto tiempo, sin sorpresas a mitad de obra.",
  ],
  [
    "¿Hacen casas desde cero y también remodelaciones?",
    "Las dos cosas. 14 casas llave en mano y más de 200 remodelaciones y trabajos de techo en 16 años.",
  ],
  [
    "¿Necesito tener los planos o un arquitecto?",
    "No. Contamos con un equipo completo de profesionales para que no pagues comisiones de más.",
  ],
  [
    "¿En qué zona trabajan?",
    "Santa Fe capital y alrededores. Para obras grandes nos movemos a toda la provincia y el país; consultanos.",
  ],
  [
    "¿Cuánto tarda una casa de cero?",
    "Depende del tamaño, pero una vivienda familiar suele estar entre 6 y 10 meses. Te damos un cronograma realista desde el arranque.",
  ],
];

export function FAQ() {
  return (
    <section className="bg-blanco px-[22px] pb-[64px] pt-[20px]">
      <div className="mx-auto max-w-screen-sm">
        <Reveal>
          <Eyebrow>Preguntas frecuentes</Eyebrow>
        </Reveal>
        <Reveal delay={60}>
          <h2
            className="mb-[24px] mt-[12px] font-display text-[33px] font-extrabold leading-[1.05] text-grafito"
            style={{ letterSpacing: "-0.035em" }}
          >
            Lo que todos preguntan.
          </h2>
        </Reveal>
        {/* collapsible: permite cerrar todos. defaultValue abre el primero. */}
        <Accordion type="single" collapsible defaultValue="item-0">
          {qs.map(([q, a], k) => (
            <AccordionItem key={k} value={`item-${k}`}>
              <AccordionTrigger>{q}</AccordionTrigger>
              <AccordionContent>{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
