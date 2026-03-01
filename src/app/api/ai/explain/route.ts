import { NextResponse } from "next/server";

const MODEL = process.env.HUGGINGFACE_MODEL?.trim() || "meta-llama/Llama-3.2-3B-Instruct";
const MAX_INPUT_LENGTH = 8_000;
const MAX_TOKENS = 900;

type ExplainMode = "tecnico" | "claro" | "cliente";

type ExplainRequest = {
  text?: string;
  mode?: ExplainMode;
  question?: string;
};

type Citation = { quote: string };

type StructuredExplain = {
  executive: string;
  keyPoints: string[];
  favors: string[];
  limits: string[];
  risks: string[];
  recommendation: string;
  citations: Citation[];
};

function modeInstruction(mode: ExplainMode) {
  if (mode === "tecnico") return "Usa redacción jurídica técnica y precisa.";
  if (mode === "cliente") return "Explica para un cliente sin formación jurídica, evita jerga y aterriza en consecuencias prácticas.";
  return "Usa lenguaje claro, directo y entendible para no especialistas.";
}

function buildExplainPrompt(text: string, mode: ExplainMode) {
  return [
    "Analiza la siguiente tesis/jurisprudencia mexicana.",
    modeInstruction(mode),
    "Responde ÚNICAMENTE con JSON válido y sin markdown, usando esta estructura exacta:",
    '{"executive":"...","keyPoints":["..."],"favors":["..."],"limits":["..."],"risks":["..."],"recommendation":"...","citations":[{"quote":"..."}]}',
    "Reglas:",
    "- executive: 1 párrafo breve (máximo 120 palabras).",
    "- keyPoints: 3-6 viñetas concretas.",
    "- favors: 2-4 puntos de qué favorece este criterio.",
    "- limits: 2-4 límites/excepciones relevantes.",
    "- risks: 2-4 riesgos de interpretación o aplicación práctica.",
    "- recommendation: siguiente paso práctico sugerido.",
    "- citations.quote: cita textual breve tomada del texto fuente (máximo 4 citas).",
    "Texto fuente:",
    text,
  ].join("\n");
}

function buildQAPrompt(text: string, question: string, mode: ExplainMode) {
  return [
    "Responde la pregunta del usuario SOLO con base en el texto fuente.",
    modeInstruction(mode),
    "Si no hay base suficiente, dilo explícitamente.",
    "Devuelve ÚNICAMENTE JSON válido (sin markdown) con esta forma:",
    '{"answer":"...","citations":[{"quote":"..."}]}',
    "answer: máximo 180 palabras.",
    "citations.quote: 1 a 4 citas textuales del texto fuente.",
    `Pregunta: ${question}`,
    "Texto fuente:",
    text,
  ].join("\n");
}

async function callRouter(prompt: string, key: string) {
  return fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: "Eres un asistente jurídico experto en jurisprudencia mexicana." },
        { role: "user", content: prompt },
      ],
      max_tokens: MAX_TOKENS,
      temperature: 0.2,
    }),
    next: { revalidate: 0 },
  });
}

function extractContent(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";
  const choices = (payload as { choices?: { message?: { content?: string } }[] }).choices;
  const content = choices?.[0]?.message?.content;
  return typeof content === "string" ? content.trim() : "";
}

function parseJsonLoose(raw: string) {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenced?.[1]?.trim() || trimmed;
  try {
    return JSON.parse(candidate);
  } catch {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(candidate.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function decodeEscapes(text: string) {
  return text
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)));
}

function extractAnswerFromRaw(raw: string) {
  const text = raw.trim();
  if (!text) return "";

  const parsed = parseJsonLoose(text);
  if (parsed && typeof (parsed as { answer?: unknown }).answer === "string") {
    const v = String((parsed as { answer: string }).answer).trim();
    if (v) return decodeEscapes(v);
  }

  const answerMatch = text.match(/"answer"\s*:\s*"((?:\\.|[^"\\])*)"/i)
    || text.match(/answer\s*:\s*"((?:\\.|[^"\\])*)"/i);
  if (answerMatch?.[1]) return decodeEscapes(answerMatch[1].trim());

  return decodeEscapes(text);
}

function normalizeCitations(input: unknown): Citation[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((it) => {
      if (!it || typeof it !== "object") return null;
      const quote = (it as { quote?: unknown }).quote;
      if (typeof quote !== "string") return null;
      const cleaned = decodeEscapes(quote.trim());
      return cleaned ? { quote: cleaned } : null;
    })
    .filter((it): it is Citation => Boolean(it))
    .slice(0, 4);
}

function normalizeExplain(parsed: unknown): StructuredExplain | null {
  if (!parsed || typeof parsed !== "object") return null;
  const data = parsed as Record<string, unknown>;

  const toArr = (v: unknown) => (Array.isArray(v) ? v.filter((i): i is string => typeof i === "string" && Boolean(i.trim())).map((i) => decodeEscapes(i.trim())) : []);
  const executive = typeof data.executive === "string" ? decodeEscapes(data.executive.trim()) : "";
  const recommendation = typeof data.recommendation === "string" ? decodeEscapes(data.recommendation.trim()) : "";
  const keyPoints = toArr(data.keyPoints);
  const favors = toArr(data.favors);
  const limits = toArr(data.limits);
  const risks = toArr(data.risks);
  const citations = normalizeCitations(data.citations);

  if (!executive || !recommendation || keyPoints.length === 0) return null;

  return { executive, keyPoints, favors, limits, risks, recommendation, citations };
}

export async function POST(req: Request) {
  const huggingFaceKey = process.env.HUGGINGFACE_API_KEY?.trim();
  if (!huggingFaceKey) {
    return NextResponse.json({ error: "HUGGINGFACE_API_KEY no está configurada en el entorno del servidor." }, { status: 503 });
  }

  let body: ExplainRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Carga inválida." }, { status: 400 });
  }

  const text = (body?.text ?? "").trim();
  const question = (body?.question ?? "").trim();
  const mode: ExplainMode = body.mode === "tecnico" || body.mode === "cliente" ? body.mode : "claro";

  if (!text) return NextResponse.json({ error: "Se requiere texto para generar la explicación." }, { status: 400 });

  const clipped = text.slice(0, MAX_INPUT_LENGTH);
  const prompt = question ? buildQAPrompt(clipped, question, mode) : buildExplainPrompt(clipped, mode);

  let response: Response;
  try {
    response = await callRouter(prompt, huggingFaceKey);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo conectar con Hugging Face." },
      { status: 502 }
    );
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data && (data as { error?: unknown }).error;
    const detail = data ? JSON.stringify(data, null, 2) : `status ${response.status}`;
    return NextResponse.json({ error: message || `Hugging Face respondió con ${response.status}.`, detail, status: response.status }, { status: response.status });
  }

  const content = extractContent(data);
  if (!content) return NextResponse.json({ error: "El modelo no devolvió contenido." }, { status: 502 });

  const parsed = parseJsonLoose(content);

  if (question) {
    const answer = extractAnswerFromRaw(content);
    const citations = normalizeCitations(parsed && typeof parsed === "object" ? (parsed as { citations?: unknown }).citations : undefined);
    return NextResponse.json({ answer, citations });
  }

  const structured = normalizeExplain(parsed);
  if (!structured) {
    return NextResponse.json({
      summary: decodeEscapes(content),
      structured: {
        executive: decodeEscapes(content),
        keyPoints: [],
        favors: [],
        limits: [],
        risks: [],
        recommendation: "",
        citations: [],
      },
      fallback: true,
    });
  }

  return NextResponse.json({
    summary: structured.executive,
    structured,
  });
}
