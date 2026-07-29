"use client";

import { useMemo, useState, useTransition } from "react";
import { ModuloF, WhatsAppGlyph, Wordmark } from "@/components/marks";
import { cn } from "@/lib/utils";
import {
  type EstadoPostulacion,
  type Postulacion,
  ESTADOS,
  claveCiudad,
  telefonoLegible,
  waTrabajador,
} from "@/lib/trabajadores/model";
import {
  cambiarEstadoAction,
  eliminarAction,
  guardarNotasAction,
} from "./actions";

const TODOS = "__todos__";

// Zona horaria fija: el servidor corre en UTC y el navegador en Argentina, y
// sin fijarla la misma fecha se renderiza distinta en cada lado (hydration).
const fechaCorta = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  timeZone: "America/Argentina/Buenos_Aires",
});

/**
 * De un grupo de gente de la misma ciudad, elige cómo mostrar el nombre: la
 * grafía más repetida y, a igualdad, la que tiene acentos ("Paraná" > "Parana").
 */
function nombreCiudad(gente: Postulacion[]): string {
  const cuenta = new Map<string, number>();
  for (const p of gente) cuenta.set(p.ciudad, (cuenta.get(p.ciudad) ?? 0) + 1);
  const conAcento = (s: string) => (s.normalize("NFD").length > s.length ? 1 : 0);
  return Array.from(cuenta.entries()).sort(
    (a, b) => b[1] - a[1] || conAcento(b[0]) - conAcento(a[0])
  )[0][0];
}

const mensajeWA = (nombre: string) =>
  `Hola ${nombre.split(" ")[0] || ""}, te escribo de FECON (Febre Construcciones). ` +
  `Te habías anotado en nuestra base de trabajadores y quería consultarte por un trabajo.`;

/* ───────────────────────── Piezas chicas ───────────────────────── */

const selectCls =
  "rounded-[9px] border border-lino bg-white px-[11px] py-[9px] font-sans " +
  "text-[14px] text-texto outline-none focus:border-bronce";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-lino-2 px-[9px] py-[3px] font-mono text-[10.5px] uppercase text-muted"
      style={{ letterSpacing: "0.08em" }}>
      {children}
    </span>
  );
}

const ESTADO_CLS: Record<EstadoPostulacion, string> = {
  nuevo: "border-bronce bg-bronce/[0.1] text-bronce",
  contactado: "border-[#3E6B4A] bg-[#3E6B4A]/[0.1] text-[#3E6B4A]",
  descartado: "border-niebla bg-niebla/[0.12] text-muted",
};

/* ───────────────────────── Ficha de trabajador ───────────────────────── */

