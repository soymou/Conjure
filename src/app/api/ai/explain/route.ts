import { NextResponse } from "next/server";

const MODEL = "google/flan-t5-base";
const MAX_INPUT_LENGTH = 6_000;
const MAX_TOKENS = 256;

function buildPrompt(text: string) {
  return `Explica en lenguaje claro y resumido el siguiente extracto jurídico (no más de 3 párrafos):\n\n${text}`;
}

function extractSummary(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload
      .map((item) => {
        if (!item) return "";
        if (typeof item === "string") return item;
        return (item as { generated_text?: string; summary_text?: string }).generated_text ||
          (item as { generated_text?: string; summary_text?: string }).summary_text ||
          "";
      })
      .filter(Boolean)
      .join("\n")
      .trim();
  }

  if (typeof payload === "string") {
    return payload.trim();
  }

  if (typeof payload === "object" && payload !== null) {
    return (
      (payload as { generated_text?: string }).generated_text ||
      (payload as { summary_text?: string }).summary_text ||
      ""
    ).trim();
  }

  return "";
}

export async function POST(req: Request) {
  const HuggingFaceKey = process.env.HUGGINGFACE_API_KEY;

  if (!HuggingFaceKey) {
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

  const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HuggingFaceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: MAX_TOKENS,
        temperature: 0.3,
        return_full_text: false,
      },
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (data && (data as { error?: string }).error) || response.statusText;
    return NextResponse.json({ error: message }, { status: response.status });
  }

  const summary = extractSummary(data);

  if (!summary) {
    return NextResponse.json(
      { error: "No se obtuvo una explicación válida del modelo." },
      { status: 502 }
    );
  }

  return NextResponse.json({ summary });
}
