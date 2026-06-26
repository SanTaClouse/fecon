"use client";

import { useMemo, useState } from "react";
import { ModuloF, Wordmark } from "@/components/marks";
import { WA_DISPLAY } from "@/lib/whatsapp";
import {
  type ItemCatalogo,
  type TipoPresupuesto,
  TIPOS,
} from "@/lib/presupuestos/catalog";
import { cn } from "@/lib/utils";

type Seleccion = {
  on: boolean;
  qty: number; // medición
  materiales: number; // tarea
  manoObra: number; // tarea
};

type Calc = {
  subtotal: number;
  porCat: Map<string, number>;
  elegidos: { item: ItemCatalogo; monto: number }[];
  margenMonto: number;
  neto: number;
  ivaMonto: number;
  total: number;
};

type Categoria = { nombre: string; items: ItemCatalogo[] };

/** Selección inicial de un ítem (toma los valores por defecto del catálogo). */
function base(item: ItemCatalogo): Seleccion {
  return { on: false, qty: 1, materiales: item.materiales, manoObra: item.manoObra };
}

/** Monto del ítem según su modo: medición = cant × unit · tarea = mat + mano. */
function montoDe(item: ItemCatalogo, s?: Seleccion): number {
  if (!s) return 0;
  if (item.modo === "tarea") return (s.materiales || 0) + (s.manoObra || 0);
  return (s.qty || 0) * item.precioUnitario;
}

const ars = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});
const fmt = (n: number) => ars.format(Math.round(n));

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

