// fecon-web.jsx — FECON landing (mobile-first), Direction C "Módulo".
// Interactive prototype: sticky nav, scroll reveals, testimonial slider,
// FAQ accordion, WhatsApp deep-links. Real Rioplatense copy.

const F = {
  grafito: '#211E1A',
  grafito2: '#191713',
  blanco:  '#FAF6EE',
  lino:    '#E4DDD0',
  lino2:   '#EDE7DB',
  niebla:  '#9C958B',
  texto:   '#2C2924',
  muted:   '#736C61',
  bronce:  '#8A6E3C',
  bronceL: '#A2823F',
};
const DISP = "'Bricolage Grotesque', sans-serif";
const TEXT = "'Schibsted Grotesk', sans-serif";
const MONO = "'Space Mono', monospace";

const WA_BASE = 'https://wa.me/5493425194112';
const wa = (msg) => `${WA_BASE}?text=${encodeURIComponent(msg)}`;
const WA_GENERAL = wa('Hola Martín, vi la web de FECON y quería pedir un presupuesto para mi proyecto.');

/* ───────── marks & icons (geometría modular) ───────── */
function ModuloF({ size = 26, color = F.blanco, accent = F.bronce }) {
  return (
    <svg width={size * 0.83} height={size} viewBox="0 0 100 120" fill="none" style={{ display: 'block' }}>
      <rect x="8" y="8" width="24" height="104" rx="2" fill={color} />
      <rect x="36" y="8" width="56" height="28" rx="2" fill={accent} />
      <rect x="36" y="48" width="40" height="28" rx="2" fill={color} />
    </svg>
  );
}
function Wordmark({ size = 19, color = F.blanco }) {
  return <span style={{ fontFamily: DISP, fontWeight: 800, fontSize: size, letterSpacing: '-0.04em', color }}>FECON</span>;
}
function IconEquipo({ c = F.grafito, a = F.bronce }) {
  return (<svg width="46" height="46" viewBox="0 0 48 48" fill="none"><rect x="6" y="25" width="15" height="15" rx="2" fill={c}/><rect x="27" y="25" width="15" height="15" rx="2" fill={c}/><rect x="16.5" y="7" width="15" height="15" rx="2" fill={a}/></svg>);
}
function IconTrato({ c = F.grafito, a = F.bronce }) {
  return (<svg width="46" height="46" viewBox="0 0 48 48" fill="none"><rect x="5" y="17" width="15" height="15" rx="2" fill={c}/><rect x="28" y="17" width="15" height="15" rx="2" fill={c}/><rect x="19" y="22" width="10" height="5" rx="1" fill={a}/></svg>);
}
function IconTecho({ c = F.grafito, a = F.bronce }) {
  return (<svg width="46" height="46" viewBox="0 0 48 48" fill="none"><path d="M7 27 L24 11 L41 27" stroke={c} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/><path d="M24 11 L41 27" stroke={a} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 37 H36" stroke={c} strokeWidth="5" strokeLinecap="round"/></svg>);
}

/* ───────── scroll reveal ───────── */
const ScrollCtx = React.createContext(null);
// Pure-CSS entrance: content is ALWAYS rendered visible; the keyframe just
// fades/lifts it in once on mount. No IntersectionObserver, no stuck-hidden state.
function Reveal({ children, delay = 0, y = 24, style = {} }) {
  return (
    <div style={{ ...style, animation: `fecon-rise .7s cubic-bezier(.2,.7,.2,1) ${delay}ms both` }}>
      {children}
    </div>
  );
}

/* ───────── small UI bits ───────── */
function Eyebrow({ children, color = F.bronce }) {
  return <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color }}>{children}</div>;
}
function WAButton({ children, href = WA_GENERAL, big = false, light = false }) {
  return (
    <a href={href} target="_blank" rel="noopener" style={{
      display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none',
      background: light ? F.blanco : F.bronce, color: light ? F.grafito : F.blanco,
      fontFamily: TEXT, fontWeight: 700, fontSize: big ? 17 : 15.5,
      padding: big ? '17px 26px' : '13px 20px', borderRadius: 999, letterSpacing: '-0.01em',
      boxShadow: '0 6px 20px rgba(33,30,26,0.18)',
    }}>
      <svg width={big ? 20 : 18} height={big ? 20 : 18} viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2z" stroke="currentColor" strokeWidth="1.8"/><path d="M8.5 7.8c.3 0 .5 0 .7.5l.9 2c.1.3 0 .5-.1.7l-.5.6c-.2.2-.2.4 0 .7.6 1 1.4 1.8 2.5 2.3.3.2.5.1.7-.1l.5-.6c.2-.2.4-.3.7-.2l2 .9c.4.2.5.4.5.7 0 1.2-1 2-2.1 2-3.6-.2-6.7-3.3-6.9-6.9 0-1 .8-1.8 1.9-1.8z" fill="currentColor"/></svg>
      {children}
    </a>
  );
}

