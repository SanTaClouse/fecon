import { Reveal } from "@/components/ui-bits";
import { cn } from "@/lib/utils";

const data: [string, string][] = [
  ["16", "Años de oficio"],
  ["14", "Casas de cero"],
  ["+200", "Trabajos y techos"],
  ["15", "En el equipo"],
];

export function KPIs() {
  return (
    <section className="bg-blanco px-[16px]">
      <div className="mx-auto grid max-w-screen-sm grid-cols-2 border-t border-lino">
        {data.map(([n, l], i) => (
          <Reveal
            key={i}
            delay={i * 70}
            className={cn(
              "border-b border-lino px-[14px] py-[26px]",
              i % 2 === 0 && "border-r border-lino"
            )}
          >
            <div
              className="font-display text-[46px] font-extrabold leading-[0.9] text-grafito"
              style={{ letterSpacing: "-0.04em" }}
            >
              {n}
            </div>
            <div
              className="mt-[8px] font-mono text-[11.5px] uppercase text-muted"
              style={{ letterSpacing: "0.04em" }}
            >
              {l}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
