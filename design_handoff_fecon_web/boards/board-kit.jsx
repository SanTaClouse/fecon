// board-kit.jsx — shared primitives for the three FECON brand-direction boards.
// Scope-isolated babel script: defines helpers and exports them to window.
// All visual tokens are passed in via props so each direction controls its own palette.

const BK_W = 1180;
const BK_H = 2820;

// Root frame: fixed-size board with generous side rails.
function BoardFrame({ bg, color, font, children }) {
  return (
    <div className="board-root" style={{
      width: BK_W, height: BK_H, background: bg, color,
      fontFamily: font, position: 'relative', overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}

// Section wrapper with an index + label eyebrow.
function Section({ index, label, accent, mutedColor, children, pad = true }) {
  return (
    <section style={{ padding: pad ? '0 84px' : 0, marginBottom: 64 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 30 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: accent, fontWeight: 700 }}>{index}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: mutedColor }}>{label}</span>
      </div>
      {children}
    </section>
  );
}

function Hairline({ color, my = 0 }) {
  return <div style={{ height: 1, background: color, margin: `${my}px 0` }} />;
}

// A single palette swatch with hex + name.
function Swatch({ hex, name, role, textColor }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ height: 132, background: hex, borderRadius: 3 }} />
      <div style={{ marginTop: 12 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: '0.04em', color: textColor }}>{hex}</div>
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 3, color: textColor }}>{name}</div>
        <div style={{ fontSize: 12.5, opacity: 0.55, color: textColor }}>{role}</div>
      </div>
    </div>
  );
}

// Diagonal-striped placeholder standing in for a real photo.
function Stripe({ h = 200, label, dark = false, radius = 3, style = {} }) {
  const stripe = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const base = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.035)';
  const txt = dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.42)';
  return (
    <div style={{
      height: h, borderRadius: radius, position: 'relative', overflow: 'hidden',
      background: `repeating-linear-gradient(135deg, ${base} 0 11px, ${stripe} 11px 22px)`,
      border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
      display: 'flex', alignItems: 'flex-end', ...style,
    }}>
      {label && <span style={{
        fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.08em',
        color: txt, padding: '10px 12px', textTransform: 'uppercase',
      }}>{label}</span>}
    </div>
  );
}

// Small caption under a logo lockup tile.
function TileCaption({ children, color }) {
  return <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color, marginTop: 12 }}>{children}</div>;
}

Object.assign(window, { BoardFrame, Section, Hairline, Swatch, Stripe, TileCaption, BK_W, BK_H });
