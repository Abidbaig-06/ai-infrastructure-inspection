/**
 * NVIDIA NIM Vision Engine
 * Replaces the local SAM 2 / Grounding DINO server with a hosted vision-LLM
 * (build.nvidia.com). One chat/completions call returns detected infrastructure
 * defects as structured JSON: bounding boxes (0-100%), type, severity, confidence,
 * plus a short engineering narrative for the dossier.
 *
 * Env: NVIDIA_API_KEY = nvapi-...
 * Model override: NVIDIA_VISION_MODEL (default meta/llama-3.2-90b-vision-instruct)
 */

const NVIDIA_BASE = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const NVIDIA_MODEL = process.env.NVIDIA_VISION_MODEL || 'meta/llama-3.2-90b-vision-instruct';

// Accept a single key (NVIDIA_API_KEY) or a comma-separated pool (NVIDIA_API_KEYS).
// Keys are used round-robin, and a request rotates to the next key on 401/403/429/5xx.
const API_KEYS = (process.env.NVIDIA_API_KEYS || process.env.NVIDIA_API_KEY || '')
  .split(',')
  .map((k) => k.trim())
  .filter(Boolean);

let keyCursor = 0;
const nextKeyIndex = () => {
  const i = keyCursor % API_KEYS.length;
  keyCursor = (keyCursor + 1) % API_KEYS.length;
  return i;
};

// Map a free-text severity to the app's fixed enum
const normalizeSeverity = (s) => {
  const v = String(s || '').toUpperCase();
  if (v.includes('CRIT')) return 'CRITICAL';
  if (v.includes('HIGH')) return 'HIGH';
  if (v.includes('MED') || v.includes('MOD')) return 'MEDIUM';
  if (v.includes('LOW') || v.includes('MINOR')) return 'LOW';
  return 'MEDIUM';
};

const clampPct = (n, fallback) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return fallback;
  return Math.min(100, Math.max(0, Math.round(x)));
};

// Deterministic fallback so Tab 2 still renders if the API key is missing or the call fails
const fallbackDefects = (category = '') => {
  const cat = category.toLowerCase();
  if (cat.includes('water') || cat.includes('pipe') || cat.includes('sewage')) {
    return [{
      defectType: 'High-Pressure Pipeline Rupture & Cavitation',
      confidence: 0.9,
      dimensions: 'Estimated inundation area: ~40 m²',
      severityLevel: 'CRITICAL',
      ircCodeStandard: 'CPHEEO Manual on Water Supply and Treatment',
      boundingCoordinates: { xmin: 22, ymin: 28, xmax: 78, ymax: 82 }
    }];
  }
  if (cat.includes('electric') || cat.includes('wire')) {
    return [{
      defectType: 'Dangling 440V Overhead Conductor Sag',
      confidence: 0.9,
      dimensions: 'Ground clearance well below statutory 5.5m',
      severityLevel: 'CRITICAL',
      ircCodeStandard: 'Central Electricity Authority (CEA) Safety Regulations 2010',
      boundingCoordinates: { xmin: 30, ymin: 15, xmax: 68, ymax: 85 }
    }];
  }
  return [
    {
      defectType: 'Alligator Cracking & Asphalt Spalling',
      confidence: 0.9,
      dimensions: 'Length: ~2.8m, Width: ~1.6m',
      severityLevel: 'CRITICAL',
      ircCodeStandard: 'IRC:82-2015 Pavement Maintenance Standard (Severity III)',
      boundingCoordinates: { xmin: 15, ymin: 22, xmax: 85, ymax: 78 }
    },
    {
      defectType: 'Sub-Base Soil Erosion Void',
      confidence: 0.82,
      dimensions: 'Estimated cavity volume: ~0.6 m³',
      severityLevel: 'HIGH',
      ircCodeStandard: 'IRC:37-2018 Structural Design of Flexible Pavements',
      boundingCoordinates: { xmin: 40, ymin: 46, xmax: 72, ymax: 70 }
    }
  ];
};

// Build the `image_url` content part the way the NVIDIA API catalog documents it.
// - http(s) URL: passed through as-is (NIM fetches it server-side)
// - data: URI: passed through as-is
// - anything else / oversized data URI: caller falls back
const MAX_DATA_URI_BYTES = 180 * 1024; // NIM inline image ceiling (~180KB base64)

const buildImageUrlPart = (imageUrl) => {
  if (!imageUrl) return null;
  if (/^https?:\/\//i.test(imageUrl)) {
    return { type: 'image_url', image_url: { url: imageUrl } };
  }
  const m = /^data:([^;]+);base64,(.+)$/i.exec(imageUrl);
  if (m) {
    if (m[2].length > MAX_DATA_URI_BYTES) return null; // too large to inline
    return { type: 'image_url', image_url: { url: imageUrl } };
  }
  return null;
};

const SYSTEM_PROMPT =
  'You are an infrastructure inspection vision model for a municipal corporation. ' +
  'You look at a single photo of public infrastructure and report visible physical defects. ' +
  'Respond with ONLY a compact JSON object, no markdown, no prose.';

const buildUserPrompt = (title, category) => `
Analyze this infrastructure photo${category ? ` (reported category: ${category})` : ''}${title ? `, titled "${title}"` : ''}.

Return JSON exactly in this shape:
{
  "defects": [
    {
      "defectType": "short label",
      "severity": "CRITICAL | HIGH | MEDIUM | LOW",
      "confidence": 0.0-1.0,
      "dimensions": "approx size / extent in plain words",
      "standard": "relevant Indian code if known (IRC / CPHEEO / CEA / SWM), else empty",
      "bbox": { "xmin": 0-100, "ymin": 0-100, "xmax": 0-100, "ymax": 0-100 }
    }
  ],
  "summary": "one or two sentence engineering assessment",
  "recommendedAction": "the single most important corrective action"
}
bbox values are PERCENTAGES of image width/height (top-left origin). Report 1-4 defects, most severe first.
`.trim();

