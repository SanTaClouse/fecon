// logo-modulo.jsx — FECON · Phase 2 · Direction C "Módulo"
// (1) isotype exploration — 4 marks in the Módulo language
// (2) full logo system built on the recommended mark
// Scope-isolated babel script. Loads after board-kit.jsx (uses TileCaption).

const LC = {
  grafito: '#211E1A',
  niebla:  '#9C958B',
  lino:    '#E4DDD0',
  lino2:   '#EDE7DB',
  blanco:  '#FAF6EE',
  bronce:  '#8A6E3C',
};

/* ─────────── The four isotype candidates ─────────── */

// 1 · Módulo — the base: an "F" assembled from offset structural blocks.
function MarkModulo({ size = 96, color = LC.grafito, accent = LC.bronce }) {
  const w = size * 0.83;
  return (
    <svg width={w} height={size} viewBox="0 0 100 120" fill="none" style={{ display: 'block' }}>
      <rect x="8" y="8" width="24" height="104" rx="2" fill={color} />
      <rect x="36" y="8" width="56" height="28" rx="2" fill={accent} />
      <rect x="36" y="48" width="40" height="28" rx="2" fill={color} />
    </svg>
  );
}

// 2 · Escalonado — stepped terraces / floors reading as an F.
function MarkEscalonado({ size = 96, color = LC.grafito, accent = LC.bronce }) {
  const w = size * 0.83;
  return (
    <svg width={w} height={size} viewBox="0 0 100 120" fill="none" style={{ display: 'block' }}>
      <rect x="12" y="12" width="80" height="24" rx="2" fill={accent} />
      <rect x="12" y="48" width="60" height="24" rx="2" fill={color} />
      <rect x="12" y="84" width="40" height="24" rx="2" fill={color} />
    </svg>
  );
}

// 3 · Hueco — the SAME modular F as 01, in negative space inside a tile.
// Centered, with the modular gaps, chunky enough to survive 16px favicons.
function MarkHueco({ size = 96, color = LC.grafito, accent = LC.bronce, paper = LC.blanco, rx = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" style={{ display: 'block' }}>
      <rect x="0" y="0" width="120" height="120" rx={rx} fill={color} />
      {/* knockout F — mirrors MarkModulo proportions, centered, with gaps */}
      <rect x="38" y="34" width="18" height="52" rx="1.5" fill={paper} />
      <rect x="60" y="34" width="22" height="16" rx="1.5" fill={accent} />
      <rect x="60" y="56" width="16" height="14" rx="1.5" fill={paper} />
    </svg>
  );
}

// 4 · Sección — the F with a roof-pitch cut on the top arm (nods to techos de tejas).
function MarkSeccion({ size = 96, color = LC.grafito, accent = LC.bronce }) {
  const w = size * 0.83;
  return (
    <svg width={w} height={size} viewBox="0 0 100 120" fill="none" style={{ display: 'block' }}>
      <rect x="8" y="8" width="24" height="104" rx="2" fill={color} />
      <path d="M36 8 H78 L92 30 V36 H36 Z" fill={accent} />
      <rect x="36" y="48" width="40" height="28" rx="2" fill={color} />
    </svg>
  );
}

function WM({ size = 62, color = LC.grafito, sub = LC.niebla, showSub = true }) {
  return (
    <div>
      <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: size, letterSpacing: '-0.04em', lineHeight: 0.88, color }}>FECON</div>
      {showSub && <div style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 500, fontSize: size * 0.142, letterSpacing: '0.38em', marginTop: size * 0.2, color: sub, textTransform: 'uppercase' }}>Febre Construcciones</div>}
    </div>
  );
}

/* ─────────── Board 1 · isotype exploration ─────────── */

function ExploreTile({ rec, idx, name, frase, children }) {
  const mono = "'Space Mono', monospace";
  return (
    <div style={{ background: LC.lino2, borderRadius: 4, padding: '30px 32px 26px', border: rec ? `2px solid ${LC.bronce}` : '2px solid transparent', position: 'relative' }}>
      {rec && <span style={{ position: 'absolute', top: 16, right: 16, fontFamily: mono, fontSize: 10, letterSpacing: '0.14em', color: LC.bronce, fontWeight: 700 }}>RECOMENDADO</span>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26 }}>
        <span style={{ fontFamily: mono, fontSize: 12, color: LC.bronce, fontWeight: 700 }}>{idx}</span>
        <span style={{ fontFamily: mono, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: LC.grafito }}>{name}</span>
      </div>
      <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
      <p style={{ fontSize: 14, lineHeight: 1.5, color: LC.niebla, margin: '24px 0 0' }}>{frase}</p>
    </div>
  );
}

