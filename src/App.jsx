import { useState, createContext, useContext } from "react";

const ThemeCtx = createContext();
const useT = () => useContext(ThemeCtx);
const TH = {
  dark: { bg: "#090b11", bgS: "#0d0f17", bgC: "#111320", bgI: "#0a0c13", brd: "#1e2235", bH: "rgba(55,194,235,0.3)", tx: "#f0f0f5", txS: "#8892a8", txM: "#505872", ac: "#37c2eb", ac2: "#13b4de", acS: "rgba(55,194,235,0.1)", sh: "rgba(0,0,0,0.5)", gr: "linear-gradient(135deg,#37c2eb,#13b4de,#06b6d4)", n: "dark" },
  light: { bg: "#f7f8fa", bgS: "#fff", bgC: "#fff", bgI: "#f0f1f5", brd: "#e2e5ee", bH: "rgba(55,194,235,0.2)", tx: "#1c2030", txS: "#5a6178", txM: "#9ca3b8", ac: "#37c2eb", ac2: "#1da8d1", acS: "rgba(55,194,235,0.08)", sh: "rgba(0,0,0,0.06)", gr: "linear-gradient(135deg,#37c2eb,#13b4de,#06b6d4)", n: "light" }
};

const ADMIN_EMAIL = "innovaciondigitalfarmacia@gmail.com";
const ADMIN_PASS = "F@rmacia.i.2026.";

const AGENCY_BRANDS = [
  { id: "1", name: "Descubre Tu Regalo", short: "DTR", color: "#D93B84", industry: "Finca Agroturistica y Cabanas", tone: "Emocional, romantico, aspiracional, magico", audience: "Parejas, turismo experiencial, escapadas romanticas", emoji: "🏡", brandVoice: "Voz romantica y emocional. Inspira deseo, emocion y reservas. No es un hotel, es una experiencia romantica y transformadora. Emojis: 💜🏡✨💑🌿", imgStyle: "warm romantic atmosphere, rustic cabins in nature, jacuzzi, couples, magical lighting, purple and pink tones, lush green mountains, La Vega Cundinamarca Colombia", sector: "B2C", colors: ["#D93B84","#77468C","#F25F29","#D93E30","#F2F2F2"], products: "Cabanas con jacuzzi privado, Spa con masajes y sauna, Restaurante, Escuela de la Felicidad, Salon de eventos", description: "Finca agroturistica en La Vega Cundinamarca. Experiencias romanticas y de bienestar en cabanas con jacuzzi, rodeadas de naturaleza.", differentiator: "Escuela de la Felicidad con 16 jardines experienciales", website: "https://descubreturegalo.co" },
  { id: "2", name: "Farmacia Institucional", short: "FI", color: "#142B73", industry: "Logistica Farmaceutica y Distribucion de Medicamentos", tone: "Profesional, claro, tecnico, confiable", audience: "EPS, IPS, clinicas, hospitales, instituciones de salud", emoji: "💊", brandVoice: "Autoridad en salud institucional. Profesional y confiable. No es una farmacia comun, es una empresa de soluciones en salud y logistica farmaceutica. Nunca sonar emocional ni informal. Emojis: 💙🏥✅💊", imgStyle: "institutional medical, navy blue #142B73 and red #F21628 and green #93BF34, professional corporate, pharmaceutical logistics, clean and trustworthy", sector: "B2B", colors: ["#F21628","#142B73","#93BF34","#D9BD30","#F2F2F2"], products: "Medicamentos, dispositivos medicos (apositos Aquacel), insumos hospitalarios, logistica farmaceutica, dispensacion de medicamentos", description: "Especialistas en Salud. Mas de 20 anos de experiencia en logistica y dispensacion de medicamentos para instituciones de salud en Colombia.", differentiator: "Mas de 20 anos de experiencia, una de las carteras de productos mas completas del sector farmaceutico, logistica especializada", website: "https://farmaciainstitucional.com" },
  { id: "3", name: "NeuroHeal", short: "NH", color: "#055941", industry: "Centro Fonoaudiologico Infantil", tone: "Cientifico accesible, calido, empatico", audience: "Padres de ninos 0-18 anos con trastornos de comunicacion, habla y lenguaje", emoji: "🧒", brandVoice: "Profesional pero cercano y empatico. La comunicacion transforma vidas. Combina ciencia con terapias alternativas. Emojis: 🧒💚🗣️🧠✨", imgStyle: "children therapy, warm green tones #055941 #14D9A1 #48D96C, kids communicating, professional yet warm, therapeutic environment", sector: "B2C", colors: ["#055941","#14D9A1","#48D96C","#A6D95B","#F2F2F2"], products: "Evaluacion fonoaudiologica, terapia del habla y lenguaje, programa Neuropreme, terapias alternativas (mindfulness, musicoterapia, arte terapia, intervencion asistida con animales, yoga)", description: "Centro fonoaudiologico especializado en evaluacion, diagnostico y tratamiento de trastornos de la comunicacion en ninos y adolescentes.", differentiator: "Combinacion unica de fonoaudiologia convencional con terapias alternativas y programa Neuropreme de neurodesarrollo", website: "https://www.neurohealcolombia.com" },
  { id: "4", name: "Medighan S.A.S.", short: "MG", color: "#05DBF2", industry: "Bienestar Integral y Productos de Bienestar", tone: "Emocional, calido, espiritual, premium, inspirador", audience: "Personas interesadas en bienestar integral, transformacion personal", emoji: "🧘", brandVoice: "Espiritual y premium. No vende productos, vende bienestar, transformacion, rituales y conexion personal. Nunca sonar frio ni clinico. Emojis: 🧘✨💆🌿💫", imgStyle: "wellness spiritual, cyan #05DBF2 and green tones, premium aesthetic, soft lighting, mindfulness, aromatherapy, peaceful", sector: "B2C", colors: ["#05DBF2","#02590F","#0BD904","#078C03","#ABD904"], products: "Productos de bienestar mental, fisico y espiritual, aromaterapia, productos infantiles, herramientas de autocuidado", description: "Empresa colombiana dedicada a importar y desarrollar productos innovadores para el bienestar integral mental, fisico y espiritual.", differentiator: "Enfoque integral en bienestar con productos para todas las dimensiones: mental, fisica, espiritual y del hogar", website: "https://medighan.com" },
  { id: "5", name: "Equilibrio Natural", short: "EN", color: "#62A632", industry: "Neurotransformacion y Bienestar Sensorial", tone: "Consciente, transformador, sensorial, empoderador", audience: "Personas 30-55 interesadas en transformacion personal y bienestar", emoji: "🌿", brandVoice: "Guia de neurotransformacion. Programa tu mente para la vida que deseas. Transformacion a traves de los 5 sentidos. Emojis: 🌿🧠✨🍃🧘‍♀️", imgStyle: "green tones #62A632 #94BF75 #8FBF26, nature, mindfulness, sensorial experience, peaceful, transformation, botanical", sector: "B2C", colors: ["#62A632","#94BF75","#BFD9AD","#8FBF26","#F2F2F2"], products: "Programacion auditiva (afirmaciones, sonidos), programacion visual, programacion olfativa (aromas), programacion gustativa, programacion kinestesica, productos sensoriales", description: "Neurotransformacion a traves de los sentidos. Reprograma pensamientos, emociones y habitos con estimulos sensoriales intencionales.", differentiator: "Unica marca enfocada en neurotransformacion a traves de los 5 sentidos: auditivo, visual, olfativo, gustativo y kinestesico", website: "https://www.instagram.com/equilibrionaturalcol_/" },
];

const EMOJIS = ["🎁","💊","🧠","🏥","🌿","🛒","📱","🎯","💎","🚀","🏠","🎵","📚","✈️","🍕","⚡","🌸","🧪","💼","🎨"];
const CTYPES = [
  { id: "post_visual", label: "Post + Imagen", icon: "🖼️", fmt: "visual" },
  { id: "carousel", label: "Carrusel", icon: "🎠", fmt: "carousel" },
  { id: "reel", label: "Reel / Story", icon: "🎬", fmt: "reel" },
  { id: "post_text", label: "Copy + Hashtags", icon: "✍️", fmt: "text" },
  { id: "ad", label: "Anuncio", icon: "📢", fmt: "visual" },
  { id: "email", label: "Email", icon: "✉️", fmt: "text" },
];
const PLANS = [
  { id: "free", name: "Starter", price: "$0", desc: "Para empezar", color: "#8892a8", brands: 1, features: ["1 marca","10 posts/mes","Copy + Hashtags","Soporte email"] },
  { id: "pro", name: "Pro", price: "$29", desc: "Para marcas en crecimiento", color: "#37c2eb", brands: 3, pop: true, features: ["3 marcas","100 posts/mes","Imágenes AI (Gemini)","Carruseles y Reels","Branding Kit completo","Soporte prioritario"] },
  { id: "agency", name: "Agency", price: "$79", desc: "Para agencias digitales", color: "#8b5cf6", brands: 99, features: ["Marcas ilimitadas","Posts ilimitados","Imágenes AI ilimitadas","Todos los formatos","Base de Conocimiento","Calendario","Multi-usuario (5 seats)","API access","Soporte dedicado 24/7"] },
];

const Ic = ({ name, size = 18 }) => {
  const d = { sparkle: "M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z", copy: "M9 9h13v13H9zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1", check: "M20 6L9 17l-5-5", menu: "M3 6h18M3 12h18M3 18h18", x: "M18 6L6 18M6 6l12 12", sun: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v2m0 18v2m-9-11H1m22 0h-2", moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z", logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9", chevL: "M15 18l-6-6 6-6", chevR: "M9 18l6-6-6-6", plus: "M12 5v14M5 12h14", trash: "M3 6h18M8 6V4h8v2m1 0v14H7V6", edit: "M11 4H4v16h16v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z", users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", grid: "M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z", palette: "M12 2L2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5", factory: "M2 7h20v14H2zM16 7V5a4 4 0 0 0-8 0v2", settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", card: "M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM1 10h22", back: "M19 12H5M12 19l-7-7 7-7", user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0", shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01", zap: "M13 2 3 14h9l-1 8 10-12h-9l1-8z", book: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z", ar: "M5 12h14M12 5l7 7-7 7" };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d[name] || ""}/></svg>;
};
const Spin = () => <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin .8s linear infinite" }}/>;
const Btn = ({ children, primary, danger, ghost, onClick, style: s, disabled }) => { const t = useT(); return <button onClick={onClick} disabled={disabled} style={{ padding: "10px 22px", background: danger ? "#ef4444" : primary ? t.gr : ghost ? "transparent" : t.bgC, color: danger || primary ? "#fff" : ghost ? t.txS : t.tx, border: ghost ? "none" : danger || primary ? "none" : `1px solid ${t.brd}`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: disabled ? "default" : "pointer", display: "inline-flex", alignItems: "center", gap: 8, opacity: disabled ? .5 : 1, boxShadow: primary ? "0 4px 20px rgba(55,194,235,.25)" : "none", transition: "all .2s", ...s }}>{children}</button>; };
const Card = ({ children, style: s, onClick }) => { const t = useT(); return <div onClick={onClick} style={{ background: t.bgC, border: `1px solid ${t.brd}`, borderRadius: 14, padding: 20, boxShadow: `0 2px 12px ${t.sh}`, cursor: onClick ? "pointer" : "default", ...s }}>{children}</div>; };
const Input = ({ value, onChange, placeholder, type, style: s, onKeyDown }) => { const t = useT(); return <input value={value} onChange={onChange} onKeyDown={onKeyDown} type={type} placeholder={placeholder} style={{ padding: "12px 16px", background: t.bgI, border: `1px solid ${t.brd}`, borderRadius: 10, color: t.tx, fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", ...s }} onFocus={e => e.target.style.borderColor = t.ac} onBlur={e => e.target.style.borderColor = t.brd}/>; };
const Textarea = ({ value, onChange, placeholder, rows }) => { const t = useT(); return <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows || 3} style={{ padding: "12px 16px", background: t.bgI, border: `1px solid ${t.brd}`, borderRadius: 10, color: t.tx, fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}/>; };
const Badge = ({ children, color }) => <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: (color || "#37c2eb") + "15", color: color || "#37c2eb" }}>{children}</span>;
const Label = ({ children, req }) => { const t = useT(); return <div style={{ fontSize: 12, fontWeight: 600, color: t.txM, marginBottom: 6 }}>{children}{req && <span style={{ color: "#ef4444" }}> *</span>}</div>; };
const Section = ({ title, sub, right, children }) => { const t = useT(); return <div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sub ? 6 : 20, flexWrap: "wrap", gap: 10 }}><h2 style={{ fontSize: 24, fontWeight: 700, color: t.tx, margin: 0 }}>{title}</h2>{right}</div>{sub && <p style={{ color: t.txS, fontSize: 14, margin: "0 0 22px" }}>{sub}</p>}{children}</div>; };
const CopyBtn = ({ text, label }) => { const t = useT(); const [c, setC] = useState(false); return <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: c ? "rgba(55,194,235,.1)" : t.acS, border: `1px solid ${c ? "rgba(55,194,235,.2)" : t.bH}`, borderRadius: 10, color: c ? "#37c2eb" : t.ac, fontSize: 12, fontWeight: 600, cursor: "pointer" }}><Ic name={c ? "check" : "copy"} size={14}/> {c ? "¡Copiado!" : (label || "Copiar")}</button>; };
const Logo = ({ size = 32 }) => <img src="/logo.jpg" alt="DataGrowth" style={{ width: size, height: size, borderRadius: size * 0.25, objectFit: "cover" }}/>;

