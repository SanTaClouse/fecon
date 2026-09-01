import { cn } from "@/lib/utils";

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
