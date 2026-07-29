"use client";

import { useEffect, useState, useTransition } from "react";
import { ModuloF, Wordmark, ArrowRight } from "@/components/marks";
import { Eyebrow, Reveal } from "@/components/ui-bits";
import { cn } from "@/lib/utils";
import {
  type FormPostulacion,
  OFICIOS,
  PROVINCIAS,
} from "@/lib/trabajadores/model";
import { anotarseAction } from "./actions";

const VACIO: FormPostulacion = {
  nombre: "",
  nacimiento: "",
  telefono: "",
  provincia: "Santa Fe",
  ciudad: "",
  oficio: "",
  experiencia: "",
  descripcion: "",
  herramientas: false,
  movilidad: false,
  viaja: false,
};

const OTRO = "Otro";

/* ───────────────────────── Piezas de formulario ───────────────────────── */

const inputCls =
  "w-full rounded-[10px] border border-lino bg-white px-[14px] py-[13px] " +
  "font-sans text-[16px] text-texto outline-none transition-colors " +
  "placeholder:text-niebla focus:border-bronce";

function Campo({
  label,
  hint,
  children,
  requerido = false,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  requerido?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-[7px] block font-sans text-[14px] font-semibold text-texto">
        {label}
        {requerido && <span className="text-bronce"> *</span>}
      </span>
      {children}
      {hint && (
        <span className="mt-[6px] block font-sans text-[12.5px] text-muted">
          {hint}
        </span>
      )}
    </label>
  );
}

function Check({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-[11px] rounded-[10px] border px-[14px] py-[12px] transition-colors",
        checked ? "border-bronce bg-bronce/[0.07]" : "border-lino bg-white"
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-[18px] w-[18px] shrink-0 accent-bronce"
      />
      <span className="font-sans text-[15px] text-texto">{children}</span>
    </label>
  );
}

/* ───────────────────────── Pantalla de "listo" ───────────────────────── */

