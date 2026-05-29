import { cn } from "@/lib/utils";
import { WhatsAppGlyph } from "@/components/marks";
import { WA } from "@/lib/whatsapp";

/* ───────── Reveal (entrada fade-up, una sola vez) ───────── */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={cn("reveal", className)} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ───────── Eyebrow (mono, uppercase, tracking) ───────── */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "font-mono text-[11px] uppercase text-bronce",
        className
      )}
      style={{ letterSpacing: "0.2em" }}
    >
      {children}
    </div>
  );
}

/* ───────── Botón WhatsApp ───────── */
export function WAButton({
  children,
  href = WA.general,
  big = false,
  light = false,
  className,
}: {
  children: React.ReactNode;
  href?: string;
  big?: boolean;
  light?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={typeof children === "string" ? children : "Escribir por WhatsApp"}
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
    </a>
  );
}
