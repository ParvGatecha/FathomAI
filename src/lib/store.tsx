"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Meeting, ActionItem, Highlight, SearchResultMatch, TranscriptSegment } from "./types";
import { SEED_MEETINGS } from "./seed-data";
import { generateSummaryForTemplate } from "./templates";

const STORAGE_KEY = "fathom_meetings_v2";

export interface AddActionItemParams {
  text: string;
  timestamp?: number;
  assignee?: {
    name: string;
    avatar: string;
  };
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}

interface StoreContextType {
  meetings: Meeting[];
  isLoaded: boolean;
  getMeeting: (id: string) => Meeting | undefined;
  toggleActionItem: (meetingId: string, actionId: string) => void;
  addActionItem: (
    meetingId: string,
    paramsOrText: string | AddActionItemParams,
    timestamp?: number,
    assignee?: { name: string; avatar: string },
    dueDate?: string,
    priority?: "low" | "medium" | "high"
  ) => void;
  deleteActionItem: (meetingId: string, actionId: string) => void;
  addHighlight: (meetingId: string, highlight: Omit<Highlight, "id">) => void;
  deleteHighlight: (meetingId: string, highlightId: string) => void;
  toggleSegmentHighlight: (
    meetingId: string,
    segment: TranscriptSegment,
    label?: string,
    color?: Highlight["color"]
  ) => boolean;
  setSummaryTemplate: (meetingId: string, templateId: string) => void;
  toggleFavorite: (meetingId: string) => void;
  addMeeting: (meeting: Meeting) => void;
  deleteMeeting: (meetingId: string) => void;
  resetToSeedData: () => void;
  searchMeetings: (query: string) => SearchResultMatch[];
}

const StoreContext = createContext<StoreContextType | null>(null);

