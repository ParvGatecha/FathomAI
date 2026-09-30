import { Meeting } from "./types";
import { retrieveRelevantSegments, ScoredTranscriptSegment } from "./retrieval";
import { generateGroundedAnswerWithOpenAI } from "./ai-grounded";
import { deterministicMeetingFallback, deterministicGlobalFallback } from "./deterministic-fallback";
import { isOpenAIConfigured } from "./openai";

export interface GroundedCitation {
  meetingId?: string;
  meetingTitle?: string;
  timestamp: number;
  quote: string;
  speakerName?: string;
  label?: string;
}

export interface GroundedAnswer {
  text: string;
  citations: GroundedCitation[];
  confidence: number;
  isRealLLM?: boolean;
}

/**
 * Ask Fathom Single-Meeting Intelligence:
 * Prioritizes real OpenAI generation with citation validation, with seamless fallback.
 */
export async function askMeetingIntelligenceAsync(
  meeting: Meeting,
  question: string
): Promise<GroundedAnswer> {
  // 1. Retrieve relevant transcript segments
  const retrievedSegments = retrieveRelevantSegments({
    query: question,
    meeting,
    maxSegments: 8,
    includeNeighbors: true,
  });

  // 2. Primary Path: OpenAI Grounded Generation
  if (isOpenAIConfigured()) {
    try {
      const aiResult = await generateGroundedAnswerWithOpenAI({
        query: question,
        contextSegments: retrievedSegments,
        meetingTitle: meeting.title,
        decisions: meeting.summary.keyDecisions,
        actionItems: meeting.actionItems.map((a) => a.text),
      });

      if (aiResult) {
        return {
          ...aiResult,
          isRealLLM: true,
        };
      }
    } catch (err) {
      console.warn("[Fathom AI] OpenAI generation encountered error, invoking fallback:", err);
    }
  }

  // 3. Fallback Path: Deterministic transcript synthesis
  return deterministicMeetingFallback(meeting, question, retrievedSegments);
}

/**
 * Synchronous wrapper for client components when necessary
 */
export function askMeetingIntelligence(
  meeting: Meeting,
  question: string
): GroundedAnswer {
  const retrievedSegments = retrieveRelevantSegments({
    query: question,
    meeting,
    maxSegments: 8,
    includeNeighbors: true,
  });
  return deterministicMeetingFallback(meeting, question, retrievedSegments);
}

/**
 * Cross-Meeting Global Intelligence:
 * Prioritizes real OpenAI generation across multi-meeting contexts, with seamless fallback.
 */
export async function askGlobalIntelligenceAsync(
  meetings: Meeting[],
  question: string
): Promise<GroundedAnswer & { meetingsAnalyzed: number }> {
  // 1. Cross-meeting retrieval
  const retrievedSegments = retrieveRelevantSegments({
    query: question,
    meetings,
    maxSegments: 12,
  });

  const uniqueMeetingIds = new Set(retrievedSegments.map((s) => s.meetingId));

  // 2. Primary Path: OpenAI Grounded Generation
  if (isOpenAIConfigured()) {
    try {
      const aiResult = await generateGroundedAnswerWithOpenAI({
        query: question,
        contextSegments: retrievedSegments,
      });

      if (aiResult) {
        return {
          ...aiResult,
          isRealLLM: true,
          meetingsAnalyzed: uniqueMeetingIds.size || meetings.length,
        };
      }
    } catch (err) {
      console.warn("[Fathom AI] OpenAI global generation error, invoking fallback:", err);
    }
  }

  // 3. Fallback Path
  const fallback = deterministicGlobalFallback(meetings, question, retrievedSegments);
  return {
    ...fallback,
    meetingsAnalyzed: uniqueMeetingIds.size || meetings.length,
  };
}

/**
 * Synchronous wrapper for cross-meeting Q&A
 */
export function askGlobalIntelligence(
  meetings: Meeting[],
  question: string
): GroundedAnswer {
  const retrievedSegments = retrieveRelevantSegments({
    query: question,
    meetings,
    maxSegments: 10,
  });
  return deterministicGlobalFallback(meetings, question, retrievedSegments);
}
