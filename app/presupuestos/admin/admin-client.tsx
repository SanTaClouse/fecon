"use client";

import { useMemo, useState, useTransition } from "react";
import { ModuloF, Wordmark } from "@/components/marks";
import {
  type FilaCatalogo,
  type ItemCatalogo,
  type TipoPresupuesto,
  TIPOS,
} from "@/lib/presupuestos/catalog";
import { cn } from "@/lib/utils";
import {
  guardarCatalogoAction,
  restaurarEjemplosAction,
  type GuardarResult,
} from "./actions";

type Row = FilaCatalogo & { key: string };

let _k = 0;
const nuevaKey = () => `r${_k++}`;

const ars = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});
const fmt = (n: number) => ars.format(Math.round(n || 0));

export function AdminClient({
  catalogo,
  conBase,
}: {
  catalogo: ItemCatalogo[];
  conBase: boolean;
}) {
  const [rows, setRows] = useState<Row[]>(() =>
    catalogo.map((it) => ({ ...it, key: nuevaKey() }))
  );
  const [tipo, setTipo] = useState<TipoPresupuesto>("casa_desde_0");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const rowsTipo = useMemo(
    () => rows.filter((r) => r.tipo === tipo),
    [rows, tipo]
  );

  function setRow(key: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
    setMsg(null);
  }
  function eliminar(key: string) {
    setRows((prev) => prev.filter((r) => r.key !== key));
    setMsg(null);
  }
  function agregar() {
    const ultimaCat = rowsTipo[rowsTipo.length - 1]?.categoria ?? "";
    setRows((prev) => [
      ...prev,
      {
        key: nuevaKey(),
        tipo,
        categoria: ultimaCat,
        item: "",
        unidad: "m²",
        cantidad: 1,
        materiales: 0,
        manoObra: 0,
      },
    ]);
    setMsg(null);
  }

  // Ordena por tipo (Casa primero) preservando el orden de cada grupo.
  function ordenadas(): FilaCatalogo[] {
    const out: FilaCatalogo[] = [];
    for (const t of TIPOS) {
      for (const r of rows) {
        if (r.tipo !== t.value) continue;
        const { key: _key, ...fila } = r;
        out.push(fila);
      }
    }
    return out;
  }

  function manejar(res: GuardarResult, okText: (n: number) => string) {
    if (res.ok) setMsg({ ok: true, text: okText(res.count) });
    else setMsg({ ok: false, text: res.error });
  }

  function guardar() {
    setMsg(null);
    startTransition(async () => {
      const res = await guardarCatalogoAction(ordenadas());
      manejar(res, (n) => `Guardado ✓ — ${n} ítems en el catálogo.`);
    });
  }

  function restaurar() {
    if (
      !confirm(
        "Esto reemplaza TODO el catálogo por los ítems de ejemplo. ¿Continuar?"
      )
    )
      return;
    setMsg(null);
    startTransition(async () => {
      const res = await restaurarEjemplosAction();
      if (res.ok) window.location.reload();
      else manejar(res, () => "");
    });
  }

  const totalItems = rows.filter((r) => r.item.trim()).length;

  return (
    <div className="min-h-screen bg-blanco text-texto">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-grafito-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <ModuloF size={22} />
            <Wordmark size={18} />
            <span className="ml-1.5 hidden font-mono text-[11px] uppercase tracking-[0.18em] text-niebla sm:inline">
              Editar catálogo
            </span>
          </div>
          <a
            href="/presupuestos"
            className="rounded-full border border-blanco/30 px-3.5 py-1.5 font-sans text-[13px] font-bold text-blanco no-underline hover:bg-white/5"
          >
            ← Volver a presupuestos
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-32 pt-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-grafito sm:text-3xl">
          Catálogo de ítems y precios
        </h1>
        <p className="mt-1 max-w-2xl text-[15px] text-muted">
          Editá rubros, ítems y precios como en una planilla. Cada ítem lleva{" "}
          <strong>materiales</strong> + <strong>mano de obra</strong> (el total se
          calcula solo). La <strong>cantidad</strong> y la <strong>unidad</strong>{" "}
          son de referencia. Al terminar, tocá <strong>Guardar cambios</strong>.
        </p>

        {!conBase && (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-[14px] text-amber-900">
            ⚠️ No hay base de datos configurada (<code>DATABASE_URL</code>). Podés
            ver el catálogo pero los cambios <strong>no se guardarán</strong>.
          </div>
        )}

        <div className="mt-6 flex gap-2">
          {TIPOS.map((t) => {
            const n = rows.filter((r) => r.tipo === t.value).length;
            return (
              <button
                key={t.value}
                onClick={() => setTipo(t.value)}
                className={cn(
                  "rounded-full px-4 py-2 font-sans text-[14px] font-bold transition-colors",
                  tipo === t.value
                    ? "bg-grafito text-blanco"
                    : "bg-white text-muted ring-1 ring-lino hover:ring-niebla"
                )}
              >
                {t.label} <span className="ml-1 text-[12px] text-niebla">({n})</span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 overflow-x-auto rounded-2xl border border-lino bg-white">
          <table className="w-full min-w-[920px] border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b border-lino bg-lino-2/60 text-left font-mono text-[10.5px] uppercase tracking-wide text-muted">
                <th className="px-2 py-2 font-semibold">Rubro</th>
                <th className="px-2 py-2 font-semibold">Ítem</th>
                <th className="px-2 py-2 font-semibold">Unidad</th>
                <th className="px-2 py-2 text-right font-semibold">Cantidad</th>
                <th className="px-2 py-2 text-right font-semibold">Materiales</th>
                <th className="px-2 py-2 text-right font-semibold">Mano de obra</th>
                <th className="px-2 py-2 text-right font-semibold">Total</th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {rowsTipo.map((r) => (
                <tr key={r.key} className="border-b border-lino-2 align-middle">
                  <td className="px-2 py-1.5">
                    <input
                      value={r.categoria}
                      onChange={(e) => setRow(r.key, { categoria: e.target.value })}
                      placeholder="Rubro"
                      className={celdaCls + " w-40"}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      value={r.item}
                      onChange={(e) => setRow(r.key, { item: e.target.value })}
                      placeholder="Nombre del ítem"
                      className={celdaCls + " w-full min-w-[220px]"}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      value={r.unidad}
                      onChange={(e) => setRow(r.key, { unidad: e.target.value })}
                      placeholder="m²"
                      className={celdaCls + " w-20"}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <NumCell
                      value={r.cantidad}
                      onChange={(v) => setRow(r.key, { cantidad: v })}
                      w="w-20"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <NumCell
                      value={r.materiales}
                      onChange={(v) => setRow(r.key, { materiales: v })}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <NumCell
                      value={r.manoObra}
                      onChange={(v) => setRow(r.key, { manoObra: v })}
                    />
                  </td>
                  <td className="px-2 py-1.5 text-right font-mono text-[13px] font-semibold text-grafito">
                    {fmt(r.materiales + r.manoObra)}
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <button
                      onClick={() => eliminar(r.key)}
                      title="Eliminar ítem"
                      className="rounded-md px-2 py-1 text-[15px] text-niebla hover:bg-red-50 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
              {rowsTipo.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted">
                    No hay ítems en este tipo de obra todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button
          onClick={agregar}
          className="mt-3 rounded-full border border-bronce/50 bg-bronce/10 px-4 py-2 font-sans text-[14px] font-bold text-bronce hover:bg-bronce/15"
        >
          + Agregar ítem
        </button>

        <div className="mt-8">
          <button
            onClick={restaurar}
            disabled={pending || !conBase}
            className="text-[13px] font-semibold text-muted underline underline-offset-2 hover:text-grafito disabled:opacity-40"
          >
            Restaurar ítems de ejemplo
          </button>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-lino bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="min-h-[20px] text-[14px]">
            {msg ? (
              <span className={msg.ok ? "text-green-700" : "text-red-600"}>
                {msg.text}
              </span>
            ) : (
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                {totalItems} ítems en total
              </span>
            )}
          </div>
          <button
            onClick={guardar}
            disabled={pending || !conBase}
            className="rounded-full bg-bronce px-6 py-2.5 font-sans text-[14.5px] font-bold text-blanco shadow-wa transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

const celdaCls =
  "rounded-lg border border-lino bg-white px-2 py-1.5 text-[13.5px] text-texto outline-none placeholder:text-niebla focus:border-bronce";

function NumCell({
  value,
  onChange,
  w = "w-28",
}: {
  value: number;
  onChange: (v: number) => void;
  w?: string;
}) {
  return (
    <input
      type="number"
      min={0}
      step="any"
      value={value || ""}
      placeholder="0"
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className={cn(celdaCls, w, "text-right font-mono")}
    />
  );
}