// ══════ LANDING PAGE (Supabase-inspired) ══════
const Landing = ({ onLogin, onRegister, dark, setDark }) => {
  const t = useT();
  const features = [
    { icon: "🖼️", title: "Imágenes AI", desc: "Genera fotos profesionales con Gemini para cada post, carrusel y story." },
    { icon: "✍️", title: "Copy Experto", desc: "Textos nivel agencia con emojis estratégicos, ganchos y CTAs que convierten." },
    { icon: "🎬", title: "Storyboards", desc: "Guiones de reels escena por escena con indicaciones de cámara y audio." },
    { icon: "🎠", title: "Carruseles", desc: "5 slides optimizados con estructura gancho-valor-CTA." },
    { icon: "🏢", title: "Multi-marca", desc: "Gestiona múltiples marcas desde un solo panel, cada una con su voz." },
    { icon: "📊", title: "Branding Kit", desc: "Configura tono, audiencia, colores y personalidad. La IA aprende de ti." },
  ];

  return (
    <div style={{ background: t.bg, minHeight: "100vh", fontFamily: "'Segoe UI',system-ui,sans-serif", color: t.tx }}>
      {/* NAV */}
      <nav style={{ padding: "16px 0", borderBottom: `1px solid ${t.brd}`, position: "sticky", top: 0, background: t.bg + "ee", backdropFilter: "blur(12px)", zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden" }}><Logo size={32}/></div>
            <span style={{ fontSize: 16, fontWeight: 700 }}>DataGrowth</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div onClick={() => setDark(!dark)} style={{ cursor: "pointer", color: t.txM, padding: 6 }}><Ic name={dark ? "sun" : "moon"} size={16}/></div>
            <Btn ghost onClick={onLogin} style={{ fontSize: 13 }}>Iniciar sesión</Btn>
            <Btn primary onClick={onRegister} style={{ fontSize: 13, padding: "8px 18px" }}>Empezar gratis</Btn>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: t.ac, borderRadius: "50%", filter: "blur(180px)", opacity: .06, pointerEvents: "none" }}/>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: t.bgC, border: `1px solid ${t.brd}`, borderRadius: 50, padding: "6px 18px 6px 8px", fontSize: 13, color: t.txS, marginBottom: 28 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.ac, animation: "pulse 2s infinite" }}/> Plataforma AI para agencias digitales
        </div>
        <h1 style={{ fontSize: "clamp(36px,5.5vw,64px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: -2, marginBottom: 20 }}>Crea contenido en minutos{" "}<span style={{ background: t.gr, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Escala a miles</span></h1>
        <p style={{ fontSize: 18, color: t.txS, maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.6 }}>DataGrowth genera posts, carruseles, reels e imágenes profesionales con IA para múltiples marcas. Todo desde un solo lugar.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Btn primary onClick={onRegister} style={{ fontSize: 16, padding: "14px 32px" }}>Empezar gratis</Btn>
          <Btn onClick={onLogin} style={{ fontSize: 16, padding: "14px 32px" }}>Iniciar sesión <Ic name="ar" size={16}/></Btn>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: t.ac, textTransform: "uppercase", letterSpacing: 3, marginBottom: 12 }}>Funcionalidades</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>Todo lo que tu agencia necesita</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {features.map((f, i) => (
            <Card key={i} style={{ padding: 28, transition: "border-color .3s" }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: t.tx, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: t.txS, lineHeight: 1.6 }}>{f.desc}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: t.ac, textTransform: "uppercase", letterSpacing: 3, marginBottom: 12 }}>Precios</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>Planes simples y transparentes</h2>
          <p style={{ fontSize: 16, color: t.txS, marginTop: 10 }}>Empieza gratis. Escala cuando lo necesites.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {PLANS.map(p => (
            <Card key={p.id} style={{ position: "relative", border: p.pop ? `2px solid ${p.color}` : `1px solid ${t.brd}`, textAlign: "center", padding: 32, overflow: "visible" }}>
              {p.pop && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: p.color, color: "#fff", padding: "5px 20px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>Más popular</div>}
              <div style={{ fontSize: 18, fontWeight: 600, color: t.tx, marginBottom: 4, paddingTop: p.pop ? 8 : 0 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: t.txS, marginBottom: 16 }}>{p.desc}</div>
              <div style={{ fontSize: 44, fontWeight: 800, color: p.color, marginBottom: 4 }}>{p.price}<span style={{ fontSize: 16, fontWeight: 400, color: t.txM }}>/mes</span></div>
              <div style={{ borderTop: `1px solid ${t.brd}`, margin: "20px 0", paddingTop: 20 }}>
                {p.features.map((f, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 14, color: t.tx }}><span style={{ color: t.ac }}>✓</span>{f}</div>)}
              </div>
              <Btn primary={p.pop} onClick={() => onRegister(p)} style={{ width: "100%", justifyContent: "center" }}>Empezar con {p.name}</Btn>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <Card style={{ textAlign: "center", padding: "60px 40px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 500, height: 300, background: t.ac, borderRadius: "50%", filter: "blur(140px)", opacity: .08, pointerEvents: "none" }}/>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, position: "relative" }}>Empieza a crear contenido <span style={{ color: t.ac }}>hoy</span></h2>
          <p style={{ fontSize: 16, color: t.txS, marginBottom: 28, position: "relative" }}>Únete a las agencias que ya generan contenido profesional con IA.</p>
          <Btn primary onClick={onRegister} style={{ fontSize: 16, padding: "14px 36px", position: "relative" }}>Crear cuenta gratis</Btn>
        </Card>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${t.brd}`, padding: "40px 0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, overflow: "hidden" }}><Logo size={28}/></div>
              <span style={{ fontSize: 15, fontWeight: 700, color: t.tx }}>DataGrowth</span>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <a href="https://instagram.com/datagrowth.agency" target="_blank" rel="noopener noreferrer" style={{ color: t.txS, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = "#E1306C"} onMouseLeave={e => e.currentTarget.style.color = t.txS}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                @datagrowth.agency
              </a>
              <a href="https://x.com/DataGrowth_" target="_blank" rel="noopener noreferrer" style={{ color: t.txS, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = t.tx} onMouseLeave={e => e.currentTarget.style.color = t.txS}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                @DataGrowth_
              </a>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${t.brd}`, paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <p style={{ fontSize: 12, color: t.txM }}>© 2026 DataGrowth by DataGrowth Agency. Todos los derechos reservados.</p>
            <p style={{ fontSize: 12, color: t.txM }}>Powered by Claude + Gemini</p>
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
};

// ══════ AUTH ══════
const Auth = ({ mode, setMode, onAuth, dark, setDark, selPlan }) => {
  const t = useT();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [ll, setLl] = useState(false);
  const [sent, setSent] = useState(false);
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const isPaid = selPlan && selPlan.id !== "free";

  const formatCard = (v) => { const n = v.replace(/\D/g, "").slice(0, 16); return n.replace(/(.{4})/g, "$1 ").trim(); };
  const formatExp = (v) => { const n = v.replace(/\D/g, "").slice(0, 4); return n.length > 2 ? n.slice(0, 2) + "/" + n.slice(2) : n; };

  const go = () => {
    if (mode === "forgot") { setSent(true); return; }
    if (!email || !pass) return;
    if (mode === "register" && !name) return;
    if (mode === "register" && isPaid && (!cardNum || !cardExp || !cardCvc)) return;
    setLl(true);
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && pass === ADMIN_PASS;
    setTimeout(() => onAuth({ name: mode === "register" ? name : email.split("@")[0], email, company, phone, role: isAdmin ? "agency" : "client" }), 800);
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ position: "fixed", top: -200, left: -100, width: 600, height: 600, background: t.ac, borderRadius: "50%", filter: "blur(180px)", opacity: .06 }}/>
      <div style={{ width: 440, padding: 44, background: t.bgC, border: `1px solid ${t.brd}`, borderRadius: 20, zIndex: 1, position: "relative", boxShadow: `0 20px 60px ${t.sh}` }}>
        <div style={{ position: "absolute", top: 16, right: 16, cursor: "pointer", color: t.txM, padding: 6, borderRadius: 8, background: t.bgI }} onClick={() => setDark(!dark)}><Ic name={dark ? "sun" : "moon"} size={16}/></div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, overflow: "hidden" }}><Logo size={44}/></div>
          <div><div style={{ fontSize: 20, fontWeight: 700, color: t.tx }}>DataGrowth</div><div style={{ fontSize: 11, color: t.ac, textTransform: "uppercase", letterSpacing: 2 }}>Creative Agency</div></div>
        </div>

        {mode === "login" && <>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.tx, marginBottom: 4 }}>Bienvenido de vuelta</div>
          <p style={{ fontSize: 14, color: t.txS, marginBottom: 24 }}>Ingresa a tu cuenta para gestionar tus marcas.</p>
          <div style={{ marginBottom: 16 }}><Label>Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="tu@empresa.com" onKeyDown={e => e.key === "Enter" && go()}/></div>
          <div style={{ marginBottom: 8 }}><Label>Contraseña</Label><Input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="••••••••" onKeyDown={e => e.key === "Enter" && go()}/></div>
          <div onClick={() => setMode("forgot")} style={{ fontSize: 13, color: t.ac, cursor: "pointer", textAlign: "right", marginBottom: 24 }}>¿Olvidaste tu contraseña?</div>
          <button onClick={go} style={{ width: "100%", padding: 16, background: t.gr, color: "#fff", border: "none", borderRadius: 50, fontSize: 16, fontWeight: 600, cursor: "pointer", opacity: (!email || !pass) ? .5 : 1, boxShadow: "0 4px 20px rgba(55,194,235,.25)" }}>{ll ? "Ingresando..." : "Iniciar sesión"}</button>
          <div style={{ textAlign: "center", marginTop: 20 }}><span style={{ color: t.txM, fontSize: 13 }}>¿No tienes cuenta? </span><span onClick={() => setMode("register")} style={{ color: t.ac, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Regístrate gratis</span></div>
        </>}

        {mode === "register" && <>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.tx, marginBottom: 4 }}>Crea tu cuenta</div>
          <p style={{ fontSize: 14, color: t.txS, marginBottom: selPlan ? 16 : 24 }}>{isPaid ? "Completa tu registro y datos de pago." : "Empieza gratis y genera contenido con IA."}</p>
          {selPlan && <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: t.bgI, borderRadius: 12, border: `1px solid ${selPlan.color}30`, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: selPlan.color }}/>
              <div><div style={{ fontSize: 14, fontWeight: 600, color: t.tx }}>Plan {selPlan.name}</div><div style={{ fontSize: 11, color: t.txM }}>{selPlan.id === "free" ? "Gratis para siempre" : `Se cobrará ${selPlan.price}/mes`}</div></div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: selPlan.color }}>{selPlan.price}<span style={{ fontSize: 11, fontWeight: 400, color: t.txM }}>/mes</span></div>
          </div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div><Label req>Nombre</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre"/></div>
            <div><Label>Empresa</Label><Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Empresa"/></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div><Label req>Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="tu@empresa.com"/></div>
            <div><Label>Teléfono</Label><Input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+57 300 000 0000"/></div>
          </div>
          <div style={{ marginBottom: isPaid ? 20 : 24 }}><Label req>Contraseña</Label><Input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Mínimo 8 caracteres"/></div>

          {isPaid && <>
            <div style={{ borderTop: `1px solid ${t.brd}`, paddingTop: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 18 }}>💳</span>
                <div style={{ fontSize: 16, fontWeight: 600, color: t.tx }}>Datos de pago</div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                  <div style={{ padding: "2px 8px", borderRadius: 4, background: "#1a1f6c", fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>VISA</div>
                  <div style={{ padding: "2px 8px", borderRadius: 4, background: "#eb001b", fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>MC</div>
                  <div style={{ padding: "2px 8px", borderRadius: 4, background: "#006fcf", fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>AMEX</div>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}><Label req>Nombre en la tarjeta</Label><Input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="JULIAN PEREZ"/></div>
              <div style={{ marginBottom: 14 }}><Label req>Número de tarjeta</Label><Input value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))} placeholder="4242 4242 4242 4242" style={{ fontFamily: "monospace", letterSpacing: 2 }}/></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div><Label req>Vencimiento</Label><Input value={cardExp} onChange={e => setCardExp(formatExp(e.target.value))} placeholder="MM/AA" style={{ fontFamily: "monospace" }}/></div>
                <div><Label req>CVC</Label><Input value={cardCvc} onChange={e => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" type="password" style={{ fontFamily: "monospace" }}/></div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: t.bgI, borderRadius: 10, border: `1px solid ${t.brd}`, marginBottom: 6 }}>
                <span style={{ fontSize: 14 }}>🔒</span>
                <div style={{ fontSize: 12, color: t.txM }}>Pago seguro con encriptación SSL 256-bit. Tu información está protegida.</div>
              </div>
            </div>
          </>}

          <button onClick={go} style={{ width: "100%", padding: 16, background: t.gr, color: "#fff", border: "none", borderRadius: 50, fontSize: 16, fontWeight: 600, cursor: "pointer", opacity: (!email || !pass || !name || (isPaid && (!cardNum || !cardExp || !cardCvc))) ? .5 : 1, boxShadow: "0 4px 20px rgba(55,194,235,.25)" }}>{ll ? "Procesando..." : isPaid ? `Pagar ${selPlan.price}/mes y crear cuenta` : "Crear cuenta gratis"}</button>
          {isPaid && <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: t.txM }}>Puedes cancelar en cualquier momento. Sin permanencia.</div>}
          <div style={{ textAlign: "center", marginTop: 16 }}><span style={{ color: t.txM, fontSize: 13 }}>¿Ya tienes cuenta? </span><span onClick={() => setMode("login")} style={{ color: t.ac, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Inicia sesión</span></div>
        </>}

        {mode === "forgot" && <>
          <div onClick={() => setMode("login")} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: t.txM, fontSize: 13, marginBottom: 20 }}><Ic name="back" size={16}/> Volver</div>
          {!sent ? <>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.tx, marginBottom: 4 }}>Recuperar contraseña</div>
            <p style={{ fontSize: 14, color: t.txS, marginBottom: 24 }}>Te enviaremos un link para restablecerla.</p>
            <div style={{ marginBottom: 24 }}><Label>Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="tu@empresa.com"/></div>
            <button onClick={go} style={{ width: "100%", padding: 16, background: t.gr, color: "#fff", border: "none", borderRadius: 50, fontSize: 16, fontWeight: 600, cursor: "pointer", opacity: !email ? .5 : 1 }}>Enviar link</button>
          </> : <>
            <div style={{ textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: t.tx, marginBottom: 8 }}>¡Revisa tu email!</div>
              <div style={{ fontSize: 14, color: t.txS, marginBottom: 20 }}>Te enviamos un link de recuperación a <strong style={{ color: t.tx }}>{email}</strong></div>
              <Btn primary onClick={() => { setMode("login"); setSent(false); }}>Volver al login</Btn>
            </div>
          </>}
        </>}
      </div>
    </div>
  );
};