function Ficha({
  p,
  onCambio,
}: {
  p: Postulacion;
  onCambio: (id: string, patch: Partial<Postulacion>) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const [notas, setNotas] = useState(p.notas);
  const [notasGuardadas, setNotasGuardadas] = useState(true);
  const [pending, startTransition] = useTransition();

  function setEstado(estado: EstadoPostulacion) {
    onCambio(p.id, { estado });
    startTransition(async () => {
      const res = await cambiarEstadoAction(p.id, estado);
      if (!res.ok) alert(`No se pudo guardar: ${res.error}`);
    });
  }

  function guardarNotas() {
    startTransition(async () => {
      const res = await guardarNotasAction(p.id, notas);
      if (res.ok) {
        setNotasGuardadas(true);
        onCambio(p.id, { notas });
      } else {
        alert(`No se pudo guardar: ${res.error}`);
      }
    });
  }

  function borrar() {
    if (!confirm(`¿Borrar a ${p.nombre} de la base? No se puede deshacer.`)) return;
    startTransition(async () => {
      const res = await eliminarAction(p.id);
      if (res.ok) onCambio(p.id, { id: "" });
      else alert(`No se pudo borrar: ${res.error}`);
    });
  }

  return (
    <article
      className={cn(
        "rounded-[12px] border border-lino bg-white p-[15px] transition-opacity",
        p.estado === "descartado" && "opacity-60",
        pending && "opacity-70"
      )}
    >
      <div className="flex items-start gap-[12px]">
        <div className="min-w-0 flex-1">
          <h4 className="font-display text-[19px] font-bold leading-[1.15] text-texto"
            style={{ letterSpacing: "-0.02em" }}>
            {p.nombre}
          </h4>
          <div className="mt-[4px] font-sans text-[14.5px] text-bronce">
            {p.oficio}
            {p.experiencia > 0 && (
              <span className="text-muted">
                {" · "}
                {p.experiencia} {p.experiencia === 1 ? "año" : "años"}
              </span>
            )}
          </div>
          <div className="mt-[3px] font-sans text-[13.5px] text-muted">
            {p.edad !== null ? `${p.edad} años` : "Edad sin dato"}
            {" · "}
            {telefonoLegible(p.telefonoNorm)}
          </div>
        </div>

        <a
          href={waTrabajador(p.telefonoNorm, mensajeWA(p.nombre))}
          target="_blank"
          rel="noopener"
          aria-label={`Escribir a ${p.nombre} por WhatsApp`}
          className="inline-flex shrink-0 items-center gap-[7px] rounded-full bg-bronce px-[14px] py-[9px] font-sans text-[13.5px] font-bold text-blanco no-underline active:scale-[0.98]"
        >
          <WhatsAppGlyph size={15} />
          Escribir
        </a>
      </div>

      {(p.herramientas || p.movilidad || p.viaja) && (
        <div className="mt-[11px] flex flex-wrap gap-[6px]">
          {p.herramientas && <Badge>Herramientas</Badge>}
          {p.movilidad && <Badge>Movilidad</Badge>}
          {p.viaja && <Badge>Viaja</Badge>}
        </div>
      )}

      {p.descripcion && (
        <p className="mt-[11px] font-sans text-[14.5px] leading-[1.5] text-texto/[0.85]">
          {p.descripcion}
        </p>
      )}

      <div className="mt-[13px] flex flex-wrap items-center gap-[8px]">
        {ESTADOS.map((e) => (
          <button
            key={e.value}
            type="button"
            onClick={() => setEstado(e.value)}
            className={cn(
              "rounded-full border px-[12px] py-[6px] font-sans text-[12.5px] font-semibold transition-colors",
              p.estado === e.value
                ? ESTADO_CLS[e.value]
                : "border-lino bg-white text-muted"
            )}
          >
            {e.label}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          className="ml-auto font-sans text-[12.5px] font-semibold text-muted underline underline-offset-2"
        >
          {abierto ? "Cerrar" : p.notas ? "Ver nota" : "Nota"}
        </button>
      </div>

      {abierto && (
        <div className="mt-[12px] border-t border-lino pt-[12px]">
          <textarea
            className="min-h-[74px] w-full resize-y rounded-[9px] border border-lino bg-lino-2/[0.4] px-[12px] py-[10px] font-sans text-[14.5px] text-texto outline-none focus:border-bronce"
            placeholder="Nota privada: cómo laburó, con quién trabajó, disponibilidad…"
            maxLength={800}
            value={notas}
            onChange={(e) => {
              setNotas(e.target.value);
              setNotasGuardadas(false);
            }}
          />
          <div className="mt-[9px] flex items-center gap-[10px]">
            <button
              type="button"
              onClick={guardarNotas}
              disabled={notasGuardadas || pending}
              className="rounded-full bg-grafito px-[15px] py-[8px] font-sans text-[13px] font-bold text-blanco disabled:opacity-40"
            >
              {notasGuardadas ? "Guardado ✓" : "Guardar nota"}
            </button>
            <span className="font-mono text-[11px] text-niebla">
              Se anotó el {fechaCorta.format(new Date(p.creadoEn))}
            </span>
            <button
              type="button"
              onClick={borrar}
              className="ml-auto font-sans text-[12.5px] font-semibold text-[#8E3324] underline underline-offset-2"
            >
              Borrar
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

/* ───────────────────────── Panel ───────────────────────── */

export function TrabajadoresClient({
  inicial,
  conBase,
}: {
  inicial: Postulacion[];
  conBase: boolean;
}) {
  const [lista, setLista] = useState(inicial);
  const [q, setQ] = useState("");
  const [oficio, setOficio] = useState(TODOS);
  const [estado, setEstado] = useState(TODOS);
  const [soloViajan, setSoloViajan] = useState(false);

  function onCambio(id: string, patch: Partial<Postulacion>) {
    // patch.id === "" es la señal de "esta fila se borró".
    if (patch.id === "") {
      setLista((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    setLista((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  const oficios = useMemo(
    () => Array.from(new Set(lista.map((p) => p.oficio))).sort((a, b) => a.localeCompare(b, "es")),
    [lista]
  );

  const filtrados = useMemo(() => {
    const texto = q.trim().toLocaleLowerCase("es-AR");
    return lista.filter((p) => {
      if (oficio !== TODOS && p.oficio !== oficio) return false;
      if (estado !== TODOS && p.estado !== estado) return false;
      if (soloViajan && !p.viaja) return false;
      if (!texto) return true;
      return [p.nombre, p.oficio, p.ciudad, p.provincia, p.descripcion, p.notas]
        .join(" ")
        .toLocaleLowerCase("es-AR")
        .includes(texto);
    });
  }, [lista, q, oficio, estado, soloViajan]);

  // Agrupado provincia → ciudad, ciudades ordenadas por cantidad. Se agrupa por
  // clave sin acentos ("Parana" y "Paraná" son la misma ciudad) y se muestra la
  // grafía más usada, prefiriendo la que tiene acentos.
  const zonas = useMemo(() => {
    const porProv = new Map<string, Map<string, Postulacion[]>>();
    for (const p of filtrados) {
      if (!porProv.has(p.provincia)) porProv.set(p.provincia, new Map());
      const ciudades = porProv.get(p.provincia)!;
      const clave = claveCiudad(p.ciudad);
      if (!ciudades.has(clave)) ciudades.set(clave, []);
      ciudades.get(clave)!.push(p);
    }
    return Array.from(porProv.entries())
      .map(([provincia, ciudades]) => ({
        provincia,
        total: Array.from(ciudades.values()).reduce((n, c) => n + c.length, 0),
        ciudades: Array.from(ciudades.entries())
          .map(([clave, gente]) => ({ clave, ciudad: nombreCiudad(gente), gente }))
          .sort(
            (a, b) =>
              b.gente.length - a.gente.length || a.ciudad.localeCompare(b.ciudad, "es")
          ),
      }))
      .sort((a, b) => b.total - a.total || a.provincia.localeCompare(b.provincia, "es"));
  }, [filtrados]);

  function exportarCSV() {
    const cab = [
      "Nombre", "Edad", "Nacimiento", "WhatsApp", "Provincia", "Ciudad",
      "Oficio", "Experiencia", "Herramientas", "Movilidad", "Viaja",
      "Estado", "Descripcion", "Notas", "Anotado",
    ];
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const filas = filtrados.map((p) =>
      [
        p.nombre, p.edad ?? "", p.nacimiento ?? "", telefonoLegible(p.telefonoNorm),
        p.provincia, p.ciudad, p.oficio, p.experiencia,
        p.herramientas ? "sí" : "no", p.movilidad ? "sí" : "no", p.viaja ? "sí" : "no",
        p.estado, p.descripcion, p.notas,
        fechaCorta.format(new Date(p.creadoEn)),
      ].map(esc).join(",")
    );
    // BOM para que Excel abra los acentos bien.
    const csv = "﻿" + [cab.map(esc).join(","), ...filas].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `fecon-trabajadores-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-blanco text-texto">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-grafito-900 px-[18px] py-[13px]">
        <div className="mx-auto flex max-w-4xl items-center gap-[10px]">
          <ModuloF size={22} />
          <Wordmark size={18} />
          <span className="font-sans text-[14px] text-blanco/[0.6]">Trabajadores</span>
          <span className="ml-auto font-mono text-[12px] text-bronce-light">
            {filtrados.length}
            {filtrados.length !== lista.length && ` / ${lista.length}`}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-[18px] py-[22px]">
        {!conBase && (
          <div className="mb-[18px] rounded-[10px] border border-bronce bg-bronce/[0.08] px-[14px] py-[12px] font-sans text-[14px]">
            No hay base de datos configurada (falta <code>DATABASE_URL</code>).
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-[9px]">
          <input
            type="search"
            placeholder="Buscar por nombre, oficio, ciudad…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="min-w-[190px] flex-1 rounded-[9px] border border-lino bg-white px-[13px] py-[10px] font-sans text-[15px] outline-none placeholder:text-niebla focus:border-bronce"
          />
          <select className={selectCls} value={oficio} onChange={(e) => setOficio(e.target.value)}>
            <option value={TODOS}>Todos los oficios</option>
            {oficios.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <select className={selectCls} value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value={TODOS}>Todos los estados</option>
            {ESTADOS.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setSoloViajan((v) => !v)}
            className={cn(
              "rounded-[9px] border px-[13px] py-[10px] font-sans text-[14px] font-semibold transition-colors",
              soloViajan ? "border-bronce bg-bronce/[0.1] text-bronce" : "border-lino bg-white text-muted"
            )}
          >
            Viajan
          </button>
          <button
            type="button"
            onClick={exportarCSV}
            disabled={filtrados.length === 0}
            className="rounded-[9px] border border-lino bg-white px-[13px] py-[10px] font-sans text-[14px] font-semibold text-muted disabled:opacity-40"
          >
            CSV
          </button>
        </div>

        {/* Listado por zona */}
        {lista.length === 0 ? (
          <p className="mt-[40px] font-sans text-[16px] leading-[1.55] text-muted">
            Todavía no se anotó nadie. Compartí el link{" "}
            <a href="/trabaja-con-nosotros" className="font-semibold text-bronce">
              /trabaja-con-nosotros
            </a>{" "}
            en el video y las historias, y acá te van a ir apareciendo ordenados por ciudad.
          </p>
        ) : filtrados.length === 0 ? (
          <p className="mt-[40px] font-sans text-[16px] text-muted">
            Ningún trabajador coincide con el filtro.
          </p>
        ) : (
          <div className="mt-[26px] flex flex-col gap-[34px]">
            {zonas.map((z) => (
              <section key={z.provincia}>
                <div className="mb-[14px] flex items-baseline gap-[10px] border-b border-lino pb-[8px]">
                  <h2 className="font-display text-[24px] font-extrabold text-texto"
                    style={{ letterSpacing: "-0.03em" }}>
                    {z.provincia}
                  </h2>
                  <span className="font-mono text-[12px] text-niebla">
                    {z.total} {z.total === 1 ? "persona" : "personas"}
                  </span>
                </div>

                <div className="flex flex-col gap-[22px]">
                  {z.ciudades.map((c) => (
                    <div key={c.clave}>
                      <h3
                        className="mb-[10px] font-mono text-[11.5px] uppercase text-bronce"
                        style={{ letterSpacing: "0.16em" }}
                      >
                        {c.ciudad} · {c.gente.length}
                      </h3>
                      <div className="flex flex-col gap-[10px]">
                        {c.gente.map((p) => (
                          <Ficha key={p.id} p={p} onCambio={onCambio} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