function BoardLogoExplore() {
  const mono = "'Space Mono', monospace";
  return (
    <window.BoardFrame bg={LC.blanco} color={LC.grafito} font="'Schibsted Grotesk', sans-serif">
      <div style={{ padding: '72px 84px 0' }}>
        <div style={{ fontFamily: mono, fontSize: 13, letterSpacing: '0.24em', color: LC.bronce, marginBottom: 20 }}>FASE 2 · ISOTIPO</div>
        <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 76, letterSpacing: '-0.045em', lineHeight: 0.9, margin: 0 }}>Elegí el símbolo</h1>
        <p style={{ fontSize: 22, lineHeight: 1.45, marginTop: 22, maxWidth: 720, fontWeight: 500 }}>
          Cuatro caminos para la "F" de FECON, todos dentro del lenguaje Módulo. Decime cuál te late y sobre ese construyo todo el sistema.
        </p>
      </div>

      <div style={{ padding: '0 84px', marginTop: 48 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <ExploreTile idx="01" name="Módulo" rec frase="La F armada con bloques desfasados. Clara, sistemática, sólida. Lee como estructura y como letra a la vez.">
            <MarkModulo size={130} />
          </ExploreTile>
          <ExploreTile idx="02" name="Escalonado" frase="Terrazas / pisos apilados que sugieren la F. Más dinámico, evoca el crecer de una obra planta por planta.">
            <MarkEscalonado size={130} />
          </ExploreTile>
          <ExploreTile idx="03" name="Hueco" frase="La F en negativo dentro de un mosaico macizo. El más premium para avatar y favicon: imbatible en tamaños chicos.">
            <MarkHueco size={132} />
          </ExploreTile>
          <ExploreTile idx="04" name="Sección" frase="La F con un corte de pendiente en el brazo superior. Guiña al diferenciador: los techos de tejas, sin ser literal.">
            <MarkSeccion size={130} />
          </ExploreTile>
        </div>
        <p style={{ fontFamily: mono, fontSize: 12.5, color: LC.niebla, marginTop: 30, lineHeight: 1.6 }}>// Mi recomendación: <span style={{ color: LC.grafito }}>01 Módulo</span> como isotipo principal + <span style={{ color: LC.grafito }}>03 Hueco</span> como versión mosaico para favicon/avatar. Conviven perfecto. → así lo armé en el board de al lado.</p>
      </div>
    </window.BoardFrame>
  );
}

/* ─────────── Board 2 · full logo system ─────────── */

function SysBlock({ title, children, mb = 56 }) {
  const mono = "'Space Mono', monospace";
  return (
    <section style={{ padding: '0 84px', marginBottom: mb }}>
      <div style={{ fontFamily: mono, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: LC.niebla, marginBottom: 22 }}>{title}</div>
      {children}
    </section>
  );
}

