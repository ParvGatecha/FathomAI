import { Meeting, TranscriptSegment, ActionItem } from "./types";
import { formatTime } from "./utils";
import { GroundedAnswer, GroundedCitation } from "./rag";
import { ScoredTranscriptSegment, retrieveRelevantSegments } from "./retrieval";

/**
 * Deterministic fallback for single-meeting Q&A when OpenAI API is not configured or unavailable.
 */
export function deterministicMeetingFallback(
  meeting: Meeting,
  question: string,
  preRetrievedSegments?: ScoredTranscriptSegment[]
): GroundedAnswer {
  const qClean = question.trim().toLowerCase();
  const segments = preRetrievedSegments || retrieveRelevantSegments({ query: question, meeting, maxSegments: 6 });

  // 1. Speaker commitment intent
  const matchedSpeaker = meeting.speakers.find((s) =>
    qClean.includes(s.name.toLowerCase()) ||
    s.name.toLowerCase().split(" ").some((part) => part.length > 2 && qClean.includes(part))
  );

  if (matchedSpeaker && (qClean.includes("agree") || qClean.includes("do") || qClean.includes("commit") || qClean.includes("action") || qClean.includes("task") || qClean.includes("say"))) {
    const speakerActions = meeting.actionItems.filter(
      (a) => a.assignee?.name.toLowerCase() === matchedSpeaker.name.toLowerCase()
    );
    const speakerTurns = meeting.transcript.filter(
      (t) => t.speakerName.toLowerCase() === matchedSpeaker.name.toLowerCase()
    );
    const citations: GroundedCitation[] = [];

    let body = `During the meeting, **${matchedSpeaker.name}** (${matchedSpeaker.role}) agreed to and discussed the following key points:\n\n`;

    if (speakerActions.length > 0) {
      body += `### Assigned Commitments:\n`;
      speakerActions.forEach((act) => {
        body += `- **${act.text}** (Due: ${act.dueDate || "Pending"})\n`;
        citations.push({
          meetingId: meeting.id,
          meetingTitle: meeting.title,
          timestamp: act.timestamp,
          quote: act.text,
          speakerName: matchedSpeaker.name,
          label: `Commitment (${formatTime(act.timestamp)})`,
        });
      });
      body += `\n`;
    }

    if (speakerTurns.length > 0) {
      body += `### Relevant Dialogue Contributions:\n`;
      speakerTurns.slice(0, 3).forEach((turn) => {
        body += `- *"${turn.text}"*\n`;
        if (!citations.some((c) => Math.abs(c.timestamp - turn.startTime) < 1)) {
          citations.push({
            meetingId: meeting.id,
            meetingTitle: meeting.title,
            timestamp: turn.startTime,
            quote: turn.text,
            speakerName: matchedSpeaker.name,
            label: `Turn (${formatTime(turn.startTime)})`,
          });
        }
      });
    }

    return {
      text: body,
      citations: citations.slice(0, 4),
      confidence: 0.96,
    };
  }

  // 2. Decisions intent
  if (qClean.includes("decision") || qClean.includes("agreed") || qClean.includes("decide") || qClean.includes("conclusion")) {
    const citations: GroundedCitation[] = [];
    let body = `Here are the primary decisions finalized during **${meeting.title}**:\n\n`;

    meeting.summary.keyDecisions.forEach((decision, idx) => {
      body += `${idx + 1}. **${decision}**\n`;
    });

    const relevantDecSegments = segments.filter((s) =>
      s.text.toLowerCase().includes("agree") ||
      s.text.toLowerCase().includes("decid") ||
      s.text.toLowerCase().includes("confirm") ||
      s.text.toLowerCase().includes("launch")
    );

    const targetSegs = relevantDecSegments.length > 0 ? relevantDecSegments : segments.slice(0, 2);
    targetSegs.slice(0, 3).forEach((seg) => {
      citations.push({
        meetingId: meeting.id,
        meetingTitle: meeting.title,
        timestamp: seg.startTime,
        quote: seg.text,
        speakerName: seg.speakerName,
        label: `Decision Discussion (${formatTime(seg.startTime)})`,
      });
    });

    return {
      text: body,
      citations: citations.slice(0, 4),
      confidence: 0.98,
    };
  }

  // 3. Action items & next steps intent
  if (qClean.includes("action") || qClean.includes("next step") || qClean.includes("todo") || qClean.includes("follow up")) {
    const citations: GroundedCitation[] = [];
    let body = `Here are the active action items and next steps from **${meeting.title}**:\n\n`;

    meeting.actionItems.forEach((act) => {
      body += `- [${act.completed ? "x" : " "}] **${act.text}** — Assigned to **${act.assignee?.name || "Team"}** (Due: ${act.dueDate || "This week"})\n`;
      citations.push({
        meetingId: meeting.id,
        meetingTitle: meeting.title,
        timestamp: act.timestamp,
        quote: act.text,
        speakerName: act.assignee?.name || "Participant",
        label: `Action Item (${formatTime(act.timestamp)})`,
      });
    });

    return {
      text: body,
      citations: citations.slice(0, 4),
      confidence: 0.95,
    };
  }

  // 4. Default Fallback using retrieved transcript segments
  if (segments.length > 0) {
    const citations: GroundedCitation[] = [];
    let body = `Based on the transcript of **${meeting.title}**, here is the relevant discussion on this topic:\n\n`;

    segments.slice(0, 4).forEach((seg) => {
      body += `- **${seg.speakerName}** (${formatTime(seg.startTime)}): "${seg.text}"\n\n`;
      citations.push({
        meetingId: meeting.id,
        meetingTitle: meeting.title,
        timestamp: seg.startTime,
        quote: seg.text,
        speakerName: seg.speakerName,
        label: `${seg.speakerName} (${formatTime(seg.startTime)})`,
      });
    });

    return {
      text: body,
      citations,
      confidence: 0.88,
    };
  }

  return {
    text: `I searched the transcript of **${meeting.title}** for "${question}", but did not find a direct mention. You can review the executive summary or action items for general context.`,
    citations: [],
    confidence: 0.6,
  };
}

