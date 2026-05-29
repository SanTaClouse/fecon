// Isotipo "Módulo" y wordmark FECON, recreados desde las specs del handoff.
// La "F" se arma con 3 bloques rectangulares (asta + brazo superior bronce +
// brazo medio). Íconos geométricos propios del sistema Módulo (NO de librería).

type MarkProps = { size?: number; color?: string; accent?: string };

const GRAFITO = "#211E1A";
const BLANCO = "#FAF6EE";
const BRONCE = "#8A6E3C";

export function ModuloF({
  size = 26,
  color = BLANCO,
  accent = BRONCE,
}: MarkProps) {
  return (
    <svg
      width={size * 0.83}
      height={size}
      viewBox="0 0 100 120"
      fill="none"
      className="block"
      aria-hidden="true"
    >
      <rect x="8" y="8" width="24" height="104" rx="2" fill={color} />
      <rect x="36" y="8" width="56" height="28" rx="2" fill={accent} />
      <rect x="36" y="48" width="40" height="28" rx="2" fill={color} />
    </svg>
  );
}

export function Wordmark({
  size = 19,
  color = BLANCO,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <span
      className="font-display font-extrabold"
      style={{ fontSize: size, letterSpacing: "-0.04em", color }}
    >
      FECON
    </span>
  );
}

type IconProps = { c?: string; a?: string };

export function IconEquipo({ c = GRAFITO, a = BRONCE }: IconProps) {
  return (
    <svg width="46" height="46" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="6" y="25" width="15" height="15" rx="2" fill={c} />
      <rect x="27" y="25" width="15" height="15" rx="2" fill={c} />
      <rect x="16.5" y="7" width="15" height="15" rx="2" fill={a} />
    </svg>
  );
}

export function IconTrato({ c = GRAFITO, a = BRONCE }: IconProps) {
  return (
    <svg width="46" height="46" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="5" y="17" width="15" height="15" rx="2" fill={c} />
      <rect x="28" y="17" width="15" height="15" rx="2" fill={c} />
      <rect x="19" y="22" width="10" height="5" rx="1" fill={a} />
    </svg>
  );
}

export function IconTecho({ c = GRAFITO, a = BRONCE }: IconProps) {
  return (
    <svg width="46" height="46" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M7 27 L24 11 L41 27"
        stroke={c}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 11 L41 27"
        stroke={a}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 37 H36" stroke={c} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function WhatsAppGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8.5 7.8c.3 0 .5 0 .7.5l.9 2c.1.3 0 .5-.1.7l-.5.6c-.2.2-.2.4 0 .7.6 1 1.4 1.8 2.5 2.3.3.2.5.1.7-.1l.5-.6c.2-.2.4-.3.7-.2l2 .9c.4.2.5.4.5.7 0 1.2-1 2-2.1 2-3.6-.2-6.7-3.3-6.9-6.9 0-1 .8-1.8 1.9-1.8z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h9M8 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
