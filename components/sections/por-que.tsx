import { Reveal, Eyebrow } from "@/components/ui-bits";
import { IconEquipo, IconTrato, IconTecho } from "@/components/marks";

const items = [
  {
    Icon: IconEquipo,
    t: "Equipo propio",
    d: "15 personas en relación de dependencia. No tercerizamos: la obra la hace nuestra gente, no un subcontratista que aparece y desaparece.",
  },
  {
    Icon: IconTrato,
    t: "Trato directo con el dueño",
    d: "Hablás con Martín, no con un vendedor ni un arquitecto intermediario que infle la cuenta. Las cosas se dicen de frente.",
  },
  {
    Icon: IconTecho,
    t: "Especialistas en techos",
    d: "El nicho que casi nadie cubre bien en Santa Fe. Tejas, cumbreras y filtraciones: lo resolvemos y te explicamos cómo.",
  },
];

export function PorQue() {
  return (
    <section className="bg-lino px-[22px] py-[64px]">
      <div className="mx-auto max-w-screen-sm">
        <Reveal>
          <Eyebrow>Por qué FECON</Eyebrow>
        </Reveal>
        <Reveal delay={60}>
          <h2
            className="mb-[32px] mt-[12px] font-display text-[33px] font-extrabold leading-[1.05] text-grafito"
            style={{ letterSpacing: "-0.035em" }}
          >
            Construir sin vueltas, con quien sabe.
          </h2>
        </Reveal>
        <div className="flex flex-col gap-[30px]">
          {items.map(({ Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 80}>
              <div
                className="pt-[22px]"
                style={{ borderTop: "1px solid rgba(33,30,26,0.14)" }}
              >
                <Icon />
                <h3
                  className="mt-[16px] font-display text-[21px] font-bold text-grafito"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {t}
                </h3>
                <p className="mt-[9px] font-sans text-[15px] leading-[1.5] text-muted">
                  {d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
