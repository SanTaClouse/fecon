"use client";

import { useState } from "react";
import { Reveal, Eyebrow } from "@/components/ui-bits";
import { cn } from "@/lib/utils";

// Testimonios FALSOS por ahora — reemplazar por reales.
const quotes = [
  {
    q: "Pensé que iba a ser un quilombo y fue al revés: Martín me explicó cada etapa y los tiempos se cumplieron.",
    n: "Laura G.",
    l: "Casa nueva · Recreo",
  },
  {
    q: "Nos cambiaron todo el techo de tejas en una semana. Dos inviernos después, cero goteras.",
    n: "Diego F.",
    l: "Recambio de techo · Santo Tomé",
  },
  {
    q: "Presupuesto claro, sin sorpresas a mitad de obra. Volvería a construir con ellos sin dudarlo.",
    n: "Flia. Méndez",
    l: "Ampliación · Santa Fe",
  },
];

export function Testimonios() {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((p) => (p + d + quotes.length) % quotes.length);

  return (
    <section className="bg-blanco px-[22px] py-[64px]">
      <div className="mx-auto max-w-screen-sm">
        <Reveal>
          <Eyebrow>Lo que dicen</Eyebrow>
        </Reveal>
        <Reveal delay={60}>
          <div className="mt-[22px] min-h-[240px]">
            <div className="h-[22px] font-display text-[48px] font-extrabold leading-[0.6] text-lino">
              &ldquo;
            </div>
            <p
              key={i}
              className="reveal mt-[8px] min-h-[150px] font-display text-[24px] font-medium leading-[1.25] text-grafito"
              style={{ letterSpacing: "-0.02em" }}
            >
              {quotes[i].q}
            </p>
            <div className="mt-[18px]">
              <div className="font-sans text-[15px] font-bold text-grafito">
                {quotes[i].n}
              </div>
              <div className="mt-[3px] font-mono text-[11.5px] text-muted">
                {quotes[i].l}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-[26px] flex items-center justify-between">
          <div className="flex gap-[7px]">
            {quotes.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                aria-label={`Testimonio ${k + 1}`}
                className={cn(
                  "h-[7px] rounded-full transition-[width,background-color] duration-300",
                  k === i ? "w-[22px] bg-bronce" : "w-[7px] bg-lino"
                )}
              />
            ))}
          </div>
          <div className="flex gap-[10px]">
            <button
              onClick={() => go(-1)}
              aria-label="Testimonio anterior"
              className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-lino bg-blanco font-sans text-[22px] leading-none text-grafito"
            >
              &lsaquo;
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Testimonio siguiente"
              className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-lino bg-blanco font-sans text-[22px] leading-none text-grafito"
            >
              &rsaquo;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