export function PresupuestoBuilder({ catalogo }: { catalogo: ItemCatalogo[] }) {
  const [tipo, setTipo] = useState<TipoPresupuesto>("casa_desde_0");
  const [sel, setSel] = useState<Record<string, Seleccion>>({});
  const [obra, setObra] = useState("");
  const [cliente, setCliente] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [fecha, setFecha] = useState(hoyISO);
  const [notas, setNotas] = useState("");
  const [margen, setMargen] = useState(0);
  const [iva, setIva] = useState(21);

  const itemsTipo = useMemo(
    () => catalogo.filter((i) => i.tipo === tipo),
    [catalogo, tipo]
  );

  // Categorías en el orden en que aparecen en el catálogo.
  const categorias = useMemo(() => {
    const map = new Map<string, ItemCatalogo[]>();
    for (const i of itemsTipo) {
      const arr = map.get(i.categoria) ?? [];
      arr.push(i);
      map.set(i.categoria, arr);
    }
    return Array.from(map.entries()).map(
      ([nombre, items]): Categoria => ({ nombre, items })
    );
  }, [itemsTipo]);

  const calc = useMemo(() => {
    let subtotal = 0;
    const porCat = new Map<string, number>();
    const elegidos: { item: ItemCatalogo; monto: number }[] = [];
    for (const item of itemsTipo) {
      const s = sel[item.id];
      const monto = s?.on ? montoDe(item, s) : 0;
      if (monto > 0) {
        subtotal += monto;
        porCat.set(item.categoria, (porCat.get(item.categoria) ?? 0) + monto);
        elegidos.push({ item, monto });
      }
    }
    const margenMonto = subtotal * (margen / 100);
    const neto = subtotal + margenMonto;
    const ivaMonto = neto * (iva / 100);
    return {
      subtotal,
      porCat,
      elegidos,
      margenMonto,
      neto,
      ivaMonto,
      total: neto + ivaMonto,
    };
  }, [itemsTipo, sel, margen, iva]);

  const hayItems = calc.elegidos.length > 0;

  function update(item: ItemCatalogo, fn: (s: Seleccion) => Seleccion) {
    setSel((prev) => ({ ...prev, [item.id]: fn(prev[item.id] ?? base(item)) }));
  }
  const toggle = (item: ItemCatalogo) => update(item, (s) => ({ ...s, on: !s.on }));
  const setQty = (item: ItemCatalogo, qty: number) =>
    update(item, (s) => ({ ...s, on: true, qty: Math.max(0, qty) }));
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
      {/* ─────────── Barra superior (no se imprime) ─────────── */}
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

      {/* ─────────── Pantalla de trabajo (no se imprime) ─────────── */}
      <main className="print:hidden mx-auto max-w-5xl px-4 pb-40 pt-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-grafito sm:text-3xl">
          Generador de presupuestos
        </h1>
        <p className="mt-1 max-w-2xl text-[15px] text-muted">
          Elegí el tipo de obra y tildá los ítems. En los que se miden cargás la{" "}
          <strong>cantidad</strong>; en las instalaciones <strong>por tarea</strong>{" "}
          cargás <strong>materiales</strong> y <strong>mano de obra</strong>. El
          total se calcula solo. Después tocá{" "}
          <strong>Imprimir / Guardar PDF</strong> para generar el presupuesto con
          la marca FECON.
        </p>

        {/* Tipo de obra */}
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
                      tipo === t.value
                        ? "border-bronce"
                        : "border-niebla"
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

        {/* Datos */}
        <section className="mt-8">
          <SectionTitle n={2}>Datos del presupuesto</SectionTitle>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Nombre de la obra / proyecto">
              <input
                value={obra}
                onChange={(e) => setObra(e.target.value)}
                placeholder="Ej: Vivienda B° Candioti"
                className={inputCls}
              />
            </Field>
            <Field label="Cliente">
              <input
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Nombre del cliente"
                className={inputCls}
              />
            </Field>
            <Field label="Localidad">
              <input
                value={localidad}
                onChange={(e) => setLocalidad(e.target.value)}
                placeholder="Santa Fe"
                className={inputCls}
              />
            </Field>
            <Field label="Fecha">
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
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
              const sub = calc.porCat.get(cat.nombre) ?? 0;
              const elegidos = cat.items.filter((i) => {
                const s = sel[i.id];
                return s?.on && montoDe(i, s) > 0;
              }).length;
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
                        onQty={setQty}
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

        {/* Ajustes */}
        <section className="mt-8">
          <SectionTitle n={4}>Ajustes (opcional)</SectionTitle>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Margen / imprevistos (%)">
              <input
                type="number"
                min={0}
                step="any"
                value={margen || ""}
                placeholder="0"
                onChange={(e) => setMargen(parseFloat(e.target.value) || 0)}
                className={inputCls}
              />
            </Field>
            <Field label="IVA (%)">
              <input
                type="number"
                min={0}
                step="any"
                value={iva || ""}
                placeholder="0"
                onChange={(e) => setIva(parseFloat(e.target.value) || 0)}
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="Notas / aclaraciones (aparecen en el PDF)" className="mt-3">
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              placeholder="Ej: No incluye honorarios profesionales ni derechos de construcción. Validez 15 días."
              className={cn(inputCls, "resize-y")}
            />
          </Field>
        </section>
      </main>

      {/* ─────────── Barra de total fija (no se imprime) ─────────── */}
      <div className="print:hidden fixed inset-x-0 bottom-0 z-20 border-t border-lino bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
              Total estimado · {calc.elegidos.length} ítems
            </div>
            <div className="font-display text-2xl font-extrabold text-grafito">
              {fmt(calc.total)}
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

      {/* ─────────── Documento para imprimir / PDF ─────────── */}
      <PrintDoc
        tipoLabel={tipoLabel}
        obra={obra}
        cliente={cliente}
        localidad={localidad}
        fecha={fecha}
        notas={notas}
        categorias={categorias}
        calc={calc}
        sel={sel}
        margen={margen}
        iva={iva}
      />
    </div>
  );
}

// ───────────────────────── Vista de impresión ─────────────────────────

