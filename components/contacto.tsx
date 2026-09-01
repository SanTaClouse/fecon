"use client";

// Portero de contacto — el único acceso al WhatsApp desde la web pública.
//
// Por qué existe: después del reel de la convocatoria, el WhatsApp de Martín se
// llenó de mensajes de gente buscando trabajo. Ese número es de VENTAS
// (presupuestos y obras); las postulaciones van al formulario de
// /trabaja-con-nosotros, que además arma la base por ciudad.
//
// Cómo funciona: ningún botón de la landing linkea a wa.me directo. Todos abren
// esta ventana, que primero ofrece la salida "busco trabajo" y recién después
// deja seguir a WhatsApp con el mensaje pre-cargado del contexto (techo,
// remodelación, etc.). El número tampoco se muestra más como texto suelto, así
// que no se copia de un vistazo sin pasar por acá.
//
// Es una medida reversible: para volver al link directo alcanza con que
// WAButton y ContactoTrigger vuelvan a renderizar un <a href={wa.me}>.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { WhatsAppGlyph, ArrowRight } from "@/components/marks";
import type { Contexto } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// Redirect del servidor a wa.me (app/ir/wa/route.ts). Se escribe a mano y no
// se importa de lib/whatsapp: ese modulo tiene el numero y no tiene que llegar
// al bundle del navegador.
const RUTA_WA = "/ir/wa";

type ContactoCtx = { abrir: (contexto?: Contexto) => void };

const Ctx = createContext<ContactoCtx | null>(null);

function useAbrir() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("Falta envolver la página con <ContactoProvider>.");
  }
  return ctx.abrir;
}

/** Hook para abrir el portero desde cualquier componente cliente. */
export function useContacto() {
  return { abrir: useAbrir() };
}

export function ContactoProvider({ children }: { children: React.ReactNode }) {
  // null = cerrado. Abierto guarda el contexto del botón que lo abrió, que es
  // lo que elige el mensaje pre-cargado de WhatsApp.
  const [ctx, setCtx] = useState<Contexto | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previo = useRef<HTMLElement | null>(null);

  const abrir = useCallback((contexto: Contexto = "general") => {
    previo.current = document.activeElement as HTMLElement | null;
    setCtx(contexto);
  }, []);

  const cerrar = useCallback(() => {
    setCtx(null);
    previo.current?.focus?.();
  }, []);

  // Escape cierra, y el fondo no scrollea mientras la ventana está abierta.
  useEffect(() => {
    if (!ctx) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [ctx, cerrar]);

  return (
    <Ctx.Provider value={{ abrir }}>
      {children}
      {ctx && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          onClick={cerrar}
        >
          <div className="absolute inset-0 bg-grafito-900/[0.72] backdrop-blur-[3px]" />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contacto-titulo"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="animate-fecon-rise relative w-full max-w-[440px] rounded-t-[20px] bg-blanco px-[24px] pb-[26px] pt-[24px] outline-none sm:rounded-[20px]"
          >
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar"
              className="absolute right-[14px] top-[14px] flex h-[34px] w-[34px] items-center justify-center rounded-full text-muted"
            >
              <Cruz />
            </button>

            <div
              className="font-mono text-[11px] uppercase text-bronce"
              style={{ letterSpacing: "0.2em" }}
            >
              WhatsApp · Ventas
            </div>
            <h2
              id="contacto-titulo"
              className="mt-[10px] font-display text-[24px] font-extrabold leading-[1.1] text-grafito"
              style={{ letterSpacing: "-0.03em" }}
            >
              Antes de escribirnos.
            </h2>
            <p className="mt-[10px] font-sans text-[15px] leading-[1.5] text-muted">
              Este WhatsApp es solo para presupuestos y consultas de obra.
            </p>

            {/* La salida para quien busca trabajo va primero y bien visible:
                es el motivo por el que existe esta ventana. */}
            <div className="mt-[20px] rounded-2xl bg-lino-2 px-[18px] py-[18px]">
              <h3
                className="font-display text-[17px] font-bold text-grafito"
                style={{ letterSpacing: "-0.02em" }}
              >
                ¿Escribís por trabajo?
              </h3>
              <p className="mt-[8px] font-sans text-[14.5px] leading-[1.5] text-muted">
                Las postulaciones no se toman por WhatsApp. Dejá tus datos y tu
                oficio en el formulario: cuando salga una obra en tu zona te
                buscamos ahí y te escribimos nosotros.
              </p>
              <a
                href="/trabaja-con-nosotros"
                className="mt-[14px] inline-flex items-center gap-[8px] rounded-full bg-grafito px-[18px] py-[12px] font-sans text-[15px] font-bold text-blanco no-underline transition-transform active:scale-[0.98]"
                style={{ letterSpacing: "-0.01em" }}
              >
                Quiero trabajar en FECON <ArrowRight />
              </a>
            </div>

            <a
              href={`${RUTA_WA}?c=${ctx}`}
              target="_blank"
              rel="noopener"
              onClick={cerrar}
              className="mt-[18px] inline-flex w-full items-center justify-center gap-[10px] rounded-full bg-bronce px-[22px] py-[15px] font-sans text-[16px] font-bold text-blanco no-underline shadow-wa transition-transform active:scale-[0.98]"
              style={{ letterSpacing: "-0.01em" }}
            >
              <WhatsAppGlyph size={19} />
              Es por un presupuesto
            </a>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

function Cruz() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

/* ───────── Botón WhatsApp (abre el portero, no wa.me) ───────── */
export function WAButton({
  children,
  contexto = "general",
  big = false,
  light = false,
  className,
}: {
  children: React.ReactNode;
  contexto?: Contexto;
  big?: boolean;
  light?: boolean;
  className?: string;
}) {
  const abrir = useAbrir();
  return (
    <button
      type="button"
      onClick={() => abrir(contexto)}
      className={cn(
        "inline-flex items-center gap-[10px] rounded-full font-sans font-bold shadow-wa no-underline transition-transform active:scale-[0.98]",
        light ? "bg-blanco text-grafito" : "bg-bronce text-blanco",
        big ? "px-[26px] py-[17px] text-[17px]" : "px-[20px] py-[13px] text-[15.5px]",
        className
      )}
      style={{ letterSpacing: "-0.01em" }}
    >
      <WhatsAppGlyph size={big ? 20 : 18} />
      {children}
    </button>
  );
}

/* ───────── Envoltorio genérico: convierte cualquier bloque en disparador ─────────
   Lo usan las tarjetas de servicios y el link del footer, que antes eran <a>
   apuntando a wa.me. */
export function ContactoTrigger({
  children,
  contexto = "general",
  className,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  contexto?: Contexto;
  className?: string;
  "aria-label"?: string;
}) {
  const abrir = useAbrir();
  return (
    <button
      type="button"
      onClick={() => abrir(contexto)}
      aria-label={ariaLabel}
      className={cn("w-full cursor-pointer text-left", className)}
    >
      {children}
    </button>
  );
}
