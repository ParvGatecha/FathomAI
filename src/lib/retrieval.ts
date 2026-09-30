import { Meeting, TranscriptSegment } from "./types";

export interface ScoredTranscriptSegment {
  meetingId: string;
  meetingTitle: string;
  meetingCategory: string;
  segmentId: string;
  speakerId: string;
  speakerName: string;
  speakerRole?: string;
  startTime: number;
  endTime: number;
  text: string;
  score: number;
  isNeighbor?: boolean;
}

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
  "any", "are", "as", "at", "be", "because", "been", "before", "being", "below",
  "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down",
  "during", "each", "few", "for", "from", "further", "had", "has", "have",
  "having", "he", "her", "here", "hers", "herself", "him", "himself", "his",
  "how", "i", "if", "in", "into", "is", "it", "its", "itself", "just", "me",
  "more", "most", "my", "myself", "no", "nor", "not", "now", "of", "off", "on",
  "once", "only", "or", "other", "our", "ours", "ourselves", "out", "over",
  "own", "same", "she", "should", "so", "some", "such", "than", "that", "the",
  "their", "theirs", "them", "themselves", "then", "there", "these", "they",
  "this", "those", "through", "to", "too", "under", "until", "up", "very",
  "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom",
  "why", "will", "with", "would", "you", "your", "yours", "yourself", "yourselves"
]);

export function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

/**
 * Deterministic lexical & BM25-style transcript retrieval engine
 */
export function retrieveRelevantSegments(options: {
  query: string;
  meeting?: Meeting;
  meetings?: Meeting[];
  maxSegments?: number;
  includeNeighbors?: boolean;
  minScoreThreshold?: number;
}): ScoredTranscriptSegment[] {
  const {
    query,
    meeting,
    meetings = meeting ? [meeting] : [],
    maxSegments = 8,
    includeNeighbors = true,
    minScoreThreshold = 0.5,
  } = options;

  const queryClean = query.trim().toLowerCase();
  const tokens = tokenizeQuery(query);

  if (tokens.length === 0 && !queryClean) {
    return [];
  }

  const scoredList: ScoredTranscriptSegment[] = [];

  for (const meet of meetings) {
    if (!meet.transcript || meet.transcript.length === 0) continue;

    const transcriptLen = meet.transcript.length;

    for (let i = 0; i < transcriptLen; i++) {
      const seg = meet.transcript[i];
      const textLower = seg.text.toLowerCase();
      const speakerLower = seg.speakerName.toLowerCase();
      let score = 0;

      // 1. Exact query phrase match (Highest boost)
      if (queryClean.length > 4 && textLower.includes(queryClean)) {
        score += 15.0;
      }

      // 2. Multi-token scoring
      for (const token of tokens) {
        if (textLower.includes(token)) {
          // Boost rarer/longer terms
          const termWeight = token.length >= 6 ? 3.0 : 1.5;
          score += termWeight;

          // Word boundary exact match bonus
          const wordRegex = new RegExp(`\\b${token}\\b`, "i");
          if (wordRegex.test(seg.text)) {
            score += 1.5;
          }
        }

        // Speaker name mention boost
        if (speakerLower.includes(token)) {
          score += 3.5;
        }
      }

      // 3. Domain keyword intent bonus
      if (
        (queryClean.includes("decision") || queryClean.includes("agree")) &&
        (textLower.includes("agree") || textLower.includes("decid") || textLower.includes("consensus") || textLower.includes("confirm"))
      ) {
        score += 3.0;
      }

      if (
        (queryClean.includes("action") || queryClean.includes("next step") || queryClean.includes("task") || queryClean.includes("todo")) &&
        (textLower.includes("will") || textLower.includes("follow up") || textLower.includes("take care") || textLower.includes("assign") || textLower.includes("action"))
      ) {
        score += 3.0;
      }

      if (
        (queryClean.includes("concern") || queryClean.includes("risk") || queryClean.includes("objection") || queryClean.includes("blocker")) &&
        (textLower.includes("concern") || textLower.includes("risk") || textLower.includes("issue") || textLower.includes("block") || textLower.includes("worry"))
      ) {
        score += 3.0;
      }

      if (
        (queryClean.includes("price") || queryClean.includes("cost") || queryClean.includes("budget") || queryClean.includes("tier")) &&
        (textLower.includes("$") || textLower.includes("tier") || textLower.includes("seat") || textLower.includes("annual") || textLower.includes("contract") || textLower.includes("pricing"))
      ) {
        score += 3.5;
      }

      if (score >= minScoreThreshold) {
        scoredList.push({
          meetingId: meet.id,
          meetingTitle: meet.title,
          meetingCategory: meet.category,
          segmentId: seg.id,
          speakerId: seg.speakerId,
          speakerName: seg.speakerName,
          speakerRole: seg.speakerRole,
          startTime: seg.startTime,
          endTime: seg.endTime,
          text: seg.text,
          score,
        });
      }
    }
  }

  // Sort descending by score
  scoredList.sort((a, b) => b.score - a.score);

  // If no hits scored above threshold, fallback to sampling early key turns
  if (scoredList.length === 0 && meetings.length > 0) {
    const fallbackMeet = meetings[0];
    const topTurns = fallbackMeet.transcript.slice(0, Math.min(maxSegments, fallbackMeet.transcript.length));
    return topTurns.map((seg) => ({
      meetingId: fallbackMeet.id,
      meetingTitle: fallbackMeet.title,
      meetingCategory: fallbackMeet.category,
      segmentId: seg.id,
      speakerId: seg.speakerId,
      speakerName: seg.speakerName,
      speakerRole: seg.speakerRole,
      startTime: seg.startTime,
      endTime: seg.endTime,
      text: seg.text,
      score: 1.0,
    }));
  }

  // Pick top scoring distinct segments
  const topScored = scoredList.slice(0, maxSegments);

  // If neighboring segments requested, include adjacent turns for context cohesion
  if (includeNeighbors && meetings.length === 1 && meeting) {
    const includedSegmentIds = new Set(topScored.map((s) => s.segmentId));
    const neighborsToAdd: ScoredTranscriptSegment[] = [];

    for (const scored of topScored) {
      const idx = meeting.transcript.findIndex((s) => s.id === scored.segmentId);
      if (idx > 0) {
        const prevSeg = meeting.transcript[idx - 1];
        if (!includedSegmentIds.has(prevSeg.id)) {
          includedSegmentIds.add(prevSeg.id);
          neighborsToAdd.push({
            meetingId: meeting.id,
            meetingTitle: meeting.title,
            meetingCategory: meeting.category,
            segmentId: prevSeg.id,
            speakerId: prevSeg.speakerId,
            speakerName: prevSeg.speakerName,
            speakerRole: prevSeg.speakerRole,
            startTime: prevSeg.startTime,
            endTime: prevSeg.endTime,
            text: prevSeg.text,
            score: scored.score * 0.7,
            isNeighbor: true,
          });
        }
      }
    }

    const merged = [...topScored, ...neighborsToAdd];
    merged.sort((a, b) => a.startTime - b.startTime);
    return merged;
  }

  return topScored;
}