function PrintDoc({
  tipoLabel,
  obra,
  cliente,
  localidad,
  fecha,
  notas,
  categorias,
  calc,
  sel,
  margen,
  iva,
}: {
  tipoLabel: string;
  obra: string;
  cliente: string;
  localidad: string;
  fecha: string;
  notas: string;
  categorias: Categoria[];
  calc: Calc;
  sel: Record<string, Seleccion>;
  margen: number;
  iva: number;
}) {
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
              Febre Construcciones · Santa Fe
            </div>
          </div>
        </div>
        <div className="text-right text-[11px] leading-snug text-[#736C61]">
          <div className="font-display text-[15px] font-bold text-[#211E1A]">
            Presupuesto de obra
          </div>
          <div>{tipoLabel}</div>
          <div>{fmtFecha(fecha)}</div>
        </div>
      </div>

      {/* Datos */}
      <div className="mt-3 grid grid-cols-3 gap-3 text-[12px]">
        <DatoPrint label="Obra / proyecto" valor={obra || "—"} />
        <DatoPrint label="Cliente" valor={cliente || "—"} />
        <DatoPrint label="Localidad" valor={localidad || "—"} />
      </div>

      {/* Tabla por categoría */}
      <table className="mt-4 w-full border-collapse text-[12px]">
        <thead>
          <tr className="border-b border-[#211E1A] text-left text-[10px] uppercase tracking-wide text-[#736C61]">
            <th className="py-1.5 pr-2 font-semibold">Ítem</th>
            <th className="py-1.5 px-2 text-center font-semibold">Un.</th>
            <th className="py-1.5 px-2 text-right font-semibold">Cant.</th>
            <th className="py-1.5 px-2 text-right font-semibold">P. unit.</th>
            <th className="py-1.5 pl-2 text-right font-semibold">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => {
            const filas = cat.items
              .map((item) => ({ item, s: sel[item.id] }))
              .filter(
                (f): f is { item: ItemCatalogo; s: Seleccion } =>
                  !!f.s?.on && montoDe(f.item, f.s) > 0
              );
            if (filas.length === 0) return null;
            const sub = calc.porCat.get(cat.nombre) ?? 0;
            return (
              <CategoriaPrint
                key={cat.nombre}
                nombre={cat.nombre}
                sub={sub}
                filas={filas}
              />
            );
          })}
        </tbody>
      </table>

      {/* Totales */}
      <div className="mt-4 flex justify-end">
        <table className="text-[12.5px]">
          <tbody>
            <TotalRow label="Subtotal" valor={fmt(calc.subtotal)} />
            {margen > 0 && (
              <TotalRow
                label={`Margen / imprevistos (${margen}%)`}
                valor={fmt(calc.margenMonto)}
              />
            )}
            {iva > 0 && (
              <TotalRow label={`IVA (${iva}%)`} valor={fmt(calc.ivaMonto)} />
            )}
            <tr className="border-t-2 border-[#211E1A]">
              <td className="py-2 pr-8 font-display text-[15px] font-extrabold">
                TOTAL
              </td>
              <td className="py-2 text-right font-display text-[16px] font-extrabold">
                {fmt(calc.total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Notas */}
      {notas.trim() && (
        <div className="mt-4 border-t border-[#E4DDD0] pt-2 text-[11px] leading-snug text-[#3a3a3a]">
          <div className="font-semibold text-[#211E1A]">Notas</div>
          <p className="whitespace-pre-wrap">{notas}</p>
        </div>
      )}

      {/* Pie */}
      <div className="mt-6 border-t border-[#E4DDD0] pt-2 text-[10px] leading-snug text-[#736C61]">
        <p>
          Presupuesto estimativo. Los valores pueden variar según relevamiento en
          obra, condiciones del terreno y fluctuación de precios de materiales.
        </p>
        <p className="mt-1">
          FECON · Febre Construcciones · WhatsApp {WA_DISPLAY} · fecon.com.ar
        </p>
      </div>
    </div>
  );
}

function CategoriaPrint({
  nombre,
  sub,
  filas,
}: {
  nombre: string;
  sub: number;
  filas: { item: ItemCatalogo; s: Seleccion }[];
}) {
  return (
    <>
      <tr className="bg-[#F3EEE3]">
        <td colSpan={4} className="px-1 py-1 font-display text-[11.5px] font-bold">
          {nombre}
        </td>
        <td className="px-1 py-1 text-right font-mono text-[11px] text-[#736C61]">
          {fmt(sub)}
        </td>
      </tr>
      {filas.map(({ item, s }) =>
        item.modo === "tarea" ? (
          <tr key={item.id} className="border-b border-[#EDE7DB]">
            <td className="py-1 pr-2">
              {item.item}
              <div className="text-[10px] text-[#736C61]">
                Materiales {fmt(s.materiales)} · Mano de obra {fmt(s.manoObra)}
              </div>
            </td>
            <td className="py-1 px-2 text-center text-[#736C61]">tarea</td>
            <td className="py-1 px-2 text-right text-[#736C61]">—</td>
            <td className="py-1 px-2 text-right text-[#736C61]">—</td>
            <td className="py-1 pl-2 text-right font-semibold">
              {fmt(montoDe(item, s))}
            </td>
          </tr>
        ) : (
          <tr key={item.id} className="border-b border-[#EDE7DB]">
            <td className="py-1 pr-2">{item.item}</td>
            <td className="py-1 px-2 text-center text-[#736C61]">{item.unidad}</td>
            <td className="py-1 px-2 text-right">{s.qty}</td>
            <td className="py-1 px-2 text-right">{fmt(item.precioUnitario)}</td>
            <td className="py-1 pl-2 text-right font-semibold">
              {fmt(montoDe(item, s))}
            </td>
          </tr>
        )
      )}
    </>
  );
}