/**
 * Deterministic fallback for cross-meeting Q&A when OpenAI API is not configured or unavailable.
 */
export function deterministicGlobalFallback(
  meetings: Meeting[],
  question: string,
  preRetrievedSegments?: ScoredTranscriptSegment[]
): GroundedAnswer {
  const qClean = question.trim().toLowerCase();
  const segments = preRetrievedSegments || retrieveRelevantSegments({ query: question, meetings, maxSegments: 10 });

  if (segments.length > 0) {
    const citations: GroundedCitation[] = [];
    let body = `Across your workspace meetings, here is the synthesis of discussion on "${question}":\n\n`;

    const meetingsMap = new Map<string, ScoredTranscriptSegment[]>();
    for (const seg of segments) {
      if (!meetingsMap.has(seg.meetingTitle)) {
        meetingsMap.set(seg.meetingTitle, []);
      }
      meetingsMap.get(seg.meetingTitle)!.push(seg);
    }

    meetingsMap.forEach((segs, meetingTitle) => {
      body += `### ${meetingTitle}\n`;
      segs.slice(0, 2).forEach((seg) => {
        body += `- **${seg.speakerName}** (${formatTime(seg.startTime)}): "${seg.text}"\n`;
        citations.push({
          meetingId: seg.meetingId,
          meetingTitle: seg.meetingTitle,
          timestamp: seg.startTime,
          quote: seg.text,
          speakerName: seg.speakerName,
          label: `${seg.meetingTitle} (${formatTime(seg.startTime)})`,
        });
      });
      body += `\n`;
    });

    return {
      text: body,
      citations: citations.slice(0, 5),
      confidence: 0.92,
    };
  }

  return {
    text: `I searched across all ${meetings.length} meetings in your workspace for "${question}", but found no matching discussion. Try searching for broader terms like "pricing", "latency", "SLA", or "roadmap".`,
    citations: [],
    confidence: 0.5,
  };
}
