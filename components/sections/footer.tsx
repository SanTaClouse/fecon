import { ModuloF, Wordmark } from "@/components/marks";
import { ContactoTrigger } from "@/components/contacto";

export function Footer() {
  return (
    <footer className="bg-grafito-900 px-[22px] py-[40px]">
      <div className="mx-auto max-w-screen-sm">
        <div className="mb-[22px] flex items-center gap-[10px]">
          <ModuloF size={26} />
          <Wordmark size={22} />
        </div>
        <div className="flex flex-col gap-[12px] font-sans text-[15px]">
          <ContactoTrigger className="font-sans text-[15px] text-blanco/[0.82]">
            WhatsApp · Presupuestos y obras
          </ContactoTrigger>
          <a
            href="https://instagram.com/feconconstrucciones"
            target="_blank"
            rel="noopener"
            className="text-blanco/[0.82] no-underline"
          >
            Instagram · @feconconstrucciones
          </a>
          <a
            href="/trabaja-con-nosotros"
            className="font-semibold text-bronce-light no-underline"
          >
            Trabajá con nosotros · Sumate al equipo
          </a>
          <span className="text-blanco/[0.82]">
            Santa Fe capital y alrededores · Argentina
          </span>
          <span className="font-mono text-[13px] text-bronce-light">
            fecon.com.ar
          </span>
        </div>
        <div className="mt-[26px] border-t border-blanco/[0.12] pt-[18px] font-mono text-[10.5px] text-blanco/[0.4]" style={{ letterSpacing: "0.04em" }}>
          © 2026 FECON · Febre Construcciones · Construcciones en general
        </div>
      </div>
    </footer>
  );
}
