"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  Video,
  Clock,
  CheckCircle2,
  FileText,
  MessageSquare,
  ArrowRight,
  Send,
  Calendar,
  Star,
  Layers,
  Filter,
  Users,
  Check,
} from "lucide-react";
import { useMeetingsStore } from "@/lib/store";
import { formatTime, formatDate, getCategoryBadgeColor } from "@/lib/utils";
import { askGlobalIntelligence, GroundedCitation } from "@/lib/rag";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { SearchResultMatch } from "@/lib/types";

function SearchContent() {
  const { searchMeetings, meetings } = useMeetingsStore();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "transcript" | "action_item" | "summary" | "highlight"
  >("all");

  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<{
    text: string;
    citations: GroundedCitation[];
  } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Global Keyword Search
  const rawResults = useMemo(() => {
    return searchMeetings(query);
  }, [query, searchMeetings]);

  const searchResults = useMemo(() => {
    if (activeFilter === "all") return rawResults;
    return rawResults.filter((r) => r.matchType === activeFilter);
  }, [rawResults, activeFilter]);

  // Counts by Type
  const counts = useMemo(() => {
    return {
      all: rawResults.length,
      transcript: rawResults.filter((r) => r.matchType === "transcript").length,
      action_item: rawResults.filter((r) => r.matchType === "action_item").length,
      summary: rawResults.filter((r) => r.matchType === "summary").length,
      highlight: rawResults.filter((r) => r.matchType === "highlight").length,
    };
  }, [rawResults]);

  // Cross-Meeting Ask Fathom
  const handleAskGlobalAi = async (customPrompt?: string) => {
    const prompt = customPrompt || aiQuestion;
    if (!prompt.trim()) return;

    setIsAiLoading(true);
    setAiAnswer(null);

    try {
      const res = await fetch("/api/meetings/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: prompt,
          customContext: meetings,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiAnswer({
          text: data.answer,
          citations: data.citations || [],
        });
      } else {
        const result = askGlobalIntelligence(meetings, prompt);
        setAiAnswer({
          text: result.text,
          citations: result.citations,
        });
      }
    } catch {
      const result = askGlobalIntelligence(meetings, prompt);
      setAiAnswer({
        text: result.text,
        citations: result.citations,
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const getMatchIcon = (type: SearchResultMatch["matchType"]) => {
    switch (type) {
      case "transcript":
        return <MessageSquare className="h-4 w-4 text-indigo-400" />;
      case "action_item":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "summary":
        return <FileText className="h-4 w-4 text-purple-400" />;
      case "highlight":
        return <Star className="h-4 w-4 fill-amber-400 text-amber-400" />;
      default:
        return <Video className="h-4 w-4 text-blue-400" />;
    }
  };

  const getMatchTypeBadge = (type: SearchResultMatch["matchType"]) => {
    switch (type) {
      case "transcript":
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Transcript
          </span>
        );
      case "action_item":
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Action Item
          </span>
        );
      case "summary":
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            AI Summary
          </span>
        );
      case "highlight":
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Highlight ⭐
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            Meeting
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Cross-Meeting Search & Intelligence
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Search Across All Meetings
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Search instantly across transcripts, executive summaries, action items, and highlights from all {meetings.length} recorded discussions.
        </p>
      </div>

      {/* 1. Cross-Meeting Ask Fathom AI Card */}
      <div className="p-6 rounded-2xl glass-panel bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-950 border border-indigo-500/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>Ask Fathom (Cross-Meeting RAG)</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {meetings.length} meetings indexed
          </span>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Ask across all meetings (e.g. 'What were the pricing discussions?', 'What is the deal size for Acme?', 'Why did latency spike?')..."
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAskGlobalAi()}
            className="py-2.5 text-xs"
          />
          <Button
            variant="primary"
            size="md"
            onClick={() => handleAskGlobalAi()}
            disabled={isAiLoading || !aiQuestion.trim()}
            className="text-xs shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            <span>Ask AI</span>
          </Button>
        </div>

        {/* Suggested Queries */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-500 font-semibold">Try:</span>
          {[
            "What were the pricing discussions across meetings?",
            "Why was query latency reduced to 780ms?",
            "What were the terms of the Acme Corp deal?",
            "What caused the database outage on Tuesday?",
            "What are the top action items this week?",
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setAiQuestion(prompt);
                handleAskGlobalAi(prompt);
              }}
              className="text-xs px-3 py-1 rounded-full bg-slate-900/90 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/30 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* AI Answer Display */}
        {isAiLoading && (
          <div className="p-4 rounded-xl bg-slate-950/70 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2.5 animate-pulse">
            <Sparkles className="h-4 w-4 animate-spin text-indigo-400 shrink-0" />
            <span>Retrieving transcript dialogue across {meetings.length} meetings and synthesizing verified sources...</span>
          </div>
        )}

        {aiAnswer && (
          <div className="p-5 rounded-xl bg-slate-950/90 border border-indigo-500/30 space-y-4 animate-in fade-in">
            <p className="text-xs text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">
              {aiAnswer.text}
            </p>

            {aiAnswer.citations.length > 0 && (
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400" />
                  <span>Verified Source References (Click to Jump):</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {aiAnswer.citations.map((cite, i) => (
                    <Link
                      key={i}
                      href={`/meetings/${cite.meetingId || "meet-1"}?t=${cite.timestamp}`}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-start gap-2.5 text-xs group shadow-sm"
                    >
                      <Video className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-slate-200 group-hover:text-indigo-300 truncate">
                            {cite.meetingTitle}
                          </span>
                          <span className="font-mono text-indigo-400 text-[11px] shrink-0 font-semibold">
                            {formatTime(cite.timestamp)}
                          </span>
                        </div>
                        {cite.speakerName && (
                          <span className="text-[10px] text-slate-400 block font-medium">
                            Speaker: {cite.speakerName}
                          </span>
                        )}
                        <p className="text-[11px] text-slate-300 group-hover:text-white truncate mt-0.5 italic">
                          &ldquo;{cite.quote}&rdquo;
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Global Keyword Match Search */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Search className="h-4 w-4 text-indigo-400" />
            <span>Keyword Search Engine</span>
          </h2>
          <span className="text-xs text-slate-400">
            Titles • Transcripts • Summaries • Action Items • Highlights
          </span>
        </div>

        <Input
          icon={<Search className="h-4 w-4 text-slate-500" />}
          placeholder="Search by keyword across all meetings (e.g. 'pricing', 'latency', 'SOC2', 'Marcus', 'budget', 'pilot')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="py-2.5 text-xs"
        />

        {/* Filter Tabs */}
        {query && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                activeFilter === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              All Matches ({counts.all})
            </button>
            <button
              onClick={() => setActiveFilter("transcript")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                activeFilter === "transcript"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              Transcripts ({counts.transcript})
            </button>
            <button
              onClick={() => setActiveFilter("action_item")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                activeFilter === "action_item"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              Action Items ({counts.action_item})
            </button>
            <button
              onClick={() => setActiveFilter("summary")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                activeFilter === "summary"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              Summaries ({counts.summary})
            </button>
            <button
              onClick={() => setActiveFilter("highlight")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                activeFilter === "highlight"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              Highlights ({counts.highlight})
            </button>
          </div>
        )}

        {/* Results List */}
        {query ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Showing {searchResults.length} {activeFilter !== "all" ? activeFilter.replace("_", " ") : ""} results for &ldquo;
              <span className="text-slate-200 font-semibold">{query}</span>&rdquo;
            </p>

            {searchResults.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                <Search className="h-8 w-8 text-slate-600 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-300">
                  No matching results found
                </h4>
                <p className="text-xs text-slate-500">
                  Try searching for general keywords like &ldquo;pricing&rdquo;, &ldquo;latency&rdquo;, &ldquo;pilot&rdquo;, or &ldquo;roadmap&rdquo;.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {searchResults.map((match, idx) => (
                  <Link
                    key={idx}
                    href={
                      match.timestamp !== undefined
                        ? `/meetings/${match.meetingId}?t=${match.timestamp}`
                        : `/meetings/${match.meetingId}`
                    }
                    className="p-4 rounded-xl glass-card hover:border-indigo-500/50 flex items-start justify-between gap-4 group transition-all"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-800 text-slate-300 mt-0.5 shrink-0">
                        {getMatchIcon(match.matchType)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                            {match.meetingTitle}
                          </span>
                          {getMatchTypeBadge(match.matchType)}
                          {match.timestamp !== undefined && (
                            <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-semibold">
                              {formatTime(match.timestamp)}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                          {match.speakerName && (
                            <strong className="text-indigo-300 font-semibold">
                              {match.speakerName}:{" "}
                            </strong>
                          )}
                          {match.snippet}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-indigo-400 font-semibold shrink-0 self-center group-hover:translate-x-1 transition-transform">
                      <span className="hidden sm:inline">Jump</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Empty / Default State with quick search tags */
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
            <Search className="h-8 w-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">
              Type to search transcript knowledge
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Search any term to retrieve timestamped dialogue across all meetings in your workspace.
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
              {["pricing", "latency", "SOC2", "database", "Acme", "Marcus", "budget", "interview", "hiring"].map((kw) => (
                <button
                  key={kw}
                  onClick={() => setQuery(kw)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  &ldquo;{kw}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}