export function MeetingsProvider({ children }: { children: React.ReactNode }) {
  const [meetings, setMeetings] = useState<Meeting[]>(SEED_MEETINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure flagship meeting (meet-1) always stays up to date with the latest 194-segment transcript
          const storedMeet1 = parsed.find((m: Meeting) => m.id === "meet-1");
          const seedMeet1 = SEED_MEETINGS.find((m) => m.id === "meet-1");
          let finalMeetings = parsed;
          if (seedMeet1 && (!storedMeet1 || !storedMeet1.transcript || storedMeet1.transcript.length < 50)) {
            finalMeetings = parsed.map((m: Meeting) => (m.id === "meet-1" ? seedMeet1 : m));
            if (!finalMeetings.some((m: Meeting) => m.id === "meet-1")) {
              finalMeetings = [seedMeet1, ...finalMeetings];
            }
          }
          setMeetings(finalMeetings);
        } else {
          setMeetings(SEED_MEETINGS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_MEETINGS));
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_MEETINGS));
      }
    } catch {
      setMeetings(SEED_MEETINGS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  const saveMeetings = useCallback((updated: Meeting[]) => {
    setMeetings(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, []);

  const getMeeting = useCallback(
    (id: string) => meetings.find((m) => m.id === id) || SEED_MEETINGS.find((m) => m.id === id),
    [meetings]
  );

  const toggleActionItem = useCallback(
    (meetingId: string, actionId: string) => {
      const updated = meetings.map((m) => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          actionItems: m.actionItems.map((a) =>
            a.id === actionId ? { ...a, completed: !a.completed } : a
          ),
        };
      });
      saveMeetings(updated);
    },
    [meetings, saveMeetings]
  );

  const addActionItem = useCallback(
    (
      meetingId: string,
      paramsOrText: string | AddActionItemParams,
      timestamp: number = 0,
      assignee?: { name: string; avatar: string },
      dueDate: string = "This Week",
      priority: "low" | "medium" | "high" = "medium"
    ) => {
      const updated = meetings.map((m) => {
        if (m.id !== meetingId) return m;

        let newItem: ActionItem;
        if (typeof paramsOrText === "object") {
          newItem = {
            id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            text: paramsOrText.text,
            completed: false,
            timestamp: paramsOrText.timestamp ?? 0,
            assignee: paramsOrText.assignee,
            dueDate: paramsOrText.dueDate || "This Week",
            priority: paramsOrText.priority || "medium",
          };
        } else {
          newItem = {
            id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            text: paramsOrText,
            completed: false,
            timestamp,
            assignee,
            dueDate,
            priority,
          };
        }

        return {
          ...m,
          actionItems: [newItem, ...m.actionItems],
        };
      });
      saveMeetings(updated);
    },
    [meetings, saveMeetings]
  );

  const deleteActionItem = useCallback(
    (meetingId: string, actionId: string) => {
      const updated = meetings.map((m) => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          actionItems: m.actionItems.filter((a) => a.id !== actionId),
        };
      });
      saveMeetings(updated);
    },
    [meetings, saveMeetings]
  );

  const addHighlight = useCallback(
    (meetingId: string, highlightData: Omit<Highlight, "id">) => {
      const updated = meetings.map((m) => {
        if (m.id !== meetingId) return m;
        const newHighlight: Highlight = {
          ...highlightData,
          id: `hl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        };
        return {
          ...m,
          highlights: [newHighlight, ...m.highlights],
        };
      });
      saveMeetings(updated);
    },
    [meetings, saveMeetings]
  );

  const deleteHighlight = useCallback(
    (meetingId: string, highlightId: string) => {
      const updated = meetings.map((m) => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          highlights: m.highlights.filter((h) => h.id !== highlightId),
          transcript: m.transcript.map((seg) =>
            seg.highlightId === highlightId ? { ...seg, highlightId: undefined } : seg
          ),
        };
      });
      saveMeetings(updated);
    },
    [meetings, saveMeetings]
  );

  const toggleSegmentHighlight = useCallback(
    (
      meetingId: string,
      segment: TranscriptSegment,
      label: string = "Key Point",
      color: Highlight["color"] = "yellow"
    ): boolean => {
      let isNowHighlighted = false;
      const updated = meetings.map((m) => {
        if (m.id !== meetingId) return m;

        // Check if highlight already exists for this segment
        const existingIdx = m.highlights.findIndex(
          (h) =>
            h.segmentId === segment.id ||
            h.id === segment.highlightId ||
            (Math.abs(h.startTime - segment.startTime) < 0.5 && h.text === segment.text)
        );

        if (existingIdx !== -1) {
          // Remove highlight
          const hlToRemove = m.highlights[existingIdx];
          isNowHighlighted = false;
          return {
            ...m,
            highlights: m.highlights.filter((_, idx) => idx !== existingIdx),
            transcript: m.transcript.map((seg) =>
              seg.id === segment.id || seg.highlightId === hlToRemove.id
                ? { ...seg, highlightId: undefined }
                : seg
            ),
          };
        } else {
          // Add highlight
          const newId = `hl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
          const newHighlight: Highlight = {
            id: newId,
            segmentId: segment.id,
            startTime: segment.startTime,
            endTime: segment.endTime,
            text: segment.text,
            label: (label as any) || "Key Point",
            color: color || "yellow",
            createdByType: "user",
            createdAt: new Date().toISOString(),
          };
          isNowHighlighted = true;
          return {
            ...m,
            highlights: [newHighlight, ...m.highlights],
            transcript: m.transcript.map((seg) =>
              seg.id === segment.id ? { ...seg, highlightId: newId } : seg
            ),
          };
        }
      });
      saveMeetings(updated);
      return isNowHighlighted;
    },
    [meetings, saveMeetings]
  );

  const setSummaryTemplate = useCallback(
    (meetingId: string, templateId: string) => {
      const updated = meetings.map((m) => {
        if (m.id !== meetingId) return m;
        let newSummary = m.availableSummaries?.[templateId];
        if (!newSummary) {
          newSummary = generateSummaryForTemplate(m, templateId);
        }
        return {
          ...m,
          summary: newSummary,
        };
      });
      saveMeetings(updated);
    },
    [meetings, saveMeetings]
  );

  const toggleFavorite = useCallback(
    (meetingId: string) => {
      const updated = meetings.map((m) => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          isFavorite: !m.isFavorite,
        };
      });
      saveMeetings(updated);
    },
    [meetings, saveMeetings]
  );

  const addMeeting = useCallback(
    (meeting: Meeting) => {
      const updated = [meeting, ...meetings];
      saveMeetings(updated);
    },
    [meetings, saveMeetings]
  );

  const deleteMeeting = useCallback(
    (meetingId: string) => {
      const updated = meetings.filter((m) => m.id !== meetingId);
      saveMeetings(updated);
    },
    [meetings, saveMeetings]
  );

  const resetToSeedData = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_MEETINGS));
    setMeetings(SEED_MEETINGS);
  }, []);

  const searchMeetings = useCallback(
    (query: string): SearchResultMatch[] => {
      if (!query.trim()) return [];
      const q = query.toLowerCase();
      const results: SearchResultMatch[] = [];

      for (const m of meetings) {
        // 1. Title match
        if (m.title.toLowerCase().includes(q)) {
          results.push({
            meetingId: m.id,
            meetingTitle: m.title,
            meetingDate: m.date,
            category: m.category,
            matchType: "title",
            snippet: m.title,
          });
        }

        // 2. Summary match (headline, overview, sections)
        if (
          m.summary?.headline.toLowerCase().includes(q) ||
          m.summary?.overview.toLowerCase().includes(q)
        ) {
          results.push({
            meetingId: m.id,
            meetingTitle: m.title,
            meetingDate: m.date,
            category: m.category,
            matchType: "summary",
            snippet: m.summary.headline,
          });
        }

        // Search within summary section bullets
        if (m.summary?.sections) {
          for (const sec of m.summary.sections) {
            for (const bullet of sec.bullets) {
              if (bullet.toLowerCase().includes(q)) {
                results.push({
                  meetingId: m.id,
                  meetingTitle: m.title,
                  meetingDate: m.date,
                  category: m.category,
                  matchType: "summary",
                  timestamp: sec.citations?.[0]?.timestamp || 0,
                  snippet: bullet,
                });
                break;
              }
            }
          }
        }

        // 3. Action item match
        for (const act of m.actionItems) {
          if (act.text.toLowerCase().includes(q) || act.assignee?.name.toLowerCase().includes(q)) {
            results.push({
              meetingId: m.id,
              meetingTitle: m.title,
              meetingDate: m.date,
              category: m.category,
              matchType: "action_item",
              timestamp: act.timestamp,
              speakerName: act.assignee?.name,
              snippet: act.text,
            });
          }
        }

        // 4. Highlight match
        for (const hl of m.highlights) {
          if (hl.text.toLowerCase().includes(q) || hl.label.toLowerCase().includes(q)) {
            results.push({
              meetingId: m.id,
              meetingTitle: m.title,
              meetingDate: m.date,
              category: m.category,
              matchType: "highlight",
              timestamp: hl.startTime,
              snippet: hl.text,
            });
          }
        }

        // 5. Transcript segment match
        for (const seg of m.transcript) {
          if (
            seg.text.toLowerCase().includes(q) ||
            seg.speakerName.toLowerCase().includes(q)
          ) {
            results.push({
              meetingId: m.id,
              meetingTitle: m.title,
              meetingDate: m.date,
              category: m.category,
              matchType: "transcript",
              timestamp: seg.startTime,
              speakerName: seg.speakerName,
              snippet: seg.text,
            });
          }
        }
      }

      return results.slice(0, 40);
    },
    [meetings]
  );

  return (
    <StoreContext.Provider
      value={{
        meetings,
        isLoaded,
        getMeeting,
        toggleActionItem,
        addActionItem,
        deleteActionItem,
        addHighlight,
        deleteHighlight,
        toggleSegmentHighlight,
        setSummaryTemplate,
        toggleFavorite,
        addMeeting,
        deleteMeeting,
        resetToSeedData,
        searchMeetings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useMeetingsStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useMeetingsStore must be used within a MeetingsProvider");
  }
  return context;
}
