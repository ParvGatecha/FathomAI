import { getOpenAIClient, getOpenAIModel, logAIOperation, isOpenAIConfigured } from "./openai";
import { ScoredTranscriptSegment } from "./retrieval";
import { validateAndRepairCitations } from "./citation-validator";
import { GroundedAnswer, GroundedCitation } from "./rag";
import { Meeting, Speaker, TranscriptSegment } from "./types";
import { formatTime } from "./utils";

/**
 * Generates an LLM answer strictly grounded in the retrieved transcript excerpts.
 */
export async function generateGroundedAnswerWithOpenAI(options: {
  query: string;
  contextSegments: ScoredTranscriptSegment[];
  meetingTitle?: string;
  decisions?: string[];
  actionItems?: string[];
}): Promise<GroundedAnswer | null> {
  const { query, contextSegments, meetingTitle, decisions = [], actionItems = [] } = options;

  if (!isOpenAIConfigured()) {
    return null;
  }

  const client = getOpenAIClient();
  if (!client) {
    return null;
  }

  const startTime = Date.now();
  const model = getOpenAIModel();

  // Format context for LLM prompt
  const formattedExcerpts = contextSegments.map((s, idx) => {
    return `[Segment #${idx + 1}]
Meeting ID: ${s.meetingId}
Meeting Title: ${s.meetingTitle}
Timestamp: ${s.startTime}s (${formatTime(s.startTime)}) - ${s.endTime}s (${formatTime(s.endTime)})
Speaker: ${s.speakerName}${s.speakerRole ? ` (${s.speakerRole})` : ""}
Dialogue: "${s.text}"`;
  }).join("\n\n");

  const decisionsContext = decisions.length > 0
    ? `Recorded Decisions:\n${decisions.map((d) => `- ${d}`).join("\n")}`
    : "";

  const actionsContext = actionItems.length > 0
    ? `Recorded Action Items:\n${actionItems.map((a) => `- ${a}`).join("\n")}`
    : "";

  const systemPrompt = `You are Fathom AI, an elite, accurate meeting intelligence system.
Your mission is to answer user questions with 100% grounded precision based ONLY on the provided meeting transcript excerpts and metadata.

CRITICAL GROUNDING RULES:
1. Answer strictly and solely using the provided transcript excerpts and recorded decisions/action items.
2. NEVER invent facts, metrics, speaker statements, dates, or SLAs not in the context.
3. If the provided context does NOT contain enough information to answer the question, explicitly state: "Based on the recorded meeting transcript, this specific topic was not covered," and summarize related topics that were discussed.
4. For every key fact, agreement, decision, or quote you state, include a citation referencing the exact Segment # and timestamp.
5. Do NOT fabricate timestamps or speaker names. Citations must match the timestamps and speakers in the provided context.

You MUST respond with valid JSON matching this schema:
{
  "answer": "Markdown-formatted concise, direct answer with bullet points and bold highlights",
  "citations": [
    {
      "meetingId": "string matching meetingId in excerpt",
      "meetingTitle": "string matching meetingTitle in excerpt",
      "timestamp": number (exact seconds from context),
      "quote": "verbatim quote snippet from dialogue",
      "speakerName": "exact speaker name",
      "label": "Decision | Action | Key Point | Blocker | SLA | Pricing"
    }
  ],
  "confidence": number between 0.80 and 1.00
}`;

  const userPrompt = `User Question: "${query}"

${meetingTitle ? `Current Meeting: ${meetingTitle}\n` : ""}
Retrieved Transcript Excerpts:
${formattedExcerpts}

${decisionsContext}
${actionsContext}

Provide a grounded, structured answer with verified citations:`;

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1, // Low temperature for high factual accuracy
      max_tokens: 800,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response received from OpenAI.");
    }

    const parsed = JSON.parse(content);
    const durationMs = Date.now() - startTime;

    // Validate and repair citations against source context
    const validatedCitations = validateAndRepairCitations(
      parsed.citations || [],
      contextSegments
    );

    logAIOperation({
      operation: meetingTitle ? "ask_meeting" : "ask_global",
      model,
      durationMs,
      retrievedSegmentsCount: contextSegments.length,
      success: true,
      citationsCount: validatedCitations.length,
    });

    return {
      text: parsed.answer || "I could not find a definitive answer in the transcript.",
      citations: validatedCitations,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.95,
      isRealLLM: true,
    };
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    logAIOperation({
      operation: meetingTitle ? "ask_meeting" : "ask_global",
      model,
      durationMs,
      retrievedSegmentsCount: contextSegments.length,
      success: false,
      error: err?.message || String(err),
    });
    return null;
  }
}

