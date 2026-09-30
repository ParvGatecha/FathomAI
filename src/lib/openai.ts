import OpenAI from "openai";

let openaiInstance: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  const rawKey = process.env.OPENAI_API_KEY?.trim();
  const apiKey = rawKey?.replace(/^['"]|['"]$/g, "").trim();
  if (!apiKey || apiKey.length < 10) {
    return null;
  }

  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey,
      timeout: 25000, // 25s timeout for fast responses
      maxRetries: 2,
    });
  }

  return openaiInstance;
}

export function isOpenAIConfigured(): boolean {
  const rawKey = process.env.OPENAI_API_KEY?.trim();
  const key = rawKey?.replace(/^['"]|['"]$/g, "").trim();
  return Boolean(key && key.length > 10 && !key.includes("your-api-key") && !key.includes("your_openai_api_key"));
}

export function getOpenAIModel(): string {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

/**
 * Structured server log for AI calls (Strictly excludes API key and sensitive credentials)
 */
export function logAIOperation(details: {
  operation: "ask_meeting" | "ask_global" | "summarize_meeting" | "extract_actions";
  model: string;
  durationMs: number;
  retrievedSegmentsCount: number;
  success: boolean;
  error?: string;
  citationsCount?: number;
}) {
  const timestamp = new Date().toISOString();
  console.log(
    `[Fathom AI Engine] ${timestamp} | op=${details.operation} | model=${details.model} | dur=${details.durationMs}ms | ctxSegments=${details.retrievedSegmentsCount} | citations=${details.citationsCount ?? 0} | success=${details.success}${
      details.error ? ` | err=${details.error}` : ""
    }`
  );
}
