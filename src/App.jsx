import { useState, useEffect, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://wmonacfzxjpndbhwsdsf.supabase.co", "sb_publishable_TT6jl9XE1oQmHRPeuT68wg_KMy2106J");

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
  { id: "free", name: "Starter", price: "$0", desc: "Para empezar", color: "#8892a8", brands: 1, limits: { post_visual: 5, carousel: 5, post_text: 5, ad: 5, email: 5, reel: 0 }, features: ["1 marca","5 posts de imagen","5 carruseles","5 copys","5 anuncios","5 emails","Sin videos","Soporte email"] },
  { id: "pro", name: "Pro", price: "$59", desc: "Para marcas en crecimiento", color: "#37c2eb", brands: 3, limits: { post_visual: 100, carousel: 100, post_text: 100, ad: 100, email: 100, reel: 15 }, pop: true, features: ["3 marcas","100 de cada tipo/mes","15 videos/mes","Todos los formatos","Branding Kit completo","Fotos reales","Info real de la web","Soporte prioritario"] },
  { id: "agency", name: "Agency", price: "$149", desc: "Para agencias digitales", color: "#8b5cf6", brands: 99, limits: { post_visual: 9999, carousel: 9999, post_text: 9999, ad: 9999, email: 9999, reel: 20 }, features: ["Marcas ilimitadas","Posts ilimitados","20 videos/mes","Todos los formatos","Base de Conocimiento","Info real de la web","Multi-usuario (5 seats)","API access","Soporte dedicado 24/7"] },
];

const Ic = ({ name, size = 18 }) => {
  const d = { sparkle: "M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z", copy: "M9 9h13v13H9zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1", check: "M20 6L9 17l-5-5", menu: "M3 6h18M3 12h18M3 18h18", x: "M18 6L6 18M6 6l12 12", sun: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v2m0 18v2m-9-11H1m22 0h-2", moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z", logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9", chevL: "M15 18l-6-6 6-6", chevR: "M9 18l6-6-6-6", plus: "M12 5v14M5 12h14", trash: "M3 6h18M8 6V4h8v2m1 0v14H7V6", edit: "M11 4H4v16h16v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z", users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", grid: "M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z", palette: "M12 2L2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5", factory: "M2 7h20v14H2zM16 7V5a4 4 0 0 0-8 0v2", settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", card: "M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM1 10h22", back: "M19 12H5M12 19l-7-7 7-7", user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0", shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01", zap: "M13 2 3 14h9l-1 8 10-12h-9l1-8z", book: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z", ar: "M5 12h14M12 5l7 7-7 7" };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d[name] || ""}/></svg>;
};
const Spin = () => <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin .8s linear infinite" }}/>;
const Btn = ({ children, primary, danger, ghost, secondary, onClick, style: s, disabled }) => { const t = useT(); return <button onClick={onClick} disabled={disabled} style={{ padding: "10px 22px", background: danger ? "#ef4444" : primary ? t.gr : secondary ? t.acS : ghost ? "transparent" : t.bgC, color: danger || primary ? "#fff" : secondary ? t.ac : ghost ? t.txS : t.tx, border: ghost ? "none" : danger || primary ? "none" : secondary ? "1px solid " + t.ac + "40" : `1px solid ${t.brd}`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: disabled ? "default" : "pointer", display: "inline-flex", alignItems: "center", gap: 8, opacity: disabled ? .5 : 1, boxShadow: primary ? "0 4px 20px rgba(55,194,235,.25)" : "none", transition: "all .2s", ...s }}>{children}</button>; };
const Card = ({ children, style: s, onClick }) => { const t = useT(); return <div onClick={onClick} style={{ background: t.bgC, border: `1px solid ${t.brd}`, borderRadius: 14, padding: 20, boxShadow: `0 2px 12px ${t.sh}`, cursor: onClick ? "pointer" : "default", ...s }}>{children}</div>; };
const Input = ({ value, onChange, placeholder, type, style: s, onKeyDown }) => { const t = useT(); return <input value={value} onChange={onChange} onKeyDown={onKeyDown} type={type} placeholder={placeholder} style={{ padding: "12px 16px", background: t.bgI, border: `1px solid ${t.brd}`, borderRadius: 10, color: t.tx, fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", ...s }} onFocus={e => e.target.style.borderColor = t.ac} onBlur={e => e.target.style.borderColor = t.brd}/>; };
const Textarea = ({ value, onChange, placeholder, rows }) => { const t = useT(); return <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows || 3} style={{ padding: "12px 16px", background: t.bgI, border: `1px solid ${t.brd}`, borderRadius: 10, color: t.tx, fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}/>; };
const Badge = ({ children, color }) => <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: (color || "#37c2eb") + "15", color: color || "#37c2eb" }}>{children}</span>;
const Label = ({ children, req }) => { const t = useT(); return <div style={{ fontSize: 12, fontWeight: 600, color: t.txM, marginBottom: 6 }}>{children}{req && <span style={{ color: "#ef4444" }}> *</span>}</div>; };
const Section = ({ title, sub, right, children }) => { const t = useT(); return <div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sub ? 6 : 20, flexWrap: "wrap", gap: 10 }}><h2 style={{ fontSize: 24, fontWeight: 700, color: t.tx, margin: 0 }}>{title}</h2>{right}</div>{sub && <p style={{ color: t.txS, fontSize: 14, margin: "0 0 22px" }}>{sub}</p>}{children}</div>; };
const CopyBtn = ({ text, label }) => { const t = useT(); const [c, setC] = useState(false); return <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: c ? "rgba(55,194,235,.1)" : t.acS, border: `1px solid ${c ? "rgba(55,194,235,.2)" : t.bH}`, borderRadius: 10, color: c ? "#37c2eb" : t.ac, fontSize: 12, fontWeight: 600, cursor: "pointer" }}><Ic name={c ? "check" : "copy"} size={14}/> {c ? "¡Copiado!" : (label || "Copiar")}</button>; };
const Logo = ({ size = 32 }) => <img src="/logo.jpg" alt="DataGrowth" style={{ width: size, height: size, borderRadius: size * 0.25, objectFit: "cover" }}/>;

// ══════ LANDING PAGE (Supabase-inspired) ══════
const BLOG_POSTS = [
  { id: 1, tag: "Marketing IA", emoji: "🤖", title: "Cómo generar contenido para redes sociales con IA en minutos", desc: "Aprende a usar IA para crear posts, carruseles y reels profesionales sin ser diseñador.", date: "4 Jun 2026", min: "5 min", body: "En DataGrowth hemos desarrollado una plataforma que permite a agencias digitales y emprendedores generar contenido profesional en segundos. La clave está en configurar correctamente la identidad de tu marca.\n\nCon nuestra Fábrica Creativa puedes generar posts con imagen, carruseles de 5 slides, reels de hasta 8 segundos, copys para redes sociales, anuncios y emails de marketing. Todo con el tono, colores y voz de tu marca.\n\nEl proceso es simple: describes lo que quieres en lenguaje natural y la IA genera imagen, texto y hashtags listos para publicar." },
  { id: 2, tag: "Estrategia", emoji: "📈", title: "5 estrategias de marketing digital que toda agencia debe aplicar en 2026", desc: "El marketing digital evoluciona rápido. Estas son las estrategias que están dominando este año.", date: "1 Jun 2026", min: "7 min", body: "El marketing digital en 2026 está siendo transformado por la inteligencia artificial. Aquí las 5 estrategias más efectivas:\n\n1. Contenido hiperpersonalizado: ya no basta con contenido genérico. Las marcas que ganan hablan directamente a su audiencia.\n\n2. Video corto consistente: Instagram Reels y TikTok siguen dominando. La clave es la consistencia, no la perfección.\n\n3. Email marketing automatizado: el email tiene el ROI más alto de todos los canales.\n\n4. Branding coherente en todos los canales: tu marca debe verse y sonar igual en Instagram, email y anuncios.\n\n5. Datos reales en el contenido: la IA que usa información real de tu marca genera contenido más creíble." },
  { id: 3, tag: "Branding", emoji: "🎨", title: "Por qué tu marca necesita contenido consistente para crecer en redes", desc: "La consistencia es el secreto del crecimiento orgánico. Te explicamos cómo lograrlo con IA.", date: "28 May 2026", min: "4 min", body: "El algoritmo de Instagram favorece a las cuentas que publican consistentemente. No es sobre cantidad, es sobre regularidad.\n\nEl problema es que crear contenido de calidad todos los días es agotador y costoso. Ahí es donde entra DataGrowth.\n\nCon nuestra plataforma puedes configurar tu marca una sola vez y generar semanas de contenido en minutos. Mismo tono, mismos colores, misma voz de marca en cada pieza." },
];

