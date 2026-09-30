"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  use,
} from "react";
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
  Plus,
  Volume2,
  VolumeX,
  Layers,
  ExternalLink,
  Calendar,
  Users,
  CheckSquare,
  Bookmark,
  Maximize2,
  Columns,
  ListFilter,
  Flame,
  ArrowRight,
} from "lucide-react";
import { useMeetingsStore } from "@/lib/store";
import {
  formatTime,
  formatDate,
  formatDuration,
  getCategoryBadgeColor,
} from "@/lib/utils";
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

  // Core Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hoverTimelineTime, setHoverTimelineTime] = useState<number | null>(null);

  // Navigation Tabs: 'overview' | 'transcript' | 'highlights' | 'actions' | 'split'
  const [activeTab, setActiveTab] = useState<
    "overview" | "transcript" | "highlights" | "actions" | "split"
  >("overview");

  // In-Transcript Search Filter
  const [transcriptSearch, setTranscriptSearch] = useState("");

  // Clip Share Modal
  const [isClipModalOpen, setIsClipModalOpen] = useState(false);
  const [clipStart, setClipStart] = useState(0);
  const [clipEnd, setClipEnd] = useState(30);
  const [copiedClip, setCopiedClip] = useState(false);

  // New Action Item Input
  const [newActionText, setNewActionText] = useState("");
  const [newActionDueDate, setNewActionDueDate] = useState("This Week");

  // Keyboard Shortcuts Modal
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Auto-scroll transcript container refs
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const activeSegmentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Audio synthesis reference (generates subtle ambient rhythm on play)
  const audioContextRef = useRef<AudioContext | null>(null);

  // Handle URL timestamp param on mount or update
  useEffect(() => {
    if (initialTime > 0) {
      setCurrentTime(initialTime);
    }
  }, [initialTime]);

  // Smooth playback timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && meeting) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= meeting.duration) {
            setIsPlaying(false);
            return meeting.duration;
          }
          return Math.min(prev + 0.25 * playbackSpeed, meeting.duration);
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, meeting]);

  // Seeking helper
  const handleSeek = useCallback(
    (seconds: number) => {
      if (!meeting) return;
      const target = Math.max(0, Math.min(seconds, meeting.duration));
      setCurrentTime(target);
    },
    [meeting]
  );

  // Keyboard shortcuts (Space: play/pause, J/Left: -10s, L/Right: +10s)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === "j" || e.key === "ArrowLeft") {
        e.preventDefault();
        handleSeek(currentTime - 10);
      } else if (e.key === "l" || e.key === "ArrowRight") {
        e.preventDefault();
        handleSeek(currentTime + 10);
      } else if (e.key === "?") {
        setIsShortcutsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTime, handleSeek]);

  // Calculate active transcript segment based on currentTime
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

  // Timeline Click / Scrubbing Handler
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !meeting) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(clickX / rect.width, 1));
    handleSeek(percent * meeting.duration);
  };

  // Timeline Hover Time Calculation
  const handleTimelineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !meeting) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(hoverX / rect.width, 1));
    setHoverTimelineTime(percent * meeting.duration);
  };

  // Clip Sharing setup
  const handleOpenClipModal = (start?: number, end?: number) => {
    if (!meeting) return;
    const s = start !== undefined ? Math.floor(start) : Math.floor(currentTime);
    const e = end !== undefined ? Math.floor(end) : Math.min(s + 30, meeting.duration);
    setClipStart(s);
    setClipEnd(e);
    setIsClipModalOpen(true);
  };

  const handleCopyClipLink = () => {
    if (!meeting) return;
    const url = `${window.location.origin}/shared/${meeting.id}?start=${clipStart}&end=${clipEnd}`;
    navigator.clipboard.writeText(url);
    setCopiedClip(true);
    setTimeout(() => setCopiedClip(false), 2000);
  };

  // Add Action Item
  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionText.trim() || !meeting) return;
    addActionItem(meeting.id, newActionText.trim(), Math.floor(currentTime));
    setNewActionText("");
  };

  if (!meeting) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-slate-100">Meeting not found</h2>
        <p className="text-sm text-slate-400">
          The requested meeting recording does not exist in your workspace.
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

  const catColor = getCategoryBadgeColor(meeting.category);
  const activeSegment = meeting.transcript[activeSegmentIndex] || meeting.transcript[0];

  const filteredTranscript = meeting.transcript.filter((seg) => {
    if (!transcriptSearch.trim()) return true;
    const q = transcriptSearch.toLowerCase();
    return (
      seg.text.toLowerCase().includes(q) ||
      seg.speakerName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-950">
      {/* 1. Header Bar */}
      <header className="px-6 py-3.5 bg-slate-950 border-b border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/meetings"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors shrink-0"
            title="Back to Meeting Library"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${catColor.bg} ${catColor.text} ${catColor.border}`}
              >
                {meeting.category}
              </span>
              {meeting.meetingType && (
                <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                  {meeting.meetingType}
                </span>
              )}
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Calendar className="h-3 w-3" />
                {formatDate(meeting.date)}
              </span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(meeting.duration)}
              </span>
            </div>

            <h1 className="text-base font-bold text-white tracking-tight truncate">
              {meeting.title}
            </h1>
          </div>
        </div>

        {/* Header Right: Participants & Share CTA */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Participant Avatars */}
          <div className="flex items-center gap-2 pr-2 border-r border-slate-850 hidden sm:flex">
            <div className="flex -space-x-2 overflow-hidden">
              {meeting.speakers.map((spk) => (
                <Avatar
                  key={spk.id}
                  name={spk.name}
                  src={spk.avatar}
                  size="sm"
                  className="ring-2 ring-slate-900"
                />
              ))}
            </div>
            <span className="text-xs text-slate-300 font-medium">
              {meeting.speakers.length} participants
            </span>
          </div>

          <Button
            variant="glass"
            size="sm"
            onClick={() => handleOpenClipModal()}
            className="text-xs"
          >
            <Share2 className="h-3.5 w-3.5 mr-1 text-indigo-400" />
            <span>Share Clip</span>
          </Button>
        </div>
      </header>

      {/* 2. Persistent Playback Controls & Waveform Bar */}
      <div className="px-6 py-2.5 bg-slate-900/90 border-b border-slate-850 flex flex-col gap-2 shrink-0 z-10">
        <div className="flex items-center justify-between gap-4">
          {/* Play / Skip Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-8 w-8 rounded-full p-0 flex items-center justify-center shadow-md shadow-indigo-600/30"
              title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current ml-0.5" />
              )}
            </Button>

            <button
              onClick={() => handleSeek(currentTime - 10)}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Rewind 10s (J)"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={() => handleSeek(currentTime + 10)}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Forward 10s (L)"
            >
              <RotateCw className="h-4 w-4" />
            </button>

            {/* Time Indicator */}
            <div className="font-mono text-xs font-semibold text-slate-200 ml-2">
              <span className="text-indigo-400">{formatTime(currentTime)}</span>
              <span className="text-slate-500"> / </span>
              <span className="text-slate-400">{formatTime(meeting.duration)}</span>
            </div>
          </div>

          {/* Active Speaker Mini Banner */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 hidden md:flex min-w-0 max-w-md">
            <Avatar
              name={activeSegment?.speakerName || "Speaker"}
              src={activeSegment?.speakerAvatar}
              size="xs"
            />
            <div className="flex items-center gap-1.5 min-w-0 text-xs">
              <span className="font-bold text-slate-200 truncate">
                {activeSegment?.speakerName}:
              </span>
              <span className="text-slate-400 truncate italic">
                &ldquo;{activeSegment?.text}&rdquo;
              </span>
            </div>
            {isPlaying && (
              <div className="flex items-center gap-0.5 h-3 ml-1 shrink-0">
                <div className="w-0.5 bg-emerald-400 rounded-full animate-wave-1" />
                <div className="w-0.5 bg-emerald-400 rounded-full animate-wave-2" />
                <div className="w-0.5 bg-emerald-400 rounded-full animate-wave-3" />
              </div>
            )}
          </div>

          {/* Speed & Audio controls */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-slate-950 rounded-lg p-0.5 text-[11px] font-semibold border border-slate-800">
              {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
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
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-rose-400" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Interactive Timeline Track with Speaker Segments & Highlight Pins */}
        <div className="relative pt-1 pb-1">
          <div
            ref={timelineRef}
            onClick={handleTimelineClick}
            onMouseMove={handleTimelineMouseMove}
            onMouseLeave={() => setHoverTimelineTime(null)}
            className="relative h-3 bg-slate-950 rounded-full cursor-pointer overflow-hidden border border-slate-800/80 group"
          >
            {/* Speaker Color Segments */}
            {meeting.transcript.map((seg, idx) => {
              const leftPercent = (seg.startTime / meeting.duration) * 100;
              const widthPercent =
                ((seg.endTime - seg.startTime) / meeting.duration) * 100;
              return (
                <div
                  key={seg.id}
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                  className={`absolute top-0 bottom-0 opacity-40 hover:opacity-80 transition-opacity ${
                    idx % 2 === 0 ? "bg-indigo-900/60" : "bg-purple-900/60"
                  }`}
                />
              );
            })}

            {/* Current Playback Progress Fill */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-75"
              style={{
                width: `${(currentTime / meeting.duration) * 100}%`,
              }}
            />

            {/* AI Highlight Pins on Track */}
            {meeting.highlights.map((hl) => (
              <div
                key={hl.id}
                title={`${hl.label}: ${hl.text}`}
                className="absolute top-0 bottom-0 w-1.5 bg-amber-400 z-10 shadow-sm"
                style={{
                  left: `${(hl.startTime / meeting.duration) * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Hover Time Tooltip */}
          {hoverTimelineTime !== null && (
            <div
              className="absolute -top-7 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-indigo-300 pointer-events-none shadow-lg z-20"
              style={{
                left: `${(hoverTimelineTime / meeting.duration) * 100}%`,
              }}
            >
              {formatTime(hoverTimelineTime)}
            </div>
          )}
        </div>
      </div>

      {/* 3. Meeting Navigation Tabs */}
      <div className="px-6 bg-slate-950 border-b border-slate-850 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {[
            { id: "overview", label: "Overview", icon: FileText },
            {
              id: "transcript",
              label: `Transcript (${meeting.transcript.length})`,
              icon: MessageSquare,
            },
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
            {
              id: "split",
              label: "Split View",
              icon: Columns,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all duration-150 whitespace-nowrap ${
                  isActive
                    ? "border-indigo-500 text-indigo-300 bg-indigo-500/5"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Template Selector on Overview */}
        {activeTab === "overview" && meeting.availableSummaries && (
          <div className="flex items-center gap-2 text-xs py-1">
            <span className="text-slate-400 font-medium hidden sm:inline">
              Template:
            </span>
            <select
              value={meeting.summary.templateId}
              onChange={(e) => setSummaryTemplate(meeting.id, e.target.value)}
              className="bg-slate-900 text-xs font-semibold text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="default">Executive Overview</option>
              <option value="sales_meddic">MEDDIC Sales Discovery</option>
              <option value="eng_sprint">Engineering Sprint</option>
              <option value="one_on_one">1-on-1 Sync</option>
              <option value="user_research">User Research</option>
            </select>
          </div>
        )}
      </div>

      {/* 4. Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW                                           */}
        {/* ========================================================= */}
        {activeTab === "overview" && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* AI Summary Banner */}
            <div className="p-5 rounded-2xl glass-card border-indigo-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>AI Executive Summary</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Template: {meeting.summary.templateName}
                </span>
              </div>

              <h2 className="text-base font-bold text-white leading-snug">
                {meeting.summary.headline}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {meeting.summary.overview}
              </p>
            </div>

            {/* Key Topics (3-6 Structured Sections) */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-indigo-400" />
                <span>Key Topics & Discussion Pillars</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meeting.summary.sections.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5"
                  >
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                      {sec.title}
                    </h4>
                    <ul className="space-y-2">
                      {sec.bullets.map((bullet, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Citations with Click-to-Seek */}
                    {sec.citations && sec.citations.length > 0 && (
                      <div className="pt-2 mt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                        {sec.citations.map((cite, ci) => (
                          <button
                            key={ci}
                            onClick={() => handleSeek(cite.timestamp)}
                            className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
                            title={`Jump to ${formatTime(cite.timestamp)}`}
                          >
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(cite.timestamp)}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Decisions */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Key Decisions Agreed Upon
                </h3>
              </div>
              <ul className="space-y-2">
                {meeting.summary.keyDecisions.map((decision, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-200 flex items-start gap-2.5 leading-relaxed font-medium"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{decision}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Items Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Action Items & Commitments ({meeting.actionItems.length})</span>
                </h3>
                <button
                  onClick={() => setActiveTab("actions")}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Manage All →
                </button>
              </div>

              <div className="space-y-2">
                {meeting.actionItems.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={act.completed}
                      onChange={() => toggleActionItem(meeting.id, act.id)}
                      className="mt-1 h-3.5 w-3.5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium ${
                          act.completed
                            ? "line-through text-slate-500"
                            : "text-slate-200"
                        }`}
                      >
                        {act.text}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-850 text-[11px]">
                        <button
                          onClick={() => handleSeek(act.timestamp)}
                          className="font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
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
                            <span className="text-slate-400">
                              {act.assignee.name} • {act.dueDate}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: TRANSCRIPT (Full View)                             */}
        {/* ========================================================= */}
        {activeTab === "transcript" && (
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Search Filter Header */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-10">
              <div className="flex-1 max-w-md">
                <Input
                  icon={<Search className="h-3.5 w-3.5 text-slate-500" />}
                  placeholder="Filter transcript by keyword or speaker..."
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  className="py-1.5 text-xs"
                />
              </div>
              <span className="text-xs font-mono text-slate-400">
                {filteredTranscript.length} / {meeting.transcript.length} turns
              </span>
            </div>

            {/* Transcript Stream */}
            <div
              ref={transcriptContainerRef}
              className="space-y-3 pb-12"
            >
              {filteredTranscript.map((seg, idx) => {
                const isActive =
                  currentTime >= seg.startTime && currentTime <= seg.endTime;
                return (
                  <div
                    key={seg.id}
                    ref={isActive ? activeSegmentRef : null}
                    onClick={() => handleSeek(seg.startTime)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                      isActive
                        ? "bg-indigo-600/15 border-indigo-500/50 shadow-md shadow-indigo-600/10"
                        : "bg-slate-900/50 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={seg.speakerName}
                          src={seg.speakerAvatar}
                          size="sm"
                          className={isActive ? "ring-2 ring-indigo-400" : ""}
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">
                              {seg.speakerName}
                            </span>
                            {seg.speakerRole && (
                              <span className="text-[10px] text-slate-400 font-medium">
                                • {seg.speakerRole}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                            isActive
                              ? "bg-indigo-500 text-white font-bold"
                              : "bg-slate-800 text-indigo-300"
                          }`}
                        >
                          {formatTime(seg.startTime)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenClipModal(seg.startTime, seg.endTime);
                          }}
                          className="p-1 text-slate-400 hover:text-indigo-300 transition-colors"
                          title="Share Clip of this moment"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <p
                      className={`text-xs leading-relaxed pl-9 ${
                        isActive
                          ? "text-slate-100 font-medium"
                          : "text-slate-300"
                      }`}
                    >
                      {seg.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ACTION ITEMS                                       */}
        {/* ========================================================= */}
        {activeTab === "actions" && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Add Action Item Form */}
            <form
              onSubmit={handleAddAction}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center gap-3"
            >
              <div className="flex-1 w-full">
                <Input
                  placeholder="Type new action item task..."
                  value={newActionText}
                  onChange={(e) => setNewActionText(e.target.value)}
                  className="py-1.5 text-xs"
                />
              </div>
              <Button type="submit" variant="primary" size="sm" className="text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" />
                <span>Add Task</span>
              </Button>
            </form>

            {/* List */}
            <div className="space-y-3">
              {meeting.actionItems.map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex items-start gap-3.5 group"
                >
                  <input
                    type="checkbox"
                    checked={act.completed}
                    onChange={() => toggleActionItem(meeting.id, act.id)}
                    className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium leading-relaxed ${
                        act.completed
                          ? "line-through text-slate-500"
                          : "text-slate-100"
                      }`}
                    >
                      {act.text}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-850">
                      <button
                        onClick={() => handleSeek(act.timestamp)}
                        className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-semibold"
                      >
                        <Clock className="h-3.5 w-3.5" />
                        <span>Verbal source: {formatTime(act.timestamp)}</span>
                      </button>

                      {act.assignee && (
                        <div className="flex items-center gap-2">
                          <Avatar
                            name={act.assignee.name}
                            src={act.assignee.avatar}
                            size="xs"
                          />
                          <span className="text-xs text-slate-300 font-medium">
                            {act.assignee.name}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            (Due: {act.dueDate})
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

        {/* ========================================================= */}
        {/* TAB 4: HIGHLIGHTS                                         */}
        {/* ========================================================= */}
        {activeTab === "highlights" && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Highlight Quotes ({meeting.highlights.length})
              </h3>
              <span className="text-xs text-slate-400">
                Click quote to seek audio
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meeting.highlights.map((hl) => (
                <div
                  key={hl.id}
                  onClick={() => handleSeek(hl.startTime)}
                  className="p-4 rounded-xl glass-card border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all space-y-2 group"
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

                  <p className="text-xs text-slate-200 group-hover:text-white leading-relaxed font-medium italic">
                    &ldquo;{hl.text}&rdquo;
                  </p>

                  <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px] text-indigo-400">
                    <span>Jump to quote</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: SPLIT VIEW (Transcript + Overview Side-by-Side)    */}
        {/* ========================================================= */}
        {activeTab === "split" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Left Col (6): Transcript */}
            <div className="lg:col-span-6 flex flex-col rounded-2xl glass-panel border border-slate-800 p-4 space-y-3 overflow-hidden h-[600px]">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Synchronized Transcript
                </span>
                <span className="text-xs font-mono text-indigo-400">
                  {formatTime(currentTime)}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {meeting.transcript.map((seg) => {
                  const isActive =
                    currentTime >= seg.startTime && currentTime <= seg.endTime;
                  return (
                    <div
                      key={seg.id}
                      onClick={() => handleSeek(seg.startTime)}
                      className={`p-3 rounded-xl cursor-pointer border text-xs transition-all ${
                        isActive
                          ? "bg-indigo-600/20 border-indigo-500/50 text-white font-medium"
                          : "bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-900/80"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-200">
                          {seg.speakerName}
                        </span>
                        <span className="text-[10px] font-mono text-indigo-400">
                          {formatTime(seg.startTime)}
                        </span>
                      </div>
                      <p>{seg.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Col (6): Summary & Decisions */}
            <div className="lg:col-span-6 flex flex-col rounded-2xl glass-panel border border-slate-800 p-4 space-y-4 overflow-y-auto h-[600px]">
              <div className="space-y-1.5 border-b border-slate-850 pb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Executive Notes</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  {meeting.summary.headline}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {meeting.summary.overview}
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Key Decisions
                </h5>
                <ul className="space-y-1.5">
                  {meeting.summary.keyDecisions.map((dec, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-300 flex items-start gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{dec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-850">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Action Items ({meeting.actionItems.length})
                </h5>
                <div className="space-y-2">
                  {meeting.actionItems.map((act) => (
                    <div
                      key={act.id}
                      className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-2 text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={act.completed}
                        onChange={() => toggleActionItem(meeting.id, act.id)}
                        className="mt-0.5 h-3.5 w-3.5 cursor-pointer"
                      />
                      <span
                        className={
                          act.completed
                            ? "line-through text-slate-500"
                            : "text-slate-200"
                        }
                      >
                        {act.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Share Clip Modal */}
      <Modal
        isOpen={isClipModalOpen}
        onClose={() => setIsClipModalOpen(false)}
        title="Share Meeting Highlight Clip"
        description="Generate a shareable public link for this trimmed moment."
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
              onClick={handleCopyClipLink}
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

      {/* Keyboard Shortcuts Cheat Sheet Modal */}
      <Modal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        title="Keyboard Shortcuts"
        description="Navigate meeting playback without leaving your keyboard."
      >
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-300">Play / Pause</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono">
              Space
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-300">Skip back 10 seconds</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono">
              J or ←
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-300">Skip forward 10 seconds</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono">
              L or →
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-300">Open Global Search</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono">
              ⌘K / Ctrl+K
            </kbd>
          </div>
        </div>
      </Modal>
    </div>
  );
}
