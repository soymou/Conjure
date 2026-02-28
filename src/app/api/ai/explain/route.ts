import { NextResponse } from "next/server";

const MODEL = process.env.HUGGINGFACE_MODEL?.trim() || "google/flan-t5-base";
const MAX_INPUT_LENGTH = 6_000;
const MAX_TOKENS = 256;

function buildPrompt(text: string) {
  return `Eres una asistente jurídica que explica jurisprudencia mexicana a personas no especialistas. Resume el extracto en lenguaje llano (máximo 3 párrafos), resalta los puntos clave en frases tipo viñeta y evita copiar literalmente, salvo que sea absolutamente necesario.\n\nTexto original:\n${text}`;
}

function extractSummary(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";
  const candidate = (payload as { generated_text?: string; summary_text?: string }).generated_text ||
    (payload as { generated_text?: string; summary_text?: string }).summary_text;
  if (candidate && typeof candidate === "string") return candidate.trim();
  return "";
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
    response = await fetch(`https://router.huggingface.co/models/${MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${huggingFaceKey}`,
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
    });
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo conectar con Hugging Face: " + (error as Error).message },
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
