"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Meeting, ActionItem, Highlight, SearchResultMatch } from "./types";
import { SEED_MEETINGS } from "./seed-data";

const STORAGE_KEY = "fathom_meetings_v1";

interface StoreContextType {
  meetings: Meeting[];
  isLoaded: boolean;
  getMeeting: (id: string) => Meeting | undefined;
  toggleActionItem: (meetingId: string, actionId: string) => void;
  addActionItem: (meetingId: string, text: string, timestamp?: number) => void;
  deleteActionItem: (meetingId: string, actionId: string) => void;
  addHighlight: (meetingId: string, highlight: Omit<Highlight, "id">) => void;
  deleteHighlight: (meetingId: string, highlightId: string) => void;
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
          setMeetings(parsed);
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
    (id: string) => meetings.find((m) => m.id === id),
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
    (meetingId: string, text: string, timestamp: number = 0) => {
      const updated = meetings.map((m) => {
        if (m.id !== meetingId) return m;
        const newItem: ActionItem = {
          id: `act-${Date.now()}`,
          text,
          completed: false,
          timestamp,
          priority: "medium",
          dueDate: "Pending",
        };
        return {
          ...m,
          actionItems: [...m.actionItems, newItem],
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
          id: `hl-${Date.now()}`,
        };
        return {
          ...m,
          highlights: [...m.highlights, newHighlight],
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
        };
      });
      saveMeetings(updated);
    },
    [meetings, saveMeetings]
  );

  const setSummaryTemplate = useCallback(
    (meetingId: string, templateId: string) => {
      const updated = meetings.map((m) => {
        if (m.id !== meetingId) return m;
        if (m.availableSummaries && m.availableSummaries[templateId]) {
          return {
            ...m,
            summary: m.availableSummaries[templateId],
          };
        }
        return m;
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
        // Title match
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

        // Summary match
        if (m.summary?.headline.toLowerCase().includes(q) || m.summary?.overview.toLowerCase().includes(q)) {
          results.push({
            meetingId: m.id,
            meetingTitle: m.title,
            meetingDate: m.date,
            category: m.category,
            matchType: "summary",
            snippet: m.summary.headline,
          });
        }

        // Action item match
        for (const act of m.actionItems) {
          if (act.text.toLowerCase().includes(q)) {
            results.push({
              meetingId: m.id,
              meetingTitle: m.title,
              meetingDate: m.date,
              category: m.category,
              matchType: "action_item",
              timestamp: act.timestamp,
              snippet: act.text,
            });
          }
        }

        // Transcript segment match
        for (const seg of m.transcript) {
          if (seg.text.toLowerCase().includes(q)) {
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

      return results.slice(0, 25);
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
