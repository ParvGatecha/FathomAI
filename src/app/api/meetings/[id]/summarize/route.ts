import { NextRequest, NextResponse } from "next/server";
import { SEED_MEETINGS } from "@/lib/seed-data";
import { generateMeetingSummaryWithOpenAI } from "@/lib/ai-grounded";
import { generateSummaryForTemplate } from "@/lib/templates";
import { isOpenAIConfigured } from "@/lib/openai";
import { Meeting, TranscriptSegment, Speaker } from "@/lib/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { templateId = "general", customMeeting, transcript, speakers } = body;

    // Resolve target meeting
    let meeting: Meeting | undefined = customMeeting;
    if (!meeting) {
      meeting = SEED_MEETINGS.find((m) => m.id === id);
    }

    const meetingTitle = meeting?.title || body.title || `Meeting ${id}`;
    const category = meeting?.category || body.category || "product";
    const activeTranscript: TranscriptSegment[] =
      transcript || meeting?.transcript || [];
    const activeSpeakers: Speaker[] =
      speakers || meeting?.speakers || [];

    if (activeTranscript.length === 0) {
      return NextResponse.json(
        { error: "No transcript segments found to summarize." },
        { status: 400 }
      );
    }

    // 1. Primary Path: OpenAI Grounded Summary
    if (isOpenAIConfigured()) {
      try {
        const aiSummary = await generateMeetingSummaryWithOpenAI({
          meetingTitle,
          category,
          templateId,
          transcript: activeTranscript,
          speakers: activeSpeakers,
        });

        if (aiSummary) {
          return NextResponse.json({
            overview: aiSummary.overview,
            keyTopics: aiSummary.keyTopics,
            decisions: aiSummary.decisions,
            actionItems: aiSummary.actionItems.map((a) => ({
              task: a.task,
              assignee: a.assignee || "Unassigned",
              dueDate: a.dueDate || "Next Sprint",
            })),
            openQuestions: aiSummary.openQuestions,
            highlights: aiSummary.highlights.map((h) => ({
              timestamp: h.timestamp,
              reason: h.reason,
            })),
            isRealLLM: true,
            templateId,
          });
        }
      } catch (err) {
        console.warn("[Fathom AI] OpenAI summary generation failed, using template fallback:", err);
      }
    }

    // 2. Fallback Path: Deterministic Template Engine
    const deterministicMeeting = meeting || {
      id,
      title: meetingTitle,
      date: new Date().toISOString(),
      duration: activeTranscript[activeTranscript.length - 1]?.endTime || 1800,
      category: category as any,
      platform: "zoom" as const,
      speakers: activeSpeakers,
      transcript: activeTranscript,
      summary: {
        templateId: "default" as const,
        templateName: "General Overview",
        headline: `${meetingTitle} Summary`,
        overview: "Meeting discussions captured from session transcript.",
        sections: [],
        keyDecisions: [],
        nextSteps: [],
      },
      actionItems: [],
      highlights: [],
      tags: [],
      createdAt: new Date().toISOString(),
    };

    const templateSummary = generateSummaryForTemplate(deterministicMeeting, templateId);

    const keyTopics = templateSummary.sections.map((s) => s.title);
    const actionItems = deterministicMeeting.actionItems?.length > 0
      ? deterministicMeeting.actionItems.map((a) => ({
          task: a.text,
          assignee: a.assignee?.name || "Unassigned",
          dueDate: a.dueDate || "Next Week",
        }))
      : templateSummary.nextSteps.map((step) => ({
          task: step,
          assignee: "Team",
          dueDate: "Next Sprint",
        }));

    const highlights = deterministicMeeting.highlights?.length > 0
      ? deterministicMeeting.highlights.map((h) => ({
          timestamp: h.startTime,
          reason: h.text,
        }))
      : (templateSummary.sections[0]?.citations || []).map((c) => ({
          timestamp: c.timestamp,
          reason: c.quote,
        }));

    return NextResponse.json({
      overview: templateSummary.overview,
      keyTopics,
      decisions: templateSummary.keyDecisions,
      actionItems,
      openQuestions: [
        "Are all stakeholder requirements captured for the next sprint review?",
        "Do we have complete test coverage for high-latency network conditions?",
      ],
      highlights,
      isRealLLM: false,
      templateId,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Failed to generate meeting summary.",
        message: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
