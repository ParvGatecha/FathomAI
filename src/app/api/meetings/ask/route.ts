import { NextRequest, NextResponse } from "next/server";
import { SEED_MEETINGS } from "@/lib/seed-data";
import { askGlobalIntelligenceAsync } from "@/lib/rag";
import { Meeting } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, customContext } = body;

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json(
        { error: "Question parameter is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    let allMeetings: Meeting[] = SEED_MEETINGS;
    if (customContext && Array.isArray(customContext) && customContext.length > 0) {
      allMeetings = customContext;
    }

    const result = await askGlobalIntelligenceAsync(allMeetings, question.trim());

    return NextResponse.json({
      answer: result.text,
      citations: result.citations,
      confidence: result.confidence,
      meetingsAnalyzed: result.meetingsAnalyzed,
      isRealLLM: result.isRealLLM ?? false,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Failed to process cross-meeting query.",
        message: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
