import { Meeting, Speaker, TranscriptSegment } from "./types";
import { SEED_MEETINGS } from "./seed-data";

export interface ClipPayload {
  id: string;
  meetingId: string;
  title: string;
  startTime: number;
  endTime: number;
  createdAt: string;
  createdBy?: string;
  notes?: string;
}

export interface ResolvedClip {
  id: string;
  meeting: Meeting;
  title: string;
  startTime: number;
  endTime: number;
  createdAt: string;
  createdBy?: string;
  notes?: string;
  segments: TranscriptSegment[];
}

// Pre-seeded clips for reliable instant links
export const SEED_CLIPS: Record<string, ClipPayload> = {
  "clip-enterprise-sla": {
    id: "clip-enterprise-sla",
    meetingId: "meet-1",
    title: "Enterprise SLA & Dedicated Pods Decision",
    startTime: 222, // 03:42
    endTime: 268,   // 04:28
    createdAt: "2026-09-28T14:30:00Z",
    createdBy: "Sarah Chen (Head of Product)",
    notes: "Discussion confirming 99.95% uptime commitment and dedicated GPU pod allocation for tier-1 accounts.",
  },
  "clip-pricing-model": {
    id: "clip-pricing-model",
    meetingId: "meet-2",
    title: "Acme Corp 250-Seat Pricing Agreement",
    startTime: 270, // 04:30
    endTime: 345,   // 05:45
    createdAt: "2026-09-27T10:15:00Z",
    createdBy: "Marcus Vance (VP Enterprise Sales)",
    notes: "Agreement on annual tier commitment with custom SAML/SSO add-on.",
  },
  "clip-latency-benchmark": {
    id: "clip-latency-benchmark",
    meetingId: "meet-3",
    title: "Sub-200ms Streaming Latency Benchmark",
    startTime: 135, // 02:15
    endTime: 190,   // 03:10
    createdAt: "2026-09-26T16:00:00Z",
    createdBy: "Liam Johnson (CTO)",
    notes: "Benchmarking results verifying streaming transcript pipeline meets real-time UX thresholds.",
  },
  "clip-design-critique": {
    id: "clip-design-critique",
    meetingId: "meet-7",
    title: "Dark Mode Glassmorphism Hierarchy & Typography",
    startTime: 90,  // 01:30
    endTime: 165,   // 02:45
    createdAt: "2026-09-24T11:00:00Z",
    createdBy: "Elena Rostova (Design Lead)",
    notes: "Final sign-off on typography scale and contrast ratios for accessibility.",
  },
};

/**
 * Encodes a clip payload into a compact, URL-safe base64 string
 */
export function encodeClipToken(data: {
  meetingId: string;
  title: string;
  start: number;
  end: number;
  notes?: string;
}): string {
  try {
    const minObj = {
      m: data.meetingId,
      t: data.title,
      s: Math.round(data.start),
      e: Math.round(data.end),
      n: data.notes || undefined,
      c: Date.now(),
    };
    const json = JSON.stringify(minObj);
    // Browser & Node compatible base64 encoding
    const b64 = typeof window !== "undefined"
      ? btoa(unescape(encodeURIComponent(json)))
      : Buffer.from(json).toString("base64");
    // Convert to URL-safe base64
    const urlSafe = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return `clp_${urlSafe}`;
  } catch (err) {
    console.error("Error encoding clip token:", err);
    return `clip_${data.meetingId}_${data.start}_${data.end}`;
  }
}

/**
 * Decodes a token string (or looks up seed clips or meeting IDs) into a ResolvedClip
 */
export function decodeClipToken(
  token: string,
  meetingsList: Meeting[],
  searchParamsStart?: number,
  searchParamsEnd?: number
): ResolvedClip | null {
  if (!token) return null;

  // 1. Check Pre-seeded Clips
  if (SEED_CLIPS[token]) {
    const seed = SEED_CLIPS[token];
    const meeting = meetingsList.find((m) => m.id === seed.meetingId) ||
      SEED_MEETINGS.find((m) => m.id === seed.meetingId);
    if (meeting) {
      const segments = meeting.transcript.filter(
        (seg) => seg.endTime >= seed.startTime && seg.startTime <= seed.endTime
      );
      return {
        id: seed.id,
        meeting,
        title: seed.title,
        startTime: seed.startTime,
        endTime: seed.endTime,
        createdAt: seed.createdAt,
        createdBy: seed.createdBy,
        notes: seed.notes,
        segments: segments.length > 0 ? segments : meeting.transcript.slice(0, 3),
      };
    }
  }

  // 2. Check if token starts with "clp_" (URL-safe base64 payload)
  if (token.startsWith("clp_")) {
    try {
      const raw = token.slice(4).replace(/-/g, "+").replace(/_/g, "/");
      const padded = raw.padEnd(raw.length + (4 - (raw.length % 4)) % 4, "=");
      const json = typeof window !== "undefined"
        ? decodeURIComponent(escape(atob(padded)))
        : Buffer.from(padded, "base64").toString("utf-8");
      const minObj = JSON.parse(json);

      const meeting = meetingsList.find((m) => m.id === minObj.m) ||
        SEED_MEETINGS.find((m) => m.id === minObj.m);

      if (meeting) {
        const startTime = Number(minObj.s) || 0;
        const endTime = Number(minObj.e) || Math.min(startTime + 45, meeting.duration);
        const segments = meeting.transcript.filter(
          (seg) => seg.endTime >= startTime && seg.startTime <= endTime
        );
        return {
          id: token,
          meeting,
          title: minObj.t || `${meeting.title} Excerpt`,
          startTime,
          endTime,
          createdAt: minObj.c ? new Date(minObj.c).toISOString() : new Date().toISOString(),
          createdBy: "Workspace Member",
          notes: minObj.n,
          segments: segments.length > 0 ? segments : meeting.transcript.slice(0, 3),
        };
      }
    } catch (err) {
      console.warn("Failed to decode clp_ token:", err);
    }
  }

  // 3. Fallback: Token is directly a Meeting ID (with optional start/end query parameters)
  const meeting = meetingsList.find((m) => m.id === token) ||
    SEED_MEETINGS.find((m) => m.id === token);

  if (meeting) {
    const startTime = searchParamsStart !== undefined && !isNaN(searchParamsStart)
      ? searchParamsStart
      : 0;
    const endTime = searchParamsEnd !== undefined && !isNaN(searchParamsEnd) && searchParamsEnd > startTime
      ? searchParamsEnd
      : Math.min(startTime + 45, meeting.duration);

    const segments = meeting.transcript.filter(
      (seg) => seg.endTime >= startTime && seg.startTime <= endTime
    );

    return {
      id: token,
      meeting,
      title: `${meeting.title} — Clip (${Math.floor(startTime / 60)}:${String(Math.floor(startTime % 60)).padStart(2, "0")} - ${Math.floor(endTime / 60)}:${String(Math.floor(endTime % 60)).padStart(2, "0")})`,
      startTime,
      endTime,
      createdAt: meeting.date,
      createdBy: meeting.speakers[0]?.name || "Workspace Member",
      segments: segments.length > 0 ? segments : meeting.transcript.slice(0, 3),
    };
  }

  return null;
}
