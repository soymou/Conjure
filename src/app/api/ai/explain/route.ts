import { NextResponse } from "next/server";

const MODEL = process.env.HUGGINGFACE_MODEL?.trim() || "meta-llama/Llama-3.2-1B-Instruct";
const MODEL_PATH = encodeURIComponent(MODEL);
const MAX_INPUT_LENGTH = 6_000;
const MAX_TOKENS = 256;

function buildPrompt(text: string) {
  return `Eres una asistente jurídica que explica jurisprudencia mexicana a personas no especialistas. Resume el extracto en lenguaje llano (máximo 3 párrafos), resalta los puntos clave en frases tipo viñeta y evita copiar literalmente, salvo que sea absolutamente necesario.\n\nTexto original:\n${text}`;
}

function extractSummary(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";
  const choices = (payload as { choices?: { message?: { content?: string } }[] }).choices;
  if (Array.isArray(choices) && choices.length > 0) {
    const content = choices[0]?.message?.content;
    if (typeof content === "string" && content.trim()) return content.trim();
  }
  const generated = (payload as { generated_text?: string }).generated_text;
  if (typeof generated === "string" && generated.trim()) return generated.trim();
  return "";
}

async function callRouter(prompt: string, key: string) {
  return fetch(`https://router.huggingface.co/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: "Eres un asistente jurídico" },
        { role: "user", content: prompt },
      ],
      max_tokens: MAX_TOKENS,
      temperature: 0.3,
    }),
    next: { revalidate: 0 },
  });
}

async function callLegacy(prompt: string, key: string) {
  return fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: MAX_TOKENS,
        temperature: 0.3,
      },
      options: { wait_for_model: true },
    }),
    next: { revalidate: 0 },
  });
}

async function requestHuggingFace(prompt: string, key: string) {
  try {
    const routerResponse = await callRouter(prompt, key);
    if (routerResponse.ok) return routerResponse;
    const text = await routerResponse.text().catch(() => "");
    if (!text.includes("router.huggingface.co")) return routerResponse;
  } catch (error) {
    console.warn("Router fallback", error);
  }
  return callLegacy(prompt, key);
}

export async function POST(req: Request) {
  const huggingFaceKey = process.env.HUGGINGFACE_API_KEY?.trim();

  if (!huggingFaceKey) {
    return NextResponse.json(
      { error: "HUGGINGFACE_API_KEY no está configurada en el entorno del servidor." },
      { status: 503 }
    );
  }

  let body: { text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Carga inválida." }, { status: 400 });
  }

  const text = (body?.text ?? "").trim();
  if (!text) {
    return NextResponse.json({ error: "Se requiere texto para generar la explicación." }, { status: 400 });
  }

  const prompt = buildPrompt(text.slice(0, MAX_INPUT_LENGTH));

  let response: Response;
  try {
    response = await requestHuggingFace(prompt, huggingFaceKey);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo conectar con Hugging Face." },
      { status: 502 }
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data && (data as { error?: string }).error;
    return NextResponse.json({ error: message || `Hugging Face respondió con ${response.status}.` }, { status: response.status });
  }

  const summary = extractSummary(data);
  if (!summary) {
    return NextResponse.json(
      { error: "Hugging Face no devolvió una explicación válida." },
      { status: 502 }
    );
  }

  return NextResponse.json({ summary });
}
