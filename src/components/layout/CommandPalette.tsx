"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Video, FileText, CheckCircle2, MessageSquare, Clock, ArrowRight } from "lucide-react";
import { useMeetingsStore } from "@/lib/store";
import { formatTime, formatDate } from "@/lib/utils";
import { SearchResultMatch } from "@/lib/types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultMatch[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { searchMeetings, meetings } = useMeetingsStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      // Default to recent meetings if no query
      const recents: SearchResultMatch[] = meetings.slice(0, 5).map((m) => ({
        meetingId: m.id,
        meetingTitle: m.title,
        meetingDate: m.date,
        category: m.category,
        matchType: "title",
        snippet: m.summary?.headline || m.title,
      }));
      setResults(recents);
      setSelectedIndex(0);
      return;
    }

    const matches = searchMeetings(query);
    setResults(matches);
    setSelectedIndex(0);
  }, [query, searchMeetings, meetings]);

  const handleSelect = React.useCallback(
    (result: SearchResultMatch) => {
      onClose();
      if (result.timestamp !== undefined) {
        router.push(`/meetings/${result.meetingId}?t=${Math.floor(result.timestamp)}`);
      } else {
        router.push(`/meetings/${result.meetingId}`);
      }
    },
    [onClose, router]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, handleSelect, onClose]);

  if (!isOpen) return null;

  const getMatchIcon = (type: SearchResultMatch["matchType"]) => {
    switch (type) {
      case "transcript":
        return <MessageSquare className="h-4 w-4 text-indigo-400 shrink-0" />;
      case "action_item":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />;
      case "summary":
        return <FileText className="h-4 w-4 text-amber-400 shrink-0" />;
      default:
        return <Video className="h-4 w-4 text-purple-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="h-5 w-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search meetings, transcripts, action items, or summaries..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-md">
            ESC to close
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {results.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-300 font-medium">
                No matching results found
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Try searching for &ldquo;latency&rdquo;, &ldquo;MEDDIC&rdquo;, or &ldquo;Sarah&rdquo;
              </p>
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={`${item.meetingId}-${item.matchType}-${item.timestamp || 0}-${index}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "bg-indigo-600/15 border border-indigo-500/30 text-slate-100"
                      : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50">
                    {getMatchIcon(item.matchType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {item.meetingTitle}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {item.category}
                      </span>
                      {item.timestamp !== undefined && (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded">
                          <Clock className="h-3 w-3" />
                          {formatTime(item.timestamp)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {item.speakerName && (
                        <strong className="text-slate-200">
                          {item.speakerName}:{" "}
                        </strong>
                      )}
                      {item.snippet}
                    </p>
                  </div>
                  <ArrowRight
                    className={`h-4 w-4 shrink-0 mt-1 transition-opacity ${
                      isSelected ? "opacity-100 text-indigo-400" : "opacity-0"
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              Use <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">Enter</kbd> to select
            </span>
          </div>
          <span>Instant RAG Index</span>
        </div>
      </div>
    </div>
  );
}