/**
 * Generates structured meeting summaries tailored to a specific template using OpenAI.
 */
export async function generateMeetingSummaryWithOpenAI(options: {
  meetingTitle: string;
  category: string;
  templateId?: string;
  transcript: TranscriptSegment[];
  speakers: Speaker[];
}): Promise<{
  headline: string;
  overview: string;
  keyTopics: string[];
  decisions: string[];
  actionItems: {
    task: string;
    assignee?: string;
    dueDate?: string;
    timestamp?: number;
  }[];
  openQuestions: string[];
  highlights: {
    timestamp: number;
    quote: string;
    reason: string;
    label: string;
  }[];
} | null> {
  const { meetingTitle, category, templateId = "general", transcript, speakers } = options;

  if (!isOpenAIConfigured()) {
    return null;
  }

  const client = getOpenAIClient();
  if (!client) {
    return null;
  }

  const startTime = Date.now();
  const model = getOpenAIModel();

  // Compress transcript for cost control and token safety (take up to 35 most informative turns)
  const sampledTranscript = transcript.slice(0, 40).map((s) => {
    return `[${formatTime(s.startTime)}] ${s.speakerName}: "${s.text}"`;
  }).join("\n");

  const systemPrompt = `You are Fathom AI's expert meeting synthesis engine.
Your task is to analyze meeting dialogue and produce a highly structured, accurate summary according to the template "${templateId}".

TEMPLATE GUIDELINES:
- general: Executive overview, clear decisions, follow-up commitments.
- sales / sales_meddic: Focus on Metrics, Economic Buyer, Decision Criteria, Decision Process, Identified Pain, Champion, and pricing objections.
- customer_success: Account health, feature requests, blockers, SLA satisfaction, renewal timeline.
- product: Roadmap priorities, technical architecture choices, design review sign-offs, launch blockers.
- engineering: Sprint velocity, infrastructure incident root causes, PR readiness, database optimizations.
- interview: Candidate competency scorecard, problem-solving evaluation, culture alignment, hiring recommendation.

You MUST respond with valid JSON matching this schema:
{
  "headline": "Punchy 1-sentence executive headline summary",
  "overview": "2-3 sentence strategic executive overview paragraph",
  "keyTopics": ["3-5 important discussion topics"],
  "decisions": ["2-5 agreed upon decisions made during the call"],
  "actionItems": [
    {
      "task": "Specific actionable commitment",
      "assignee": "Name of assigned speaker or 'Unassigned'",
      "dueDate": "e.g. By Friday, Next Sprint, End of Month",
      "timestamp": number (seconds into call)
    }
  ],
  "openQuestions": ["1-3 unresolved questions or open risks"],
  "highlights": [
    {
      "timestamp": number,
      "quote": "verbatim quote from dialogue",
      "reason": "Why this quote is important",
      "label": "Decision | Action | Blocker | Praise | Key Point"
    }
  ]
}`;

  const userPrompt = `Meeting Title: "${meetingTitle}"
Category: ${category}
Participants: ${speakers.map((s) => `${s.name} (${s.role})`).join(", ")}
Summary Template: ${templateId}

Transcript Excerpt:
${sampledTranscript}

Generate structured JSON summary:`;

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 1200,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty summary response received from OpenAI.");
    }

    const parsed = JSON.parse(content);
    const durationMs = Date.now() - startTime;

    logAIOperation({
      operation: "summarize_meeting",
      model,
      durationMs,
      retrievedSegmentsCount: transcript.length,
      success: true,
    });

    return {
      headline: parsed.headline || `${meetingTitle} Summary`,
      overview: parsed.overview || "Overview synthesized from transcript dialogue.",
      keyTopics: Array.isArray(parsed.keyTopics) ? parsed.keyTopics : [],
      decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
      openQuestions: Array.isArray(parsed.openQuestions) ? parsed.openQuestions : [],
      highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
    };
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    logAIOperation({
      operation: "summarize_meeting",
      model,
      durationMs,
      retrievedSegmentsCount: transcript.length,
      success: false,
      error: err?.message || String(err),
    });
    return null;
  }
}
