import { NextRequest, NextResponse } from "next/server";
import { SEED_MEETINGS } from "@/lib/seed-data";
import { askMeetingIntelligence, askGlobalIntelligence } from "@/lib/rag";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, meetingId, customContext } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question parameter is required." },
        { status: 400 }
      );
    }

    if (meetingId) {
      const meeting = customContext || SEED_MEETINGS.find((m) => m.id === meetingId);
      if (!meeting) {
        return NextResponse.json(
          { error: `Meeting with ID '${meetingId}' not found.` },
          { status: 404 }
        );
      }

      const answer = askMeetingIntelligence(meeting, question);
      return NextResponse.json({
        answer: answer.text,
        citations: answer.citations,
        confidence: answer.confidence,
        timestamp: new Date().toISOString(),
      });
    }

    // Global query across all meetings
    const allMeetings = customContext || SEED_MEETINGS;
    const globalAnswer = askGlobalIntelligence(allMeetings, question);

    return NextResponse.json({
      answer: globalAnswer.text,
      citations: globalAnswer.citations,
      confidence: globalAnswer.confidence,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Failed to process AI question.",
        message: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
