// hedra.js

const HEDRA_API_KEY = "sk_hedra_tyJdfeH3NKG5v874Q9Dj2HDUScBLjVyEoD4Idp37DhcSSVc5tZChqw31T7sQNph-";
const HEDRA_BASE = "https://api.hedra.com/web-app/public";

const MODELS = {
  talking: "d1dd37a3-e39a-4854-a298-6510289f9cf2",
  scene: "kling-25-turbo",
  scene_premium: "kling-3-pro",
};

export async function generateHedraVideo({
  imageUrl,
  script,
  prompt,
  mode,
  aspectRatio = "9:16",
  resolution = "540p",
  durationMs = 5000,
  voiceId,
}) {
  if (!imageUrl) throw new Error("Falta imageUrl");

  const finalMode = mode || (script ? "talking" : "scene");
  const modelId = MODELS[finalMode];

  const payload = {
    type: "video",
    ai_model_id: modelId,
    start_keyframe_url: imageUrl,
    generated_video_inputs: {
      text_prompt: prompt || (finalMode === "talking" ? "A person talking naturally to camera" : ""),
      ai_model_id: modelId,
      resolution,
      aspect_ratio: aspectRatio,
      duration_ms: durationMs,
    },
  };

  if (finalMode === "talking") {
    if (!script) throw new Error("Falta script para modo talking");
    payload.audio_generation = {
      text: script,
      type: "text_to_speech",
      language: "auto",
      stability: 1,
      speed: 1,
      ...(voiceId && { voice_id: voiceId }),
    };
  } else {
    if (!prompt) throw new Error("Falta prompt para modo scene");
  }

  const startRes = await fetch(`${HEDRA_BASE}/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": HEDRA_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!startRes.ok) {
    const err = await startRes.text();
    throw new Error(`Hedra error: ${err}`);
  }

  const { id: generationId, asset_id } = await startRes.json();

  // Polling hasta 5 min
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 5000));

    const statusRes = await fetch(`${HEDRA_BASE}/generations/${generationId}/status`, {
      headers: { "X-API-Key": HEDRA_API_KEY },
    });

    if (!statusRes.ok) continue;
    const status = await statusRes.json();

    if (status.status === "complete") {
      const assetRes = await fetch(`${HEDRA_BASE}/assets/${status.asset_id || asset_id}`, {
        headers: { "X-API-Key": HEDRA_API_KEY },
      });
      const asset = await assetRes.json();
      return { videoUrl: asset.url || asset.asset_url, generationId };
    }

    if (status.status === "error") {
      throw new Error(`Falló: ${status.error || "unknown"}`);
    }
  }

  throw new Error("Timeout: el video tardó más de 5 minutos");
}