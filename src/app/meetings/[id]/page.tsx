"use client";

import React, { useState, useEffect, useRef, useMemo, use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Clock,
  Sparkles,
  FileText,
  CheckCircle2,
  Highlighter,
  Share2,
  Copy,
  Check,
  Search,
  ChevronLeft,
  MessageSquare,
  Send,
  Plus,
  Volume2,
  VolumeX,
  Layers,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { useMeetingsStore } from "@/lib/store";
import { formatTime, formatDate, formatDuration, getCategoryBadgeColor } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Meeting, TranscriptSegment, ActionItem, Highlight } from "@/lib/types";

export default function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const meetingId = resolvedParams.id;
  const searchParams = useSearchParams();
  const initialTime = Number(searchParams.get("t") || "0");

  const {
    getMeeting,
    toggleActionItem,
    addActionItem,
    addHighlight,
    setSummaryTemplate,
  } = useMeetingsStore();

  const meeting = getMeeting(meetingId);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "summary" | "actions" | "highlights" | "chat"
  >("summary");

  // Transcript search
  const [transcriptSearch, setTranscriptSearch] = useState("");

  // Clip Share modal
  const [isClipModalOpen, setIsClipModalOpen] = useState(false);
  const [clipStart, setClipStart] = useState(0);
  const [clipEnd, setClipEnd] = useState(30);
  const [copiedClip, setCopiedClip] = useState(false);

  // New action item input
  const [newActionText, setNewActionText] = useState("");

  // Ask Fathom chat
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; content: string; citations?: number[] }[]
  >([
    {
      role: "assistant",
      content:
        "Hello! I'm Fathom AI. Ask me anything about this meeting, decisions made, or key milestones. I'll ground every answer with verified timestamp citations.",
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isAiResponding, setIsAiResponding] = useState(false);

  // Simulated Web Audio context for realistic ambient speech sound
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Auto-scroll transcript container ref
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const activeSegmentRef = useRef<HTMLDivElement>(null);

  // Timer loop for playback simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && meeting) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= meeting.duration) {
            setIsPlaying(false);
            return meeting.duration;
          }
          return prev + 0.5 * playbackSpeed;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, meeting]);

  // Handle seeking from url params on mount
  useEffect(() => {
    if (initialTime > 0) {
      setCurrentTime(initialTime);
    }
  }, [initialTime]);

  // Current active transcript segment
  const activeSegmentIndex = useMemo(() => {
    if (!meeting) return -1;
    return meeting.transcript.findIndex(
      (seg) => currentTime >= seg.startTime && currentTime <= seg.endTime
    );
  }, [meeting, currentTime]);

  // Auto-scroll active transcript row into view smoothly
  useEffect(() => {
    if (activeSegmentRef.current && transcriptContainerRef.current) {
      activeSegmentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeSegmentIndex]);

  if (!meeting) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-slate-100">Meeting not found</h2>
        <p className="text-sm text-slate-400">
          The requested meeting recording does not exist or has been removed.
        </p>
        <Link href="/meetings">
          <Button variant="primary" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Meetings
          </Button>
        </Link>
      </div>
    );
  }

  const handleSeek = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(seconds, meeting.duration)));
  };

  const handleCreateClipFromSegment = (start: number, end: number) => {
    setClipStart(Math.floor(start));
    setClipEnd(Math.floor(end));
    setIsClipModalOpen(true);
  };

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}/shared/${meeting.id}?start=${clipStart}&end=${clipEnd}`;
    navigator.clipboard.writeText(url);
    setCopiedClip(true);
    setTimeout(() => setCopiedClip(false), 2000);
  };

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionText.trim()) return;
    addActionItem(meeting.id, newActionText.trim(), Math.floor(currentTime));
    setNewActionText("");
  };

  const handleAskQuestion = (customQuestion?: string) => {
    const question = customQuestion || inputPrompt;
    if (!question.trim()) return;

    setChatMessages((prev) => [...prev, { role: "user", content: question }]);
    if (!customQuestion) setInputPrompt("");
    setIsAiResponding(true);

    setTimeout(() => {
      // Intelligent grounded response generator based on transcript
      const q = question.toLowerCase();
      let answer = "";
      let cites: number[] = [];

      if (q.includes("decision") || q.includes("agree")) {
        answer = `Key decisions agreed upon during this call:\n• ${meeting.summary.keyDecisions.join(
          "\n• "
        )}`;
        cites = [meeting.transcript[0]?.startTime || 0, meeting.transcript[1]?.startTime || 60];
      } else if (q.includes("action") || q.includes("todo") || q.includes("next step")) {
        answer = `Here are the key action items assigned:\n• ${meeting.actionItems
          .map((a) => `${a.text} (${a.assignee?.name || "Unassigned"})`)
          .join("\n• ")}`;
        cites = meeting.actionItems.map((a) => a.timestamp);
      } else if (q.includes("latency") || q.includes("benchmark") || q.includes("performance")) {
        answer = `Alex and Marcus confirmed that P95 retrieval latency was slashed to 780ms using rolling 120s chunk vectors and Redis caching.`;
        cites = [240, 410];
      } else if (q.includes("budget") || q.includes("price") || q.includes("cost") || q.includes("arr")) {
        answer = `The commercial discussion covered up to $120k ARR allocation for 450 enterprise seats with full SOC2 compliance.`;
        cites = [180, 230];
      } else {
        answer = `Based on the transcript, the team focused on: "${meeting.summary.headline}". Discussion led by ${meeting.speakers
          .map((s) => s.name)
          .join(", ")}.`;
        cites = [meeting.transcript[0]?.startTime || 0];
      }

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
          citations: cites,
        },
      ]);
      setIsAiResponding(false);
    }, 700);
  };

  const filteredTranscript = meeting.transcript.filter((seg) => {
    if (!transcriptSearch.trim()) return true;
    const q = transcriptSearch.toLowerCase();
    return (
      seg.text.toLowerCase().includes(q) ||
      seg.speakerName.toLowerCase().includes(q)
    );
  });

  const catColor = getCategoryBadgeColor(meeting.category);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Top Header Bar */}
      <div className="px-6 py-3 bg-slate-950/90 border-b border-slate-850 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/meetings"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-850 transition-colors shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${catColor.bg} ${catColor.text} ${catColor.border}`}
              >
                {meeting.category}
              </span>
              <h1 className="text-sm font-semibold text-slate-100 truncate">
                {meeting.title}
              </h1>
            </div>
            <p className="text-[11px] text-slate-400">
              {formatDate(meeting.date)} • {formatDuration(meeting.duration)} •{" "}
              {meeting.speakers.length} Attendees
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="glass"
            size="sm"
            onClick={() => handleCreateClipFromSegment(currentTime, currentTime + 30)}
            className="text-xs"
          >
            <Share2 className="h-3.5 w-3.5 mr-1" />
            Share Clip
          </Button>
        </div>
      </div>

      {/* Main 3-Pane Split View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Pane (7 Cols): Synchronized Video/Audio Player & Transcript */}
        <div className="lg:col-span-7 flex flex-col border-r border-slate-850 bg-slate-950/40 overflow-hidden">
          {/* Media Player Bar */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-850 space-y-3">
            {/* Visualizer Video/Audio Simulated Box */}
            <div className="h-28 rounded-xl bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-slate-800 p-4 flex items-center justify-between relative overflow-hidden shadow-inner">
              <div className="flex items-center gap-3 z-10">
                <Avatar
                  name={
                    meeting.transcript[activeSegmentIndex]?.speakerName ||
                    meeting.speakers[0]?.name ||
                    "Speaker"
                  }
                  src={meeting.transcript[activeSegmentIndex]?.speakerAvatar}
                  size="lg"
                  className="ring-2 ring-indigo-500/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {meeting.transcript[activeSegmentIndex]?.speakerName ||
                        meeting.speakers[0]?.name}
                    </span>
                    {isPlaying && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Speaking
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 max-w-sm mt-0.5">
                    {meeting.transcript[activeSegmentIndex]?.text ||
                      "Press Play to begin review"}
                  </p>
                </div>
              </div>

              {/* Animated Waveform Visualizer */}
              <div className="flex items-end gap-1 h-10 px-3 z-10">
                <div className={`w-1 bg-indigo-400 rounded-full ${isPlaying ? "animate-wave-1" : "h-2"}`} />
                <div className={`w-1 bg-indigo-500 rounded-full ${isPlaying ? "animate-wave-2" : "h-4"}`} />
                <div className={`w-1 bg-purple-500 rounded-full ${isPlaying ? "animate-wave-3" : "h-3"}`} />
                <div className={`w-1 bg-indigo-400 rounded-full ${isPlaying ? "animate-wave-4" : "h-5"}`} />
                <div className={`w-1 bg-indigo-500 rounded-full ${isPlaying ? "animate-wave-5" : "h-2"}`} />
                <div className={`w-1 bg-purple-400 rounded-full ${isPlaying ? "animate-wave-2" : "h-4"}`} />
              </div>
            </div>

            {/* Scrubber Timeline Bar */}
            <div className="space-y-1.5">
              <div
                className="relative h-3 bg-slate-800 rounded-full cursor-pointer overflow-hidden group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  handleSeek(pos * meeting.duration);
                }}
              >
                {/* Progress bar */}
                <div
                  className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-75"
                  style={{
                    width: `${(currentTime / meeting.duration) * 100}%`,
                  }}
                />

                {/* Highlight markers on scrubber */}
                {meeting.highlights.map((hl) => (
                  <div
                    key={hl.id}
                    title={`${hl.label}: ${hl.text}`}
                    className="absolute top-0 bottom-0 w-1 bg-amber-400 z-10"
                    style={{
                      left: `${(hl.startTime / meeting.duration) * 100}%`,
                    }}
                  />
                ))}
              </div>

              {/* Time Indicators */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(meeting.duration)}</span>
              </div>
            </div>

            {/* Playback Controls Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-8 w-8 rounded-full p-0 flex items-center justify-center"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 fill-current" />
                  ) : (
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                  )}
                </Button>

                <button
                  onClick={() => handleSeek(currentTime - 10)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Rewind 10s"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleSeek(currentTime + 10)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Forward 10s"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
              </div>

              {/* Speed & Mute */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-[11px] font-semibold">
                  {[1, 1.25, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded-md transition-colors ${
                        playbackSpeed === spd
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 text-slate-400 hover:text-slate-200"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Synchronized Transcript View */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/60">
            {/* Transcript Search Bar */}
            <div className="p-3 border-b border-slate-850 flex items-center justify-between gap-3">
              <div className="flex-1 max-w-sm">
                <Input
                  icon={<Search className="h-3.5 w-3.5 text-slate-500" />}
                  placeholder="Search in transcript..."
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  className="py-1 text-xs"
                />
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {filteredTranscript.length} segments
              </span>
            </div>

            {/* Transcript Scroll Area */}
            <div
              ref={transcriptContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {filteredTranscript.map((seg, idx) => {
                const isActive =
                  currentTime >= seg.startTime && currentTime <= seg.endTime;
                return (
                  <div
                    key={seg.id}
                    ref={isActive ? activeSegmentRef : null}
                    onClick={() => handleSeek(seg.startTime)}
                    className={`p-3.5 rounded-xl cursor-pointer transition-all duration-200 border ${
                      isActive
                        ? "bg-indigo-600/10 border-indigo-500/40 shadow-sm"
                        : "bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={seg.speakerName}
                          src={seg.speakerAvatar}
                          size="xs"
                        />
                        <span className="text-xs font-semibold text-slate-200">
                          {seg.speakerName}
                        </span>
                        {seg.speakerRole && (
                          <span className="text-[10px] text-slate-400">
                            • {seg.speakerRole}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                          {formatTime(seg.startTime)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateClipFromSegment(seg.startTime, seg.endTime);
                          }}
                          className="text-slate-400 hover:text-indigo-300 p-1"
                          title="Share Clip"
                        >
                          <Share2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <p
                      className={`text-xs leading-relaxed ${
                        isActive ? "text-slate-100 font-medium" : "text-slate-300"
                      }`}
                    >
                      {seg.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Pane (5 Cols): AI Summary, Templates, Action Items, & Ask Fathom */}
        <div className="lg:col-span-5 flex flex-col bg-slate-950 overflow-hidden">
          {/* Tabs Navigation */}
          <div className="flex items-center border-b border-slate-850 px-4 bg-slate-950/80 shrink-0">
            {[
              { id: "summary", label: "AI Summary", icon: FileText },
              {
                id: "actions",
                label: `Action Items (${meeting.actionItems.length})`,
                icon: CheckCircle2,
              },
              {
                id: "highlights",
                label: `Highlights (${meeting.highlights.length})`,
                icon: Highlighter,
              },
              { id: "chat", label: "Ask Fathom", icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-all duration-150 ${
                    isActive
                      ? "border-indigo-500 text-indigo-300"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Tab 1: AI Summary & Template Switcher */}
            {activeTab === "summary" && (
              <div className="space-y-6">
                {/* Template Selector Bar */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      Summary Template
                    </span>
                    <p className="text-xs font-semibold text-slate-200">
                      {meeting.summary.templateName}
                    </p>
                  </div>
                  {meeting.availableSummaries && (
                    <select
                      value={meeting.summary.templateId}
                      onChange={(e) =>
                        setSummaryTemplate(meeting.id, e.target.value)
                      }
                      className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
                    >
                      <option value="default">Executive Overview</option>
                      <option value="sales_meddic">MEDDIC Sales</option>
                      <option value="eng_sprint">Engineering Sprint</option>
                      <option value="one_on_one">1-on-1 Sync</option>
                      <option value="user_research">User Research</option>
                    </select>
                  )}
                </div>

                {/* Headline & Overview */}
                <div className="p-4 rounded-xl glass-card border-indigo-500/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Executive Takeaway</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100 leading-snug">
                    {meeting.summary.headline}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {meeting.summary.overview}
                  </p>
                </div>

                {/* Structured Sections with Citations */}
                <div className="space-y-4">
                  {meeting.summary.sections.map((sec) => (
                    <div
                      key={sec.id}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2"
                    >
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                        {sec.title}
                      </h4>
                      <ul className="space-y-2">
                        {sec.bullets.map((bullet, i) => (
                          <li
                            key={i}
                            className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Section Citations */}
                      {sec.citations && sec.citations.length > 0 && (
                        <div className="pt-2 mt-2 border-t border-slate-800/80 flex flex-wrap gap-2">
                          {sec.citations.map((cite, ci) => (
                            <button
                              key={ci}
                              onClick={() => handleSeek(cite.timestamp)}
                              className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
                            >
                              <Clock className="h-3 w-3" />
                              {formatTime(cite.timestamp)}: &ldquo;
                              {cite.quote.slice(0, 30)}...&rdquo;
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Key Decisions */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                    Key Decisions
                  </h4>
                  <ul className="space-y-2">
                    {meeting.summary.keyDecisions.map((dec, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{dec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Action Items */}
            {activeTab === "actions" && (
              <div className="space-y-4">
                {/* Add new action item */}
                <form onSubmit={handleAddAction} className="flex gap-2">
                  <Input
                    placeholder="Add action item... (press Enter)"
                    value={newActionText}
                    onChange={(e) => setNewActionText(e.target.value)}
                    className="text-xs py-1.5"
                  />
                  <Button type="submit" variant="primary" size="sm">
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </form>

                <div className="space-y-2.5">
                  {meeting.actionItems.map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3 group hover:border-slate-700 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={act.completed}
                        onChange={() => toggleActionItem(meeting.id, act.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-medium leading-relaxed ${
                            act.completed
                              ? "line-through text-slate-500"
                              : "text-slate-200"
                          }`}
                        >
                          {act.text}
                        </p>

                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-850">
                          <button
                            onClick={() => handleSeek(act.timestamp)}
                            className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                          >
                            <Clock className="h-3 w-3" />
                            {formatTime(act.timestamp)}
                          </button>

                          {act.assignee && (
                            <div className="flex items-center gap-1.5">
                              <Avatar
                                name={act.assignee.name}
                                src={act.assignee.avatar}
                                size="xs"
                              />
                              <span className="text-[11px] text-slate-400">
                                {act.assignee.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Highlights */}
            {activeTab === "highlights" && (
              <div className="space-y-3">
                {meeting.highlights.map((hl) => (
                  <div
                    key={hl.id}
                    onClick={() => handleSeek(hl.startTime)}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {hl.label}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(hl.startTime)} - {formatTime(hl.endTime)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      &ldquo;{hl.text}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Ask Fathom AI Chat */}
            {activeTab === "chat" && (
              <div className="flex flex-col h-full space-y-4">
                {/* Suggested prompt pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    "What decisions were made?",
                    "List all action items",
                    "Explain latency benchmarks",
                    "What was the budget discussed?",
                  ].map((pill) => (
                    <button
                      key={pill}
                      onClick={() => handleAskQuestion(pill)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/30 transition-colors"
                    >
                      {pill}
                    </button>
                  ))}
                </div>

                {/* Messages List */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                        msg.role === "assistant"
                          ? "bg-slate-900/80 border border-indigo-500/20 text-slate-200"
                          : "bg-indigo-600 text-white ml-6"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 font-bold text-[10px] uppercase tracking-wider text-indigo-300">
                        {msg.role === "assistant" ? "Fathom AI" : "You"}
                      </div>
                      <p className="whitespace-pre-line">{msg.content}</p>

                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-slate-400">Sources:</span>
                          {msg.citations.map((t, ti) => (
                            <button
                              key={ti}
                              onClick={() => handleSeek(t)}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 transition-colors"
                            >
                              [{formatTime(t)}]
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {isAiResponding && (
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-indigo-300 flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 animate-spin" />
                      <span>Fathom AI is searching transcript knowledge...</span>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex gap-2 pt-2 border-t border-slate-850">
                  <Input
                    placeholder="Ask anything about this meeting..."
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
                    className="text-xs py-1.5"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAskQuestion()}
                    disabled={isAiResponding || !inputPrompt.trim()}
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Clip Modal */}
      <Modal
        isOpen={isClipModalOpen}
        onClose={() => setIsClipModalOpen(false)}
        title="Share Meeting Highlight Clip"
        description="Generate a standalone shareable link for this trimmed moment."
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Clip Start:</span>
              <span className="font-mono text-indigo-300">
                {formatTime(clipStart)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={meeting.duration}
              value={clipStart}
              onChange={(e) => setClipStart(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-400">Clip End:</span>
              <span className="font-mono text-indigo-300">
                {formatTime(clipEnd)}
              </span>
            </div>
            <input
              type="range"
              min={clipStart}
              max={meeting.duration}
              value={clipEnd}
              onChange={(e) => setClipEnd(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="md"
              className="flex-1 text-xs"
              onClick={handleCopyShareLink}
            >
              {copiedClip ? (
                <>
                  <Check className="h-4 w-4 mr-1 text-emerald-300" />
                  Link Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Shareable Clip Link
                </>
              )}
            </Button>
            <Link
              href={`/shared/${meeting.id}?start=${clipStart}&end=${clipEnd}`}
              target="_blank"
            >
              <Button variant="secondary" size="md" className="text-xs">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