const Landing = ({ onLogin, onRegister, dark, setDark, showPlans, setShowPlans }) => {
  const t = useT();
  const [customAmount, setCustomAmount] = useState(150);
  const [blogOpen, setBlogOpen] = useState(null);

  const openBlog = (post) => {
    setBlogOpen(post);
    window.history.pushState({ blog: post.id }, "", "#blog-" + post.id);
  };
  const closeBlog = () => {
    setBlogOpen(null);
    window.history.back();
  };

  useEffect(() => {
    const handlePop = (e) => { if (!e.state?.blog) setBlogOpen(null); };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);
  const features = [
    { icon: "🖼️", title: "Imagenes AI", desc: "Genera imagenes profesionales con Nano Banana de Google. Sube fotos reales de tu producto y la IA las transforma." },
    { icon: "🎬", title: "Videos AI", desc: "Crea reels de 8 segundos con Veo 3.1. Videos realistas con audio, desde texto o animando tus propias fotos." },
    { icon: "✍️", title: "Copy Profesional", desc: "Captions con emojis, ganchos que atrapan, CTAs que convierten. Texto listo para copiar y publicar." },
    { icon: "🎠", title: "Carruseles", desc: "5 slides optimizados con estructura gancho-valor-CTA. Solo arma el diseno con los textos generados." },
    { icon: "📧", title: "Email Marketing", desc: "Emails completos y persuasivos listos para enviar a tus clientes. Con CTA claro y tono de tu marca." },
    { icon: "🏢", title: "Multi-marca", desc: "Gestiona multiples marcas desde un solo panel. Cada una con sus colores, tono, audiencia y voz unica." },
    { icon: "🎨", title: "Branding Kit", desc: "Configura colores, tipografias, tono, audiencia y productos. La IA usa TODO para generar contenido fiel a tu marca." },
    { icon: "🌐", title: "Info Real", desc: "Se conecta a tu pagina web y redes para usar informacion REAL. Nunca inventa precios ni datos falsos." },
    { icon: "📢", title: "Anuncios", desc: "Genera imagenes y textos publicitarios listos para pauta en Meta Ads, Google Ads y mas." },
  ];

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const NAV_LINKS = [
    { label: "Inicio", id: "inicio" },
    { label: "Funciones", id: "funciones" },
    { label: "Quiénes somos", id: "quienes" },
    { label: "Planes", action: () => setShowPlans(true) },
    { label: "Blog", id: "blog" },
  ];

  return (
    <div style={{ background: t.bg, minHeight: "100vh", fontFamily: "'Segoe UI',system-ui,sans-serif", color: t.tx }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}} @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} @keyframes glow{0%,100%{text-shadow:0 0 20px rgba(55,194,235,0.3)}50%{text-shadow:0 0 40px rgba(55,194,235,0.6),0 0 80px rgba(55,194,235,0.2)}} .dg-title{animation:glow 3s ease-in-out infinite}`}</style>

      {/* NAV */}
      <nav style={{ padding: "0", borderBottom: `1px solid ${t.brd}`, position: "sticky", top: 0, background: t.bg + "f2", backdropFilter: "blur(16px)", zIndex: 50, height: 62, display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 1100, width: "100%", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, overflow: "hidden" }}><Logo size={30}/></div>
            <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.5 }}>DataGrowth</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {NAV_LINKS.map((l, i) => (
              <button key={i} onClick={l.action || (() => scrollTo(l.id))}
                style={{ background: "transparent", border: "none", color: t.txS, fontSize: 13, fontWeight: 500, padding: "7px 13px", borderRadius: 7, cursor: "pointer", transition: "all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.color = t.ac; e.currentTarget.style.background = t.acS; }}
                onMouseLeave={e => { e.currentTarget.style.color = t.txS; e.currentTarget.style.background = "transparent"; }}>
                {l.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div onClick={() => setDark(!dark)} style={{ cursor: "pointer", color: t.txM, padding: 7, borderRadius: 7, background: t.bgI, display: "flex" }}><Ic name={dark ? "sun" : "moon"} size={15}/></div>
            <Btn secondary onClick={onLogin} style={{ fontSize: 13, padding: "7px 16px" }}>Iniciar sesion</Btn>
            <Btn primary onClick={() => onRegister()} style={{ fontSize: 13, padding: "7px 16px" }}>Crear cuenta gratis</Btn>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div id="inicio" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: t.ac, borderRadius: "50%", filter: "blur(180px)", opacity: .06, pointerEvents: "none" }}/>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1px solid ${t.ac}50`, borderRadius: 6, padding: "5px 16px 5px 10px", fontSize: 11, color: t.ac, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.ac, animation: "pulse 2s infinite" }}/> Plataforma AI para agencias digitales
        </div>
        <h1 className="dg-title" style={{ fontSize: "clamp(40px,6vw,72px)", fontWeight: 900, lineHeight: 1.04, letterSpacing: -2.5, marginBottom: 24 }}>Crea contenido en minutos{" "}<span style={{ color: t.ac }}>Escala a miles</span></h1>
        <p style={{ fontSize: 18, color: t.txS, maxWidth: 640, margin: "0 auto 36px", lineHeight: 1.6 }}>DataGrowth es la plataforma de inteligencia artificial que genera posts, imagenes, videos, carruseles, reels, copys y emails profesionales para tu marca o la de tus clientes. Configura tu identidad de marca una sola vez y genera contenido ilimitado con un clic.</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
          <button onClick={() => setShowPlans(true)} style={{ background: t.ac, border: "none", color: "#fff", fontSize: 17, fontWeight: 700, padding: "16px 44px", borderRadius: 10, cursor: "pointer", boxShadow: `0 0 30px ${t.ac}40` }}>Ver planes</button>
          <button onClick={() => onRegister()} style={{ background: "transparent", border: `1px solid ${t.brd}`, color: t.tx, fontSize: 16, fontWeight: 500, padding: "16px 32px", borderRadius: 10, cursor: "pointer" }}>Empezar gratis →</button>
        </div>
      </div>
      <div id="funciones" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: t.ac, textTransform: "uppercase", letterSpacing: 3, marginBottom: 12 }}>Funcionalidades</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>Todo lo que tu agencia necesita</h2>
          <p style={{ fontSize: 15, color: t.txS, marginTop: 10, maxWidth: 500, margin: "10px auto 0" }}>Una sola plataforma para generar todo el contenido de tus marcas.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: t.bgC, border: "1px solid " + t.brd, borderRadius: 16, padding: 28, transition: "all .3s", cursor: "default" }} onMouseEnter={e => { e.currentTarget.style.borderColor = t.ac + "50"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px " + t.sh; }} onMouseLeave={e => { e.currentTarget.style.borderColor = t.brd; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: t.acS, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>{f.icon}</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: t.tx, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: t.txS, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT US */}
      <div id="quienes" style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 500, height: 300, background: t.ac, borderRadius: "50%", filter: "blur(160px)", opacity: .04, pointerEvents: "none" }}/>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: t.ac, textTransform: "uppercase", letterSpacing: 3, marginBottom: 12 }}>Quienes Somos</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>La agencia digital que trabaja 24/7 para tu marca</h2>
          <p style={{ fontSize: 16, color: t.txS, marginTop: 12, maxWidth: 700, margin: "12px auto 0", lineHeight: 1.7 }}>DataGrowth es una plataforma de inteligencia artificial disenada para agencias digitales, emprendedores y empresas que necesitan generar contenido profesional de forma rapida, consistente y alineado con su identidad de marca.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            { icon: "🎯", title: "Que hacemos", desc: "Generamos contenido completo para redes sociales usando inteligencia artificial de ultima generacion. Desde imagenes y videos hasta copys, carruseles, reels, anuncios y emails de marketing. Todo personalizado con los colores, tono de voz, productos e informacion real de tu marca." },
            { icon: "🚀", title: "Como funciona", desc: "1. Creas tu marca y configuras tu Brand Kit. 2. Conectas tu pagina web o redes sociales. 3. Seleccionas el tipo de contenido. 4. Describes lo que quieres. 5. La IA genera todo en segundos: imagen, texto, hashtags, listo para publicar." },
            { icon: "💡", title: "Que nos diferencia", desc: "DataGrowth se conecta a tu pagina web y redes sociales para extraer informacion REAL. Nunca inventa precios, productos ni servicios. Cada pieza de contenido refleja tu marca tal como es. Sube fotos reales y la IA las transforma en contenido profesional." },
            { icon: "🏢", title: "Para quien es", desc: "Para agencias digitales que manejan multiples marcas. Para emprendedores que necesitan contenido profesional. Para empresas que quieren mantener sus redes activas. Para cualquier negocio que quiera escalar su presencia digital." }
          ].map((item, i) => <div key={i} style={{ background: t.bgC, border: "1px solid " + t.brd, borderRadius: 16, padding: 28, transition: "all .3s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = t.ac + "50"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px " + t.sh; }} onMouseLeave={e => { e.currentTarget.style.borderColor = t.brd; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: t.acS, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 14 }}>{item.icon}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: t.tx, marginBottom: 10 }}>{item.title}</div>
            <div style={{ fontSize: 14, color: t.txS, lineHeight: 1.7 }}>{item.desc}</div>
          </div>)}
        </div>
        <div style={{ marginTop: 24, background: t.bgC, border: "1px solid " + t.brd, borderRadius: 16, padding: 28 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: t.tx, marginBottom: 16, textAlign: "center" }}>🛠️ Tecnologia que impulsa DataGrowth</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {[
                { icon: "🤖", name: "Claude AI", desc: "Genera textos, copys y emails de nivel agencia" },
                { icon: "🖼️", name: "Nano Banana", desc: "Crea imagenes profesionales con IA de Google" },
                { icon: "🎬", name: "Veo 3.1", desc: "Genera videos de 8 segundos en alta calidad" },
                { icon: "🌐", name: "Web Scraping", desc: "Extrae info real de tu pagina web y redes" }
              ].map((t2, i) => <div key={i} style={{ textAlign: "center", padding: 16, background: t.bgI, borderRadius: 12, transition: "all .3s" }} onMouseEnter={e => { e.currentTarget.style.background = t.acS; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.background = t.bgI; e.currentTarget.style.transform = "none"; }}><div style={{ fontSize: 24, marginBottom: 6 }}>{t2.icon}</div><div style={{ fontSize: 13, fontWeight: 600, color: t.tx, marginBottom: 4 }}>{t2.name}</div><div style={{ fontSize: 11, color: t.txS }}>{t2.desc}</div></div>)}
            </div>
        </div>
      </div>

      {/* BLOG */}
      <div id="blog" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        {blogOpen ? (
          <div>
            <button onClick={closeBlog} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", color: t.txS, fontSize: 14, cursor: "pointer", marginBottom: 40, padding: 0, fontWeight: 500 }}>
              <Ic name="back" size={16}/> Volver al blog
            </button>
            <div style={{ maxWidth: 680 }}>
              <div style={{ display: "inline-block", background: t.acS, color: t.ac, fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 6, marginBottom: 24, textTransform: "uppercase", letterSpacing: 1.5 }}>{blogOpen.tag}</div>
              <h1 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, letterSpacing: -2, marginBottom: 20, lineHeight: 1.05 }}>{blogOpen.title}</h1>
              <div style={{ fontSize: 12, color: t.txM, marginBottom: 48, textTransform: "uppercase", letterSpacing: 1 }}>{blogOpen.date} · {blogOpen.min} de lectura</div>
              {blogOpen.body.split("\n\n").map((p, i) => <p key={i} style={{ fontSize: 16, color: t.txS, lineHeight: 1.8, marginBottom: 24 }}>{p}</p>)}
              <div style={{ marginTop: 40, padding: 28, background: t.acS, border: `1px solid ${t.ac}40`, borderRadius: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: t.tx, marginBottom: 12 }}>¿Listo para escalar tu contenido?</div>
                <button onClick={() => onRegister()} style={{ background: t.ac, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, padding: "12px 28px", borderRadius: 8, cursor: "pointer" }}>Crear cuenta gratis →</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.ac, textTransform: "uppercase", letterSpacing: 3, marginBottom: 12 }}>Blog</div>
              <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>Recursos para tu agencia</h2>
              <p style={{ fontSize: 15, color: t.txS, marginTop: 10, maxWidth: 500, margin: "10px auto 0" }}>Artículos sobre marketing digital, contenido con IA y estrategias para crecer.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
              {BLOG_POSTS.map((post, i) => (
                <div key={i} onClick={() => openBlog(post)} style={{ border: `1px solid ${t.brd}`, borderRadius: 16, overflow: "hidden", cursor: "pointer", background: t.bgC, transition: "all .25s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = t.ac + "50"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${t.sh}`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = t.brd; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ height: 140, background: `linear-gradient(135deg, ${t.ac}15, ${t.ac}03)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, borderBottom: `1px solid ${t.brd}` }}>{post.emoji}</div>
                  <div style={{ padding: 24 }}>
                    <div style={{ display: "inline-block", background: t.acS, color: t.ac, fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 5, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>{post.tag}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: t.tx, marginBottom: 10, lineHeight: 1.3 }}>{post.title}</div>
                    <div style={{ fontSize: 13, color: t.txS, lineHeight: 1.6, marginBottom: 16 }}>{post.desc}</div>
                    <div style={{ fontSize: 11, color: t.txM, textTransform: "uppercase", letterSpacing: 1 }}>{post.date} · {post.min}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ textAlign: "center", padding: "70px 40px", position: "relative", overflow: "hidden", background: t.bgC, border: "1px solid " + t.brd, borderRadius: 20 }}>
          <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: t.ac, borderRadius: "50%", filter: "blur(150px)", opacity: .1, pointerEvents: "none" }}/>
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🚀</div>
            <h2 style={{ fontSize: 34, fontWeight: 700, marginBottom: 14 }}>Empieza a crear contenido <span style={{ color: t.ac }}>hoy</span></h2>
            <p style={{ fontSize: 16, color: t.txS, marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>Unete a las agencias y emprendedores que ya generan contenido profesional con IA. Sin tarjeta de credito.</p>
          </div>
        </div>
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

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}} @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} nav,section,h1,h2,p{animation:fadeUp .6s ease-out}`}</style>

      {/* PLANS PAGE OVERLAY */}
      {showPlans && <div style={{ position: "fixed", inset: 0, background: t.bg, zIndex: 200, overflow: "auto" }}>
        <nav style={{ padding: "16px 0", borderBottom: "1px solid " + t.brd, background: t.bg + "ee", backdropFilter: "blur(12px)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setShowPlans(false)}>
              <Ic name="back" size={20}/>
              <div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden" }}><Logo size={32}/></div>
              <span style={{ fontSize: 16, fontWeight: 700 }}>DataGrowth</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Btn secondary onClick={onLogin} style={{ fontSize: 13, padding: "8px 18px" }}>Iniciar sesion</Btn>
              <Btn primary onClick={() => onRegister()} style={{ fontSize: 13, padding: "8px 18px" }}>Crear cuenta gratis</Btn>
            </div>
          </div>
        </nav>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 80px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: t.ac, textTransform: "uppercase", letterSpacing: 3, marginBottom: 12 }}>Precios</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>Elige el plan perfecto para ti</h2>
            <p style={{ fontSize: 16, color: t.txS, marginTop: 12 }}>Empieza gratis. Escala cuando lo necesites. Cancela cuando quieras.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {PLANS.map(p => (
              <div key={p.id} style={{ position: "relative", background: t.bgC, border: p.pop ? "2px solid " + p.color : "1px solid " + t.brd, borderRadius: 20, textAlign: "center", padding: 40, overflow: "visible", transition: "all .3s", display: "flex", flexDirection: "column" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 60px " + t.sh; }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                {p.pop && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: t.gr, color: "#fff", padding: "6px 28px", borderRadius: 20, fontSize: 12, fontWeight: 700, boxShadow: "0 4px 15px rgba(55,194,235,.3)" }}>Mas popular</div>}
                <div style={{ fontSize: 22, fontWeight: 700, color: t.tx, marginBottom: 6, paddingTop: p.pop ? 10 : 0 }}>{p.name}</div>
                <div style={{ fontSize: 14, color: t.txS, marginBottom: 20 }}>{p.desc}</div>
                <div style={{ fontSize: 52, fontWeight: 800, color: p.color, marginBottom: 6 }}>{p.price}<span style={{ fontSize: 16, fontWeight: 400, color: t.txM }}>/mes</span></div>
                <div style={{ borderTop: "1px solid " + t.brd, margin: "24px 0", paddingTop: 20, flex: 1 }}>
                  {p.features.map((f, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", fontSize: 15, color: t.tx, textAlign: "left" }}><span style={{ color: t.ac, fontSize: 18, flexShrink: 0 }}>✓</span>{f}</div>)}
                </div>
                <Btn primary={p.pop} secondary={!p.pop} onClick={() => onRegister(p)} style={{ width: "100%", justifyContent: "center", padding: "16px 24px", borderRadius: 14, fontSize: 16, marginTop: "auto" }}>{p.id === "free" ? "Crear cuenta gratis" : "Empezar con " + p.name}</Btn>
              </div>
            ))}
          </div>
          {/* CUSTOM PLAN */}
          <div style={{ marginTop: 40, background: t.bgC, border: "1px solid " + t.brd, borderRadius: 20, padding: 40, overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, background: t.ac, borderRadius: "50%", filter: "blur(120px)", opacity: .06, pointerEvents: "none" }}/>
            <div style={{ position: "relative" }}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: t.ac, textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>Plan personalizado</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: t.tx }}>Tu defines cuanto invertir</div>
                <div style={{ fontSize: 14, color: t.txS, marginTop: 6 }}>Mueve el slider o escribe el monto. Calculamos automaticamente lo que recibes.</div>
              </div>
              <div style={{ maxWidth: 500, margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                  <input type="range" min="150" max="500" value={customAmount} onChange={e => setCustomAmount(Number(e.target.value))} style={{ flex: 1, height: 6, borderRadius: 3, background: t.brd, cursor: "pointer", accentColor: "#37c2eb" }}/>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, background: t.bgI, border: "1px solid " + t.brd, borderRadius: 12, padding: "8px 14px" }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: t.ac }}>$</span>
                    <input type="number" min="150" max="500" value={customAmount} onChange={e => setCustomAmount(Math.max(150, Math.min(500, Number(e.target.value))))} style={{ width: 60, fontSize: 22, fontWeight: 800, color: t.tx, background: "transparent", border: "none", outline: "none", textAlign: "center" }}/>
                    <span style={{ fontSize: 13, color: t.txM }}>/mes</span>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
                  {[
                    { label: "Posts/mes", value: 300 + Math.round((customAmount - 149) * 3), icon: "🖼️" },
                    { label: "Videos/mes", value: 20 + Math.round(customAmount - 149), icon: "🎬" },
                    { label: "Marcas", value: "Ilimitadas", icon: "🏢" },
                    { label: "Formatos", value: "Todos", icon: "✨" }
                  ].map((item, i) => <div key={i} style={{ textAlign: "center", padding: 16, background: t.bgI, borderRadius: 14, border: "1px solid " + t.brd }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: t.ac }}>{item.value}</div>
                    <div style={{ fontSize: 11, color: t.txM, marginTop: 2 }}>{item.label}</div>
                  </div>)}
                </div>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                  <Btn primary onClick={() => { const posts = 300 + Math.round((customAmount - 149) * 3); const vids = 20 + Math.round(customAmount - 149); onRegister({ id: "custom", name: "Custom", price: "$" + customAmount, desc: "Plan personalizado", color: "#37c2eb", brands: 99, limits: { post_visual: posts, carousel: posts, post_text: posts, ad: posts, email: posts, reel: vids }, features: [posts + " posts/mes", vids + " videos/mes", "Marcas ilimitadas", "Todos los formatos", "Info real de la web", "Soporte dedicado"] }); }} style={{ padding: "16px 40px", borderRadius: 14, fontSize: 16 }}>Empezar con plan de ${customAmount}/mes</Btn>
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <p style={{ fontSize: 13, color: t.txM }}>Todos los planes incluyen acceso a la plataforma completa. Sin permanencia. Cancela cuando quieras.</p>
            <Btn ghost onClick={() => setShowPlans(false)} style={{ marginTop: 16, fontSize: 14 }}><Ic name="back" size={16}/> Volver al inicio</Btn>
          </div>
        </div>
      </div>}
    </div>
  );
};

// ══════ AUTH ══════
const ResetPassword = ({ t, onDone }) => {
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);

  const save = async () => {
    if (!pass || pass.length < 8) return setErr("La contraseña debe tener al menos 8 caracteres");
    if (pass !== pass2) return setErr("Las contraseñas no coinciden");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pass });
    setLoading(false);
    if (error) return setErr(error.message);
    setOk(true);
    setTimeout(() => onDone(), 2000);
  };

  return <>
    <div style={{ fontSize: 22, fontWeight: 700, color: t.tx, marginBottom: 4 }}>Nueva contraseña</div>
    <p style={{ fontSize: 14, color: t.txS, marginBottom: 24 }}>Escribe tu nueva contraseña.</p>
    {ok ? <div style={{ textAlign: "center", padding: 20 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: t.tx }}>¡Contraseña actualizada!</div>
      <div style={{ fontSize: 13, color: t.txS, marginTop: 6 }}>Redirigiendo al login...</div>
    </div> : <>
      <div style={{ marginBottom: 16 }}><Label req>Nueva contraseña</Label><Input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Mínimo 8 caracteres"/></div>
      <div style={{ marginBottom: 24 }}><Label req>Repetir contraseña</Label><Input value={pass2} onChange={e => setPass2(e.target.value)} type="password" placeholder="Repite la contraseña" onKeyDown={e => e.key === "Enter" && save()}/></div>
      <button onClick={save} style={{ width: "100%", padding: 16, background: t.gr, color: "#fff", border: "none", borderRadius: 50, fontSize: 16, fontWeight: 600, cursor: "pointer", opacity: (!pass || !pass2) ? .5 : 1 }}>{loading ? "Guardando..." : "Guardar contraseña"}</button>
      {err && <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, fontSize: 13, color: "#ef4444", textAlign: "center" }}>{err}</div>}
    </>}
  </>;
};

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

  const [err, setErr] = useState("");

  const go = async () => {
    setErr("");
    if (mode === "forgot") {
      if (!email) return;
      setLl(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
      setLl(false);
      if (error) { setErr(error.message); return; }
      setSent(true);
      return;
    }
    if (!email || !pass) return;
    if (mode === "register" && !name) return;
    if (mode === "register" && isPaid && (!cardNum || !cardExp || !cardCvc)) return;
    setLl(true);

    if (mode === "register") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { name, company, phone } }
      });
      setLl(false);
      if (error) { setErr(error.message === "User already registered" ? "Ya existe una cuenta con este email" : error.message); return; }
      if (data.user) {
        const profile = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
        onAuth({ id: data.user.id, name, email, company, phone, role: profile.data?.role || "client", plan: profile.data?.plan || "free" });
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      setLl(false);
      if (error) { setErr(error.message === "Invalid login credentials" ? "Email o contraseña incorrectos" : error.message); return; }
      if (data.user) {
        const profile = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
        onAuth({ id: data.user.id, name: profile.data?.name || email.split("@")[0], email: data.user.email, company: profile.data?.company || "", phone: profile.data?.phone || "", role: profile.data?.role || "client", plan: profile.data?.plan || "free" });
      }
    }
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
          {err && <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, fontSize: 13, color: "#ef4444", textAlign: "center" }}>{err}</div>}
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
          {err && <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, fontSize: 13, color: "#ef4444", textAlign: "center" }}>{err}</div>}
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

        {mode === "reset-password" && <ResetPassword t={t} onDone={() => setMode("login")} />}
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
const BrandKit = ({ brands, setBrands, user }) => {
  const t = useT();
  const [sel, setSel] = useState(brands[0] || null);
  const [ed, setEd] = useState(null);
  const [cr, setCr] = useState(false);
  const [del, setDel] = useState(null);
  const [tab, setTab] = useState("identity");
  const save = async (b) => {
    if (cr) {
      const { data } = await supabase.from("brands").insert({ user_id: user.id, name: b.name, short: b.short, color: b.color, industry: b.industry, tone: b.tone, audience: b.audience, emoji: b.emoji, brand_voice: b.brandVoice, img_style: b.imgStyle, sector: b.sector, colors: b.colors, products: b.products, description: b.description, differentiator: b.differentiator, website: b.website, instagram: b.instagram, facebook: b.facebook }).select().single();
      if (data) { const nb = { ...data, brandVoice: data.brand_voice, imgStyle: data.img_style }; setBrands([...brands, nb]); setSel(nb); }
    } else {
      await supabase.from("brands").update({ name: b.name, short: b.short, color: b.color, industry: b.industry, tone: b.tone, audience: b.audience, emoji: b.emoji, brand_voice: b.brandVoice, img_style: b.imgStyle, sector: b.sector, colors: b.colors, products: b.products, description: b.description, differentiator: b.differentiator, website: b.website, instagram: b.instagram, facebook: b.facebook }).eq("id", b.id);
      setBrands(brands.map(x => x.id === b.id ? b : x)); setSel(b);
    }
    setEd(null); setCr(false);
  };

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
      {del && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}><Card style={{ width: 380, textAlign: "center" }}><div style={{ fontSize: 36, marginBottom: 10 }}>⚠️</div><div style={{ fontSize: 17, fontWeight: 700, color: t.tx, marginBottom: 8 }}>¿Eliminar?</div><div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}><Btn onClick={() => setDel(null)}>Cancelar</Btn><Btn danger onClick={async () => { await supabase.from("brands").delete().eq("id", del); setBrands(brands.filter(b => b.id !== del)); setSel(brands.find(b => b.id !== del)); setDel(null); }}>Eliminar</Btn></div></Card></div>}
    </Section>
  );
};

// ══════ FACTORY ══════
const Factory = ({ brands, gemKey, isAdmin, user }) => {
  const t = useT();
  const [brand, setBrand] = useState(brands[0]);
  const [ct, setCt] = useState(CTYPES[0]);
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [txt, setTxt] = useState("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState({});
  const currentMonth = new Date().toISOString().slice(0, 7);
  const getUsage = (typeId) => usage[typeId] || 0;
  const addUsage = async (typeId) => {
    setUsage(prev => ({ ...prev, [typeId]: (prev[typeId] || 0) + 1 }));
    const { data: existing } = await supabase.from("usage").select("*").eq("user_id", user?.id).eq("content_type", typeId).eq("month", currentMonth).single();
    if (existing) {
      await supabase.from("usage").update({ count: existing.count + 1 }).eq("id", existing.id);
    } else {
      await supabase.from("usage").insert({ user_id: user?.id, content_type: typeId, month: currentMonth, count: 1 });
    }
  };
  useEffect(() => {
    if (!user?.id || isAdmin) return;
    supabase.from("usage").select("*").eq("user_id", user.id).eq("month", currentMonth).then(({ data }) => {
      const u = {}; (data || []).forEach(r => { u[r.content_type] = r.count; }); setUsage(u);
    });
  }, [user?.id]);
  const userPlan = isAdmin ? PLANS[2] : PLANS[0];
  const getLimit = (typeId) => userPlan.limits?.[typeId] ?? 9999;
  const getLeft = (typeId) => getLimit(typeId) - getUsage(typeId);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoProgress, setVideoProgress] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedPreviews, setUploadedPreviews] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [lastAiImage, setLastAiImage] = useState(null);
  const handleUploadImages = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const preview = URL.createObjectURL(file);
      setUploadedPreviews(prev => [...prev, preview]);
      const img = new Image();
      img.onload = () => {
        const maxW = 512;
        const scale = img.width > maxW ? maxW / img.width : 1;
        const c = document.createElement("canvas");
        c.width = img.width * scale;
        c.height = img.height * scale;
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        const b64 = c.toDataURL("image/jpeg", 0.7).split(",")[1];
        setUploadedImages(prev => [...prev, b64]);
      };
      img.src = preview;
    });
    e.target.value = "";
  };
  const removeUploadedImage = (idx) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== idx));
    setUploadedPreviews(prev => prev.filter((_, i) => i !== idx));
  };
  const saveImageForRefinement = (imgUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const maxW = 512;
        const scale = img.width > maxW ? maxW / img.width : 1;
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        const b64 = c.toDataURL("image/jpeg", 0.7).split(",")[1];
        setLastAiImage(b64);
        resolve(b64);
      };
      img.onerror = () => { resolve(null); };
      img.src = imgUrl;
    });
  };
  const pollVideo = async (opName, ep, respUrl, statUrl) => {
    setVideoLoading(true); setVideoProgress("Generando video con IA... (1-3 min)");
    let attempts = 0;
    const maxAttempts = 60;
    let falInfo = "";
    while (attempts < maxAttempts) {
      await new Promise(r => setTimeout(r, 5000));
      attempts++;
      setVideoProgress("Generando video... " + Math.min(Math.round((attempts/maxAttempts)*100), 95) + "%" + falInfo);
      try {
        let url = "/api/video?action=check&op=" + encodeURIComponent(opName);
        if (ep) url += "&endpoint=" + encodeURIComponent(ep);
        if (respUrl) url += "&response_url=" + encodeURIComponent(respUrl);
        if (statUrl) url += "&status_url=" + encodeURIComponent(statUrl);
        url += "&t=" + Date.now();
        const r = await fetch(url);
        const d = await r.json();
        if (d.status === "completed" && d.video_url) {
          setVideoUrl(d.video_url);
          setVideoLoading(false);
          setVideoProgress("");
          return;
        }
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
        if (d.status === "completed_no_url") { setVideoProgress("Video completo pero sin URL. Debug: " + (d.debug || "sin info")); setVideoLoading(false); return; }
        if (d.fal_status) falInfo = " [" + d.fal_status + (d.queue_position ? " pos:" + d.queue_position : "") + "]";
      } catch (e) { /* keep polling */ }
    }
    setVideoProgress("El video tardo demasiado. Intenta de nuevo con una instruccion mas corta o sin foto."); setVideoLoading(false);
  };
  const go = async () => {
    if (!topic.trim() || !brand) return;
    const currentTopic = topic;
    const currentImages = [...uploadedImages];
    const isRefining = ct.fmt === "visual" && lastAiImage && currentImages.length === 0;
    const isDirectEdit = ct.fmt === "visual" && currentImages.length > 0;
    // For visual, add to chat and clear input immediately
    if (ct.fmt === "visual") {
      setChatHistory(prev => [...prev, { role: "user", text: currentTopic, images: uploadedPreviews.length > 0 ? [...uploadedPreviews] : null }]);
      setTopic("");
      setUploadedImages([]);
      setUploadedPreviews([]);
    }
    if (!isAdmin && getLeft(ct.id) <= 0) { setTxt("Has alcanzado el limite de " + ct.label + " de tu plan (" + getLimit(ct.id) + "/" + "mes). Actualiza a Pro o Agency para generar mas contenido."); setResult({t:"text"}); return; }
    setLoading(true); setResult(null); setTxt(""); setVideoUrl(null); setVideoLoading(false); setVideoProgress("");
    const brandColors = (brand.colors || [brand.color]).join(", ");
    const brandStyle = brand.imgStyle || "professional modern";

    // ── DIRECT EDIT: user uploaded a photo, send instruction directly to image API ──
    if (isDirectEdit) {
      const editPrompt = "You are an IMAGE EDITOR, not an image generator. You have been given reference images. Follow these instructions EXACTLY: " + currentTopic + ". RULES: 1) Do NOT regenerate or recreate the image. EDIT the existing image. 2) Keep the EXACT same scene, background, people, objects, lighting, colors, and composition. 3) ONLY add or modify what the user explicitly asked for. 4) If the user says 'add logo', place the provided logo image on the photo without changing anything else. 5) If the user asks to improve faces, improve ONLY the faces. 6) Any text must be in Spanish. 7) Do NOT add any brand name, watermark or text that was not asked for.";
      setChatHistory(prev => [...prev, { role: "ai", text: "", headline: "", loading: true }]);
      try {
        const r = await fetch("/api/image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: editPrompt, images: currentImages }) });
        if (!r.ok) throw new Error("API error " + r.status);
        const b = await r.blob();
        if (!r.headers.get("content-type")?.includes("image")) throw new Error("No image");
        const u = URL.createObjectURL(b);
        await saveImageForRefinement(u);
        setChatHistory(prev => { const n = [...prev]; const last = n.findLastIndex(m => m.role === "ai" && m.loading); if (last > -1) { n[last] = { ...n[last], img: u, loading: false }; } return n; });
      } catch (e) {
        setChatHistory(prev => { const n = [...prev]; const last = n.findLastIndex(m => m.role === "ai" && m.loading); if (last > -1) { n[last] = { ...n[last], text: "Error: " + e.message, loading: false }; } return n; });
      }
      if (!isAdmin) addUsage(ct.id);
      setLoading(false);
      return;
    }

    // ── DIRECT REFINEMENT: skip text gen, send instruction directly to image API ──
    if (isRefining) {
      const editPrompt = "You are an IMAGE EDITOR. This is the SAME image from before. The user wants these SPECIFIC changes: " + currentTopic + ". RULES: 1) This is NOT a new image. EDIT the existing one. 2) Keep the EXACT same scene, people, objects, background, lighting. 3) ONLY modify what the user asked. Everything else stays IDENTICAL. 4) Do NOT regenerate the image from scratch. 5) Do NOT add any text, brand name or watermark unless specifically asked. 6) If asked to remove something, remove ONLY that thing.";
      setChatHistory(prev => [...prev, { role: "ai", text: "", headline: "", loading: true }]);
      try {
        const r = await fetch("/api/image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: editPrompt, image_base64: lastAiImage }) });
        if (!r.ok) throw new Error("API error " + r.status);
        const b = await r.blob();
        if (!r.headers.get("content-type")?.includes("image")) throw new Error("No image");
        const u = URL.createObjectURL(b);
        await saveImageForRefinement(u);
        setChatHistory(prev => { const n = [...prev]; const last = n.findLastIndex(m => m.role === "ai" && m.loading); if (last > -1) { n[last] = { ...n[last], img: u, loading: false }; } return n; });
      } catch (e) {
        setChatHistory(prev => { const n = [...prev]; const last = n.findLastIndex(m => m.role === "ai" && m.loading); if (last > -1) { n[last] = { ...n[last], text: "Error: " + e.message, loading: false }; } return n; });
      }
      if (!isAdmin) addUsage(ct.id);
      setLoading(false);
      return;
    }

    // ── NORMAL GENERATION FLOW ──
    // Fetch real info from brand website (5 sec timeout)
    let realInfo = "";
    const scrapeUrl = brand.website || brand.instagram || brand.facebook || "";
    if (scrapeUrl) {
      try {
        const ctrl = new AbortController();
        const tmout = setTimeout(() => ctrl.abort(), 5000);
        const wr = await fetch("/api/scrape?url=" + encodeURIComponent(scrapeUrl.startsWith("http") ? scrapeUrl : "https://" + scrapeUrl), { signal: ctrl.signal });
        clearTimeout(tmout);
        const wd = await wr.json();
        if (wd.text) realInfo = wd.text.substring(0, 1500);
      } catch (e) { /* continue without web info */ }
    }
    // Start video generation for reels: Gemini image first, then fal.ai animates it
    const fmt = ct.fmt;
    if (fmt === "reel") {
      const imgPrompt = "Cinematic wide shot photo for " + brand.name + " (" + brand.industry + "). Topic: " + topic + ". Style: " + brandStyle + ". IMPORTANT: If people appear, show them from medium or wide angle, never extreme close-ups. Any visible text must be in Spanish. Do NOT include any logo. Photorealistic, high quality, 9:16 vertical format.";
      const motionPrompt = "Gentle cinematic motion: slow camera pan, subtle movement in the scene, light breeze, atmospheric effects. Keep all people and faces stable. Smooth and professional.";
      
      setVideoLoading(true); setVideoProgress("Generando imagen base con IA...");
      
      // Step 1: Generate image with Gemini
      const generateAndAnimate = async () => {
        try {
          let imageBase64 = null;
          
          // If user uploaded images, use those
          if (currentImages[0]) {
            imageBase64 = currentImages[0];
          } else {
            // Generate image with Gemini
            const imgRes = await fetch("/api/image?prompt=" + encodeURIComponent(imgPrompt));
            if (imgRes.ok && imgRes.headers.get("content-type")?.includes("image")) {
              const blob = await imgRes.blob();
              imageBase64 = await new Promise(resolve => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(",")[1]);
                reader.readAsDataURL(blob);
              });
            }
          }
          
          if (!imageBase64) {
            // Fallback: text-to-video without image
            const videoBody = { prompt: imgPrompt.substring(0, 500) };
            const r = await fetch("/api/video", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(videoBody) });
            const d = await r.json();
            if (d.operation) { pollVideo(d.operation, d.endpoint, d.response_url, d.status_url); } else { setVideoProgress("Error: " + (d.error || "no se pudo iniciar")); }
            return;
          }
          
          // Step 2: Send image to fal.ai to animate
          setVideoProgress("Animando video con IA...");
          const videoBody = { prompt: motionPrompt, image_base64: imageBase64 };
          const r = await fetch("/api/video", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(videoBody) });
          const d = await r.json();
          if (d.operation) { pollVideo(d.operation, d.endpoint, d.response_url, d.status_url); } else { setVideoProgress("Error: " + (d.error || "no se pudo iniciar")); setVideoLoading(false); }
        } catch (e) {
          setVideoProgress("Error: " + e.message); setVideoLoading(false);
        }
      };
      generateAndAnimate();
    }
    const brandCtx = "MARCA:" + brand.name + "|INDUSTRIA:" + brand.industry + "|TONO:" + brand.tone + "|AUDIENCIA:" + brand.audience + "|VOZ:" + (brand.brandVoice || "Profesional") + "|PRODUCTOS:" + (brand.products || "N/A") + "|COLORES:" + brandColors + "|ESTILO_VISUAL:" + brandStyle;
    const realInfoBlock = realInfo ? "\n\nINFORMACION REAL DE LA PAGINA WEB DE " + brand.name + " (USA SOLO ESTA INFORMACION REAL, NO INVENTES DATOS):\n" + realInfo : "";
    const jsonRule = (fmt === "text") ? " Responde en texto plano, NO JSON." : " SOLO JSON sin markdown sin backticks.";
    const sys = "Eres DIRECTOR CREATIVO SENIOR agencia Bogota. " + brandCtx + ". REGLAS:1)Gancho 2)3-5 emojis 3)Gancho>Valor>CTA 4)8 hashtags 5)Espanol colombiano tu 6)Valor primero 7)Saltos linea." + jsonRule + " MUY IMPORTANTE: Usa SOLO informacion REAL de la marca. NUNCA inventes precios, productos, servicios ni datos que no sean reales." + realInfoBlock;
    const imgInst = "image_prompt: MUST be in english BUT any visible text inside the image MUST be in Spanish. Translate the user request LITERALLY into an image description. If user asks for animated/cartoon style, specify 3D Pixar-style animated. If user mentions discounts or text, include that text visually in the image. Brand name: " + brand.name + ". Brand colors: " + brandColors + ". Brand visual style: " + brandStyle + ". Industry: " + brand.industry + ". Be EXTREMELY specific and literal. Copy the user instructions as closely as possible into the image description. NEVER include any logo or brand logo in the image because the AI will generate a fake incorrect logo. The real logo will be added manually later.";
    let msg = "";
    if (fmt === "visual") {
      msg = 'Post sobre: "' + currentTopic + '". Responde SOLO con JSON asi: {"headline":"max 8 palabras","subtext":"subtitulo","caption":"3-5 lineas con emojis","hashtags":"8 hashtags","image_prompt":"(en ingles) traduce LITERALMENTE lo que el usuario pidio a una descripcion de imagen. Incluye el nombre de marca ' + brand.name + ' si es relevante. ' + imgInst + '"}';
    } else if (fmt === "carousel") {
      msg = 'Carrusel 5 slides: "' + currentTopic + '". JSON:{"slides":[{"title":"..","body":"emojis","emoji":".."}],"caption":"CTA","hashtags":"8"}';
    } else if (fmt === "reel") {
      msg = 'Reel 5 escenas: "' + topic + '". Responde SOLO JSON:{"scenes":[{"title":"..","duration":"3s","emoji":"..","visual":"camara","text_overlay":"texto+emoji","audio":"musica","transition":"tipo"}],"caption":"CTA","hashtags":"8","video_prompt":"Cinematic promotional video. Any visible text MUST be in Spanish. NO close-up shots of human faces, show people from medium or wide angles only. Focus on scenery, products, atmosphere. Topic: ' + currentTopic + '. Brand: ' + brand.name + ' (' + brand.industry + '). Visual style: ' + brandStyle + '. Professional, eye-catching, social media ready. Do NOT include any logo."}';
    } else if (fmt === "text" && ct.id === "email") {
      msg = 'Escribe un email marketing completo para ' + brand.name + ' sobre: "' + currentTopic + '". Escribe el email de corrido, natural, como si fueras el equipo de ' + brand.name + ' escribiendole al cliente. Incluye saludo, cuerpo persuasivo con emojis, CTA claro, y despedida. NO pongas etiquetas como "asunto:" o "cuerpo:" ni JSON. Solo el email completo listo para copiar y enviar. Al final agrega una linea con 8 hashtags relevantes.';
    } else {
      msg = 'Escribe un copy para redes sociales de ' + brand.name + ' sobre: "' + currentTopic + '". Escribe el caption de corrido con emojis, gancho al inicio, valor en el medio, CTA al final. NO uses JSON. Solo el texto listo para copiar y pegar en Instagram. Agrega saltos de linea para que se vea bien. Al final agrega 8 hashtags relevantes.';
    }
    try { const gc = new AbortController(); const gt = setTimeout(() => gc.abort(), 30000); const r = await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"gemini-2.5-flash",max_tokens:2500,system:sys,messages:[{role:"user",content:msg}]}),signal:gc.signal}); clearTimeout(gt); const d = await r.json(); const raw = d.content?.map(c=>c.text||"").join("")||""; if(fmt==="text"){setTxt(raw);setResult({t:"text"});}else{try{let clean=raw;if(clean.indexOf("{")>-1)clean=clean.substring(clean.indexOf("{"),clean.lastIndexOf("}")+1);const pd=JSON.parse(clean);
      // Image generation
      const hasUserImg = currentImages.length > 0;
      const imgToSend = hasUserImg ? currentImages[0] : (lastAiImage || null);
      if(fmt==="visual"&&pd.image_prompt){
        setChatHistory(prev=>[...prev,{role:"ai",text:pd.caption,hashtags:pd.hashtags,headline:pd.headline,loading:true}]);
        const imgPrompt=pd.image_prompt.substring(0,500);
        const saveAndShow = async (fetchUrl, fetchOpts) => {
          try {
            const r = await fetch(fetchUrl, fetchOpts);
            if (!r.ok) throw new Error("error");
            const b = await r.blob();
            const u = URL.createObjectURL(b);
            await saveImageForRefinement(u);
            setChatHistory(prev => { const n = [...prev]; const last = n.findLastIndex(m => m.role === "ai" && m.loading); if (last > -1) { n[last] = { ...n[last], img: u, loading: false }; } return n; });
          } catch (e) {
            setChatHistory(prev => { const n = [...prev]; const last = n.findLastIndex(m => m.role === "ai" && m.loading); if (last > -1) { n[last] = { ...n[last], loading: false }; } return n; });
          }
        };
        if(imgToSend){
          saveAndShow("/api/image", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:imgPrompt,image_base64:imgToSend})});
        }else{
          saveAndShow("/api/image?prompt="+encodeURIComponent(imgPrompt));
        }
        setResult(null);
      }else{
        const imgUrl=pd.image_prompt?"/api/image?prompt="+encodeURIComponent(pd.image_prompt.substring(0,500)):null;
        setResult({t:fmt,d:pd,img:imgUrl,imgLoading:!!imgUrl});
        if(imgUrl){const testImg=new Image();testImg.onload=()=>setResult(prev=>({...prev,imgLoading:false}));testImg.onerror=()=>setResult(prev=>({...prev,imgLoading:false}));testImg.src=imgUrl;}
      }
      if(fmt==="reel"){/* video already started in parallel above */}}catch{if(fmt==="visual"){setChatHistory(prev=>[...prev,{role:"ai",text:raw}]);}else{setTxt(raw);setResult({t:"text"});}}} } catch(err){const errMsg=err.name==="AbortError"?"La generacion tardo demasiado. Intenta con una instruccion mas corta.":"Error al generar. Intenta de nuevo.";if(fmt==="visual"){setChatHistory(prev=>[...prev,{role:"ai",text:errMsg}]);}else{setTxt(errMsg);setResult({t:"text"});}} if(!isAdmin && fmt !== "reel"){addUsage(ct.id);} setLoading(false);
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
              <div style={{marginTop:6}}><span style={{fontWeight:600,color:t.tx}}>💡 Tip importante:</span> Da UNA instruccion a la vez para mejores resultados. En vez de "agrega logo + aclara caras + cambia texto" hazlo paso a paso: primero "agrega el logo arriba", despues "aclara las caras", etc. Para texto en la imagen, recomendamos generarla sin texto y agregarlo despues en Canva.</div>
            </div>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:t.ac,marginBottom:10}}>🎬 Videos (Reel / Story)</div>
            <div style={{fontSize:12,color:t.txS,lineHeight:1.7}}>
              <div style={{marginBottom:6}}><span style={{fontWeight:600,color:t.tx}}>Duracion:</span> Cada video generado dura maximo 8 segundos. Para videos mas largos, genera varios clips y unes despues.</div>
              <div style={{marginBottom:6}}><span style={{fontWeight:600,color:t.tx}}>Formato:</span> Los videos se generan en formato vertical 9:16 (ideal para Reels e Historias de Instagram).</div>
              <div style={{marginBottom:6}}><span style={{fontWeight:600,color:t.tx}}>Tiempo:</span> La generacion tarda entre 3-10 minutos. No cierres la pagina mientras se genera.</div>
              <div style={{marginBottom:6}}><span style={{fontWeight:600,color:t.tx}}>Idioma:</span> El audio y narraccion se genera en espanol latinoamericano.</div>
              <div style={{marginBottom:6}}><span style={{fontWeight:600,color:t.tx}}>Se especifico:</span> Describe la escena, la accion, el ambiente. Ej: "Un video cinematografico de una pareja entrando a una cabana romantica con jacuzzi al atardecer, con texto de 20% de descuento".</div>
              <div><span style={{fontWeight:600,color:t.tx}}>Costo:</span> Cada video consume creditos de tu cuenta de Google Cloud (~$6 USD por video de 8 seg).</div>
              <div style={{marginTop:6}}><span style={{fontWeight:600,color:t.tx}}>📷 Primer frame (opcional):</span> Puedes subir una foto REAL. El video EMPIEZA literalmente desde esa foto y le da movimiento. Ideal para animar una foto de tu local, producto o servicio. La foto NO se usa como referencia de estilo, se usa como punto de partida del video.</div>
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
      <div style={{marginBottom:14}}><Label>Tipo</Label><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>{CTYPES.map(c=><button key={c.id} onClick={()=>{setCt(c);setUploadedImages([]);setUploadedPreviews([]);if(c.fmt!=="visual"){setChatHistory([]);setLastAiImage(null);}setResult(null);setTxt("");}} style={{padding:"12px 10px",borderRadius:12,border:ct.id===c.id?`2px solid ${t.ac}`:`1px solid ${t.brd}`,background:ct.id===c.id?t.acS:t.bgC,cursor:"pointer",textAlign:"center"}}><div style={{fontSize:22,marginBottom:4}}>{c.icon}</div><div style={{fontSize:12,fontWeight:600,color:ct.id===c.id?t.tx:t.txS}}>{c.label}</div></button>)}</div></div>
      {(ct.fmt==="reel"||ct.fmt==="visual")&&<div style={{marginBottom:14,padding:14,background:t.bgI,borderRadius:12,border:"1px solid "+t.brd}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><span style={{fontSize:14}}>📷</span><span style={{fontSize:12,fontWeight:600,color:t.tx}}>{ct.fmt==="reel"?"Primer frame del video":"Fotos de referencia"}</span><span style={{fontSize:11,color:t.txM,fontStyle:"italic"}}>(opcional)</span></div><div style={{fontSize:11,color:t.txS,marginBottom:10,lineHeight:1.5}}>{ct.fmt==="reel"?"Si subes una foto, el video EMPIEZA desde esa foto y le da movimiento. Si no subes foto, la IA crea todo desde cero.":"Sube fotos reales de tu producto o servicio. La IA las usa como referencia para generar la imagen. Puedes subir varias."}</div><div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}><label style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",border:"2px dashed "+(uploadedImages.length?t.ac:t.brd),borderRadius:10,cursor:"pointer",color:uploadedImages.length?t.ac:t.txM,fontSize:12,fontWeight:500,background:uploadedImages.length?t.acS:"transparent"}}><span style={{fontSize:16}}>📷</span>Subir fotos<input type="file" accept="image/*" multiple onChange={handleUploadImages} style={{display:"none"}}/></label>{uploadedPreviews.map((p,i)=><div key={i} style={{position:"relative"}}><img src={p} style={{width:44,height:44,borderRadius:8,objectFit:"cover",border:"2px solid "+t.ac}}/><div onClick={()=>removeUploadedImage(i)} style={{position:"absolute",top:-5,right:-5,width:15,height:15,borderRadius:"50%",background:"#ef4444",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,cursor:"pointer",fontWeight:700}}>x</div></div>)}{uploadedImages.length>0&&<span style={{fontSize:11,color:t.ac,fontWeight:600}}>{uploadedImages.length} foto{uploadedImages.length>1?"s":""}</span>}</div></div>}
      <div style={{display:"flex",gap:10,marginBottom:22}}><Input value={topic} onChange={e=>setTopic(e.target.value)} placeholder={chatHistory.length>0&&ct.fmt==="visual"?"Escribe como mejorar la imagen...":"Describe que contenido necesitas..."} onKeyDown={e=>e.key==="Enter"&&go()}/><Btn onClick={go} disabled={loading||!topic.trim()} primary style={{whiteSpace:"nowrap",padding:"14px 28px"}}>{loading?<><Spin/> Creando...</>:<><Ic name="sparkle" size={16}/> {chatHistory.length>0&&ct.fmt==="visual"?"Mejorar":"Generar"}</>}</Btn>{chatHistory.length>0&&ct.fmt==="visual"&&!loading&&<Btn onClick={()=>{setChatHistory([]);setLastAiImage(null);setResult(null);}} style={{whiteSpace:"nowrap",padding:"14px 16px",fontSize:12}}>Nuevo</Btn>}</div>
      {!isAdmin&&<div style={{display:"flex",gap:10,marginBottom:14,fontSize:11,color:t.txM,flexWrap:"wrap"}}>{CTYPES.map(c=><span key={c.id} style={{padding:"3px 8px",background:getLeft(c.id)<=0?"rgba(239,68,68,.1)":t.bgI,borderRadius:6,color:getLeft(c.id)<=0?"#ef4444":t.txM}}>{c.icon} {getUsage(c.id)}/{getLimit(c.id)==9999?"∞":getLimit(c.id)}</span>)}<span style={{marginLeft:"auto",color:t.ac,cursor:"pointer"}}>⬆️ Actualizar plan</span></div>}
      {loading&&!(ct.fmt==="visual"&&chatHistory.length>0)&&<Card style={{padding:48,textAlign:"center"}}><div style={{width:48,height:48,border:`3px solid ${t.brd}`,borderTop:`3px solid ${brand?.color||t.ac}`,borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 16px"}}/><div style={{color:t.tx,fontSize:16,fontWeight:600}}>Generando para {brand?.name}...</div></Card>}
      {result&&!loading&&result.t==="text"&&<Card><div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><span style={{fontSize:13,fontWeight:600,color:t.txS}}>{brand?.emoji} {brand?.name}</span><CopyBtn text={txt}/></div><div style={{fontSize:14,color:t.tx,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{txt}</div></Card>}
      {/* VISUAL RESULT - shows only latest */}
      {ct.fmt==="visual"&&chatHistory.length>0&&(() => { const last = [...chatHistory].reverse().find(m => m.role === "ai"); if (!last) return null; return <div style={{marginBottom:16}}>
          <Card>
            {last.loading&&!last.img&&<div style={{width:"100%",height:250,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:t.bgI,borderRadius:14,border:"1px solid "+t.brd}}><div style={{width:40,height:40,border:"3px solid "+t.brd,borderTop:"3px solid "+(brand?.color||t.ac),borderRadius:"50%",animation:"spin .8s linear infinite",marginBottom:12}}/><div style={{color:t.txS,fontSize:13,fontWeight:500}}>Generando imagen con IA...</div></div>}
            {last.img&&<div style={{marginBottom:14}}><div style={{borderRadius:14,overflow:"hidden",position:"relative"}}><img id="ai-latest-img" crossOrigin="anonymous" src={last.img} alt="AI" onContextMenu={e=>e.preventDefault()} onDragStart={e=>e.preventDefault()} style={{width:"100%",maxHeight:500,objectFit:"contain",display:"block",borderRadius:14,WebkitUserSelect:"none",userSelect:"none"}}/><div onContextMenu={e=>e.preventDefault()} style={{position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}><span style={{fontSize:38,fontWeight:900,color:"rgba(255,255,255,0.3)",textShadow:"0 2px 8px rgba(0,0,0,0.3)",letterSpacing:6,textTransform:"uppercase",transform:"rotate(-25deg)",userSelect:"none",whiteSpace:"nowrap"}}>DATAGROWTH</span></div></div><div style={{textAlign:"center",padding:"6px 0",fontSize:11,color:t.txM}}>⬇️ Descarga la imagen para obtenerla sin marca de agua</div></div>}
            {last.headline&&<div style={{fontSize:20,fontWeight:800,color:t.tx,marginBottom:6}}>{last.headline}</div>}
            {last.text&&<div style={{fontSize:14,color:t.tx,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{last.text}</div>}
            {last.hashtags&&<div style={{fontSize:12,color:brand?.color,marginTop:8}}>{last.hashtags}</div>}
            {(last.img||last.text)&&!last.loading&&<div style={{marginTop:12,display:"flex",gap:8,flexWrap:"wrap"}}>
              <CopyBtn text={(last.text||"")+(last.hashtags?"\n\n"+last.hashtags:"")}/>
              {last.img&&<button onClick={()=>{fetch(last.img).then(r=>r.blob()).then(b=>{const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=(brand?.short||"img")+"_"+Date.now()+".png";document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(u),100);}).catch(()=>{});}} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",background:"rgba(55,194,235,.08)",border:"1px solid rgba(55,194,235,.2)",borderRadius:10,color:"#37c2eb",fontSize:12,fontWeight:600,cursor:"pointer"}}>⬇️ Descargar</button>}
            </div>}
          </Card>
          {loading&&<div style={{textAlign:"center",padding:16}}><div style={{width:32,height:32,border:"3px solid "+t.brd,borderTop:"3px solid "+(brand?.color||t.ac),borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 8px"}}/><div style={{color:t.txS,fontSize:13}}>Mejorando imagen...</div></div>}
        </div>; })()}
      {result&&!loading&&result.t==="visual"&&result.d&&chatHistory.length===0&&<Card>{(result.img||result.imgLoading)&&<div style={{marginBottom:16,borderRadius:14,overflow:"hidden"}}>{result.img?<div><div style={{position:"relative"}}><img id="ai-generated-img" crossOrigin="anonymous" src={result.img} alt="AI Generated" onContextMenu={e=>e.preventDefault()} onDragStart={e=>e.preventDefault()} style={{width:"100%",maxHeight:500,objectFit:"contain",display:"block",borderRadius:14,WebkitUserSelect:"none",userSelect:"none"}}/><div onContextMenu={e=>e.preventDefault()} style={{position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}><span style={{fontSize:38,fontWeight:900,color:"rgba(255,255,255,0.3)",textShadow:"0 2px 8px rgba(0,0,0,0.3)",letterSpacing:6,textTransform:"uppercase",transform:"rotate(-25deg)",userSelect:"none",whiteSpace:"nowrap"}}>DATAGROWTH</span></div></div><div style={{textAlign:"center",padding:"6px 0",fontSize:11,color:t.txM}}>⬇️ Descarga la imagen para obtenerla sin marca de agua</div></div>:<div style={{width:"100%",height:280,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:t.bgI,borderRadius:14,border:"1px solid "+t.brd}}><div style={{width:40,height:40,border:"3px solid "+t.brd,borderTop:"3px solid "+(brand?.color||t.ac),borderRadius:"50%",animation:"spin .8s linear infinite",marginBottom:12}}/><div style={{color:t.txS,fontSize:13,fontWeight:500}}>Generando imagen con IA...</div></div>}</div>}<div style={{fontSize:22,fontWeight:800,color:t.tx,marginBottom:6}}>{result.d.headline}</div>{result.d.subtext&&<div style={{color:t.txS,marginBottom:12}}>{result.d.subtext}</div>}<div style={{fontSize:14,color:t.tx,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{result.d.caption}</div>{result.d.hashtags&&<div style={{fontSize:12,color:brand?.color,marginTop:10}}>{result.d.hashtags}</div>}<div style={{marginTop:12,display:"flex",gap:8}}><CopyBtn text={`${result.d.caption}\n\n${result.d.hashtags||""}`} label="📱 Copiar"/>{result.img&&<button onClick={()=>{fetch(result.img).then(r=>r.blob()).then(b=>{const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=(brand?.short||"img")+"_"+Date.now()+".png";document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(u),100);}).catch(()=>{});}} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",background:"rgba(55,194,235,.08)",border:"1px solid rgba(55,194,235,.2)",borderRadius:10,color:"#37c2eb",fontSize:12,fontWeight:600,cursor:"pointer"}}>⬇️ Descargar imagen</button>}</div></Card>}
      {result&&!loading&&result.t==="carousel"&&result.d?.slides&&<Card>{result.d.slides.map((sl,i)=><div key={i} style={{padding:"12px 0",borderBottom:i<result.d.slides.length-1?`1px solid ${t.brd}`:"none"}}><div style={{fontSize:14,fontWeight:600,color:t.tx}}>{sl.emoji} Slide {i+1}: {sl.title}</div><div style={{fontSize:13,color:t.txS,marginTop:3}}>{sl.body}</div></div>)}{result.d.caption&&<div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${t.brd}`,fontSize:14,color:t.tx,whiteSpace:"pre-wrap"}}>{result.d.caption}</div>}<div style={{marginTop:12}}><CopyBtn text={result.d.slides.map((s,i)=>`${s.emoji} Slide ${i+1}: ${s.title}\n${s.body}`).join("\n\n")+`\n\n${result.d.caption||""}\n${result.d.hashtags||""}`} label="📋 Todo"/></div></Card>}
      {result&&!loading&&result.t==="reel"&&result.d?.scenes&&<Card>
        {videoUrl&&<div style={{marginBottom:16}}><div style={{borderRadius:14,overflow:"hidden",position:"relative"}}><video src={videoUrl} controls controlsList="nodownload" onContextMenu={(e)=>e.preventDefault()} style={{width:"100%",maxHeight:400,borderRadius:14,display:"block"}}/><div style={{position:"absolute",top:0,left:0,right:0,bottom:40,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}><span style={{fontSize:30,fontWeight:900,color:"rgba(255,255,255,0.25)",textShadow:"0 2px 8px rgba(0,0,0,0.3)",letterSpacing:6,textTransform:"uppercase",transform:"rotate(-25deg)",userSelect:"none",whiteSpace:"nowrap"}}>DATAGROWTH</span></div></div><div style={{textAlign:"center",padding:"6px 0",fontSize:11,color:t.txM}}>⬇️ Descarga el video para obtenerlo sin marca de agua</div></div>}
        {videoLoading&&<div style={{marginBottom:16,padding:24,textAlign:"center",background:t.bgI,borderRadius:14,border:"1px solid "+t.brd}}><div style={{width:40,height:40,border:"3px solid "+t.brd,borderTop:"3px solid "+(brand?.color||t.ac),borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 12px"}}/><div style={{color:t.ac,fontSize:14,fontWeight:600}}>{videoProgress}</div><div style={{color:t.txM,fontSize:12,marginTop:4}}>El video se esta generando con IA (puede tardar 2-4 min). No cierres esta pagina.</div></div>}
        {videoUrl&&<div style={{marginBottom:14,display:"flex",gap:8}}><button onClick={async()=>{try{const r=await fetch(videoUrl);const b=await r.blob();const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=(brand?.short||"reel")+"_"+Date.now()+".mp4";a.click();URL.revokeObjectURL(u);if(!isAdmin) addUsage("reel");}catch(e){window.open(videoUrl,"_blank");}}} style={{display:"flex",alignItems:"center",gap:6,padding:"10px 20px",background:t.gr,border:"none",borderRadius:10,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>⬇️ Descargar video</button></div>}
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
const ClientSettings = ({ user, setUser, onChangePlan }) => {
  const t = useT();
  const Toggle = ({ v, set }) => <div onClick={() => set(!v)} style={{ width: 40, height: 22, borderRadius: 11, background: v ? t.ac : t.brd, position: "relative", cursor: "pointer", flexShrink: 0 }}><div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: v ? 20 : 2, transition: "left .3s" }}/></div>;
  const [n1, setN1] = useState(true);
  const [n2, setN2] = useState(true);
  const [n3, setN3] = useState(false);
  const [editName, setEditName] = useState(user.name || "");
  const [editCompany, setEditCompany] = useState(user.company || "");
  const [editPhone, setEditPhone] = useState(user.phone || "");
  const [saved, setSaved] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [showPassForm, setShowPassForm] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [planMsg, setPlanMsg] = useState("");
  const currentPlan = PLANS.find(p => p.id === "free") || PLANS[0];

  const saveProfile = async () => {
    if (user?.id) { await supabase.from("profiles").update({ name: editName, company: editCompany, phone: editPhone }).eq("id", user.id); }
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
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: t.tx, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Ic name="card" size={18}/> Mi Plan</div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid " + t.brd }}><span style={{ color: t.tx }}>Plan actual</span><Badge color={currentPlan.color}>{currentPlan.name} — {currentPlan.price}/mes</Badge></div>
        <div style={{ padding: "10px 0", borderBottom: "1px solid " + t.brd }}>
          <div style={{ fontSize: 13, color: t.txM, marginBottom: 8 }}>Limites por tipo:</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{CTYPES.map(c => <span key={c.id} style={{ fontSize: 11, padding: "3px 8px", background: t.bgI, borderRadius: 6, color: t.txS }}>{c.icon} {currentPlan.limits?.[c.id] === 9999 ? "∞" : (currentPlan.limits?.[c.id] || 0)}</span>)}</div>
        </div>
        <Btn primary onClick={() => setShowPlans(true)} style={{ marginTop: 14, width: "100%", justifyContent: "center" }}>Cambiar plan</Btn>
        {planMsg && <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(55,194,235,0.1)", border: "1px solid rgba(55,194,235,0.3)", borderRadius: 10, fontSize: 13, color: t.ac, textAlign: "center" }}>{planMsg}</div>}
      </Card>
      {showPlans && <Card style={{ marginBottom: 14, border: "2px solid " + t.ac }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: t.tx, marginBottom: 16 }}>Elige tu nuevo plan</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {PLANS.map(p => <div key={p.id} style={{ textAlign: "center", padding: 20, border: p.pop ? "2px solid " + p.color : "1px solid " + t.brd, borderRadius: 14, cursor: "pointer", transition: "all .2s" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 25px " + t.sh; }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
            {p.pop && <div style={{ fontSize: 10, fontWeight: 700, color: p.color, marginBottom: 4 }}>MAS POPULAR</div>}
            <div style={{ fontSize: 15, fontWeight: 700, color: t.tx }}>{p.name}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: p.color, margin: "8px 0" }}>{p.price}<span style={{ fontSize: 12, color: t.txM }}>/mes</span></div>
            <div style={{ fontSize: 11, color: t.txS, marginBottom: 12 }}>{p.desc}</div>
            <Btn primary={p.pop} secondary={!p.pop} onClick={() => { if (p.id !== currentPlan.id) { setShowPlans(false); setPassMsg(""); setPlanMsg("✅ Plan " + p.name + " seleccionado. Cuando conectemos Stripe se activara automaticamente."); setTimeout(() => setPlanMsg(""), 4000); } }} style={{ width: "100%", justifyContent: "center", fontSize: 12, padding: "8px 12px" }}>{p.id === currentPlan.id ? "Plan actual" : "Elegir"}</Btn>
          </div>)}
        </div>
        <Btn ghost onClick={() => setShowPlans(false)} style={{ marginTop: 12, width: "100%", justifyContent: "center", fontSize: 12 }}>Cancelar</Btn>
      </Card>}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: t.tx, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Ic name="shield" size={18}/> Seguridad</div>
        {!showPassForm ? <Btn onClick={() => setShowPassForm(true)}>Cambiar contraseña</Btn> : <div>
          <div style={{ marginBottom: 10 }}><Label>Contraseña actual</Label><Input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} placeholder="Tu contraseña actual"/></div>
          <div style={{ marginBottom: 10 }}><Label>Nueva contraseña</Label><Input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Nueva contraseña"/></div>
          <div style={{ marginBottom: 14 }}><Label>Confirmar nueva contraseña</Label><Input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Repite la nueva contraseña"/></div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn primary onClick={async () => { if (!oldPass || !newPass) return; if (newPass !== confirmPass) { setPassMsg("Las contraseñas no coinciden"); return; } if (newPass.length < 6) { setPassMsg("Minimo 6 caracteres"); return; } const { error } = await supabase.auth.updateUser({ password: newPass }); if (error) { setPassMsg("Error: " + error.message); return; } setPassMsg("✅ Contraseña actualizada"); setOldPass(""); setNewPass(""); setConfirmPass(""); setTimeout(() => { setPassMsg(""); setShowPassForm(false); }, 2000); }}>{passMsg.startsWith("✅") ? passMsg : "Guardar"}</Btn>
            <Btn ghost onClick={() => { setShowPassForm(false); setOldPass(""); setNewPass(""); setConfirmPass(""); setPassMsg(""); }}>Cancelar</Btn>
          </div>
          {passMsg && !passMsg.startsWith("✅") && <div style={{ marginTop: 8, fontSize: 12, color: "#ef4444" }}>{passMsg}</div>}
        </div>}
      </Card>
      <Card><div style={{ fontSize: 16, fontWeight: 600, color: t.tx, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Ic name="help" size={18}/> Soporte</div><div style={{ fontSize: 14, color: t.txS }}>¿Necesitas ayuda? <span style={{ color: t.ac }}>soporte@datagrowth.agency</span></div></Card>
    </Section>
  );
};

// ══════ AGENCY PAGES ══════
const AgencyDash = ({ setPage, brands }) => { const t = useT(); return <Section title="Dashboard Agencia" right={<Badge color="#8b5cf6">Admin</Badge>}><div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>{[{ l: "Contenido", v: "247", c: "#37c2eb" }, { l: "Marcas", v: String(brands.length), c: "#06b6d4" }, { l: "Clientes", v: "5", c: "#8b5cf6" }, { l: "Revenue", v: "$216", c: "#f59e0b" }].map((s, i) => <Card key={i}><div style={{ fontSize: 12, color: t.txM, marginBottom: 8 }}>{s.l}</div><div style={{ fontSize: 28, fontWeight: 800, color: s.c }}>{s.v}</div></Card>)}</div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{brands.map(b => <Card key={b.id} onClick={() => setPage("factory")} style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 40, height: 40, borderRadius: 10, background: b.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{b.emoji}</div><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: t.tx }}>{b.name}</div><div style={{ fontSize: 11, color: t.txM }}>{b.industry}</div></div><Badge>Activa</Badge></Card>)}</div></Section>; };
const AgencyClients = () => { const t = useT(); const [clients, setClients] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { supabase.from("profiles").select("*").eq("role", "client").then(({ data }) => { setClients(data || []); setLoading(false); }); }, []);
  return <Section title="Clientes" right={<Badge>{clients.length} registrados</Badge>}><Card style={{ padding: 0 }}><div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "12px 20px", background: t.bgI, fontSize: 11, fontWeight: 600, color: t.txM, textTransform: "uppercase" }}><div>Empresa</div><div>Plan</div><div>Registro</div></div>{loading ? <div style={{ padding: 20, textAlign: "center", color: t.txM }}>Cargando...</div> : clients.length === 0 ? <div style={{ padding: 30, textAlign: "center", color: t.txM }}>No hay clientes registrados aún</div> : clients.map((c, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "14px 20px", borderBottom: `1px solid ${t.brd}`, alignItems: "center" }}><div><div style={{ fontSize: 14, fontWeight: 600, color: t.tx }}>{c.name || c.email}</div><div style={{ fontSize: 11, color: t.txM }}>{c.email}</div></div><Badge color={c.plan === "agency" ? "#8b5cf6" : c.plan === "pro" ? "#37c2eb" : "#888"}>{c.plan || "free"}</Badge><div style={{ color: t.txS, fontSize: 12 }}>{c.created_at ? new Date(c.created_at).toLocaleDateString() : ""}</div></div>)}</Card></Section>; };
