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
} from "lucide-react";
import { useMeetingsStore } from "@/lib/store";
import { formatTime, formatDate, getCategoryBadgeColor } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchResultMatch } from "@/lib/types";

function SearchContent() {
  const { searchMeetings, meetings } = useMeetingsStore();
  const [query, setQuery] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<{
    text: string;
    citations: {
      meetingId: string;
      meetingTitle: string;
      timestamp: number;
      snippet: string;
    }[];
  } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const searchResults = useMemo(() => {
    return searchMeetings(query);
  }, [query, searchMeetings]);

  const handleAskGlobalAi = (customPrompt?: string) => {
    const prompt = customPrompt || aiQuestion;
    if (!prompt.trim()) return;

    setIsAiLoading(true);
    setAiAnswer(null);

    setTimeout(() => {
      const q = prompt.toLowerCase();
      let responseText = "";
      let cites: {
        meetingId: string;
        meetingTitle: string;
        timestamp: number;
        snippet: string;
      }[] = [];

      if (q.includes("latency") || q.includes("cache") || q.includes("speed")) {
        responseText =
          "Across multiple technical reviews, Alex Rivera and Marcus Vance demonstrated that switching to 120-second rolling chunk embeddings paired with Redis caching reduced P95 query latency from 2.4s to 780ms.";
        cites = [
          {
            meetingId: "meet-1",
            meetingTitle: "Q3 Product Strategy & AI Copilot Roadmap Review",
            timestamp: 240,
            snippet: "Our P95 latency dropped from 2.4s to 780ms with chunk-level caching.",
          },
        ];
      } else if (q.includes("acme") || q.includes("sales") || q.includes("deal") || q.includes("revenue")) {
        responseText =
          "In the Acme Corporation enterprise discovery call, VP of Tech Rachel Green confirmed pre-approved budget of up to $120k ARR for 450 seats under their Developer Productivity initiative, with SOC2 Type II compliance as a required gate.";
        cites = [
          {
            meetingId: "meet-2",
            meetingTitle: "Enterprise Discovery Call — Acme Corporation",
            timestamp: 180,
            snippet: "Budget pre-approved up to $120k under Developer Productivity.",
          },
        ];
      } else if (q.includes("incident") || q.includes("database") || q.includes("failover") || q.includes("postgres")) {
        responseText =
          "The infrastructure incident post-mortem revealed an unindexed query across 42M rows on the meeting_events table held 200 connection slots for 14 minutes. Corrective actions include a hard 3s query timeout and read replica routing.";
        cites = [
          {
            meetingId: "meet-3",
            meetingTitle: "Infrastructure Incident Post-Mortem: DB Latency Spike",
            timestamp: 61,
            snippet: "Sequential scan across 42M rows saturated pool connections.",
          },
        ];
      } else {
        responseText = `Based on knowledge across your ${meetings.length} meetings, the team is actively progressing on the Q3 AI Copilot launch (August 15th beta), closing enterprise accounts (Acme Corp 450 seats), and scaling database resilience.`;
        cites = [
          {
            meetingId: "meet-1",
            meetingTitle: "Q3 Product Strategy Review",
            timestamp: 0,
            snippet: "Roadmap and beta release timeline alignment.",
          },
          {
            meetingId: "meet-2",
            meetingTitle: "Acme Corp Discovery",
            timestamp: 0,
            snippet: "Enterprise pilot agreement.",
          },
        ];
      }

      setAiAnswer({
        text: responseText,
        citations: cites,
      });
      setIsAiLoading(false);
    }, 600);
  };

  const getMatchIcon = (type: SearchResultMatch["matchType"]) => {
    switch (type) {
      case "transcript":
        return <MessageSquare className="h-4 w-4 text-indigo-400" />;
      case "action_item":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "summary":
        return <FileText className="h-4 w-4 text-amber-400" />;
      default:
        return <Video className="h-4 w-4 text-purple-400" />;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Global Knowledge Search & AI
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Query transcript knowledge across all meetings with grounded citations and source timestamps.
        </p>
      </div>

      {/* Ask Fathom Cross-Meeting AI Card */}
      <div className="p-6 rounded-2xl glass-panel bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-950 border border-indigo-500/30 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span>Ask Fathom AI (Cross-Meeting Knowledge)</span>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Ask anything across all meetings (e.g. 'What is the deal size for Acme?', 'Why did the database crash?')..."
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAskGlobalAi()}
          />
          <Button
            variant="primary"
            size="md"
            onClick={() => handleAskGlobalAi()}
            disabled={isAiLoading || !aiQuestion.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Suggested Queries */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            "Why was query latency reduced to 780ms?",
            "What were the terms of the Acme Corp deal?",
            "What caused the database outage on Tuesday?",
            "What are Marcus's career goals?",
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setAiQuestion(prompt);
                handleAskGlobalAi(prompt);
              }}
              className="text-xs px-3 py-1 rounded-full bg-slate-900/80 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-300 border border-slate-800 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* AI Answer Display */}
        {isAiLoading && (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2">
            <Sparkles className="h-4 w-4 animate-spin text-indigo-400" />
            <span>Scanning all meeting transcripts & synthesizing citations...</span>
          </div>
        )}

        {aiAnswer && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-3 animate-in fade-in">
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {aiAnswer.text}
            </p>

            {aiAnswer.citations.length > 0 && (
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Verified Sources:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {aiAnswer.citations.map((cite, i) => (
                    <Link
                      key={i}
                      href={`/meetings/${cite.meetingId}?t=${cite.timestamp}`}
                      className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-start gap-2 text-xs group"
                    >
                      <Video className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                            {cite.meetingTitle}
                          </span>
                          <span className="font-mono text-indigo-400 text-[11px]">
                            {formatTime(cite.timestamp)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          &ldquo;{cite.snippet}&rdquo;
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

      {/* Keyword Search Filter */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-slate-200">
          Keyword Match Search
        </h2>
        <Input
          icon={<Search className="h-4 w-4 text-slate-500" />}
          placeholder="Search by keyword across all transcripts, summaries & action items..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {query && (
          <div className="space-y-2">
            <p className="text-xs text-slate-400">
              Found {searchResults.length} matches for &ldquo;{query}&rdquo;
            </p>

            <div className="space-y-2">
              {searchResults.map((match, idx) => (
                <Link
                  key={idx}
                  href={
                    match.timestamp !== undefined
                      ? `/meetings/${match.meetingId}?t=${match.timestamp}`
                      : `/meetings/${match.meetingId}`
                  }
                  className="p-4 rounded-xl glass-card hover:border-indigo-500/40 flex items-start justify-between gap-4 group transition-all"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-300 mt-0.5">
                      {getMatchIcon(match.matchType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                          {match.meetingTitle}
                        </span>
                        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {match.matchType}
                        </span>
                        {match.timestamp !== undefined && (
                          <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                            {formatTime(match.timestamp)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {match.speakerName && (
                          <strong className="text-slate-300">
                            {match.speakerName}:{" "}
                          </strong>
                        )}
                        {match.snippet}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-indigo-400 shrink-0 mt-2 transition-colors" />
                </Link>
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