/* ───────── NAV ───────── */
function Nav({ scrolled }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 30,
      paddingTop: 50, paddingBottom: 12,
      background: scrolled ? 'rgba(25,23,19,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none', WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
      transition: 'background .3s, border-color .3s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <ModuloF size={22} />
          <Wordmark size={18} />
        </div>
        <a href={WA_GENERAL} target="_blank" rel="noopener" style={{
          fontFamily: TEXT, fontWeight: 700, fontSize: 13.5, color: F.blanco, textDecoration: 'none',
          border: `1px solid rgba(250,246,238,0.35)`, padding: '8px 15px', borderRadius: 999,
        }}>Presupuesto</a>
      </div>
    </div>
  );
}

/* ───────── HERO ───────── */
function Hero() {
  return (
    <section data-screen-label="Hero" style={{ position: 'relative', background: F.grafito, marginTop: -98, paddingTop: 98 }}>
      {/* photo placeholder */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#2A2620' }} />
        <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 13px, rgba(255,255,255,0.05) 13px 26px)` }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(25,23,19,0.55) 0%, rgba(25,23,19,0.35) 35%, rgba(25,23,19,0.92) 100%)' }} />
        <div style={{ position: 'absolute', top: 130, left: 20, fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.1em', color: 'rgba(250,246,238,0.45)', textTransform: 'uppercase' }}>[ Foto · Martín en obra ]</div>
      </div>
      <div style={{ position: 'relative', padding: '180px 22px 56px', minHeight: 600, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <Reveal><Eyebrow color={F.bronceL}>Construcción · Santa Fe · 16 años</Eyebrow></Reveal>
        <Reveal delay={80}>
          <h1 style={{ fontFamily: DISP, fontWeight: 800, fontSize: 34, lineHeight: 1.08, letterSpacing: '-0.035em', color: F.blanco, margin: '16px 0 0', textWrap: 'balance' }}>
            Casas de cero, remodelaciones y especialistas en techos de tejas.
          </h1>
        </Reveal>
        <Reveal delay={150}>
          <p style={{ fontFamily: TEXT, fontSize: 17, lineHeight: 1.5, color: 'rgba(250,246,238,0.82)', margin: '20px 0 0', maxWidth: 340 }}>
            Equipo propio, trato directo con el dueño y 16 años de oficio. De cero a llaves, o el techo que tu casa necesita.
          </p>
        </Reveal>
        <Reveal delay={220} style={{ marginTop: 30, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <WAButton big>Pedir presupuesto</WAButton>
          <a href="#servicios" style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 15, color: F.blanco, textDecoration: 'none', borderBottom: `1.5px solid ${F.bronce}`, paddingBottom: 2 }}>Ver servicios</a>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────── KPIs ───────── */
function KPIs() {
  const data = [['16', 'Años de oficio'], ['14', 'Casas de cero'], ['+200', 'Trabajos y techos'], ['15', 'En el equipo']];
  return (
    <section style={{ background: F.blanco, padding: '0 16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: `1px solid ${F.lino}` }}>
        {data.map(([n, l], i) => (
          <Reveal key={i} delay={i * 70} style={{ padding: '26px 14px', borderBottom: `1px solid ${F.lino}`, borderRight: i % 2 === 0 ? `1px solid ${F.lino}` : 'none' }}>
            <div style={{ fontFamily: DISP, fontWeight: 800, fontSize: 46, letterSpacing: '-0.04em', color: F.grafito, lineHeight: 0.9 }}>{n}</div>
            <div style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: '0.04em', color: F.muted, marginTop: 8, textTransform: 'uppercase' }}>{l}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────── SERVICIOS ───────── */
function Servicios() {
  const cards = [
    { n: '01', t: 'Construcción llave en mano', d: 'De terreno a llaves. Nos hacemos cargo de todo el proceso para que no tengas que ser tu propio capataz.', wa: 'Hola Martín, me interesa construir una casa llave en mano. ¿Podemos hablar?' },
    { n: '02', t: 'Remodelaciones integrales', d: 'Ampliar, renovar o transformar lo que ya tenés, con el mismo equipo de principio a fin.', wa: 'Hola Martín, quiero remodelar y me gustaría un presupuesto.' },
  ];
  return (
    <section id="servicios" data-screen-label="Servicios" style={{ background: F.blanco, padding: '64px 22px 8px' }}>
      <Reveal><Eyebrow>Lo que hacemos</Eyebrow></Reveal>
      <Reveal delay={60}><h2 style={{ fontFamily: DISP, fontWeight: 800, fontSize: 33, letterSpacing: '-0.035em', color: F.grafito, margin: '12px 0 28px', lineHeight: 1.05 }}>Tres formas de trabajar con nosotros.</h2></Reveal>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {cards.map((c, i) => (
          <Reveal key={i} delay={i * 80}>
            <a href={wa(c.wa)} target="_blank" rel="noopener" style={{ display: 'block', textDecoration: 'none', background: F.lino2, borderRadius: 16, padding: '24px 22px' }}>
              <div style={{ fontFamily: MONO, fontSize: 12, color: F.bronce, marginBottom: 14 }}>{c.n}</div>
              <h3 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 22, letterSpacing: '-0.03em', color: F.grafito, margin: 0 }}>{c.t}</h3>
              <p style={{ fontFamily: TEXT, fontSize: 15, lineHeight: 1.5, color: F.muted, margin: '10px 0 0' }}>{c.d}</p>
            </a>
          </Reveal>
        ))}
        {/* destacado: techos de tejas */}
        <Reveal delay={160}>
          <a href={wa('Hola Martín, tengo un techo de tejas y quiero que lo revisen / presupuesten.')} target="_blank" rel="noopener" style={{ display: 'block', textDecoration: 'none', background: F.grafito, borderRadius: 16, padding: '26px 22px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 20, right: 20 }}><IconTecho c={F.blanco} a={F.bronceL} /></div>
            <div style={{ display: 'inline-block', fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.12em', color: F.grafito, background: F.bronceL, padding: '5px 10px', borderRadius: 999, textTransform: 'uppercase', marginBottom: 16 }}>Nuestra especialidad</div>
            <h3 style={{ fontFamily: DISP, fontWeight: 800, fontSize: 24, letterSpacing: '-0.03em', color: F.blanco, margin: 0, maxWidth: 240 }}>Techos de tejas</h3>
            <p style={{ fontFamily: TEXT, fontSize: 15, lineHeight: 1.5, color: 'rgba(250,246,238,0.78)', margin: '12px 0 18px', maxWidth: 280 }}>
              Reparación, recambio total e impermeabilización. Pocos lo hacen bien en Santa Fe; nosotros vivimos de esto hace años.
            </p>
            <span style={{ fontFamily: TEXT, fontWeight: 700, fontSize: 14.5, color: F.bronceL, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              Consultar por mi techo <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h9M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────── POR QUÉ FECON ───────── */
function PorQue() {
  const items = [
    { Icon: IconEquipo, t: 'Equipo propio', d: '15 personas en relación de dependencia. No tercerizamos: la obra la hace nuestra gente, no un subcontratista que aparece y desaparece.' },
    { Icon: IconTrato, t: 'Trato directo con el dueño', d: 'Hablás con Martín, no con un vendedor ni un arquitecto intermediario que infle la cuenta. Las cosas se dicen de frente.' },
    { Icon: IconTecho, t: 'Especialistas en techos', d: 'El nicho que casi nadie cubre bien en Santa Fe. Tejas, cumbreras y filtraciones: lo resolvemos y te explicamos cómo.' },
  ];
  return (
    <section data-screen-label="Por qué FECON" style={{ background: F.lino, padding: '64px 22px' }}>
      <Reveal><Eyebrow>Por qué FECON</Eyebrow></Reveal>
      <Reveal delay={60}><h2 style={{ fontFamily: DISP, fontWeight: 800, fontSize: 33, letterSpacing: '-0.035em', color: F.grafito, margin: '12px 0 32px', lineHeight: 1.05 }}>Construir sin vueltas, con quien sabe.</h2></Reveal>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
        {items.map(({ Icon, t, d }, i) => (
          <Reveal key={i} delay={i * 80}>
            <div style={{ borderTop: `1px solid rgba(33,30,26,0.14)`, paddingTop: 22 }}>
              <Icon />
              <h3 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 21, letterSpacing: '-0.03em', color: F.grafito, margin: '16px 0 0' }}>{t}</h3>
              <p style={{ fontFamily: TEXT, fontSize: 15, lineHeight: 1.5, color: F.muted, margin: '9px 0 0' }}>{d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────── TESTIMONIOS (slider) ───────── */
function Testimonios() {
  const quotes = [
    { q: 'Pensé que iba a ser un quilombo y fue al revés: Martín me explicó cada etapa y los tiempos se cumplieron.', n: 'Laura G.', l: 'Casa nueva · Recreo' },
    { q: 'Nos cambiaron todo el techo de tejas en una semana. Dos inviernos después, cero goteras.', n: 'Diego F.', l: 'Recambio de techo · Santo Tomé' },
    { q: 'Presupuesto claro, sin sorpresas a mitad de obra. Volvería a construir con ellos sin dudarlo.', n: 'Flia. Méndez', l: 'Ampliación · Santa Fe' },
  ];
  const [i, setI] = React.useState(0);
  const go = (d) => setI((p) => (p + d + quotes.length) % quotes.length);
  return (
    <section data-screen-label="Testimonios" style={{ background: F.blanco, padding: '64px 22px' }}>
      <Reveal><Eyebrow>Lo que dicen</Eyebrow></Reveal>
      <Reveal delay={60}>
        <div style={{ marginTop: 22, minHeight: 240 }}>
          <div style={{ fontFamily: DISP, fontWeight: 800, fontSize: 48, color: F.lino, lineHeight: 0.6, height: 22 }}>“</div>
          <p key={i} style={{ fontFamily: DISP, fontWeight: 500, fontSize: 24, lineHeight: 1.25, letterSpacing: '-0.02em', color: F.grafito, margin: '8px 0 0', minHeight: 150 }}>{quotes[i].q}</p>
          <div style={{ marginTop: 18 }}>
            <div style={{ fontFamily: TEXT, fontWeight: 700, fontSize: 15, color: F.grafito }}>{quotes[i].n}</div>
            <div style={{ fontFamily: MONO, fontSize: 11.5, color: F.muted, marginTop: 3 }}>{quotes[i].l}</div>
          </div>
        </div>
      </Reveal>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 26 }}>
        <div style={{ display: 'flex', gap: 7 }}>
          {quotes.map((_, k) => (
            <button key={k} onClick={() => setI(k)} aria-label={`Testimonio ${k + 1}`} style={{ width: k === i ? 22 : 7, height: 7, borderRadius: 99, border: 'none', padding: 0, cursor: 'pointer', background: k === i ? F.bronce : F.lino, transition: 'width .3s, background .3s' }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[['‹', -1], ['›', 1]].map(([s, d]) => (
            <button key={s} onClick={() => go(d)} style={{ width: 42, height: 42, borderRadius: 99, border: `1px solid ${F.lino}`, background: F.blanco, color: F.grafito, fontSize: 22, lineHeight: 1, cursor: 'pointer', fontFamily: TEXT }}>{s}</button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── FAQ (accordion) ───────── */
function FAQ() {
  const qs = [
    ['¿El presupuesto es cerrado o por administración?', 'Te damos un presupuesto detallado y cerrado antes de empezar. Sabés cuánto sale y en cuánto tiempo, sin sorpresas a mitad de obra.'],
    ['¿Hacen casas desde cero y también remodelaciones?', 'Las dos cosas. 14 casas llave en mano y más de 200 remodelaciones y trabajos de techo en 16 años.'],
    ['¿Necesito tener los planos o un arquitecto?', 'No. Si hace falta un profesional puntual lo coordinamos, pero el grueso lo manejamos directo con vos para que no pagues comisiones de más.'],
    ['¿En qué zona trabajan?', 'Santa Fe capital y alrededores. Para obras grandes nos movemos a toda la provincia y el país; consultanos.'],
    ['¿Cuánto tarda una casa de cero?', 'Depende del tamaño, pero una vivienda familiar suele estar entre 8 y 12 meses. Te damos un cronograma realista desde el arranque.'],
    ['¿Por qué techos de tejas y no otro techo?', 'Bien hecho, un techo de tejas dura décadas y aísla mejor. El problema es que pocos lo ejecutan bien: ahí entramos nosotros.'],
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <section data-screen-label="FAQ" style={{ background: F.blanco, padding: '20px 22px 64px' }}>
      <Reveal><Eyebrow>Preguntas frecuentes</Eyebrow></Reveal>
      <Reveal delay={60}><h2 style={{ fontFamily: DISP, fontWeight: 800, fontSize: 33, letterSpacing: '-0.035em', color: F.grafito, margin: '12px 0 24px', lineHeight: 1.05 }}>Lo que todos preguntan.</h2></Reveal>
      <div>
        {qs.map(([q, a], k) => {
          const isOpen = open === k;
          return (
            <Reveal key={k} delay={k * 40}>
              <div style={{ borderTop: `1px solid ${F.lino}` }}>
                <button onClick={() => setOpen(isOpen ? -1 : k)} style={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 16, color: F.grafito, lineHeight: 1.3 }}>{q}</span>
                  <span style={{ flexShrink: 0, marginTop: 2, width: 22, height: 22, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform .3s', color: F.bronce, fontSize: 22, lineHeight: '20px', fontFamily: TEXT }}>+</span>
                </button>
                <div style={{ overflow: 'hidden', maxHeight: isOpen ? 200 : 0, transition: 'max-height .4s cubic-bezier(.2,.7,.2,1)' }}>
                  <p style={{ fontFamily: TEXT, fontSize: 15, lineHeight: 1.55, color: F.muted, margin: '0 0 20px', paddingRight: 30 }}>{a}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ───────── CTA FINAL ───────── */
function CTA() {
  return (
    <section data-screen-label="CTA final" style={{ background: F.grafito, padding: '70px 22px' }}>
      <Reveal><Eyebrow color={F.bronceL}>Hablemos</Eyebrow></Reveal>
      <Reveal delay={60}>
        <h2 style={{ fontFamily: DISP, fontWeight: 800, fontSize: 40, letterSpacing: '-0.04em', color: F.blanco, margin: '14px 0 0', lineHeight: 1.02 }}>Contanos tu proyecto.</h2>
      </Reveal>
      <Reveal delay={130}>
        <p style={{ fontFamily: TEXT, fontSize: 17, lineHeight: 1.5, color: 'rgba(250,246,238,0.8)', margin: '18px 0 28px', maxWidth: 320 }}>
          Mandanos un WhatsApp y te respondemos nosotros mismos —no un bot— con las preguntas justas para darte un número real.
        </p>
      </Reveal>
      <Reveal delay={200}><WAButton big>Escribinos por WhatsApp</WAButton></Reveal>
      <Reveal delay={260}>
        <div style={{ fontFamily: MONO, fontSize: 13.5, color: F.bronceL, marginTop: 20 }}>+54 9 3425 19-4112</div>
      </Reveal>
    </section>
  );
}

/* ───────── FOOTER ───────── */
function Footer() {
  return (
    <footer style={{ background: F.grafito2, padding: '40px 22px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <ModuloF size={26} />
        <Wordmark size={22} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: TEXT, fontSize: 15 }}>
        <a href={WA_GENERAL} target="_blank" rel="noopener" style={{ color: 'rgba(250,246,238,0.82)', textDecoration: 'none' }}>WhatsApp · +54 9 3425 19-4112</a>
        <a href="https://instagram.com" target="_blank" rel="noopener" style={{ color: 'rgba(250,246,238,0.82)', textDecoration: 'none' }}>Instagram · @feconconstrucciones</a>
        <span style={{ color: 'rgba(250,246,238,0.82)' }}>Santa Fe capital y alrededores · Argentina</span>
        <span style={{ color: F.bronceL, fontFamily: MONO, fontSize: 13 }}>feconconstrucciones.com.ar</span>
      </div>
      <div style={{ borderTop: '1px solid rgba(250,246,238,0.12)', marginTop: 26, paddingTop: 18, fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.04em', color: 'rgba(250,246,238,0.4)' }}>
        © 2026 FECON · Febre Construcciones · Construcciones en general
      </div>
    </footer>
  );
}

/* ───────── APP ───────── */
function Landing() {
  const [scrolled, setScrolled] = React.useState(false);
  const [el, setEl] = React.useState(null);
  const onScroll = (e) => setScrolled(e.target.scrollTop > 40);
  return (
    <ScrollCtx.Provider value={el}>
      <div ref={setEl} onScroll={onScroll} style={{ height: '100%', overflowY: 'auto', background: F.blanco, WebkitOverflowScrolling: 'touch' }}>
        <Nav scrolled={scrolled} />
        <Hero />
        <KPIs />
        <Servicios />
        <PorQue />
        <Testimonios />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </ScrollCtx.Provider>
  );
}

window.FeconLanding = Landing;