/**
 * @param {{imageUrl?:string, title?:string, description?:string, category?:string}} input
 * @returns {Promise<{visionDefects:Array, summary:string, recommendedAction:string, engine:string}>}
 */
const detectDefectsNvidia = async ({ imageUrl, title, category } = {}) => {
  if (API_KEYS.length === 0) {
    return {
      visionDefects: fallbackDefects(category),
      summary: 'NVIDIA vision API key not configured — showing deterministic sample defects.',
      recommendedAction: 'Set NVIDIA_API_KEY or NVIDIA_API_KEYS to enable live vision inference.',
      engine: 'fallback'
    };
  }

  const imagePart = buildImageUrlPart(imageUrl);
  if (!imagePart) {
    return {
      visionDefects: fallbackDefects(category),
      summary: 'No usable inspection image (missing, unreachable, or too large to inline).',
      recommendedAction: 'Attach a hosted image URL or a smaller photo to run vision inference.',
      engine: 'fallback'
    };
  }

  const body = {
    model: NVIDIA_MODEL,
    messages: [
      {
        role: 'user',
        content: [imagePart, { type: 'text', text: `${SYSTEM_PROMPT}\n\n${buildUserPrompt(title, category)}` }]
      }
    ],
    max_tokens: 1024,
    temperature: 0.2,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: false
  };

  // Try each key in rotation; rotate on auth/rate/5xx errors, fail fast otherwise.
  const RETRYABLE = new Set([401, 403, 408, 429, 500, 502, 503, 504]);
  let raw;
  let lastErr;
  const REQUEST_TIMEOUT_MS = Number(process.env.NVIDIA_TIMEOUT_MS) || 45000;
  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    const idx = nextKeyIndex();
    const key = API_KEYS[idx];
    const ac = new AbortController();
    const to = setTimeout(() => ac.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(`${NVIDIA_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(body),
        signal: ac.signal
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        const msg = `NVIDIA NIM ${res.status} (key #${idx + 1}): ${errText.slice(0, 200)}`;
        if (RETRYABLE.has(res.status) && attempt < API_KEYS.length - 1) {
          console.warn(`[NVIDIA Vision] ${msg} — rotating key`);
          lastErr = new Error(msg);
          continue;
        }
        throw new Error(msg);
      }
      const json = await res.json();
      raw = json?.choices?.[0]?.message?.content || '';
      lastErr = null;
      break;
    } catch (err) {
      lastErr = err.name === 'AbortError'
        ? new Error(`NVIDIA NIM timeout after ${REQUEST_TIMEOUT_MS}ms (key #${idx + 1})`)
        : err;
      if (attempt < API_KEYS.length - 1) {
        console.warn(`[NVIDIA Vision] request error (key #${idx + 1}): ${lastErr.message} — rotating key`);
        continue;
      }
    } finally {
      clearTimeout(to);
    }
  }

  if (lastErr || raw == null) {
    const msg = lastErr ? lastErr.message : 'no response';
    console.error('[NVIDIA Vision] all keys exhausted:', msg);
    return {
      visionDefects: fallbackDefects(category),
      summary: `Live vision inference unavailable (${msg}).`,
      recommendedAction: 'Retry inspection or verify NVIDIA API access.',
      engine: 'fallback'
    };
  }

  // Extract the JSON object from the model reply (tolerate stray text / code fences)
  let parsed;
  try {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    parsed = JSON.parse(start >= 0 && end > start ? raw.slice(start, end + 1) : raw);
  } catch (err) {
    console.warn('[NVIDIA Vision] could not parse model JSON, using fallback. Raw:', raw.slice(0, 200));
    return {
      visionDefects: fallbackDefects(category),
      summary: 'Vision model returned an unstructured response.',
      recommendedAction: 'Re-run inspection.',
      engine: 'nvidia-unparsed'
    };
  }

  const list = Array.isArray(parsed.defects) ? parsed.defects : [];
  const visionDefects = list.slice(0, 4).map((d, i) => {
    const bb = d.bbox || d.boundingCoordinates || {};
    return {
      defectType: String(d.defectType || d.type || `Detected Defect ${i + 1}`).slice(0, 120),
      confidence: Math.min(1, Math.max(0, Number(d.confidence) || 0.85)),
      dimensions: String(d.dimensions || d.size || 'Approximate extent not estimated'),
      severityLevel: normalizeSeverity(d.severity || d.severityLevel),
      ircCodeStandard: String(d.standard || d.ircCodeStandard || 'General Municipal Engineering Standard'),
      boundingCoordinates: {
        xmin: clampPct(bb.xmin, 15),
        ymin: clampPct(bb.ymin, 20),
        xmax: clampPct(bb.xmax, 85),
        ymax: clampPct(bb.ymax, 80)
      }
    };
  });

  return {
    visionDefects: visionDefects.length ? visionDefects : fallbackDefects(category),
    summary: String(parsed.summary || '').slice(0, 600),
    recommendedAction: String(parsed.recommendedAction || parsed.action || '').slice(0, 400),
    engine: `nvidia:${NVIDIA_MODEL}`
  };
};

module.exports = { detectDefectsNvidia };
