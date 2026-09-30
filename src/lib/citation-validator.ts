import { GroundedCitation } from "./rag";
import { ScoredTranscriptSegment } from "./retrieval";

/**
 * Validates and repairs LLM generated citations against actual retrieved transcript context.
 * Strictly prevents model hallucinations and timestamp fabrication.
 */
export function validateAndRepairCitations(
  rawCitations: any[],
  retrievedSegments: ScoredTranscriptSegment[]
): GroundedCitation[] {
  if (!Array.isArray(rawCitations) || rawCitations.length === 0 || retrievedSegments.length === 0) {
    return [];
  }

  const validCitations: GroundedCitation[] = [];
  const seenKeys = new Set<string>();

  for (const raw of rawCitations) {
    if (!raw || typeof raw !== "object") continue;

    const hasNumericTimestamp = typeof raw.timestamp === "number" && Number.isFinite(raw.timestamp) && raw.timestamp >= 0;
    const hasStringTimestamp = typeof raw.timestamp === "string" && !Number.isNaN(Number(raw.timestamp)) && Number(raw.timestamp) >= 0;
    const rawTimestamp = hasNumericTimestamp
      ? raw.timestamp
      : (hasStringTimestamp ? Number(raw.timestamp) : null);

    const rawQuote = typeof raw.quote === "string" ? raw.quote.trim().toLowerCase() : "";
    const rawMeetingId = typeof raw.meetingId === "string" ? raw.meetingId.trim() : "";
    const rawSpeaker = typeof raw.speakerName === "string" ? raw.speakerName.trim().toLowerCase() : "";

    // Require at least a valid timestamp or a substantial quote (> 8 chars)
    if (rawTimestamp === null && rawQuote.length < 8) {
      continue;
    }
    let bestSegment: ScoredTranscriptSegment | null = null;
    let highestMatchScore = 0;

    for (const seg of retrievedSegments) {
      let matchScore = 0;
      const segTextLower = seg.text.toLowerCase();
      const segSpeakerLower = seg.speakerName.toLowerCase();

      // 1. Meeting ID check
      if (rawMeetingId && seg.meetingId === rawMeetingId) {
        matchScore += 2;
      }

      // 2. Exact or close timestamp match (+/- 15 seconds)
      if (rawTimestamp !== null) {
        const timeDiff = Math.abs(seg.startTime - rawTimestamp);
        if (timeDiff === 0) {
          matchScore += 5;
        } else if (timeDiff <= 5) {
          matchScore += 3;
        } else if (timeDiff <= 15) {
          matchScore += 1.5;
        }
      }

      // 3. Quote substring or word overlap check
      if (rawQuote) {
        if (segTextLower.includes(rawQuote) || rawQuote.includes(segTextLower)) {
          matchScore += 8;
        } else {
          // Token overlap
          const quoteTokens = rawQuote.split(/\s+/).filter((w: string) => w.length > 3);
          const matchedWordCount = quoteTokens.filter((w: string) => segTextLower.includes(w)).length;
          if (quoteTokens.length > 0 && matchedWordCount / quoteTokens.length >= 0.5) {
            matchScore += 4;
          }
        }
      }

      // 4. Speaker name check
      if (rawSpeaker && (segSpeakerLower.includes(rawSpeaker) || rawSpeaker.includes(segSpeakerLower))) {
        matchScore += 2;
      }

      if (matchScore > highestMatchScore) {
        highestMatchScore = matchScore;
        bestSegment = seg;
      }
    }

    // Accept citation only if it reached confidence threshold against verified transcript
    if (bestSegment && highestMatchScore >= 3.0) {
      const uniqueKey = `${bestSegment.meetingId}-${bestSegment.startTime}`;
      if (!seenKeys.has(uniqueKey)) {
        seenKeys.add(uniqueKey);

        // Snap quote to clean sentence or actual segment text
        let cleanQuote = raw.quote?.trim();
        if (!cleanQuote || cleanQuote.length < 5 || !bestSegment.text.toLowerCase().includes(cleanQuote.toLowerCase())) {
          cleanQuote = bestSegment.text.length > 120
            ? `${bestSegment.text.slice(0, 120)}...`
            : bestSegment.text;
        }

        validCitations.push({
          meetingId: bestSegment.meetingId,
          meetingTitle: bestSegment.meetingTitle,
          timestamp: bestSegment.startTime,
          speakerName: bestSegment.speakerName,
          quote: cleanQuote,
          label: raw.label || (bestSegment.speakerRole ? `${bestSegment.speakerRole}` : undefined),
        });
      }
    }
  }

  // Sort chronologically by timestamp
  validCitations.sort((a, b) => a.timestamp - b.timestamp);

  // Return up to 4 validated distinct citations
  return validCitations.slice(0, 4);
}