const AgencyTeam = () => { const t = useT(); return <Section title="Equipo" right={<Btn primary><Ic name="plus" size={14}/> Invitar</Btn>}><div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>{[{ n: "Julian", r: "Admin", c: "#ec4899" }, { n: "María", r: "Editor", c: "#3b82f6" }].map((m, i) => <Card key={i}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 44, height: 44, borderRadius: "50%", background: m.c, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, color: "#fff" }}>{m.n[0]}</div><div><div style={{ fontSize: 15, fontWeight: 600, color: t.tx }}>{m.n}</div><Badge color={m.r === "Admin" ? "#8b5cf6" : "#37c2eb"}>{m.r}</Badge></div></div></Card>)}</div></Section>; };
const AgencyPlans = () => { const t = useT(); return <Section title="Planes"><div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>{PLANS.map(p => <Card key={p.id} style={{ textAlign: "center", border: p.pop ? `2px solid ${p.color}` : `1px solid ${t.brd}`, position: "relative" }}>{p.pop && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: p.color, color: "#fff", padding: "4px 16px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Popular</div>}<div style={{ fontSize: 17, fontWeight: 600, color: t.tx, paddingTop: p.pop ? 10 : 0 }}>{p.name}</div><div style={{ fontSize: 40, fontWeight: 800, color: p.color, margin: "8px 0" }}>{p.price}<span style={{ fontSize: 14, color: t.txM }}>/mes</span></div>{p.features.map((f, i) => <div key={i} style={{ fontSize: 13, color: t.tx, padding: "5px 0" }}>✓ {f}</div>)}</Card>)}</div></Section>; };
const AgencySettings = ({ gemKey, setGemKey }) => { const t = useT(); const [k, setK] = useState(gemKey); const [sv, setSv] = useState(false); return <Section title="Configuración API"><Card style={{ marginBottom: 12 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 600, color: t.tx }}>Claude</span><Badge>Conectada</Badge></div></Card><Card style={{ border: `1px solid ${gemKey ? "rgba(55,194,235,.3)" : "rgba(245,158,11,.3)"}` }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={{ fontWeight: 600, color: t.tx }}>Gemini Imágenes</span>{gemKey ? <Badge>Conectada</Badge> : <Badge color="#f59e0b">Pendiente</Badge>}</div><div style={{ display: "flex", gap: 10 }}><Input value={k} onChange={e => setK(e.target.value)} type="password" placeholder="AIzaSy..."/><Btn primary onClick={() => { setGemKey(k); try { localStorage.setItem("dg_gemkey", k); } catch {} setSv(true); setTimeout(() => setSv(false), 2000); }}>{sv ? "✅" : "Guardar"}</Btn></div></Card></Section>; };

// ══════ APP ══════
export default function App() {
  const [view, setView] = useState("loading"); // loading, landing, auth, app
  const [authMode, setAuthMode] = useState("login");
  const [selPlan, setSelPlan] = useState(null);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [landingSubView, setLandingSubView] = useState("home"); // "home" | "plans"
  const [sb, setSb] = useState(true);

  // Función central de navegación — siempre usar esta para navegar
  const navigate = (newView, opts = {}) => {
    const newPage = opts.page || page;
    const newLandingSubView = opts.landingSubView || "home";
    const newAuthMode = opts.authMode || "login";
    const state = { view: newView, page: newPage, landingSubView: newLandingSubView, authMode: newAuthMode };
    let hash = "#";
    if (newView === "app") hash = `#${newPage}`;
    else if (newView === "auth") hash = `#auth-${newAuthMode}`;
    else if (newView === "landing") hash = newLandingSubView === "plans" ? "#planes" : "#inicio";
    window.history.pushState(state, "", hash);
    setView(newView);
    if (opts.page) setPage(opts.page);
    if (opts.landingSubView !== undefined) setLandingSubView(opts.landingSubView);
    if (opts.authMode) setAuthMode(opts.authMode);
    if (opts.selPlan !== undefined) setSelPlan(opts.selPlan);
  };

  // Escuchar el botón atrás/adelante del navegador
  useEffect(() => {
    const handlePop = (e) => {
      const s = e.state;
      if (!s) return;
      setView(s.view);
      if (s.page) setPage(s.page);
      if (s.landingSubView !== undefined) setLandingSubView(s.landingSubView);
      if (s.authMode) setAuthMode(s.authMode);
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);
  const [dark, setDark] = useState(true);
  const [gemKey, setGemKey] = useState(() => { try { return localStorage.getItem("dg_gemkey") || ""; } catch { return ""; } });
  const [agBrands, setAgBrands] = useState([]);
  const [clBrands, setClBrands] = useState([]);

  const loadBrands = async (userId, role) => {
    const { data } = await supabase.from("brands").select("*").eq("user_id", userId);
    const mapped = (data || []).map(b => ({ ...b, brandVoice: b.brand_voice, imgStyle: b.img_style, logoBase64: b.logo_base64 }));
    if (role === "agency") {
      if (mapped.length === 0) {
        // Seed default brands for admin on first login
        for (const b of AGENCY_BRANDS) {
          await supabase.from("brands").insert({ user_id: userId, name: b.name, short: b.short, color: b.color, industry: b.industry, tone: b.tone, audience: b.audience, emoji: b.emoji, brand_voice: b.brandVoice, img_style: b.imgStyle, sector: b.sector, colors: b.colors, products: b.products, description: b.description, differentiator: b.differentiator, website: b.website });
        }
        const { data: seeded } = await supabase.from("brands").select("*").eq("user_id", userId);
        setAgBrands((seeded || []).map(b => ({ ...b, brandVoice: b.brand_voice, imgStyle: b.img_style, logoBase64: b.logo_base64 })));
      } else {
        setAgBrands(mapped);
      }
    } else {
      setClBrands(mapped);
    }
  };

  // Check session on mount
  useEffect(() => {
    // Si hay token de recovery en la URL, no hacer login automático
    const hash = window.location.hash;
    const isRecovery = hash.includes("type=recovery") || hash.includes("error=access_denied");
    if (isRecovery) {
      setView("auth");
      setAuthMode("reset-password");
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        const role = profile?.role || "client";
        setUser({ id: session.user.id, name: profile?.name || session.user.email.split("@")[0], email: session.user.email, company: profile?.company || "", phone: profile?.phone || "", role, plan: profile?.plan || "free" });
        setView("app");
        window.history.replaceState({ view: "app", page: "dashboard", landingSubView: "home", authMode: "login" }, "", "#dashboard");
        await loadBrands(session.user.id, role);
      } else {
        setView("landing");
        window.history.replaceState({ view: "landing", page: "dashboard", landingSubView: "home", authMode: "login" }, "", "#inicio");
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setView("auth");
        setAuthMode("reset-password");
        return;
      }
      // Ignorar SIGNED_IN si estamos en modo reset-password
      if (event === "SIGNED_IN") return;
      if (event === "SIGNED_OUT") { setUser(null); setView("landing"); window.history.replaceState({ view: "landing", page: "dashboard", landingSubView: "home", authMode: "login" }, "", "#inicio"); }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Google Translate - injected into body so it works on ALL views
  useEffect(() => {
    if (document.getElementById("gt-container")) return;
    const container = document.createElement("div");
    container.id = "gt-container";
    container.style.cssText = "position:fixed;top:12px;right:60px;z-index:9999;";
    const el = document.createElement("div");
    el.id = "google_translate_element";
    container.appendChild(el);
    document.body.appendChild(container);
    // Clear any old Google Translate cookies first
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + window.location.hostname;
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({ pageLanguage: "es", autoDisplay: false, layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL }, "google_translate_element");
      // Auto-translate ONLY if browser is NOT in Spanish
      const browserLang = (navigator.language || navigator.userLanguage || "es").split("-")[0];
      if (browserLang !== "es") {
        setTimeout(() => {
          const select = document.querySelector(".goog-te-combo");
          if (select) { select.value = browserLang; select.dispatchEvent(new Event("change")); }
        }, 1500);
      }
    };
    const s = document.createElement("script");
    s.id = "gt-script";
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.head.appendChild(s);
    const style = document.createElement("style");
    style.textContent = ".goog-te-banner-frame{display:none!important} body{top:0!important} .goog-te-gadget{font-size:0!important} .goog-te-gadget .goog-te-combo{font-size:12px;padding:5px 10px;border-radius:8px;border:1px solid rgba(55,194,235,0.3);background:rgba(17,19,32,0.95);color:#f0f0f5;outline:none;cursor:pointer;backdrop-filter:blur(8px)} .skiptranslate{display:none!important} .goog-te-gadget>span{display:none!important} #gt-container{transition:opacity .3s} .goog-text-highlight{background:none!important;box-shadow:none!important;border:none!important} font[style]{background:none!important;box-shadow:none!important} .translated-ltr font,.translated-rtl font{background:none!important;box-shadow:none!important} font{background:none!important;box-shadow:none!important;border:none!important} *[style*='background-color: rgb(211, 218, 232)']{background-color:transparent!important} *[style*='background-color: rgb(240, 242, 249)']{background-color:transparent!important}";
    document.head.appendChild(style);
  }, []);

  const th = dark ? TH.dark : TH.light;
  const isAdmin = user?.role === "agency";
  const brands = isAdmin ? agBrands : clBrands;
  const setBrands = isAdmin ? setAgBrands : setClBrands;

  const onAuth = (u) => { setUser(u); navigate("app", { page: "dashboard" }); loadBrands(u.id, u.role); };
  const logout = async () => { await supabase.auth.signOut(); setUser(null); navigate("landing", { landingSubView: "home" }); };

  const agNav = [{ id: "dashboard", label: "Dashboard", ic: "grid" }, { id: "factory", label: "Fábrica Creativa", ic: "factory", tag: "AI" }, { id: "branding", label: "Branding Kit", ic: "palette" }, { id: "clients", label: "Clientes", ic: "users" }, { id: "plans", label: "Planes", ic: "card" }, { id: "team", label: "Equipo", ic: "users" }];
  const clNav = [{ id: "dashboard", label: "Mi Dashboard", ic: "grid" }, { id: "factory", label: "Crear Contenido", ic: "factory", tag: "AI" }, { id: "branding", label: "Mis Marcas", ic: "palette" }, { id: "settings", label: "Mi Cuenta", ic: "settings" }];
  const nav = isAdmin ? agNav : clNav;
  const goPage = (p) => navigate("app", { page: p });

  if (view === "loading") return <ThemeCtx.Provider value={th}><div style={{ minHeight: "100vh", background: th.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ textAlign: "center" }}><div style={{ width: 48, height: 48, border: "3px solid " + th.brd, borderTop: "3px solid " + th.ac, borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 16px" }}/><div style={{ color: th.txS, fontSize: 14 }}>Cargando...</div></div></div></ThemeCtx.Provider>;
  if (view === "landing") return <ThemeCtx.Provider value={th}><Landing onLogin={() => navigate("auth", { authMode: "login" })} onRegister={(plan) => navigate("auth", { authMode: "register", selPlan: plan || null })} showPlans={landingSubView === "plans"} setShowPlans={(v) => { if (v) { navigate("landing", { landingSubView: "plans" }); } else { window.history.back(); } }} dark={dark} setDark={setDark}/></ThemeCtx.Provider>;
  if (view === "auth") return <ThemeCtx.Provider value={th}><Auth mode={authMode} setMode={(m) => navigate("auth", { authMode: m })} onAuth={onAuth} dark={dark} setDark={setDark} selPlan={selPlan}/></ThemeCtx.Provider>;

  const agPages = { dashboard: <AgencyDash setPage={setPage} brands={brands}/>, factory: <Factory brands={brands} gemKey={gemKey} isAdmin={true} user={user}/>, branding: <BrandKit brands={brands} setBrands={setBrands} user={user}/>, clients: <AgencyClients/>, plans: <AgencyPlans/>, team: <AgencyTeam/> };
  const clPages = { dashboard: (() => { const t = th; return <Section title="Mi Dashboard" right={<Badge color="#37c2eb">Cliente</Badge>}><div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>{[{ l: "Marcas", v: String(brands.length), c: "#06b6d4" }, { l: "Contenido", v: brands.length ? "34" : "0", c: "#37c2eb" }, { l: "Posts/mes", v: brands.length ? "12" : "0", c: "#8b5cf6" }].map((s, i) => <Card key={i}><div style={{ fontSize: 12, color: t.txM, marginBottom: 8 }}>{s.l}</div><div style={{ fontSize: 28, fontWeight: 800, color: s.c }}>{s.v}</div></Card>)}</div>{brands.length ? <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{brands.map(b => <Card key={b.id} onClick={() => setPage("factory")} style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 40, height: 40, borderRadius: 10, background: b.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{b.emoji}</div><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: t.tx }}>{b.name}</div><div style={{ fontSize: 11, color: t.txM }}>{b.industry}</div></div><Badge>Activa</Badge></Card>)}<Card onClick={() => setPage("branding")} style={{ display: "flex", alignItems: "center", justifyContent: "center", border: `2px dashed ${t.brd}`, minHeight: 70 }}><div style={{ textAlign: "center", color: t.txM }}><div style={{ fontSize: 24 }}>+</div><div style={{ fontSize: 12 }}>Nueva marca</div></div></Card></div> : <Card style={{ textAlign: "center", padding: 48 }}><div style={{ fontSize: 48, marginBottom: 12 }}>🚀</div><div style={{ fontSize: 18, fontWeight: 700, color: t.tx, marginBottom: 8 }}>¡Bienvenido!</div><div style={{ fontSize: 14, color: t.txM, marginBottom: 20 }}>Crea tu primera marca para empezar.</div><Btn primary onClick={() => setPage("branding")} style={{ margin: "0 auto" }}><Ic name="plus" size={14}/> Crear marca</Btn></Card>}</Section>; })(), factory: <Factory brands={brands} gemKey={gemKey} isAdmin={false} user={user}/>, branding: <BrandKit brands={brands} setBrands={setBrands} user={user}/>, settings: <ClientSettings user={user} setUser={setUser}/> };
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
            {nav.map(item => <div key={item.id} onClick={() => goPage(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", cursor: "pointer", color: page === item.id ? th.tx : th.txS, background: page === item.id ? th.acS : "transparent", borderLeft: page === item.id ? `3px solid ${th.ac}` : "3px solid transparent", fontSize: 13, fontWeight: 500 }}><Ic name={item.ic} size={16}/>{item.label}{item.tag && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: th.acS, color: th.ac }}>{item.tag}</span>}</div>)}
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