// ══════ BRAND EDITOR ══════
const ALLCOLORS = ["#ec4899","#f43f5e","#ef4444","#f97316","#f59e0b","#eab308","#84cc16","#22c55e","#10b981","#14b8a6","#06b6d4","#0ea5e9","#3b82f6","#6366f1","#8b5cf6","#a855f7","#d946ef","#e11d48","#0d9488","#059669","#2563eb","#4f46e5","#7c3aed","#9333ea","#c026d3","#db2777","#b91c1c","#92400e","#1e3a5f","#164e63","#1e1b4b","#312e81","#4a044e","#831843","#000000","#374151","#6b7280","#9ca3af","#d1d5db","#ffffff"];

const UploadZone = ({ label, icon, files, onAdd, multi }) => {
  const t = useT();
  const addFile = () => { const name = prompt(`Nombre del archivo ${label.toLowerCase()}:`); if (name) onAdd(name); };
  return (
    <div style={{ marginBottom: 16 }}>
      <Label>{label}</Label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {(files || []).map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: t.bgI, border: `1px solid ${t.brd}`, borderRadius: 10, fontSize: 12, color: t.tx }}>
            <span style={{ fontSize: 16 }}>{icon}</span> {f}
            <span onClick={() => { const nf = [...files]; nf.splice(i, 1); onAdd(null, nf); }} style={{ cursor: "pointer", color: "#ef4444", fontSize: 14 }}>×</span>
          </div>
        ))}
        <div onClick={addFile} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: `2px dashed ${t.brd}`, borderRadius: 10, cursor: "pointer", color: t.txM, fontSize: 12, fontWeight: 500, transition: "border-color .2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = t.ac} onMouseLeave={e => e.currentTarget.style.borderColor = t.brd}>
          <span style={{ fontSize: 18 }}>+</span> {files?.length ? "Agregar más" : `Subir ${label.toLowerCase()}`}
        </div>
      </div>
      <div style={{ fontSize: 11, color: t.txM, marginTop: 4 }}>Formatos: PNG, JPG, PDF, MP4 · Máx 50MB. Se habilitará con Supabase Storage.</div>
    </div>
  );
};

