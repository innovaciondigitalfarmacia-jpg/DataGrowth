// v23 - Hedra como motor principal (Kling/Veo/Sora/Character-3 via Hedra)
//       Gemini Veo solo como fallback de emergencia. SIN fal.ai.
export const config = { api: { bodyParser: { sizeLimit: '10mb' }, responseLimit: '15mb' } };

// Cache en memoria de modelos Hedra (refresca cada 1h)
let HEDRA_MODELS_CACHE = null;
let HEDRA_MODELS_CACHE_TIME = 0;
const CACHE_TTL = 60 * 60 * 1000;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const HEDRA_KEY = process.env.HEDRA_API_KEY;
  const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";
  const HEDRA_BASE = "https://api.hedra.com/web-app/public";

  if (!GEMINI_KEY && !HEDRA_KEY) return res.status(500).json({ error: "No API keys configured" });

  // ═══ Construye contexto del brand ═══
  const buildBrandContext = (brand) => {
    if (!brand) return "";
    const parts = [];
    if (brand.name) parts.push("BRAND: " + brand.name);
    if (brand.industry) parts.push("INDUSTRY: " + brand.industry);
    let colors = "";
    if (Array.isArray(brand.colors) && brand.colors.length > 0) colors = brand.colors.join(", ");
    else if (brand.color) colors = brand.color;
    if (colors) parts.push("BRAND COLORS: " + colors);
    if (brand.imgStyle || brand.img_style) parts.push("VISUAL STYLE: " + (brand.imgStyle || brand.img_style));
    if (brand.tone) parts.push("TONE: " + brand.tone);
    if (brand.audience) parts.push("AUDIENCE: " + brand.audience);
    if (brand.products) parts.push("REAL PRODUCTS (use ONLY these, do NOT invent): " + String(brand.products).substring(0, 400));
    if (brand.description) parts.push("DESCRIPTION: " + String(brand.description).substring(0, 300));
    if (brand.differentiator) parts.push("DIFFERENTIATOR: " + String(brand.differentiator).substring(0, 200));
    if (brand.knowledge) parts.push("REAL BRAND KNOWLEDGE (use this REAL data, NEVER invent): " + String(brand.knowledge).substring(0, 1500));
    if (brand.realInfo) parts.push("LIVE WEB INFO: " + String(brand.realInfo).substring(0, 1000));
    return parts.length > 0
      ? "BRAND CONTEXT (use this REAL data, do NOT invent products, prices, or facts): " + parts.join(" | ") + ". "
      : "";
  };

  // ═══ Trae modelos de Hedra (con cache) ═══
  const getHedraModels = async () => {
    const now = Date.now();
    if (HEDRA_MODELS_CACHE && (now - HEDRA_MODELS_CACHE_TIME) < CACHE_TTL) return HEDRA_MODELS_CACHE;
    try {
      const r = await fetch(HEDRA_BASE + '/models', { headers: { 'X-API-Key': HEDRA_KEY } });
      if (r.ok) {
        const models = await r.json();
        HEDRA_MODELS_CACHE = Array.isArray(models) ? models : [];
        HEDRA_MODELS_CACHE_TIME = now;
        return HEDRA_MODELS_CACHE;
      }
    } catch (e) { console.log('Error fetching Hedra models:', e.message); }
    return [];
  };

  // ═══ Selecciona el mejor modelo según el caso ═══
  const pickHedraModel = (models, mode) => {
    if (!models || models.length === 0) return null;
    const videoModels = models.filter(m => m && (m.type === 'video' || !m.type));

    if (mode === 'talking') {
      const charModel = videoModels.find(m => /character-3|omnia/i.test(m.name || '') && m.requires_audio_input);
      if (charModel) return charModel;
    }

    // Para escenas - orden de preferencia (rápido y bueno primero)
    const preferences = [
      /kling.*2\.5.*turbo/i,
      /kling.*2\.5/i,
      /veo.*3\.1.*fast/i,
      /veo.*3\.1/i,
      /hailuo/i,
      /minimax/i,
      /kling.*3/i,
      /seedance/i,
      /sora/i,
    ];
    for (const pattern of preferences) {
      const found = videoModels.find(m => pattern.test(m.name || '') && !m.requires_audio_input);
      if (found) return found;
    }
    return videoModels.find(m => !m.requires_audio_input) || videoModels[0];
  };

  if (req.method === 'GET') {
    const { action, op, provider } = req.query;

    if (action === 'test') {
      const checks = {
        gemini: GEMINI_KEY ? "SI" : "NO",
        hedra: "checking..."
      };
      if (HEDRA_KEY) {
        try {
          const r = await fetch(HEDRA_BASE + '/models', { headers: { 'X-API-Key': HEDRA_KEY } });
          if (r.ok) {
            const models = await r.json();
            checks.hedra = "SI";
            checks.hedra_models_count = Array.isArray(models) ? models.length : 0;
          } else {
            checks.hedra = "FALLO_" + r.status;
          }
        } catch (e) { checks.hedra = "ERROR"; }
      } else {
        checks.hedra = "NO";
      }
      return res.status(200).json({ status: 'ready', v: '23', primary: 'hedra', fallback: 'gemini-veo', checks });
    }

    if (action === 'proxy' && req.query.uri) {
      try {
        const uri = req.query.uri;
        const separator = uri.includes('?') ? '&' : '?';
        return res.redirect(302, uri + separator + 'key=' + GEMINI_KEY);
      } catch (e) {}
      return res.status(500).json({ error: 'Proxy failed' });
    }

    if (action === 'check') {
      // Hedra check
      if (provider === 'hedra' && op) {
        try {
          const r = await fetch(HEDRA_BASE + '/generations/' + op + '/status', { headers: { 'X-API-Key': HEDRA_KEY } });
          if (r.ok) {
            const d = await r.json();
            const status = d.status || '';
            if (status === 'complete' || status === 'completed' || status === 'success') {
              const directUrl = d.url || d.video_url || d.download_url;
              if (directUrl) return res.status(200).json({ status: 'completed', video_url: directUrl });
              const assetId = d.asset_id || d.video_id;
              if (assetId) {
                try {
                  const aRes = await fetch(HEDRA_BASE + '/assets?ids=' + assetId, { headers: { 'X-API-Key': HEDRA_KEY } });
                  if (aRes.ok) {
                    const aData = await aRes.json();
                    const asset = Array.isArray(aData) ? aData[0] : (aData.assets ? aData.assets[0] : aData);
                    const videoUrl = asset?.url || asset?.asset_url || asset?.download_url;
                    if (videoUrl) return res.status(200).json({ status: 'completed', video_url: videoUrl });
                  }
                } catch (e) {}
              }
              return res.status(200).json({ status: 'error', error: 'Hedra completo pero sin URL: ' + JSON.stringify(d).substring(0, 300) });
            }
            if (status === 'error' || status === 'failed') return res.status(200).json({ status: 'error', error: d.error || d.error_message || 'Hedra falló' });
            return res.status(200).json({ status: 'processing', provider: 'hedra', progress: d.progress });
          }
          return res.status(200).json({ status: 'processing', provider: 'hedra' });
        } catch (e) { return res.status(200).json({ status: 'processing', provider: 'hedra' }); }
      }

      // Gemini Veo check (fallback)
      if (provider === 'gemini' && op) {
        try {
          const r = await fetch(GEMINI_BASE + '/' + op, { headers: { 'x-goog-api-key': GEMINI_KEY } });
          if (r.ok) {
            const d = await r.json();
            if (d.done) {
              const videoUri = d.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri
                || d.response?.generatedVideos?.[0]?.video?.uri
                || d.response?.predictions?.[0]?.video?.uri
                || d.response?.predictions?.[0]?.videoUri;
              if (videoUri) return res.status(200).json({ status: 'completed', video_url: '/api/video?action=proxy&uri=' + encodeURIComponent(videoUri) });
              return res.status(200).json({ status: 'error', error: 'Video done but no URL' });
            }
            return res.status(200).json({ status: 'processing', provider: 'gemini' });
          }
          return res.status(200).json({ status: 'processing', provider: 'gemini' });
        } catch (e) { return res.status(200).json({ status: 'processing', provider: 'gemini' }); }
      }

      return res.status(200).json({ status: 'processing' });
    }
    return res.status(400).json({ error: 'Unknown action' });
  }

  // ═══════════════════════════════════════════════════════════
  // POST: Iniciar generación
  // ═══════════════════════════════════════════════════════════
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const prompt = body && body.prompt;
      const image_base64 = body && body.image_base64;
      const brand = body && body.brand;
      const mode = body && body.mode;
      const script = body && body.script;
      const aspect_ratio = (body && body.aspect_ratio) || '9:16';
      const resolution = (body && body.resolution) || '540p';
      const duration_ms = (body && body.duration_ms) || 5000;
      const voice_id = body && body.voice_id;

      if (!prompt && !script) return res.status(400).json({ error: 'No prompt' });

      const brandContext = buildBrandContext(brand);
      const finalPrompt = brandContext + (prompt || "");

      // ═══════════════════════════════════════════════════════════
      // PRIMARY: HEDRA (Kling/Veo/Sora/Character-3 según el caso)
      // ═══════════════════════════════════════════════════════════
      if (HEDRA_KEY) {
        try {
          const models = await getHedraModels();
          const selected = pickHedraModel(models, mode);

          if (selected && selected.id) {
            console.log('Hedra: usando modelo', selected.name, '(', selected.id, ')');

            // Subir imagen como asset si tenemos image_base64
            let startKeyframeId = null;
            if (image_base64) {
              try {
                const createRes = await fetch(HEDRA_BASE + '/assets', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'X-API-Key': HEDRA_KEY },
                  body: JSON.stringify({ type: 'image', name: 'keyframe.jpg' })
                });
                if (createRes.ok) {
                  const created = await createRes.json();
                  const assetId = created.id || created.asset_id;
                  if (assetId) {
                    const imgBuf = Buffer.from(image_base64, 'base64');
                    const formData = new FormData();
                    formData.append('file', new Blob([imgBuf], { type: 'image/jpeg' }), 'keyframe.jpg');
                    const uploadRes = await fetch(HEDRA_BASE + '/assets/' + assetId + '/upload', {
                      method: 'POST',
                      headers: { 'X-API-Key': HEDRA_KEY },
                      body: formData
                    });
                    if (uploadRes.ok) startKeyframeId = assetId;
                  }
                }
              } catch (e) { console.log('Hedra upload image error:', e.message); }
            }

            // Adaptar resolución / aspect ratio / duración a lo que el modelo soporta
            const isCharacter = mode === 'talking' || selected.requires_audio_input;
            const supportedRes = (selected.resolutions && selected.resolutions.length > 0) ? selected.resolutions : ['540p', '720p'];
            const finalRes = supportedRes.includes(resolution) ? resolution : supportedRes[0];
            const supportedAR = (selected.aspect_ratios && selected.aspect_ratios.length > 0) ? selected.aspect_ratios : ['9:16', '16:9', '1:1'];
            const finalAR = supportedAR.includes(aspect_ratio) ? aspect_ratio : supportedAR[0];
            const maxDur = selected.max_duration_ms || 8000;
            const finalDur = Math.min(duration_ms, maxDur);

            const hedraPayload = {
              type: 'video',
              ai_model_id: selected.id,
              generated_video_inputs: {
                text_prompt: finalPrompt.substring(0, 2000) || (isCharacter ? 'A person talking naturally' : 'Cinematic shot'),
                ai_model_id: selected.id,
                resolution: finalRes,
                aspect_ratio: finalAR,
                duration_ms: finalDur
              }
            };
            if (startKeyframeId) hedraPayload.start_keyframe_id = startKeyframeId;

            // Si es talking + script → TTS
            if (isCharacter && script) {
              hedraPayload.audio_generation = {
                text: script,
                type: 'text_to_speech',
                language: 'auto',
                stability: 1,
                speed: 1
              };
              if (voice_id) hedraPayload.audio_generation.voice_id = voice_id;
            }

            const r = await fetch(HEDRA_BASE + '/generations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'X-API-Key': HEDRA_KEY },
              body: JSON.stringify(hedraPayload)
            });

            if (r.ok) {
              const d = await r.json();
              if (d.id) {
                console.log('Hedra started:', d.id, 'with model:', selected.name);
                return res.status(200).json({
                  status: 'started',
                  operation: d.id,
                  provider: 'hedra',
                  model_used: selected.name,
                  eta_sec: d.eta_sec
                });
              }
            } else {
              const errText = await r.text();
              console.log('Hedra error ' + r.status + ':', errText.substring(0, 500));
            }
          } else {
            console.log('Hedra: no se encontró modelo apropiado, cayendo a Gemini Veo');
          }
        } catch (e) {
          console.log('Hedra exception, cayendo a Gemini Veo:', e.message);
        }
      }

      // ═══════════════════════════════════════════════════════════
      // FALLBACK: Gemini Veo (solo de emergencia)
      // ═══════════════════════════════════════════════════════════
      if (GEMINI_KEY) {
        try {
          const instance = { prompt: finalPrompt.substring(0, 500) };
          if (image_base64) instance.image = { bytesBase64Encoded: image_base64, mimeType: 'image/jpeg' };
          const errors = [];
          const models = ['veo-3.1-generate-preview', 'veo-3.1-lite-generate-preview'];
          for (const model of models) {
            try {
              const r = await fetch(GEMINI_BASE + '/models/' + model + ':predictLongRunning', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY },
                body: JSON.stringify({ instances: [instance], parameters: { aspectRatio: '9:16' } })
              });
              if (r.ok) {
                const d = await r.json();
                if (d.name) return res.status(200).json({ status: 'started', operation: d.name, provider: 'gemini' });
              } else {
                const errText = await r.text();
                errors.push(model + ': ' + r.status + ' - ' + errText.substring(0, 200));
                if (image_base64 && instance.image) {
                  const instanceNoImg = { prompt: instance.prompt };
                  const r2 = await fetch(GEMINI_BASE + '/models/' + model + ':predictLongRunning', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY },
                    body: JSON.stringify({ instances: [instanceNoImg], parameters: { aspectRatio: '9:16' } })
                  });
                  if (r2.ok) {
                    const d2 = await r2.json();
                    if (d2.name) return res.status(200).json({ status: 'started', operation: d2.name, provider: 'gemini' });
                  }
                }
              }
            } catch (e) { console.log('Gemini Veo exception:', e.message); }
          }
          return res.status(200).json({ status: 'error', error: 'Hedra y Gemini Veo fallaron. Errors: ' + errors.join(' | ') });
        } catch (e) { console.log('Gemini Veo outer exception:', e.message); }
      }

      return res.status(200).json({ status: 'error', error: 'Todos los servicios de video fallaron' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}