function Gracias({
  nombre,
  actualizado,
  onOtro,
}: {
  nombre: string;
  actualizado: boolean;
  onOtro: () => void;
}) {
  const primerNombre = nombre.split(" ")[0] || "";
  return (
    <section className="px-[22px] py-[60px]">
      <div className="mx-auto max-w-screen-sm">
        <Reveal>
          <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-bronce">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 12.5l5 5L20 6.5"
                stroke="#FAF6EE"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <h1
            className="mt-[22px] font-display text-[36px] font-extrabold leading-[1.05] text-texto"
            style={{ letterSpacing: "-0.04em" }}
          >
            {actualizado ? "Actualizamos tus datos" : "Listo"}
            {primerNombre && `, ${primerNombre}`}.
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-[16px] font-sans text-[17px] leading-[1.55] text-muted">
            Ya quedaste anotado en nuestra base de trabajadores. Cuando surja una
            obra en tu zona, te buscamos ahí y te escribimos por WhatsApp.
          </p>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-[14px] font-sans text-[15px] leading-[1.55] text-muted">
            No hace falta que hagas nada más. Si cambiás de número o de ciudad,
            volvé a completar el formulario con el mismo teléfono y se actualiza
            solo.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-[30px] flex flex-col items-start gap-[16px]">
            <a
              href="https://instagram.com/feconconstrucciones"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-[10px] rounded-full bg-bronce px-[24px] py-[15px] font-sans text-[16px] font-bold text-blanco no-underline shadow-wa transition-transform active:scale-[0.98]"
              style={{ letterSpacing: "-0.01em" }}
            >
              Seguinos en Instagram <ArrowRight size={16} />
            </a>
            <button
              type="button"
              onClick={onOtro}
              className="inline-flex items-center gap-[8px] self-start font-sans text-[15px] font-semibold text-bronce"
            >
              Anotar a otra persona <ArrowRight size={15} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Formulario ───────────────────────── */

export function PostulacionForm() {
  const [f, setF] = useState<FormPostulacion>(VACIO);
  const [oficioSel, setOficioSel] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState<{ nombre: string; actualizado: boolean } | null>(
    null
  );
  const [pending, startTransition] = useTransition();

  // La página se prerenderiza en el build, así que "hoy" se calcula recién en el
  // navegador: si no, el HTML estático traería la fecha del deploy y React se
  // quejaría al hidratar.
  const [hoy, setHoy] = useState("");
  useEffect(() => setHoy(new Date().toISOString().slice(0, 10)), []);

  function set<K extends keyof FormPostulacion>(k: K, v: FormPostulacion[K]) {
    setF((prev) => ({ ...prev, [k]: v }));
    setError(null);
  }

  function elegirOficio(v: string) {
    setOficioSel(v);
    set("oficio", v === OTRO ? "" : v);
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const res = await anotarseAction(f, honeypot);
      if (res.ok) {
        setListo({ nombre: f.nombre, actualizado: res.actualizado });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(res.error);
      }
    });
  }

  function reiniciar() {
    setF(VACIO);
    setOficioSel("");
    setListo(null);
    setError(null);
  }

  return (
    <main className="min-h-screen bg-blanco">
      <header className="bg-grafito px-[22px] py-[18px]">
        <div className="mx-auto flex max-w-screen-sm items-center gap-[10px]">
          <ModuloF size={24} />
          <Wordmark size={20} />
          <span
            className="ml-auto font-mono text-[10.5px] uppercase text-bronce-light"
            style={{ letterSpacing: "0.18em" }}
          >
            Convocatoria
          </span>
        </div>
      </header>

      {listo ? (
        <Gracias
          nombre={listo.nombre}
          actualizado={listo.actualizado}
          onOtro={reiniciar}
        />
      ) : (
        <>
          {/* Encabezado */}
          <section className="bg-grafito px-[22px] pb-[54px] pt-[10px]">
            <div className="mx-auto max-w-screen-sm">
              <Reveal>
                <Eyebrow className="text-bronce-light">
                  Base de trabajadores
                </Eyebrow>
              </Reveal>
              <Reveal delay={60}>
                <h1
                  className="mt-[14px] font-display text-[40px] font-extrabold leading-[1.02] text-blanco"
                  style={{ letterSpacing: "-0.04em" }}
                >
                  Sumate al equipo.
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-[18px] font-sans text-[17px] leading-[1.55] text-blanco/[0.82]">
                  Nos llegan consultas para construir en distintas ciudades y
                  queremos estar preparados. Dejanos tus datos y tu oficio: si
                  sale una obra en tu zona, te tenemos en cuenta.
                </p>
              </Reveal>
              <Reveal delay={190}>
                <div className="mt-[24px] rounded-[12px] border border-bronce/[0.45] bg-bronce/[0.12] px-[16px] py-[14px]">
                  <p className="font-sans text-[14px] leading-[1.5] text-blanco/[0.9]">
                    <strong className="font-bold">Importante:</strong> esto no es
                    una búsqueda abierta ni un trabajo asegurado. Es una base de
                    contactos para tenerte en cuenta a futuro. No cobramos nada
                    por anotarte.
                  </p>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Formulario */}
          <form onSubmit={enviar} className="px-[22px] py-[40px]" noValidate>
            <div className="mx-auto flex max-w-screen-sm flex-col gap-[20px]">
              <Campo label="Nombre y apellido" requerido>
                <input
                  className={inputCls}
                  type="text"
                  autoComplete="name"
                  placeholder="Juan Pérez"
                  value={f.nombre}
                  onChange={(e) => set("nombre", e.target.value)}
                />
              </Campo>

              <Campo label="Fecha de nacimiento" requerido>
                <input
                  className={inputCls}
                  type="date"
                  max={hoy || undefined}
                  value={f.nacimiento}
                  onChange={(e) => set("nacimiento", e.target.value)}
                />
              </Campo>

              <Campo
                label="WhatsApp"
                requerido
                hint="Código de área sin 0 y número sin 15. Ej: 342 5194112"
              >
                <input
                  className={inputCls}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="342 5194112"
                  value={f.telefono}
                  onChange={(e) => set("telefono", e.target.value)}
                />
              </Campo>

              <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2">
                <Campo label="Provincia" requerido>
                  <select
                    className={inputCls}
                    value={f.provincia}
                    onChange={(e) => set("provincia", e.target.value)}
                  >
                    {PROVINCIAS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </Campo>

                <Campo label="Ciudad o localidad" requerido>
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="Santa Fe"
                    value={f.ciudad}
                    onChange={(e) => set("ciudad", e.target.value)}
                  />
                </Campo>
              </div>

              <Campo label="¿Qué oficio hacés?" requerido>
                <select
                  className={inputCls}
                  value={oficioSel}
                  onChange={(e) => elegirOficio(e.target.value)}
                >
                  <option value="">Elegí una opción…</option>
                  {OFICIOS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </Campo>

              {oficioSel === OTRO && (
                <Campo label="¿Cuál?" requerido>
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="Escribí tu oficio"
                    value={f.oficio}
                    onChange={(e) => set("oficio", e.target.value)}
                  />
                </Campo>
              )}

              <Campo label="Años de experiencia en el oficio">
                <input
                  className={inputCls}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={70}
                  placeholder="0"
                  value={f.experiencia}
                  onChange={(e) => set("experiencia", e.target.value)}
                />
              </Campo>

              <Campo
                label="¿Qué sabés hacer?"
                hint="Contanos brevemente en qué obras trabajaste o qué tareas manejás."
              >
                <textarea
                  className={cn(inputCls, "min-h-[110px] resize-y")}
                  maxLength={600}
                  placeholder="Ej: 8 años en techos de tejas, armado de cabreadas y colocación. También hago revoques."
                  value={f.descripcion}
                  onChange={(e) => set("descripcion", e.target.value)}
                />
              </Campo>

              <div className="flex flex-col gap-[10px]">
                <span className="font-sans text-[14px] font-semibold text-texto">
                  Marcá lo que corresponda
                </span>
                <Check
                  checked={f.herramientas}
                  onChange={(v) => set("herramientas", v)}
                >
                  Tengo herramientas propias
                </Check>
                <Check checked={f.movilidad} onChange={(v) => set("movilidad", v)}>
                  Tengo movilidad propia
                </Check>
                <Check checked={f.viaja} onChange={(v) => set("viaja", v)}>
                  Puedo viajar a otras ciudades
                </Check>
              </div>

              {/* Trampa anti-bots: oculta para personas, no la ve nadie. */}
              <div className="absolute left-[-9999px]" aria-hidden="true">
                <label>
                  No completar
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </label>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-[10px] border border-[#B4442F] bg-[#B4442F]/[0.08] px-[14px] py-[12px] font-sans text-[14.5px] text-[#8E3324]"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={pending}
                className={cn(
                  "mt-[6px] inline-flex items-center justify-center gap-[10px] rounded-full px-[26px] py-[17px]",
                  "font-sans text-[17px] font-bold text-blanco shadow-wa transition-transform",
                  "active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100",
                  "bg-bronce"
                )}
                style={{ letterSpacing: "-0.01em" }}
              >
                {pending ? "Guardando…" : "Anotarme"}
                {!pending && <ArrowRight size={17} />}
              </button>

              <p className="font-sans text-[12.5px] leading-[1.5] text-muted">
                Usamos tus datos solo para contactarte por trabajo. No los
                compartimos con terceros. Si querés que los borremos,
                escribinos por WhatsApp.
              </p>
            </div>
          </form>
        </>
      )}

      <footer className="bg-grafito-900 px-[22px] py-[28px]">
        <div className="mx-auto max-w-screen-sm font-mono text-[10.5px] text-blanco/[0.4]"
          style={{ letterSpacing: "0.04em" }}>
          © 2026 FECON · Febre Construcciones
        </div>
      </footer>
    </main>
  );
}