function TotalRow({ label, valor }: { label: string; valor: string }) {
  return (
    <tr>
      <td className="py-0.5 pr-8 text-[#3a3a3a]">{label}</td>
      <td className="py-0.5 text-right font-mono font-semibold">{valor}</td>
    </tr>
  );
}

function DatoPrint({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-wide text-[#736C61]">
        {label}
      </div>
      <div className="font-semibold text-[#211E1A]">{valor}</div>
    </div>
  );
}

// ───────────────────────── UI helpers (pantalla) ─────────────────────────

const inputCls =
  "w-full rounded-xl border border-lino bg-white px-3.5 py-2.5 text-[15px] text-texto outline-none placeholder:text-niebla focus:border-bronce";

/** Fila de un ítem en la pantalla. Se adapta al modo (medición / tarea). */
function FilaItem({
  item,
  s,
  onToggle,
  onQty,
  onMat,
  onMano,
}: {
  item: ItemCatalogo;
  s?: Seleccion;
  onToggle: (i: ItemCatalogo) => void;
  onQty: (i: ItemCatalogo, v: number) => void;
  onMat: (i: ItemCatalogo, v: number) => void;
  onMano: (i: ItemCatalogo, v: number) => void;
}) {
  const on = !!s?.on;
  const monto = on ? montoDe(item, s) : 0;
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-lino-2 px-4 py-2.5 first:border-t-0 sm:flex-nowrap",
        on && "bg-bronce/[0.04]"
      )}
    >
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
        className="min-w-[160px] flex-1 text-left text-[14.5px] text-texto"
      >
        {item.item}
        {item.modo === "tarea" ? (
          <span className="ml-2 rounded bg-bronce/15 px-1.5 py-0.5 font-mono text-[10.5px] uppercase text-bronce">
            por tarea
          </span>
        ) : (
          <span className="ml-2 rounded bg-lino px-1.5 py-0.5 font-mono text-[10.5px] uppercase text-muted">
            {item.unidad}
          </span>
        )}
      </button>

      {item.modo === "tarea" ? (
        <div className="flex items-end gap-2">
          <MiniMoney
            label="Materiales"
            value={on ? s!.materiales : undefined}
            onChange={(v) => onMat(item, v)}
          />
          <span className="pb-1.5 text-niebla">+</span>
          <MiniMoney
            label="Mano de obra"
            value={on ? s!.manoObra : undefined}
            onChange={(v) => onMano(item, v)}
          />
        </div>
      ) : (
        <>
          <span className="w-28 shrink-0 text-right font-mono text-[13px] text-muted">
            {fmt(item.precioUnitario)}
          </span>
          <input
            type="number"
            min={0}
            step="any"
            value={on ? s!.qty : ""}
            placeholder="0"
            onChange={(e) => onQty(item, parseFloat(e.target.value) || 0)}
            className="w-20 shrink-0 rounded-lg border border-lino bg-white px-2 py-1.5 text-right text-[14px] outline-none focus:border-bronce"
            aria-label={`Cantidad de ${item.item}`}
          />
        </>
      )}

      <span className="w-28 shrink-0 text-right font-mono text-[14px] font-semibold text-grafito">
        {on ? fmt(monto) : "—"}
      </span>
    </div>
  );
}

/** Input de dinero compacto con etiqueta (para Materiales / Mano de obra). */
function MiniMoney({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-0.5 block text-center font-mono text-[9.5px] uppercase tracking-wide text-niebla">
        {label}
      </span>
      <div className="flex items-center rounded-lg border border-lino bg-white pl-1.5 focus-within:border-bronce">
        <span className="text-[12px] text-niebla">$</span>
        <input
          type="number"
          min={0}
          step="any"
          value={value ?? ""}
          placeholder="0"
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-24 bg-transparent px-1 py-1.5 text-right text-[13.5px] outline-none"
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
      <h2 className="font-display text-[18px] font-bold text-grafito">
        {children}
      </h2>
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
