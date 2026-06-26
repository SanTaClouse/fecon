"use client";

import { useMemo, useState } from "react";
import { ModuloF, Wordmark } from "@/components/marks";
import {
  type ItemCatalogo,
  type TipoPresupuesto,
  TIPOS,
} from "@/lib/presupuestos/catalog";
import { EMPRESA } from "@/lib/presupuestos/empresa";
import { montoEnLetras } from "@/lib/presupuestos/montoEnLetras";
import { cn } from "@/lib/utils";

type Seleccion = { on: boolean; cantidad: number; materiales: number; manoObra: number };
type Categoria = { nombre: string; items: ItemCatalogo[] };

const ars = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});
const fmt = (n: number) => ars.format(Math.round(n || 0));
const pct = (n: number, total: number) =>
  total > 0 ? `${((n / total) * 100).toFixed(1)}%` : "—";

const hoyISO = () => new Date().toISOString().slice(0, 10);
const fmtFecha = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

function base(item: ItemCatalogo): Seleccion {
  return {
    on: false,
    cantidad: item.cantidad || 1,
    materiales: item.materiales,
    manoObra: item.manoObra,
  };
}
const totalDe = (s?: Seleccion) =>
  s ? (s.materiales || 0) + (s.manoObra || 0) : 0;

export function PresupuestoBuilder({ catalogo }: { catalogo: ItemCatalogo[] }) {
  const [tipo, setTipo] = useState<TipoPresupuesto>("casa_desde_0");
  const [sel, setSel] = useState<Record<string, Seleccion>>({});
  const [establecimiento, setEstablecimiento] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [obra, setObra] = useState("");
  const [fecha, setFecha] = useState(hoyISO);
  const [plazo, setPlazo] = useState("");
  const [notas, setNotas] = useState("");

  const itemsTipo = useMemo(
    () => catalogo.filter((i) => i.tipo === tipo),
    [catalogo, tipo]
  );

  const categorias = useMemo<Categoria[]>(() => {
    const map = new Map<string, ItemCatalogo[]>();
    for (const i of itemsTipo) {
      const arr = map.get(i.categoria) ?? [];
      arr.push(i);
      map.set(i.categoria, arr);
    }
    return Array.from(map.entries()).map(([nombre, items]) => ({ nombre, items }));
  }, [itemsTipo]);

  const total = useMemo(() => {
    let t = 0;
    for (const i of itemsTipo) {
      const s = sel[i.id];
      if (s?.on) t += totalDe(s);
    }
    return t;
  }, [itemsTipo, sel]);

  const nElegidos = useMemo(
    () => itemsTipo.filter((i) => sel[i.id]?.on).length,
    [itemsTipo, sel]
  );
  const hayItems = nElegidos > 0;

  function update(item: ItemCatalogo, fn: (s: Seleccion) => Seleccion) {
    setSel((prev) => ({ ...prev, [item.id]: fn(prev[item.id] ?? base(item)) }));
  }
  const toggle = (item: ItemCatalogo) => update(item, (s) => ({ ...s, on: !s.on }));
  const setCantidad = (item: ItemCatalogo, v: number) =>
    update(item, (s) => ({ ...s, on: true, cantidad: Math.max(0, v) }));
  const setMateriales = (item: ItemCatalogo, v: number) =>
    update(item, (s) => ({ ...s, on: true, materiales: Math.max(0, v) }));
  const setManoObra = (item: ItemCatalogo, v: number) =>
    update(item, (s) => ({ ...s, on: true, manoObra: Math.max(0, v) }));

  function vaciar() {
    if (hayItems && !confirm("¿Vaciar el presupuesto y empezar de nuevo?")) return;
    setSel({});
  }

  const tipoLabel = TIPOS.find((t) => t.value === tipo)?.label ?? "";

  return (
    <div className="min-h-screen bg-blanco text-texto print:min-h-0">
      {/* Barra superior (no se imprime) */}
      <header className="print:hidden sticky top-0 z-20 border-b border-white/10 bg-grafito-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <ModuloF size={22} />
            <Wordmark size={18} />
            <span className="ml-1.5 hidden font-mono text-[11px] uppercase tracking-[0.18em] text-niebla sm:inline">
              Presupuestos
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/presupuestos/admin"
              className="rounded-full border border-bronce/60 bg-bronce/15 px-3.5 py-1.5 font-sans text-[13px] font-bold text-blanco no-underline hover:bg-bronce/25"
            >
              Editar catálogo
            </a>
            <a
              href="/"
              className="rounded-full border border-blanco/30 px-3.5 py-1.5 font-sans text-[13px] font-bold text-blanco no-underline hover:bg-white/5"
            >
              ← Volver al sitio
            </a>
          </div>
        </div>
      </header>

      {/* Pantalla de trabajo (no se imprime) */}
      <main className="print:hidden mx-auto max-w-5xl px-4 pb-40 pt-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-grafito sm:text-3xl">
          Generador de presupuestos
        </h1>
        <p className="mt-1 max-w-2xl text-[15px] text-muted">
          Elegí el tipo de obra y tildá los ítems. En cada uno cargás la{" "}
          <strong>cantidad</strong> y los costos de <strong>materiales</strong> y{" "}
          <strong>mano de obra</strong> (el total se calcula solo). Después tocá{" "}
          <strong>Imprimir / Guardar PDF</strong> para el presupuesto con formato
          de planilla.
        </p>

        {/* Tipo */}
        <section className="mt-7">
          <SectionTitle n={1}>Tipo de obra</SectionTitle>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {TIPOS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTipo(t.value)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-colors",
                  tipo === t.value
                    ? "border-bronce bg-bronce/10 ring-1 ring-bronce"
                    : "border-lino bg-white hover:border-bronce/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded-full border-2",
                      tipo === t.value ? "border-bronce" : "border-niebla"
                    )}
                  >
                    {tipo === t.value && (
                      <span className="h-2.5 w-2.5 rounded-full bg-bronce" />
                    )}
                  </span>
                  <span className="font-display text-[17px] font-bold text-grafito">
                    {t.label}
                  </span>
                </div>
                <p className="mt-1 pl-7 text-[13.5px] text-muted">{t.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Datos de la obra */}
        <section className="mt-8">
          <SectionTitle n={2}>Datos de la obra</SectionTitle>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Establecimiento / Cliente">
              <input
                value={establecimiento}
                onChange={(e) => setEstablecimiento(e.target.value)}
                placeholder="Ej: Escuela Nº 6415 Narciso Laprida"
                className={inputCls}
              />
            </Field>
            <Field label="Obra (descripción)">
              <input
                value={obra}
                onChange={(e) => setObra(e.target.value)}
                placeholder="Ej: Restauración cubierta de tejas"
                className={inputCls}
              />
            </Field>
            <Field label="Localidad">
              <input
                value={localidad}
                onChange={(e) => setLocalidad(e.target.value)}
                placeholder="San Justo"
                className={inputCls}
              />
            </Field>
            <Field label="Departamento">
              <input
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                placeholder="San Justo"
                className={inputCls}
              />
            </Field>
            <Field label="Fecha de cotización">
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Plazo de obra">
              <input
                value={plazo}
                onChange={(e) => setPlazo(e.target.value)}
                placeholder="Ej: 45 días corridos"
                className={inputCls}
              />
            </Field>
          </div>
        </section>

        {/* Ítems */}
        <section className="mt-8">
          <SectionTitle n={3}>Ítems — {tipoLabel}</SectionTitle>
          <div className="mt-3 space-y-3">
            {categorias.map((cat) => {
              let sub = 0;
              let elegidos = 0;
              for (const i of cat.items) {
                const s = sel[i.id];
                if (s?.on) {
                  sub += totalDe(s);
                  elegidos++;
                }
              }
              return (
                <details
                  key={cat.nombre}
                  open
                  className="overflow-hidden rounded-2xl border border-lino bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 marker:hidden">
                    <span className="font-display text-[15.5px] font-bold text-grafito">
                      {cat.nombre}
                    </span>
                    <span className="flex items-center gap-3 text-[13px]">
                      {elegidos > 0 && (
                        <span className="rounded-full bg-bronce/15 px-2 py-0.5 font-semibold text-bronce">
                          {elegidos} · {fmt(sub)}
                        </span>
                      )}
                      <span className="text-niebla">▾</span>
                    </span>
                  </summary>
                  <div className="border-t border-lino-2">
                    {cat.items.map((item) => (
                      <FilaItem
                        key={item.id}
                        item={item}
                        s={sel[item.id]}
                        onToggle={toggle}
                        onCantidad={setCantidad}
                        onMat={setMateriales}
                        onMano={setManoObra}
                      />
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        {/* Notas */}
        <section className="mt-8">
          <SectionTitle n={4}>Notas (opcional)</SectionTitle>
          <Field label="Aclaraciones que aparecen en el PDF" className="mt-3">
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              placeholder="Ej: Presupuesto válido por 15 días. No incluye honorarios profesionales ni derechos de construcción."
              className={cn(inputCls, "resize-y")}
            />
          </Field>
        </section>
      </main>

      {/* Barra de total fija (no se imprime) */}
      <div className="print:hidden fixed inset-x-0 bottom-0 z-20 border-t border-lino bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
              Total · {nElegidos} ítems
            </div>
            <div className="font-display text-2xl font-extrabold text-grafito">
              {fmt(total)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={vaciar}
              className="rounded-full border border-lino px-4 py-2.5 font-sans text-[14px] font-bold text-muted hover:border-niebla"
            >
              Vaciar
            </button>
            <button
              onClick={() => window.print()}
              disabled={!hayItems}
              className="rounded-full bg-bronce px-5 py-2.5 font-sans text-[14.5px] font-bold text-blanco shadow-wa transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Imprimir / Guardar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Documento para imprimir / PDF */}
      <PrintDoc
        tipoLabel={tipoLabel}
        establecimiento={establecimiento}
        localidad={localidad}
        departamento={departamento}
        obra={obra}
        fecha={fecha}
        plazo={plazo}
        notas={notas}
        categorias={categorias}
        sel={sel}
        total={total}
      />
    </div>
  );
}

// ───────────────────────── Vista de impresión ─────────────────────────

function PrintDoc({
  tipoLabel,
  establecimiento,
  localidad,
  departamento,
  obra,
  fecha,
  plazo,
  notas,
  categorias,
  sel,
  total,
}: {
  tipoLabel: string;
  establecimiento: string;
  localidad: string;
  departamento: string;
  obra: string;
  fecha: string;
  plazo: string;
  notas: string;
  categorias: Categoria[];
  sel: Record<string, Seleccion>;
  total: number;
}) {
  // Rubros con al menos un ítem incluido, numerados.
  const rubros = categorias
    .map((cat) => ({
      nombre: cat.nombre,
      items: cat.items
        .filter((i) => sel[i.id]?.on)
        .map((i) => ({ item: i, s: sel[i.id] as Seleccion })),
    }))
    .filter((r) => r.items.length > 0);

  return (
    <div className="hidden bg-white text-[#1a1a1a] print:block print-doc">
      {/* Encabezado */}
      <div className="flex items-start justify-between border-b-2 border-[#211E1A] pb-3">
        <div className="flex items-center gap-2.5">
          <ModuloF size={30} color="#211E1A" accent="#8A6E3C" />
          <div>
            <div
              className="font-display font-extrabold leading-none"
              style={{ fontSize: 24, letterSpacing: "-0.04em" }}
            >
              FECON
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#736C61]">
              {EMPRESA.nombre}
            </div>
          </div>
        </div>
        <div className="text-right text-[11px] leading-snug text-[#736C61]">
          <div className="font-display text-[15px] font-bold text-[#211E1A]">
            Cómputo y Presupuesto
          </div>
          <div>{tipoLabel}</div>
          <div>{fmtFecha(fecha)}</div>
        </div>
      </div>

      {/* Datos de obra */}
      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-[12px]">
        <DatoPrint label="Establecimiento / Cliente" valor={establecimiento || "—"} />
        <DatoPrint label="Obra" valor={obra || "—"} />
        <DatoPrint label="Localidad" valor={localidad || "—"} />
        <DatoPrint label="Departamento" valor={departamento || "—"} />
      </div>

      {/* Tabla */}
      <table className="mt-4 w-full border-collapse text-[11px]">
        <thead>
          <tr className="border-y border-[#211E1A] bg-[#F3EEE3] text-left text-[9px] uppercase tracking-wide text-[#211E1A]">
            <th className="px-1 py-1.5 font-semibold">Nº</th>
            <th className="px-1 py-1.5 font-semibold">Rubros por tareas</th>
            <th className="px-1 py-1.5 text-center font-semibold">U</th>
            <th className="px-1 py-1.5 text-right font-semibold">Cant.</th>
            <th className="px-1 py-1.5 text-right font-semibold">Materiales</th>
            <th className="px-1 py-1.5 text-right font-semibold">Mano de obra</th>
            <th className="px-1 py-1.5 text-right font-semibold">Costo total</th>
            <th className="px-1 py-1.5 text-right font-semibold">%</th>
          </tr>
        </thead>
        <tbody>
          {rubros.map((rubro, ri) => {
            const sub = rubro.items.reduce((a, { s }) => a + totalDe(s), 0);
            return (
              <RubroPrint
                key={rubro.nombre}
                n={ri + 1}
                nombre={rubro.nombre}
                sub={sub}
                total={total}
                items={rubro.items}
              />
            );
          })}
          <tr className="border-t-2 border-[#211E1A]">
            <td colSpan={6} className="px-1 py-2 font-display text-[13px] font-extrabold">
              TOTAL GENERAL
            </td>
            <td className="px-1 py-2 text-right font-display text-[14px] font-extrabold">
              {fmt(total)}
            </td>
            <td className="px-1 py-2 text-right text-[10px] text-[#736C61]">100%</td>
          </tr>
        </tbody>
      </table>

      {/* Son pesos */}
      <div className="mt-3 text-[12px] font-semibold">
        SON PESOS: {montoEnLetras(total)}.-
      </div>

      {/* Notas */}
      {notas.trim() && (
        <div className="mt-3 border-t border-[#E4DDD0] pt-2 text-[11px] leading-snug text-[#3a3a3a]">
          <div className="font-semibold text-[#211E1A]">Notas</div>
          <p className="whitespace-pre-wrap">{notas}</p>
        </div>
      )}

      {/* Datos del contratista + firma */}
      <div className="mt-5 grid grid-cols-2 gap-6 border-t border-[#E4DDD0] pt-3 text-[10.5px] leading-snug">
        <div className="text-[#3a3a3a]">
          <Linea label="Empresa / Contratista" valor={EMPRESA.nombre} />
          <Linea label="Dirección" valor={EMPRESA.direccion} />
          <Linea label="Ingresos Brutos Nº" valor={EMPRESA.iibb} />
          <Linea label="C.U.I.T. Nº" valor={EMPRESA.cuit} />
          <Linea label="Celular" valor={EMPRESA.celular} />
          <Linea label="E-mail" valor={EMPRESA.email} />
          <Linea label="Plazo de obra" valor={plazo || "—"} />
          <Linea label="Fecha de cotización" valor={fmtFecha(fecha)} />
        </div>
        <div className="flex flex-col items-center justify-end">
          <div className="mt-10 w-full border-t border-[#211E1A]" />
          <div className="mt-1 text-center text-[10px] text-[#736C61]">
            Firma y sello del o los titulares
          </div>
        </div>
      </div>

      {/* Pie */}
      <div className="mt-5 border-t border-[#E4DDD0] pt-2 text-[9.5px] leading-snug text-[#736C61]">
        <p>
          Presupuesto estimativo. Los valores pueden variar según relevamiento en
          obra, condiciones del lugar y fluctuación de precios de materiales.
        </p>
        <p className="mt-1">
          FECON · Febre Construcciones · WhatsApp {EMPRESA.celular} · {EMPRESA.web}
        </p>
      </div>
    </div>
  );
}

function RubroPrint({
  n,
  nombre,
  sub,
  total,
  items,
}: {
  n: number;
  nombre: string;
  sub: number;
  total: number;
  items: { item: ItemCatalogo; s: Seleccion }[];
}) {
  return (
    <>
      <tr className="bg-[#F3EEE3]">
        <td className="px-1 py-1 font-display text-[11px] font-bold">{n}</td>
        <td className="px-1 py-1 font-display text-[11px] font-bold uppercase" colSpan={5}>
          {nombre}
        </td>
        <td className="px-1 py-1 text-right font-mono text-[10px] text-[#736C61]">
          {fmt(sub)}
        </td>
        <td className="px-1 py-1 text-right text-[9px] text-[#736C61]">
          {pct(sub, total)}
        </td>
      </tr>
      {items.map(({ item, s }, idx) => {
        const t = totalDe(s);
        return (
          <tr key={item.id} className="border-b border-[#EDE7DB] align-top">
            <td className="px-1 py-1 text-[#736C61]">
              {n}.{idx + 1}
            </td>
            <td className="px-1 py-1">{item.item}</td>
            <td className="px-1 py-1 text-center text-[#736C61]">{item.unidad}</td>
            <td className="px-1 py-1 text-right">{s.cantidad}</td>
            <td className="px-1 py-1 text-right">{fmt(s.materiales)}</td>
            <td className="px-1 py-1 text-right">{fmt(s.manoObra)}</td>
            <td className="px-1 py-1 text-right font-semibold">{fmt(t)}</td>
            <td className="px-1 py-1 text-right text-[#736C61]">{pct(t, total)}</td>
          </tr>
        );
      })}
    </>
  );
}

function DatoPrint({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <span className="font-mono text-[9px] uppercase tracking-wide text-[#736C61]">
        {label}:{" "}
      </span>
      <span className="font-semibold text-[#211E1A]">{valor}</span>
    </div>
  );
}

function Linea({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <span className="text-[#736C61]">{label}: </span>
      <span className="font-semibold text-[#211E1A]">{valor}</span>
    </div>
  );
}

// ───────────────────────── UI helpers (pantalla) ─────────────────────────

const inputCls =
  "w-full rounded-xl border border-lino bg-white px-3.5 py-2.5 text-[15px] text-texto outline-none placeholder:text-niebla focus:border-bronce";

function FilaItem({
  item,
  s,
  onToggle,
  onCantidad,
  onMat,
  onMano,
}: {
  item: ItemCatalogo;
  s?: Seleccion;
  onToggle: (i: ItemCatalogo) => void;
  onCantidad: (i: ItemCatalogo, v: number) => void;
  onMat: (i: ItemCatalogo, v: number) => void;
  onMano: (i: ItemCatalogo, v: number) => void;
}) {
  const on = !!s?.on;
  const t = on ? totalDe(s) : 0;
  return (
    <div
      className={cn(
        "flex flex-wrap items-end gap-x-3 gap-y-2 border-t border-lino-2 px-4 py-2.5 first:border-t-0",
        on && "bg-bronce/[0.04]"
      )}
    >
      <div className="flex flex-1 items-center gap-3 self-center" style={{ minWidth: 180 }}>
        <input
          type="checkbox"
          checked={on}
          onChange={() => onToggle(item)}
          className="shrink-0 accent-bronce"
          style={{ width: 18, height: 18 }}
          aria-label={`Incluir ${item.item}`}
        />
        <button
          onClick={() => onToggle(item)}
          className="flex-1 text-left text-[14.5px] text-texto"
        >
          {item.item}
          <span className="ml-2 rounded bg-lino px-1.5 py-0.5 font-mono text-[10.5px] uppercase text-muted">
            {item.unidad}
          </span>
        </button>
      </div>
      <MiniNum label="Cant." value={on ? s!.cantidad : undefined} onChange={(v) => onCantidad(item, v)} money={false} />
      <MiniNum label="Materiales" value={on ? s!.materiales : undefined} onChange={(v) => onMat(item, v)} />
      <MiniNum label="Mano de obra" value={on ? s!.manoObra : undefined} onChange={(v) => onMano(item, v)} />
      <div className="w-28 shrink-0 text-right">
        <div className="font-mono text-[9.5px] uppercase tracking-wide text-niebla">
          Total
        </div>
        <div className="font-mono text-[14px] font-semibold text-grafito">
          {on ? fmt(t) : "—"}
        </div>
      </div>
    </div>
  );
}

function MiniNum({
  label,
  value,
  onChange,
  money = true,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number) => void;
  money?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-0.5 block text-center font-mono text-[9.5px] uppercase tracking-wide text-niebla">
        {label}
      </span>
      <div className="flex items-center rounded-lg border border-lino bg-white pl-1.5 focus-within:border-bronce">
        {money && <span className="text-[12px] text-niebla">$</span>}
        <input
          type="number"
          min={0}
          step="any"
          value={value ?? ""}
          placeholder="0"
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={cn(
            "bg-transparent px-1 py-1.5 text-right text-[13.5px] outline-none",
            money ? "w-24" : "w-16"
          )}
          aria-label={label}
        />
      </div>
    </label>
  );
}

function SectionTitle({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-grafito font-mono text-[12px] font-bold text-blanco">
        {n}
      </span>
      <h2 className="font-display text-[18px] font-bold text-grafito">{children}</h2>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block font-sans text-[13px] font-semibold text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
