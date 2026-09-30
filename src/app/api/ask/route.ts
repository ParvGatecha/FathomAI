import { NextRequest, NextResponse } from "next/server";
import { SEED_MEETINGS } from "@/lib/seed-data";
import { askMeetingIntelligenceAsync, askGlobalIntelligenceAsync } from "@/lib/rag";
import { Meeting } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, meetingId, customContext } = body;

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json(
        { error: "Question parameter is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    // 1. Single Meeting Q&A
    if (meetingId) {
      let meeting: Meeting | undefined;

      if (customContext && typeof customContext === "object") {
        if (Array.isArray(customContext)) {
          meeting = customContext.find((m: Meeting) => m.id === meetingId);
        } else if ((customContext as Meeting).id === meetingId) {
          meeting = customContext as Meeting;
        }
      }

      if (!meeting) {
        meeting = SEED_MEETINGS.find((m) => m.id === meetingId);
      }

      if (!meeting) {
        return NextResponse.json(
          { error: `Meeting with ID '${meetingId}' was not found.` },
          { status: 404 }
        );
      }

      const answer = await askMeetingIntelligenceAsync(meeting, question.trim());

      return NextResponse.json({
        answer: answer.text,
        citations: answer.citations,
        confidence: answer.confidence,
        isRealLLM: answer.isRealLLM ?? false,
        timestamp: new Date().toISOString(),
      });
    }

    // 2. Cross-Meeting Global Q&A
    let allMeetings: Meeting[] = SEED_MEETINGS;
    if (customContext && Array.isArray(customContext) && customContext.length > 0) {
      allMeetings = customContext;
    }

    const globalAnswer = await askGlobalIntelligenceAsync(allMeetings, question.trim());

    return NextResponse.json({
      answer: globalAnswer.text,
      citations: globalAnswer.citations,
      confidence: globalAnswer.confidence,
      meetingsAnalyzed: globalAnswer.meetingsAnalyzed,
      isRealLLM: globalAnswer.isRealLLM ?? false,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Failed to process question via Fathom AI.",
        message: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