const ColorPalette = ({ colors, onChange }) => {
  const t = useT();
  const [adding, setAdding] = useState(false);
  const addColor = (c) => { if (!colors.includes(c)) onChange([...colors, c]); setAdding(false); };
  const removeColor = (i) => { const nc = [...colors]; nc.splice(i, 1); onChange(nc); };
  return (
    <div style={{ marginBottom: 16 }}>
      <Label>Paleta de colores de la marca</Label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        {colors.map((c, i) => (
          <div key={i} style={{ position: "relative" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: c, border: `2px solid ${t.brd}` }}/>
            <div style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#ef4444", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, cursor: "pointer", fontWeight: 700 }} onClick={() => removeColor(i)}>×</div>
            <div style={{ fontSize: 9, color: t.txM, textAlign: "center", marginTop: 2, fontFamily: "monospace" }}>{c}</div>
          </div>
        ))}
        <div onClick={() => setAdding(!adding)} style={{ width: 44, height: 44, borderRadius: 10, border: `2px dashed ${t.brd}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: t.txM, fontSize: 22 }}>+</div>
      </div>
      {adding && (
        <div style={{ padding: 14, background: t.bgI, borderRadius: 12, border: `1px solid ${t.brd}` }}>
          <div style={{ fontSize: 12, color: t.txM, marginBottom: 8 }}>Selecciona un color o escribe hex:</div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
            {ALLCOLORS.map(c => <div key={c} onClick={() => addColor(c)} style={{ width: 28, height: 28, borderRadius: 6, background: c, cursor: "pointer", border: "1px solid rgba(255,255,255,.1)" }}/>)}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Input placeholder="#FF5733" style={{ flex: 1, fontSize: 12, padding: "8px 12px", fontFamily: "monospace" }} onKeyDown={e => { if (e.key === "Enter" && e.target.value.match(/^#[0-9A-Fa-f]{6}$/)) { addColor(e.target.value); e.target.value = ""; }}}/>
            <Btn small onClick={() => setAdding(false)}>Cerrar</Btn>
          </div>
        </div>
      )}
    </div>
  );
};

const BrandEditor = ({ brand, onSave, onClose, isNew }) => {
  const t = useT();
  const [step, setStep] = useState(1);
  const [f, setF] = useState(brand || {
    name: "", short: "", colors: [ALLCOLORS[0]], industry: "", tone: "", audience: "", emoji: "🎯",
    brandVoice: "", imgStyle: "", website: "", instagram: "", facebook: "", tiktok: "", sector: "B2C",
    slogan: "", products: "", differentiator: "", typography: "", values: "",
    logos: [], backgrounds: [], productPhotos: [], videos: [], socialPieces: [],
    brandManuals: [], catalogs: [], strategyDocs: [], productInfo: ""
  });
  const u = (k, v) => setF({ ...f, [k]: v });
  const addFile = (key, name, replace) => { if (replace) { u(key, replace); } else if (name) { u(key, [...(f[key] || []), name]); } };

  const steps = [
    { n: 1, label: "Identidad", icon: "🏢" },
    { n: 2, label: "Visual", icon: "🎨" },
    { n: 3, label: "Voz", icon: "🎯" },
    { n: 4, label: "Contenido", icon: "📁" },
    { n: 5, label: "Estrategia", icon: "⚡" },
  ];
  const totalSteps = steps.length;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(4px)" }}>
      <div style={{ width: 660, maxHeight: "92vh", background: t.bgC, border: `1px solid ${t.brd}`, borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 28px", borderBottom: `1px solid ${t.brd}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: t.tx, margin: 0 }}>{isNew ? "Crear marca" : "Editar marca"}</h3>
          <div onClick={onClose} style={{ cursor: "pointer", color: t.txM }}><Ic name="x" size={20}/></div>
        </div>
        <div style={{ display: "flex", gap: 2, padding: "10px 16px", borderBottom: `1px solid ${t.brd}`, overflowX: "auto" }}>
          {steps.map(s => (
            <div key={s.n} onClick={() => setStep(s.n)} style={{ padding: "7px 14px", borderRadius: 8, background: step === s.n ? t.acS : "transparent", color: step === s.n ? t.ac : t.txM, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 14 }}>{s.icon}</span> {s.label}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: 28 }}>

          {step === 1 && <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div><Label req>Nombre de la marca</Label><Input value={f.name} onChange={e => u("name", e.target.value)} placeholder="Mi Empresa S.A.S."/></div>
              <div><Label req>Abreviatura</Label><Input value={f.short} onChange={e => u("short", e.target.value.toUpperCase().slice(0, 4))} placeholder="MES"/></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div><Label>Industria</Label><Input value={f.industry} onChange={e => u("industry", e.target.value)} placeholder="Tecnología, Salud, Moda..."/></div>
              <div><Label>Slogan</Label><Input value={f.slogan} onChange={e => u("slogan", e.target.value)} placeholder="Tu slogan"/></div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <Label>Emoji</Label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {EMOJIS.map(e => <div key={e} onClick={() => u("emoji", e)} style={{ width: 38, height: 38, borderRadius: 8, background: f.emoji === e ? t.acS : t.bgI, border: f.emoji === e ? `2px solid ${t.ac}` : `1px solid ${t.brd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer" }}>{e}</div>)}
              </div>
            </div>
            <UploadZone label="Logos" icon="🖼️" files={f.logos} onAdd={(n, r) => addFile("logos", n, r)} multi/>
          </>}

          {step === 2 && <>
            <ColorPalette colors={f.colors || []} onChange={v => u("colors", v)}/>
            <div style={{ marginBottom: 16 }}>
              <Label>Tipografías</Label>
              <Textarea value={f.typography} onChange={e => u("typography", e.target.value)} placeholder="Ej: Títulos: Montserrat Bold / Cuerpo: Open Sans Regular / Acentos: Playfair Display" rows={2}/>
            </div>
            <UploadZone label="Archivos de tipografías" icon="🔤" files={f.typographyFiles || []} onAdd={(n, r) => addFile("typographyFiles", n, r)} multi/>
            <UploadZone label="Fondos y texturas" icon="🎨" files={f.backgrounds} onAdd={(n, r) => addFile("backgrounds", n, r)} multi/>
            <div>
              <Label>Estilo de imagen AI</Label>
              <Textarea value={f.imgStyle} onChange={e => u("imgStyle", e.target.value)} placeholder="Describe cómo deben verse las imágenes generadas por IA para tu marca..." rows={2}/>
            </div>
          </>}

          {step === 3 && <>
            <div style={{ marginBottom: 14 }}><Label>Tono de voz</Label><Textarea value={f.tone} onChange={e => u("tone", e.target.value)} placeholder="¿Cómo le habla tu marca al cliente? Ej: Profesional pero cercano, divertido, serio..." rows={2}/></div>
            <div style={{ marginBottom: 14 }}><Label>Audiencia objetivo</Label><Textarea value={f.audience} onChange={e => u("audience", e.target.value)} placeholder="¿Quién es tu cliente ideal? Ej: Mujeres 25-45 en Colombia..." rows={2}/></div>
            <div style={{ marginBottom: 14 }}><Label>Valores de marca</Label><Textarea value={f.values} onChange={e => u("values", e.target.value)} placeholder="Ej: Confianza, innovación, cercanía..." rows={2}/></div>
            <div><Label>Personalidad de la IA</Label><Textarea value={f.brandVoice} onChange={e => u("brandVoice", e.target.value)} placeholder="¿Cómo debe hablar la IA cuando genera contenido? Ej: Habla como un experto cercano, usa emojis de salud..." rows={3}/></div>
          </>}

          {step === 4 && <>
            <UploadZone label="Fotos de productos o servicios" icon="📸" files={f.productPhotos} onAdd={(n, r) => addFile("productPhotos", n, r)} multi/>
            <UploadZone label="Videos" icon="🎬" files={f.videos} onAdd={(n, r) => addFile("videos", n, r)} multi/>
            <UploadZone label="Piezas de redes sociales" icon="📱" files={f.socialPieces} onAdd={(n, r) => addFile("socialPieces", n, r)} multi/>
            <UploadZone label="Manuales de marca" icon="📘" files={f.brandManuals} onAdd={(n, r) => addFile("brandManuals", n, r)} multi/>
            <UploadZone label="Catálogos y listas de precios" icon="📋" files={f.catalogs} onAdd={(n, r) => addFile("catalogs", n, r)} multi/>
            <UploadZone label="Investigaciones y research" icon="🔍" files={f.researchDocs || []} onAdd={(n, r) => addFile("researchDocs", n, r)} multi/>
            <div><Label>Información de productos o servicios</Label><Textarea value={f.productInfo} onChange={e => u("productInfo", e.target.value)} placeholder="Describe tus productos/servicios principales, características, precios..." rows={3}/></div>
          </>}

          {step === 5 && <>
            <div style={{ marginBottom: 14 }}><Label>Descripción de la marca</Label><Textarea value={f.description || ""} onChange={e => u("description", e.target.value)} placeholder="¿Qué hace tu empresa? Describe brevemente tu marca..." rows={2}/></div>
            <div style={{ marginBottom: 14 }}><Label>Productos / servicios principales</Label><Textarea value={f.products} onChange={e => u("products", e.target.value)} placeholder="Lista tus productos o servicios más importantes..." rows={2}/></div>
            <div style={{ marginBottom: 14 }}><Label>¿Qué te diferencia?</Label><Textarea value={f.differentiator} onChange={e => u("differentiator", e.target.value)} placeholder="¿Qué hace única a tu marca frente a la competencia?" rows={2}/></div>
            <UploadZone label="Documentos de estrategia" icon="📊" files={f.strategyDocs} onAdd={(n, r) => addFile("strategyDocs", n, r)} multi/>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div><Label>Página web</Label><Input value={f.website} onChange={e => u("website", e.target.value)} placeholder="www.miempresa.com"/></div>
              <div><Label>Instagram</Label><Input value={f.instagram} onChange={e => u("instagram", e.target.value)} placeholder="@miempresa"/></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div><Label>Facebook</Label><Input value={f.facebook} onChange={e => u("facebook", e.target.value)} placeholder="facebook.com/miempresa"/></div>
              <div><Label>TikTok</Label><Input value={f.tiktok} onChange={e => u("tiktok", e.target.value)} placeholder="@miempresa"/></div>
            </div>
            <UploadZone label="Captura de página web" icon="🌐" files={f.websiteScreenshot || []} onAdd={(n, r) => addFile("websiteScreenshot", n, r)} multi/>

            {/* Preview */}
            <div style={{ padding: 16, background: t.bgI, borderRadius: 12, border: `1px solid ${t.brd}`, marginTop: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: t.txM, marginBottom: 10 }}>Preview de tu marca</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: (f.colors && f.colors[0]) || "#888", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{f.emoji}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: t.tx }}>{f.name || "Nombre"}</div>
                  <div style={{ fontSize: 12, color: t.txS }}>{f.industry || "Industria"}</div>
                </div>
                <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
                  {(f.colors || []).map((c, i) => <div key={i} style={{ width: 20, height: 20, borderRadius: 5, background: c }}/>)}
                </div>
              </div>
            </div>
          </>}
        </div>
        <div style={{ padding: "14px 28px", borderTop: `1px solid ${t.brd}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>{step > 1 && <Btn onClick={() => setStep(step - 1)}><Ic name="chevL" size={14}/> Anterior</Btn>}</div>
          <div style={{ fontSize: 12, color: t.txM }}>Paso {step} de {totalSteps}</div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={onClose}>Cancelar</Btn>
            {step < totalSteps ? <Btn primary onClick={() => setStep(step + 1)}>Siguiente <Ic name="chevR" size={14}/></Btn> : <Btn primary disabled={!f.name || !f.short} onClick={() => onSave({ ...f, id: f.id || Date.now().toString(), color: (f.colors && f.colors[0]) || "#888" })}>{isNew ? "Crear marca" : "Guardar"}</Btn>}
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════ BRANDING KIT ══════
const BrandKit = ({ brands, setBrands }) => {
  const t = useT();
  const [sel, setSel] = useState(brands[0] || null);
  const [ed, setEd] = useState(null);
  const [cr, setCr] = useState(false);
  const [del, setDel] = useState(null);
  const [tab, setTab] = useState("identity");
  const save = (b) => { if (cr) { setBrands([...brands, b]); setSel(b); } else { setBrands(brands.map(x => x.id === b.id ? b : x)); setSel(b); } setEd(null); setCr(false); };

  const tabs = [
    { id: "identity", label: "Identidad", icon: "🏢" },
    { id: "visual", label: "Visual", icon: "🎨" },
    { id: "voice", label: "Voz", icon: "🎯" },
    { id: "content", label: "Contenido", icon: "📁" },
    { id: "strategy", label: "Estrategia", icon: "⚡" },
  ];

  const FileList = ({ files, icon }) => (files || []).length > 0 ? (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {files.map((f, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: t.bgI, borderRadius: 8, fontSize: 12, color: t.tx, border: `1px solid ${t.brd}` }}><span>{icon}</span> {f}</div>)}
    </div>
  ) : <div style={{ fontSize: 12, color: t.txM, fontStyle: "italic" }}>Sin archivos</div>;

  return (
    <Section title="Mis Marcas" sub="Configura la identidad completa de cada marca. La IA usa toda esta información." right={<Btn primary onClick={() => setCr(true)}><Ic name="plus" size={14}/> Nueva marca</Btn>}>
      {brands.length > 0 ? <>
        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>{brands.map(b => <button key={b.id} onClick={() => { setSel(b); setTab("identity"); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: sel?.id === b.id ? `2px solid ${b.color}` : `1px solid ${t.brd}`, background: sel?.id === b.id ? b.color + "12" : t.bgC, color: sel?.id === b.id ? t.tx : t.txS, fontSize: 13, fontWeight: 600, cursor: "pointer" }}><span>{b.emoji}</span> {b.name}</button>)}</div>

        {sel && <>
          <div style={{ display: "flex", gap: 4, marginBottom: 16, borderBottom: `1px solid ${t.brd}`, paddingBottom: 8 }}>
            {tabs.map(tb => <div key={tb.id} onClick={() => setTab(tb.id)} style={{ padding: "8px 14px", borderRadius: 8, background: tab === tb.id ? t.acS : "transparent", color: tab === tb.id ? t.ac : t.txM, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}><span>{tb.icon}</span> {tb.label}</div>)}
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              <Btn small onClick={() => setEd(sel)}><Ic name="edit" size={14}/> Editar</Btn>
              {brands.length > 1 && <Btn small danger onClick={() => setDel(sel.id)}><Ic name="trash" size={14}/></Btn>}
            </div>
          </div>

          {tab === "identity" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: sel.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{sel.emoji}</div>
                <div><div style={{ fontSize: 18, fontWeight: 700, color: t.tx }}>{sel.name}</div><div style={{ fontSize: 13, color: t.txS }}>{sel.industry}</div>{sel.slogan && <div style={{ fontSize: 12, color: t.txM, fontStyle: "italic" }}>"{sel.slogan}"</div>}</div>
              </div>
              {sel.description && <div style={{ fontSize: 13, color: t.tx, lineHeight: 1.5, marginBottom: 12 }}>{sel.description}</div>}
              <div style={{ fontSize: 12, color: t.txM, marginBottom: 6 }}>Logos</div>
              <FileList files={sel.logos} icon="🖼️"/>
            </Card>
            <Card>
              <div style={{ fontSize: 12, color: t.txM, marginBottom: 10 }}>Presencia digital</div>
              {[{ l: "🌐 Web", v: sel.website }, { l: "📸 Instagram", v: sel.instagram }, { l: "📘 Facebook", v: sel.facebook }, { l: "🎵 TikTok", v: sel.tiktok }].filter(r => r.v).map((r, i) => <div key={i} style={{ fontSize: 13, color: t.tx, padding: "6px 0" }}>{r.l}: <span style={{ color: t.ac }}>{r.v}</span></div>)}
              {!sel.website && !sel.instagram && !sel.facebook && !sel.tiktok && <div style={{ fontSize: 12, color: t.txM, fontStyle: "italic" }}>Sin redes configuradas</div>}
            </Card>
          </div>}

          {tab === "visual" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <div style={{ fontSize: 12, color: t.txM, marginBottom: 10 }}>Paleta de colores</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {(sel.colors || [sel.color]).map((c, i) => <div key={i}><div style={{ width: 44, height: 44, borderRadius: 10, background: c }}/><div style={{ fontSize: 9, color: t.txM, textAlign: "center", marginTop: 2, fontFamily: "monospace" }}>{c}</div></div>)}
              </div>
              <div style={{ fontSize: 12, color: t.txM, marginBottom: 6 }}>Tipografías</div>
              <div style={{ fontSize: 13, color: t.tx, lineHeight: 1.5, marginBottom: 10 }}>{sel.typography || <span style={{ color: t.txM, fontStyle: "italic" }}>Sin tipografías definidas</span>}</div>
              {(sel.typographyFiles || []).length > 0 && <FileList files={sel.typographyFiles} icon="🔤"/>}
            </Card>
            <Card>
              <div style={{ fontSize: 12, color: t.txM, marginBottom: 8 }}>Fondos y texturas</div>
              <FileList files={sel.backgrounds} icon="🎨"/>
              <div style={{ fontSize: 12, color: t.txM, marginBottom: 8, marginTop: 14 }}>Estilo imagen AI</div>
              <div style={{ fontSize: 13, color: t.tx, padding: "8px 12px", background: t.bgI, borderRadius: 8, border: `1px solid ${t.brd}` }}>{sel.imgStyle || <span style={{ color: t.txM, fontStyle: "italic" }}>Sin definir</span>}</div>
            </Card>
          </div>}

          {tab === "voice" && <Card>
            {[{ l: "Tono de voz", v: sel.tone }, { l: "Audiencia", v: sel.audience }, { l: "Valores", v: sel.values }, { l: "Personalidad IA", v: sel.brandVoice }].filter(r => r.v).map((r, i) => <div key={i} style={{ marginBottom: 12 }}><div style={{ fontSize: 12, color: t.txM, marginBottom: 4 }}>{r.l}</div><div style={{ fontSize: 14, color: t.tx, padding: "10px 14px", background: t.bgI, borderRadius: 10, border: `1px solid ${t.brd}`, lineHeight: 1.5 }}>{r.v}</div></div>)}
          </Card>}

          {tab === "content" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              {[{ l: "Fotos de productos/servicios", f: sel.productPhotos, ic: "📸" }, { l: "Videos", f: sel.videos, ic: "🎬" }, { l: "Piezas de redes sociales", f: sel.socialPieces, ic: "📱" }].map((r, i) => <div key={i} style={{ marginBottom: 14 }}><div style={{ fontSize: 12, color: t.txM, marginBottom: 6 }}>{r.l}</div><FileList files={r.f} icon={r.ic}/></div>)}
            </Card>
            <Card>
              {[{ l: "Manuales de marca", f: sel.brandManuals, ic: "📘" }, { l: "Catálogos y precios", f: sel.catalogs, ic: "📋" }, { l: "Investigaciones", f: sel.researchDocs, ic: "🔍" }].map((r, i) => <div key={i} style={{ marginBottom: 14 }}><div style={{ fontSize: 12, color: t.txM, marginBottom: 6 }}>{r.l}</div><FileList files={r.f} icon={r.ic}/></div>)}
              <div style={{ fontSize: 12, color: t.txM, marginBottom: 6 }}>Info de productos</div>
              <div style={{ fontSize: 13, color: t.tx, lineHeight: 1.5 }}>{sel.productInfo || <span style={{ color: t.txM, fontStyle: "italic" }}>Sin información</span>}</div>
            </Card>
          </div>}

          {tab === "strategy" && <Card>
            {sel.description && <div style={{ marginBottom: 12 }}><div style={{ fontSize: 12, color: t.txM, marginBottom: 4 }}>Descripción</div><div style={{ fontSize: 14, color: t.tx, padding: "10px 14px", background: t.bgI, borderRadius: 10, border: `1px solid ${t.brd}`, lineHeight: 1.5 }}>{sel.description}</div></div>}
            {[{ l: "Productos/servicios", v: sel.products }, { l: "Diferenciador", v: sel.differentiator }].filter(r => r.v).map((r, i) => <div key={i} style={{ marginBottom: 12 }}><div style={{ fontSize: 12, color: t.txM, marginBottom: 4 }}>{r.l}</div><div style={{ fontSize: 14, color: t.tx, padding: "10px 14px", background: t.bgI, borderRadius: 10, border: `1px solid ${t.brd}`, lineHeight: 1.5 }}>{r.v}</div></div>)}
            <div style={{ fontSize: 12, color: t.txM, marginBottom: 6, marginTop: 8 }}>Documentos de estrategia</div>
            <FileList files={sel.strategyDocs} icon="📊"/>
            {(sel.websiteScreenshot || []).length > 0 && <div style={{ marginTop: 12 }}><div style={{ fontSize: 12, color: t.txM, marginBottom: 6 }}>Captura página web</div><FileList files={sel.websiteScreenshot} icon="🌐"/></div>}
          </Card>}
        </>}
      </> : <Card style={{ textAlign: "center", padding: 48 }}><div style={{ fontSize: 48, marginBottom: 12 }}>🚀</div><div style={{ fontSize: 18, fontWeight: 700, color: t.tx, marginBottom: 6 }}>¡Bienvenido!</div><div style={{ fontSize: 14, color: t.txM, marginBottom: 20, maxWidth: 380, margin: "0 auto 20px" }}>Crea tu primera marca para generar contenido con IA.</div><Btn primary onClick={() => setCr(true)} style={{ margin: "0 auto" }}><Ic name="plus" size={14}/> Crear marca</Btn></Card>}
      {(ed || cr) && <BrandEditor brand={ed} isNew={cr} onSave={save} onClose={() => { setEd(null); setCr(false); }}/>}
      {del && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}><Card style={{ width: 380, textAlign: "center" }}><div style={{ fontSize: 36, marginBottom: 10 }}>⚠️</div><div style={{ fontSize: 17, fontWeight: 700, color: t.tx, marginBottom: 8 }}>¿Eliminar?</div><div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}><Btn onClick={() => setDel(null)}>Cancelar</Btn><Btn danger onClick={() => { setBrands(brands.filter(b => b.id !== del)); setSel(brands.find(b => b.id !== del)); setDel(null); }}>Eliminar</Btn></div></Card></div>}
    </Section>
  );
};

// ══════ FACTORY ══════
const Factory = ({ brands, gemKey }) => {
  const t = useT();
  const [brand, setBrand] = useState(brands[0]);
  const [ct, setCt] = useState(CTYPES[0]);
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [txt, setTxt] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoProgress, setVideoProgress] = useState("");
  const [reelImage, setReelImage] = useState(null);
  const [reelImagePreview, setReelImagePreview] = useState(null);
  const handleReelImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReelImagePreview(URL.createObjectURL(file));
    const img = new Image();
    img.onload = () => {
      const maxW = 720;
      const scale = img.width > maxW ? maxW / img.width : 1;
      const c = document.createElement("canvas");
      c.width = img.width * scale;
      c.height = img.height * scale;
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      const b64 = c.toDataURL("image/jpeg", 0.85).split(",")[1];
      setReelImage(b64);
    };
    img.src = URL.createObjectURL(file);
  };
  const pollVideo = async (opName) => {
    setVideoLoading(true); setVideoProgress("Generando video con IA... (2-5 min)");
    let attempts = 0;
    const maxAttempts = 60;
    while (attempts < maxAttempts) {
      await new Promise(r => setTimeout(r, 8000));
      attempts++;
      setVideoProgress("Generando video... " + Math.min(Math.round((attempts/maxAttempts)*100), 95) + "%");
      try {
        const r = await fetch("/api/video?action=check&op=" + encodeURIComponent(opName) + "&t=" + Date.now());
        const d = await r.json();
        if (d.status === "completed" && d.video_base64) {
          const byteChars = atob(d.video_base64);
          const byteNums = new Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i);
          const blob = new Blob([new Uint8Array(byteNums)], { type: "video/mp4" });
          const url = URL.createObjectURL(blob);
          setVideoUrl(url);
          setVideoLoading(false);
          setVideoProgress("");
          return;
        }
        if (d.status === "error") { setVideoProgress("Error: " + (d.error || "fallo")); setVideoLoading(false); return; }
      } catch (e) { /* keep polling */ }
    }
    setVideoProgress("Timeout - el video tardo demasiado"); setVideoLoading(false);
  };
  const go = async () => {
    if (!topic.trim() || !brand) return; setLoading(true); setResult(null); setTxt(""); setVideoUrl(null); setVideoLoading(false);
    const brandColors = (brand.colors || [brand.color]).join(", ");
    const brandStyle = brand.imgStyle || "professional modern";
    // Fetch real info from brand website
    let realInfo = "";
    const scrapeUrl = brand.website || brand.instagram || brand.facebook || "";
    if (scrapeUrl) {
      try {
        const wr = await fetch("/api/scrape?url=" + encodeURIComponent(scrapeUrl.startsWith("http") ? scrapeUrl : "https://" + scrapeUrl));
        const wd = await wr.json();
        if (wd.text) realInfo = wd.text.substring(0, 2000);
      } catch (e) { /* continue without web info */ }
    }
    const brandCtx = "MARCA:" + brand.name + "|INDUSTRIA:" + brand.industry + "|TONO:" + brand.tone + "|AUDIENCIA:" + brand.audience + "|VOZ:" + (brand.brandVoice || "Profesional") + "|PRODUCTOS:" + (brand.products || "N/A") + "|COLORES:" + brandColors + "|ESTILO_VISUAL:" + brandStyle;
    const realInfoBlock = realInfo ? "\n\nINFORMACION REAL DE LA PAGINA WEB DE " + brand.name + " (USA SOLO ESTA INFORMACION REAL, NO INVENTES DATOS):\n" + realInfo : "";
    const sys = "Eres DIRECTOR CREATIVO SENIOR agencia Bogota. " + brandCtx + ". REGLAS:1)Gancho 2)3-5 emojis 3)Gancho>Valor>CTA 4)8 hashtags 5)Espanol colombiano tu 6)Valor primero 7)Saltos linea. SOLO JSON sin markdown sin backticks. MUY IMPORTANTE: Usa SOLO informacion REAL de la marca. NUNCA inventes precios, productos, servicios ni datos que no sean reales." + realInfoBlock;
    const fmt = ct.fmt;
    const imgInst = "image_prompt: MUST be in english BUT any visible text inside the image MUST be in Spanish. Translate the user request LITERALLY into an image description. If user asks for animated/cartoon style, specify 3D Pixar-style animated. If user mentions discounts or text, include that text visually in the image. Brand name: " + brand.name + ". Brand colors: " + brandColors + ". Brand visual style: " + brandStyle + ". Industry: " + brand.industry + ". Be EXTREMELY specific and literal. Copy the user instructions as closely as possible into the image description. NEVER include any logo or brand logo in the image because the AI will generate a fake incorrect logo. The real logo will be added manually later.";
    let msg = "";
    if (fmt === "visual") {
      msg = 'Post sobre: "' + topic + '". Responde SOLO con JSON asi: {"headline":"max 8 palabras","subtext":"subtitulo","caption":"3-5 lineas con emojis","hashtags":"8 hashtags","image_prompt":"(en ingles) traduce LITERALMENTE lo que el usuario pidio a una descripcion de imagen. Incluye el nombre de marca ' + brand.name + ' si es relevante. ' + imgInst + '"}';
    } else if (fmt === "carousel") {
      msg = 'Carrusel 5 slides: "' + topic + '". JSON:{"slides":[{"title":"..","body":"emojis","emoji":".."}],"caption":"CTA","hashtags":"8"}';
    } else if (fmt === "reel") {
      msg = 'Reel 5 escenas: "' + topic + '". Responde SOLO JSON:{"scenes":[{"title":"..","duration":"3s","emoji":"..","visual":"camara","text_overlay":"texto+emoji","audio":"musica","transition":"tipo"}],"caption":"CTA","hashtags":"8","video_prompt":"Create a vertical 9:16 promotional video in SPANISH language. ALL voiceover, narration and spoken words MUST be in SPANISH (Latin American). The video is about: ' + topic + '. Brand: ' + brand.name + ' (' + brand.industry + '). Use brand colors: ' + brandColors + '. Visual style: ' + brandStyle + '. Make it eye-catching, professional, and designed to attract customers on social media. Include any discounts, promotions or text mentioned by the user VISUALLY in the video. Do NOT include any logo."}';
    } else {
      msg = ct.label + ': "' + topic + '". Emojis, Gancho>Valor>CTA. 8 hashtags.';
    }
    try { const r = await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2500,system:sys,messages:[{role:"user",content:msg}]})}); const d = await r.json(); const raw = d.content?.map(c=>c.text||"").join("")||""; if(fmt==="text"){setTxt(raw);setResult({t:"text"});}else{try{let clean=raw;if(clean.indexOf("{")>-1)clean=clean.substring(clean.indexOf("{"),clean.lastIndexOf("}")+1);const pd=JSON.parse(clean);const imgUrl=pd.image_prompt?"/api/image?prompt="+encodeURIComponent(pd.image_prompt.substring(0,500))+(reelImage?"&ref=1":""):null;if(reelImage&&pd.image_prompt){fetch("/api/image",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:pd.image_prompt.substring(0,500),image_base64:reelImage})}).then(r=>r.blob()).then(b=>{const u=URL.createObjectURL(b);setResult(prev=>({...prev,img:u}));}).catch(()=>{});}setResult({t:fmt,d:pd,img:reelImage?null:imgUrl});if(fmt==="reel"){const directVideoPrompt="Create a vertical 9:16 promotional video for "+brand.name+" ("+brand.industry+"). IMPORTANT: ALL voiceover and narration MUST be in SPANISH (Latin American Spanish). Topic: "+topic+". Brand colors: "+brandColors+". Style: "+brandStyle+". Make it professional, eye-catching and designed to attract customers on social media. Include any discounts or promotions mentioned. Do NOT include any logo. Make it realistic and high quality.";const videoBody={prompt:directVideoPrompt.substring(0,500),aspect_ratio:"9:16"};if(reelImage){videoBody.image_base64=reelImage;}fetch("/api/video",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(videoBody)}).then(r=>r.json()).then(d=>{if(d.operation){pollVideo(d.operation);}else{setVideoProgress("Error: "+(d.error||"no se pudo iniciar"));}}).catch(()=>setVideoProgress("Error al conectar con API de video"));}}catch{setTxt(raw);setResult({t:"text"});}} } catch{setTxt("Error.");setResult({t:"text"});} setLoading(false);
  };
  const [showGuide, setShowGuide] = useState(false);
  if(!brands.length) return <Section title="Crear Contenido"><Card style={{textAlign:"center",padding:48}}><div style={{fontSize:48,marginBottom:12}}>🏢</div><div style={{fontSize:16,fontWeight:600,color:t.tx}}>Primero crea una marca en "Mis Marcas"</div></Card></Section>;
  return (
    <Section title="Crear Contenido" sub="Genera contenido profesional con IA." right={<Badge>Claude AI</Badge>}>
      <div onClick={()=>setShowGuide(!showGuide)} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",background:t.bgI,border:"1px solid "+t.brd,borderRadius:12,cursor:"pointer",marginBottom:showGuide?0:14}}>
        <span style={{fontSize:16}}>📋</span>
        <span style={{fontSize:13,fontWeight:600,color:t.tx,flex:1}}>Guia: Como escribir instrucciones para mejores resultados</span>
        <span style={{color:t.txM,fontSize:12}}>{showGuide?"▲ Cerrar":"▼ Ver guia"}</span>
      </div>
      {showGuide&&<Card style={{marginBottom:14,marginTop:8,border:"1px solid "+t.ac+"30"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:t.ac,marginBottom:10}}>🖼️ Imagenes (Post + Imagen, Anuncio)</div>
            <div style={{fontSize:12,color:t.txS,lineHeight:1.7}}>
              <div style={{marginBottom:6}}><span style={{fontWeight:600,color:t.tx}}>Se especifico:</span> Describe exactamente lo que quieres ver. No digas solo "una imagen bonita", di "una doctora animada estilo 3D sosteniendo un cartel con 30% de descuento en una farmacia moderna".</div>
              <div style={{marginBottom:6}}><span style={{fontWeight:600,color:t.tx}}>Estilo:</span> Indica si quieres estilo realista, animado 3D tipo Pixar, ilustracion, minimalista, etc.</div>
              <div style={{marginBottom:6}}><span style={{fontWeight:600,color:t.tx}}>Texto en la imagen:</span> Si necesitas texto visible (ej: "20% de descuento"), incluyelo en tu instruccion. La IA lo pone en la imagen.</div>
              <div style={{marginBottom:6}}><span style={{fontWeight:600,color:t.tx}}>Colores:</span> La IA usa automaticamente los colores de tu marca, pero puedes especificar colores adicionales.</div>
              <div><span style={{fontWeight:600,color:t.tx}}>Logos:</span> La IA no puede poner tu logo real. Agrega el logo manualmente despues de descargar la imagen.</div>
              <div style={{marginTop:6}}><span style={{fontWeight:600,color:t.tx}}>📷 Foto real (opcional):</span> Sube una foto de tu producto, local o servicio. La IA la modifica segun tus instrucciones: le agrega texto, cambia el estilo, la mejora. Ideal para contenido que se vea autentico.</div>
            </div>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:t.ac,marginBottom:10}}>🎬 Videos (Reel / Story)</div>
            <div style={{fontSize:12,color:t.txS,lineHeight:1.7}}>
              <div style={{marginBottom:6}}><span style={{fontWeight:600,color:t.tx}}>Duracion:</span> Cada video generado dura maximo 8 segundos. Para videos mas largos, genera varios clips y unes despues.</div>
              <div style={{marginBottom:6}}><span style={{fontWeight:600,color:t.tx}}>Formato:</span> Los videos se generan en formato vertical 9:16 (ideal para Reels e Historias de Instagram).</div>
              <div style={{marginBottom:6}}><span style={{fontWeight:600,color:t.tx}}>Tiempo:</span> La generacion tarda entre 2-5 minutos. No cierres la pagina mientras se genera.</div>
              <div style={{marginBottom:6}}><span style={{fontWeight:600,color:t.tx}}>Idioma:</span> El audio y narraccion se genera en espanol latinoamericano.</div>
              <div style={{marginBottom:6}}><span style={{fontWeight:600,color:t.tx}}>Se especifico:</span> Describe la escena, la accion, el ambiente. Ej: "Un video cinematografico de una pareja entrando a una cabana romantica con jacuzzi al atardecer, con texto de 20% de descuento".</div>
              <div><span style={{fontWeight:600,color:t.tx}}>Costo:</span> Cada video consume creditos de tu cuenta de Google Cloud (~$6 USD por video de 8 seg).</div>
              <div style={{marginTop:6}}><span style={{fontWeight:600,color:t.tx}}>📷 Foto de referencia (opcional):</span> Puedes subir una foto REAL de tu producto, cabana, clinica, etc. El video se genera a partir de esa foto, dandole movimiento y vida. Esto hace que el video se vea mucho mas realista y fiel a tu marca. Si no subes foto, la IA inventa la escena desde cero.</div>
            </div>
          </div>
        </div>
        <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid "+t.brd}}>
          <div style={{fontSize:14,fontWeight:700,color:t.ac,marginBottom:8}}>✍️ Ejemplos de buenas instrucciones</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{padding:10,background:t.bgI,borderRadius:8,fontSize:11,color:t.tx,lineHeight:1.5}}>
              <div style={{fontWeight:600,color:"#22c55e",marginBottom:4}}>✅ Buena instruccion:</div>
              "Quiero una imagen animada estilo 3D de una doctora sonriendo en una farmacia moderna sosteniendo un cartel que diga 30% de descuento por el dia del hombre, colores azul y rojo"
            </div>
            <div style={{padding:10,background:t.bgI,borderRadius:8,fontSize:11,color:t.tx,lineHeight:1.5}}>
              <div style={{fontWeight:600,color:"#ef4444",marginBottom:4}}>❌ Mala instruccion:</div>
              "Hazme una imagen bonita para redes sociales"
            </div>
          </div>
        </div>
      </Card>}
      <div style={{marginBottom:14}}><Label>Marca</Label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{brands.map(b=><button key={b.id} onClick={()=>setBrand(b)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",borderRadius:10,border:brand?.id===b.id?`2px solid ${b.color}`:`1px solid ${t.brd}`,background:brand?.id===b.id?b.color+"12":t.bgC,color:brand?.id===b.id?t.tx:t.txS,fontSize:12,fontWeight:600,cursor:"pointer"}}><span>{b.emoji}</span>{b.short||b.name.slice(0,3)}</button>)}</div></div>
      <div style={{marginBottom:14}}><Label>Tipo</Label><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>{CTYPES.map(c=><button key={c.id} onClick={()=>{setCt(c);if(c.fmt!=="reel"&&c.fmt!=="visual"){setReelImage(null);setReelImagePreview(null);}}} style={{padding:"12px 10px",borderRadius:12,border:ct.id===c.id?`2px solid ${t.ac}`:`1px solid ${t.brd}`,background:ct.id===c.id?t.acS:t.bgC,cursor:"pointer",textAlign:"center"}}><div style={{fontSize:22,marginBottom:4}}>{c.icon}</div><div style={{fontSize:12,fontWeight:600,color:ct.id===c.id?t.tx:t.txS}}>{c.label}</div></button>)}</div></div>
      {(ct.fmt==="reel"||ct.fmt==="visual")&&<div style={{marginBottom:14,padding:14,background:t.bgI,borderRadius:12,border:"1px solid "+t.brd}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><span style={{fontSize:14}}>📷</span><span style={{fontSize:12,fontWeight:600,color:t.tx}}>{ct.fmt==="reel"?"Foto de referencia":"Foto real de tu producto/servicio"}</span><span style={{fontSize:11,color:t.txM,fontStyle:"italic"}}>(opcional)</span></div><div style={{fontSize:11,color:t.txS,marginBottom:10,lineHeight:1.5}}>{ct.fmt==="reel"?"Si subes una foto real de tu producto o lugar, el video se genera a partir de ella y se ve mas realista. Si no subes foto, la IA crea el video desde cero.":"Si subes una foto real, la IA la usa como base para generar la imagen. Puede agregarle texto, cambiar el estilo o mejorarla. Si no subes foto, la IA crea la imagen desde cero."}</div><div style={{display:"flex",gap:12,alignItems:"center"}}><label style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",border:"2px dashed "+(reelImage?t.ac:t.brd),borderRadius:10,cursor:"pointer",color:reelImage?t.ac:t.txM,fontSize:12,fontWeight:500,background:reelImage?t.acS:"transparent"}}><span style={{fontSize:16}}>📷</span>{reelImage?"Cambiar foto":"Subir foto"}<input type="file" accept="image/*" onChange={handleReelImage} style={{display:"none"}}/></label>{reelImagePreview&&<div style={{position:"relative"}}><img src={reelImagePreview} style={{width:50,height:50,borderRadius:8,objectFit:"cover",border:"2px solid "+t.ac}}/><div onClick={()=>{setReelImage(null);setReelImagePreview(null);}} style={{position:"absolute",top:-6,right:-6,width:16,height:16,borderRadius:"50%",background:"#ef4444",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,cursor:"pointer",fontWeight:700}}>x</div></div>}{reelImage&&<span style={{fontSize:11,color:t.ac,fontWeight:600}}>{ct.fmt==="reel"?"✅ El video se animara desde esta foto":"✅ La imagen se generara a partir de esta foto"}</span>}</div></div>}
      <div style={{display:"flex",gap:10,marginBottom:22}}><Input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Describe qué contenido necesitas..." onKeyDown={e=>e.key==="Enter"&&go()}/><Btn onClick={go} disabled={loading||!topic.trim()} primary style={{whiteSpace:"nowrap",padding:"14px 28px"}}>{loading?<><Spin/> Creando...</>:<><Ic name="sparkle" size={16}/> Generar</>}</Btn></div>
      {loading&&<Card style={{padding:48,textAlign:"center"}}><div style={{width:48,height:48,border:`3px solid ${t.brd}`,borderTop:`3px solid ${brand?.color||t.ac}`,borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 16px"}}/><div style={{color:t.tx,fontSize:16,fontWeight:600}}>Generando para {brand?.name}...</div></Card>}
      {result&&!loading&&result.t==="text"&&<Card><div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><span style={{fontSize:13,fontWeight:600,color:t.txS}}>{brand?.emoji} {brand?.name}</span><CopyBtn text={txt}/></div><div style={{fontSize:14,color:t.tx,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{txt}</div></Card>}
      {result&&!loading&&result.t==="visual"&&result.d&&<Card>{result.img&&<div style={{marginBottom:16,borderRadius:14,overflow:"hidden"}}><img id="ai-generated-img" crossOrigin="anonymous" src={result.img} alt="AI Generated" style={{width:"100%",maxHeight:500,objectFit:"contain",display:"block",borderRadius:14}}/></div>}<div style={{fontSize:22,fontWeight:800,color:t.tx,marginBottom:6}}>{result.d.headline}</div>{result.d.subtext&&<div style={{color:t.txS,marginBottom:12}}>{result.d.subtext}</div>}<div style={{fontSize:14,color:t.tx,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{result.d.caption}</div>{result.d.hashtags&&<div style={{fontSize:12,color:brand?.color,marginTop:10}}>{result.d.hashtags}</div>}<div style={{marginTop:12,display:"flex",gap:8}}><CopyBtn text={`${result.d.caption}\n\n${result.d.hashtags||""}`} label="📱 Copiar"/>{result.img&&<button onClick={()=>{const img=document.getElementById("ai-generated-img");if(!img)return;const c=document.createElement("canvas");c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext("2d").drawImage(img,0,0);c.toBlob(b=>{const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=(brand?.short||"img")+"_"+Date.now()+".png";a.click();URL.revokeObjectURL(u);},"image/png");}} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",background:"rgba(55,194,235,.08)",border:"1px solid rgba(55,194,235,.2)",borderRadius:10,color:"#37c2eb",fontSize:12,fontWeight:600,cursor:"pointer"}}>⬇️ Descargar imagen</button>}</div></Card>}
      {result&&!loading&&result.t==="carousel"&&result.d?.slides&&<Card>{result.d.slides.map((sl,i)=><div key={i} style={{padding:"12px 0",borderBottom:i<result.d.slides.length-1?`1px solid ${t.brd}`:"none"}}><div style={{fontSize:14,fontWeight:600,color:t.tx}}>{sl.emoji} Slide {i+1}: {sl.title}</div><div style={{fontSize:13,color:t.txS,marginTop:3}}>{sl.body}</div></div>)}{result.d.caption&&<div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${t.brd}`,fontSize:14,color:t.tx,whiteSpace:"pre-wrap"}}>{result.d.caption}</div>}<div style={{marginTop:12}}><CopyBtn text={result.d.slides.map((s,i)=>`${s.emoji} Slide ${i+1}: ${s.title}\n${s.body}`).join("\n\n")+`\n\n${result.d.caption||""}\n${result.d.hashtags||""}`} label="📋 Todo"/></div></Card>}
      {result&&!loading&&result.t==="reel"&&result.d?.scenes&&<Card>
        {videoUrl&&<div style={{marginBottom:16,borderRadius:14,overflow:"hidden"}}><video src={videoUrl} controls style={{width:"100%",maxHeight:400,borderRadius:14,display:"block"}}/></div>}
        {videoLoading&&<div style={{marginBottom:16,padding:24,textAlign:"center",background:t.bgI,borderRadius:14,border:"1px solid "+t.brd}}><div style={{width:40,height:40,border:"3px solid "+t.brd,borderTop:"3px solid "+(brand?.color||t.ac),borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 12px"}}/><div style={{color:t.ac,fontSize:14,fontWeight:600}}>{videoProgress}</div><div style={{color:t.txM,fontSize:12,marginTop:4}}>El video se esta generando con Veo AI. No cierres esta pagina.</div></div>}
        {videoUrl&&<div style={{marginBottom:14,display:"flex",gap:8}}><button onClick={()=>{const a=document.createElement("a");a.href=videoUrl;a.download=(brand?.short||"reel")+"_"+Date.now()+".mp4";a.click();}} style={{display:"flex",alignItems:"center",gap:6,padding:"10px 20px",background:t.gr,border:"none",borderRadius:10,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>⬇️ Descargar video</button></div>}
        {!videoUrl&&!videoLoading&&videoProgress&&<div style={{marginBottom:14,padding:12,background:"rgba(239,68,68,.1)",borderRadius:10,color:"#ef4444",fontSize:13}}>{videoProgress}</div>}
        {result.d.scenes.map((sc,i)=><div key={i} style={{padding:"14px 0",borderBottom:i<result.d.scenes.length-1?"1px solid "+t.brd:"none"}}><div style={{fontSize:15,fontWeight:700,color:t.tx,marginBottom:4}}>🎬 Escena {i+1}: {sc.title} <span style={{fontSize:12,color:t.txM}}>({sc.duration})</span></div><div style={{fontSize:13,color:t.txS,marginBottom:4}}>📹 {sc.visual}</div><div style={{fontSize:14,fontWeight:700,color:brand?.color}}>📝 {sc.text_overlay}</div>{sc.audio&&<div style={{fontSize:12,color:t.txM,marginTop:4}}>🎵 {sc.audio}</div>}</div>)}
        {result.d.caption&&<div style={{marginTop:14,paddingTop:14,borderTop:"1px solid "+t.brd,fontSize:14,color:t.tx,whiteSpace:"pre-wrap"}}>{result.d.caption}</div>}
        <div style={{marginTop:12}}><CopyBtn text={result.d.scenes.map((s,i)=>"🎬 "+(i+1)+"("+s.duration+"):"+s.title+"\n📹"+s.visual+"\n📝"+s.text_overlay+"\n🎵"+(s.audio||"")).join("\n\n")+"\n\n"+(result.d.caption||"")+"\n"+(result.d.hashtags||"")} label="📋 Storyboard"/></div>
      </Card>}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </Section>
  );
};

// ══════ CLIENT SETTINGS ══════
const ClientSettings = ({ user, setUser }) => {
  const t = useT();
  const Toggle = ({ v, set }) => <div onClick={() => set(!v)} style={{ width: 40, height: 22, borderRadius: 11, background: v ? t.ac : t.brd, position: "relative", cursor: "pointer", flexShrink: 0 }}><div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: v ? 20 : 2, transition: "left .3s" }}/></div>;
  const [n1, setN1] = useState(true);
  const [n2, setN2] = useState(true);
  const [n3, setN3] = useState(false);
  const [editName, setEditName] = useState(user.name || "");
  const [editCompany, setEditCompany] = useState(user.company || "");
  const [editPhone, setEditPhone] = useState(user.phone || "");
  const [saved, setSaved] = useState(false);

  const saveProfile = () => {
    setUser({ ...user, name: editName, company: editCompany, phone: editPhone });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Section title="Mi Cuenta" sub="Perfil, notificaciones y plan.">
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: t.tx, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Ic name="user" size={18}/> Perfil</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div><Label>Nombre</Label><Input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Tu nombre"/></div>
          <div><Label>Empresa</Label><Input value={editCompany} onChange={e => setEditCompany(e.target.value)} placeholder="Nombre empresa"/></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div><Label>Email</Label><Input value={user.email} style={{ opacity: .5, cursor: "not-allowed" }}/></div>
          <div><Label>Teléfono</Label><Input value={editPhone} onChange={e => setEditPhone(e.target.value)} type="tel" placeholder="+57 300 000 0000"/></div>
        </div>
        <Btn primary onClick={saveProfile}>{saved ? "✅ Guardado" : "Guardar cambios"}</Btn>
      </Card>
      <Card style={{ marginBottom: 14 }}><div style={{ fontSize: 16, fontWeight: 600, color: t.tx, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Ic name="bell" size={18}/> Notificaciones</div>{[{ l: "Email cuando contenido listo", v: n1, s: setN1 }, { l: "Recordatorios programados", v: n2, s: setN2 }, { l: "Novedades y ofertas", v: n3, s: setN3 }].map((n, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 2 ? `1px solid ${t.brd}` : "none" }}><div style={{ fontSize: 14, color: t.tx }}>{n.l}</div><Toggle v={n.v} set={n.s}/></div>)}</Card>
      <Card style={{ marginBottom: 14 }}><div style={{ fontSize: 16, fontWeight: 600, color: t.tx, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Ic name="card" size={18}/> Mi Plan</div><div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}><span style={{ color: t.tx }}>Plan actual</span><Badge color="#37c2eb">Pro — $29/mes</Badge></div><div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}><span style={{ color: t.tx }}>Uso</span><span style={{ color: t.txS }}>34 / 100 posts</span></div><Btn primary style={{ marginTop: 10, width: "100%", justifyContent: "center" }}>Cambiar plan</Btn></Card>
      <Card style={{ marginBottom: 14 }}><div style={{ fontSize: 16, fontWeight: 600, color: t.tx, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Ic name="shield" size={18}/> Seguridad</div><Btn>Cambiar contraseña</Btn></Card>
      <Card><div style={{ fontSize: 16, fontWeight: 600, color: t.tx, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Ic name="help" size={18}/> Soporte</div><div style={{ fontSize: 14, color: t.txS }}>¿Necesitas ayuda? <span style={{ color: t.ac }}>soporte@datagrowth.agency</span></div></Card>
    </Section>
  );
};

// ══════ AGENCY PAGES ══════
const AgencyDash = ({ setPage, brands }) => { const t = useT(); return <Section title="Dashboard Agencia" right={<Badge color="#8b5cf6">Admin</Badge>}><div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>{[{ l: "Contenido", v: "247", c: "#37c2eb" }, { l: "Marcas", v: String(brands.length), c: "#06b6d4" }, { l: "Clientes", v: "5", c: "#8b5cf6" }, { l: "Revenue", v: "$216", c: "#f59e0b" }].map((s, i) => <Card key={i}><div style={{ fontSize: 12, color: t.txM, marginBottom: 8 }}>{s.l}</div><div style={{ fontSize: 28, fontWeight: 800, color: s.c }}>{s.v}</div></Card>)}</div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{brands.map(b => <Card key={b.id} onClick={() => setPage("factory")} style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 40, height: 40, borderRadius: 10, background: b.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{b.emoji}</div><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: t.tx }}>{b.name}</div><div style={{ fontSize: 11, color: t.txM }}>{b.industry}</div></div><Badge>Activa</Badge></Card>)}</div></Section>; };
const AgencyClients = () => { const t = useT(); return <Section title="Clientes" right={<Btn primary><Ic name="plus" size={14}/> Nuevo</Btn>}><Card style={{ padding: 0 }}><div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "12px 20px", background: t.bgI, fontSize: 11, fontWeight: 600, color: t.txM, textTransform: "uppercase" }}><div>Empresa</div><div>Plan</div><div>Revenue</div></div>{[{ n: "Cliente A", p: "Pro", r: "$29" }, { n: "Cliente B", p: "Agency", r: "$79" }, { n: "Cliente C", p: "Starter", r: "$0" }, { n: "Cliente D", p: "Pro", r: "$29" }].map((c, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "14px 20px", borderBottom: `1px solid ${t.brd}`, alignItems: "center" }}><div style={{ fontSize: 14, fontWeight: 600, color: t.tx }}>{c.n}</div><Badge color={c.p === "Agency" ? "#8b5cf6" : c.p === "Pro" ? "#37c2eb" : "#888"}>{c.p}</Badge><div style={{ color: t.tx }}>{c.r}/mes</div></div>)}</Card></Section>; };
const AgencyTeam = () => { const t = useT(); return <Section title="Equipo" right={<Btn primary><Ic name="plus" size={14}/> Invitar</Btn>}><div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>{[{ n: "Julian", r: "Admin", c: "#ec4899" }, { n: "María", r: "Editor", c: "#3b82f6" }].map((m, i) => <Card key={i}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 44, height: 44, borderRadius: "50%", background: m.c, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, color: "#fff" }}>{m.n[0]}</div><div><div style={{ fontSize: 15, fontWeight: 600, color: t.tx }}>{m.n}</div><Badge color={m.r === "Admin" ? "#8b5cf6" : "#37c2eb"}>{m.r}</Badge></div></div></Card>)}</div></Section>; };
const AgencyPlans = () => { const t = useT(); return <Section title="Planes"><div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>{PLANS.map(p => <Card key={p.id} style={{ textAlign: "center", border: p.pop ? `2px solid ${p.color}` : `1px solid ${t.brd}`, position: "relative" }}>{p.pop && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: p.color, color: "#fff", padding: "4px 16px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Popular</div>}<div style={{ fontSize: 17, fontWeight: 600, color: t.tx, paddingTop: p.pop ? 10 : 0 }}>{p.name}</div><div style={{ fontSize: 40, fontWeight: 800, color: p.color, margin: "8px 0" }}>{p.price}<span style={{ fontSize: 14, color: t.txM }}>/mes</span></div>{p.features.map((f, i) => <div key={i} style={{ fontSize: 13, color: t.tx, padding: "5px 0" }}>✓ {f}</div>)}</Card>)}</div></Section>; };
const AgencySettings = ({ gemKey, setGemKey }) => { const t = useT(); const [k, setK] = useState(gemKey); const [sv, setSv] = useState(false); return <Section title="Configuración API"><Card style={{ marginBottom: 12 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 600, color: t.tx }}>Claude</span><Badge>Conectada</Badge></div></Card><Card style={{ border: `1px solid ${gemKey ? "rgba(55,194,235,.3)" : "rgba(245,158,11,.3)"}` }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={{ fontWeight: 600, color: t.tx }}>Gemini Imágenes</span>{gemKey ? <Badge>Conectada</Badge> : <Badge color="#f59e0b">Pendiente</Badge>}</div><div style={{ display: "flex", gap: 10 }}><Input value={k} onChange={e => setK(e.target.value)} type="password" placeholder="AIzaSy..."/><Btn primary onClick={() => { setGemKey(k); try { localStorage.setItem("dg_gemkey", k); } catch {} setSv(true); setTimeout(() => setSv(false), 2000); }}>{sv ? "✅" : "Guardar"}</Btn></div></Card></Section>; };

// ══════ APP ══════
export default function App() {
  const [view, setView] = useState("landing"); // landing, auth, app
  const [authMode, setAuthMode] = useState("login");
  const [selPlan, setSelPlan] = useState(null);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [sb, setSb] = useState(true);
  const [dark, setDark] = useState(true);
  const [gemKey, setGemKey] = useState(() => { try { return localStorage.getItem("dg_gemkey") || ""; } catch { return ""; } });
  const [agBrands, setAgBrands] = useState(AGENCY_BRANDS);
  const [clBrands, setClBrands] = useState([]);

  const th = dark ? TH.dark : TH.light;
  const isAdmin = user?.role === "agency";
  const brands = isAdmin ? agBrands : clBrands;
  const setBrands = isAdmin ? setAgBrands : setClBrands;

  const onAuth = (u) => { setUser(u); setView("app"); setPage("dashboard"); };
  const logout = () => { setUser(null); setView("landing"); setPage("dashboard"); setAuthMode("login"); };

  const agNav = [{ id: "dashboard", label: "Dashboard", ic: "grid" }, { id: "factory", label: "Fábrica Creativa", ic: "factory", tag: "AI" }, { id: "branding", label: "Branding Kit", ic: "palette" }, { id: "clients", label: "Clientes", ic: "users" }, { id: "plans", label: "Planes", ic: "card" }, { id: "team", label: "Equipo", ic: "users" }, { id: "settings", label: "Config API", ic: "settings" }];
  const clNav = [{ id: "dashboard", label: "Mi Dashboard", ic: "grid" }, { id: "factory", label: "Crear Contenido", ic: "factory", tag: "AI" }, { id: "branding", label: "Mis Marcas", ic: "palette" }, { id: "settings", label: "Mi Cuenta", ic: "settings" }];
  const nav = isAdmin ? agNav : clNav;

  if (view === "landing") return <ThemeCtx.Provider value={th}><Landing onLogin={() => { setAuthMode("login"); setView("auth"); }} onRegister={(plan) => { setSelPlan(plan || null); setAuthMode("register"); setView("auth"); }} dark={dark} setDark={setDark}/></ThemeCtx.Provider>;
  if (view === "auth") return <ThemeCtx.Provider value={th}><Auth mode={authMode} setMode={setAuthMode} onAuth={onAuth} dark={dark} setDark={setDark} selPlan={selPlan}/></ThemeCtx.Provider>;

  const agPages = { dashboard: <AgencyDash setPage={setPage} brands={brands}/>, factory: <Factory brands={brands} gemKey={gemKey}/>, branding: <BrandKit brands={brands} setBrands={setBrands}/>, clients: <AgencyClients/>, plans: <AgencyPlans/>, team: <AgencyTeam/>, settings: <AgencySettings gemKey={gemKey} setGemKey={setGemKey}/> };
  const clPages = { dashboard: (() => { const t = th; return <Section title="Mi Dashboard" right={<Badge color="#37c2eb">Cliente</Badge>}><div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>{[{ l: "Marcas", v: String(brands.length), c: "#06b6d4" }, { l: "Contenido", v: brands.length ? "34" : "0", c: "#37c2eb" }, { l: "Posts/mes", v: brands.length ? "12" : "0", c: "#8b5cf6" }].map((s, i) => <Card key={i}><div style={{ fontSize: 12, color: t.txM, marginBottom: 8 }}>{s.l}</div><div style={{ fontSize: 28, fontWeight: 800, color: s.c }}>{s.v}</div></Card>)}</div>{brands.length ? <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{brands.map(b => <Card key={b.id} onClick={() => setPage("factory")} style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 40, height: 40, borderRadius: 10, background: b.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{b.emoji}</div><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: t.tx }}>{b.name}</div><div style={{ fontSize: 11, color: t.txM }}>{b.industry}</div></div><Badge>Activa</Badge></Card>)}<Card onClick={() => setPage("branding")} style={{ display: "flex", alignItems: "center", justifyContent: "center", border: `2px dashed ${t.brd}`, minHeight: 70 }}><div style={{ textAlign: "center", color: t.txM }}><div style={{ fontSize: 24 }}>+</div><div style={{ fontSize: 12 }}>Nueva marca</div></div></Card></div> : <Card style={{ textAlign: "center", padding: 48 }}><div style={{ fontSize: 48, marginBottom: 12 }}>🚀</div><div style={{ fontSize: 18, fontWeight: 700, color: t.tx, marginBottom: 8 }}>¡Bienvenido!</div><div style={{ fontSize: 14, color: t.txM, marginBottom: 20 }}>Crea tu primera marca para empezar.</div><Btn primary onClick={() => setPage("branding")} style={{ margin: "0 auto" }}><Ic name="plus" size={14}/> Crear marca</Btn></Card>}</Section>; })(), factory: <Factory brands={brands} gemKey={gemKey}/>, branding: <BrandKit brands={brands} setBrands={setBrands}/>, settings: <ClientSettings user={user} setUser={setUser}/> };
  const pages = isAdmin ? agPages : clPages;

  return (
    <ThemeCtx.Provider value={th}>
      <div style={{ display: "flex", height: "100vh", background: th.bg, fontFamily: "'Segoe UI',system-ui,sans-serif", overflow: "hidden" }}>
        <div style={{ width: sb ? 250 : 0, background: th.bgS, borderRight: `1px solid ${th.brd}`, display: "flex", flexDirection: "column", transition: "width .3s", overflow: "hidden", flexShrink: 0 }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${th.brd}`, display: "flex", alignItems: "center", gap: 10, minWidth: 230 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}><Logo size={34}/></div>
            <div><div style={{ fontSize: 14, fontWeight: 700, color: th.tx }}>DataGrowth</div><div style={{ fontSize: 9, color: th.ac, textTransform: "uppercase", letterSpacing: 2, fontWeight: 600 }}>{isAdmin ? "Agency" : "Client"}</div></div>
          </div>
          <div style={{ padding: "12px 0", minWidth: 230, flex: 1, overflowY: "auto" }}>
            {nav.map(item => <div key={item.id} onClick={() => setPage(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", cursor: "pointer", color: page === item.id ? th.tx : th.txS, background: page === item.id ? th.acS : "transparent", borderLeft: page === item.id ? `3px solid ${th.ac}` : "3px solid transparent", fontSize: 13, fontWeight: 500 }}><Ic name={item.ic} size={16}/>{item.label}{item.tag && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: th.acS, color: th.ac }}>{item.tag}</span>}</div>)}
          </div>
          <div style={{ padding: "8px 16px", borderTop: `1px solid ${th.brd}`, minWidth: 230 }}>
            <div onClick={() => setDark(!dark)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: th.bgI, borderRadius: 8, cursor: "pointer" }}><Ic name={dark ? "moon" : "sun"} size={14}/><span style={{ fontSize: 12, color: th.txS }}>{dark ? "Oscuro" : "Claro"}</span><div style={{ marginLeft: "auto", width: 32, height: 16, borderRadius: 8, background: dark ? th.ac : th.brd, position: "relative" }}><div style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: dark ? 18 : 2, transition: "left .3s" }}/></div></div>
          </div>
          <div style={{ padding: "10px 16px", borderTop: `1px solid ${th.brd}`, display: "flex", alignItems: "center", gap: 8, minWidth: 230 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: isAdmin ? th.gr : "linear-gradient(135deg,#f59e0b,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "#fff" }}>{user.name[0].toUpperCase()}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600, color: th.tx, textTransform: "capitalize" }}>{user.name}</div><div style={{ fontSize: 10, color: th.txM }}>{isAdmin ? "Admin" : "Cliente"}</div></div>
            <div onClick={logout} style={{ cursor: "pointer", color: th.txM }}><Ic name="logout" size={14}/></div>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 24px", borderBottom: `1px solid ${th.brd}`, display: "flex", alignItems: "center", gap: 12, background: th.bgS }}>
            <div onClick={() => setSb(!sb)} style={{ cursor: "pointer", color: th.txS }}><Ic name={sb ? "x" : "menu"} size={20}/></div>
            <div style={{ fontSize: 14, fontWeight: 500, color: th.txS }}>{nav.find(n => n.id === page)?.label}</div>
            <div style={{ marginLeft: "auto" }}><Badge color={isAdmin ? "#8b5cf6" : "#37c2eb"}>{isAdmin ? "Agencia" : "Cliente"}</Badge></div>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: 28 }}>{pages[page] || pages.dashboard}</div>
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}