function RepTile({ bg, label, border, children }) {
  return (
    <div>
      <div style={{ background: bg, border: border || 'none', borderRadius: 4, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
      <window.TileCaption color={LC.niebla}>{label}</window.TileCaption>
    </div>
  );
}

function BoardLogoSystem() {
  const mono = "'Space Mono', monospace";
  return (
    <window.BoardFrame bg={LC.blanco} color={LC.grafito} font="'Schibsted Grotesk', sans-serif">
      <div style={{ padding: '72px 84px 0' }}>
        <div style={{ fontFamily: mono, fontSize: 13, letterSpacing: '0.24em', color: LC.bronce, marginBottom: 20 }}>FASE 2 · SISTEMA DE LOGO</div>
        <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 76, letterSpacing: '-0.045em', lineHeight: 0.9, margin: 0 }}>FECON · Módulo</h1>
        <p style={{ fontSize: 22, lineHeight: 1.45, marginTop: 22, maxWidth: 720, fontWeight: 500 }}>
          Construido sobre el símbolo 01 + mosaico 03. Todas las variantes que vas a necesitar, listas para vectorizar.
        </p>
      </div>

      <div style={{ padding: '0 84px', margin: '52px 0' }}><div style={{ height: 1, background: 'rgba(33,30,26,0.14)' }} /></div>

      {/* Primary horizontal lockup */}
      <SysBlock title="Lockup principal — horizontal">
        <div style={{ background: LC.lino, borderRadius: 4, padding: '56px 64px', display: 'flex', alignItems: 'center', gap: 46 }}>
          <MarkModulo size={112} />
          <div style={{ width: 1, height: 112, background: 'rgba(33,30,26,0.16)' }} />
          <WM size={70} />
        </div>
      </SysBlock>

      {/* Secondary lockups */}
      <SysBlock title="Vertical · isotipo · mosaico">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          <RepTile bg={LC.lino} label="Vertical">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <MarkModulo size={58} />
              <WM size={34} sub={LC.niebla} />
            </div>
          </RepTile>
          <RepTile bg={LC.lino} label="Isotipo solo">
            <MarkModulo size={84} />
          </RepTile>
          <RepTile bg={LC.lino} label="Mosaico (03)">
            <MarkHueco size={104} />
          </RepTile>
        </div>
      </SysBlock>

      {/* Reproduction */}
      <SysBlock title="Reproducción">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }}>
          <RepTile bg={LC.blanco} border={`1px solid ${LC.lino}`} label="Fondo claro">
            <MarkModulo size={70} />
          </RepTile>
          <RepTile bg={LC.grafito} label="Fondo oscuro">
            <MarkModulo size={70} color={LC.blanco} accent={LC.bronce} />
          </RepTile>
          <RepTile bg={LC.blanco} border={`1px solid ${LC.lino}`} label="Mono negro">
            <MarkModulo size={70} color={LC.grafito} accent={LC.grafito} />
          </RepTile>
          <RepTile bg={LC.grafito} label="Mono blanco">
            <MarkModulo size={70} color={LC.blanco} accent={LC.blanco} />
          </RepTile>
          <RepTile bg={LC.bronce} label="Bronce pleno">
            <MarkModulo size={70} color={LC.blanco} accent={LC.blanco} />
          </RepTile>
        </div>
      </SysBlock>

      {/* Favicon & avatar */}
      <SysBlock title="Favicon · avatar · tamaños chicos">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 40, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18 }}>
            <div style={{ width: 120, height: 120, borderRadius: '50%', background: LC.grafito, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MarkModulo size={58} color={LC.blanco} accent={LC.bronce} /></div>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: LC.bronce, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MarkModulo size={38} color={LC.blanco} accent={LC.blanco} /></div>
            <span style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '0.1em', color: LC.niebla, marginBottom: 6 }}>AVATAR IG</span>
          </div>
          <div style={{ width: 1, height: 110, background: LC.lino }} />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', background: LC.grafito, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MarkHueco size={64} rx={0} /></div>
            <div style={{ width: 32, height: 32, borderRadius: 7, overflow: 'hidden', background: LC.grafito, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MarkHueco size={32} rx={0} /></div>
            <div style={{ width: 16, height: 16, borderRadius: 3.5, overflow: 'hidden', background: LC.grafito, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MarkHueco size={16} rx={0} /></div>
            <span style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '0.1em', color: LC.niebla, marginBottom: 2 }}>FAVICON 64 / 32 / 16</span>
          </div>
        </div>
      </SysBlock>

      {/* Clear space & min size */}
      <SysBlock title="Área de resguardo · tamaño mínimo" mb={64}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }}>
          <div style={{ background: LC.lino, borderRadius: 4, padding: 28, position: 'relative' }}>
            <div style={{ border: `1px dashed ${LC.niebla}`, borderRadius: 3, padding: 40, display: 'flex', alignItems: 'center', gap: 30 }}>
              <MarkModulo size={64} />
              <div style={{ width: 1, height: 64, background: 'rgba(33,30,26,0.16)' }} />
              <WM size={40} showSub={false} />
            </div>
            <p style={{ fontFamily: mono, fontSize: 11.5, color: LC.niebla, margin: '16px 0 0' }}>// resguardo mínimo = altura de la barra superior del módulo (× ) en todo el contorno.</p>
          </div>
          <div style={{ background: LC.lino, borderRadius: 4, padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <MarkModulo size={26} />
              <WM size={17} showSub={false} />
            </div>
            <p style={{ fontFamily: mono, fontSize: 11.5, color: LC.niebla, margin: '20px 0 0', lineHeight: 1.6 }}>// tamaño mínimo del lockup horizontal: 22 mm impreso / 120 px en pantalla. Por debajo, usar solo isotipo o mosaico.</p>
          </div>
        </div>
      </SysBlock>
    </window.BoardFrame>
  );
}

Object.assign(window, { BoardLogoExplore, BoardLogoSystem });
