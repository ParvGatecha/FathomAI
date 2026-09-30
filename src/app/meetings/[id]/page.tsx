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
  Star,
  Trash2,
  Tag,
  UserCheck,
  CalendarClock,
  AlertCircle,
  TrendingUp,
  Briefcase,
  Cpu,
  GraduationCap,
  HeartHandshake,
  HelpCircle,
  Filter,
} from "lucide-react";
import { useMeetingsStore, AddActionItemParams } from "@/lib/store";
import {
  formatTime,
  formatDate,
  formatDuration,
  getCategoryBadgeColor,
} from "@/lib/utils";
import { AVAILABLE_TEMPLATES } from "@/lib/templates";
import { askMeetingIntelligence, GroundedCitation } from "@/lib/rag";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Meeting, TranscriptSegment, ActionItem, Highlight, Speaker } from "@/lib/types";

// Template Icon Map
const TEMPLATE_ICONS: Record<string, any> = {
  general: Sparkles,
  sales: Briefcase,
  customer_success: HeartHandshake,
  product: Layers,
  engineering: Cpu,
  interview: GraduationCap,
};

export interface MeetingChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  citations?: GroundedCitation[];
}

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
    deleteActionItem,
    addHighlight,
    deleteHighlight,
    toggleSegmentHighlight,
    setSummaryTemplate,
  } = useMeetingsStore();

  const meeting = getMeeting(meetingId);

  // Core Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hoverTimelineTime, setHoverTimelineTime] = useState<number | null>(null);

  // Navigation Tabs: 'overview' | 'transcript' | 'highlights' | 'actions' | 'chat' | 'split'
  const [activeTab, setActiveTab] = useState<
    "overview" | "transcript" | "highlights" | "actions" | "chat" | "split"
  >("overview");

  // In-Transcript Search Filter
  const [transcriptSearch, setTranscriptSearch] = useState("");

  // Ask Fathom Chat State
  const [chatMessages, setChatMessages] = useState<MeetingChatMessage[]>([
    {
      id: "init-1",
      role: "assistant",
      text: "👋 Hi! I'm **Ask Fathom**. Ask me anything about this meeting's discussion, decisions, action items, or speaker commitments, and I will provide transcript-grounded answers with clickable source timestamps.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatThinking, setIsChatThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Clip Share Modal
  const [isClipModalOpen, setIsClipModalOpen] = useState(false);
  const [clipStart, setClipStart] = useState(0);
  const [clipEnd, setClipEnd] = useState(30);
  const [copiedClip, setCopiedClip] = useState(false);

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  }, []);

  // Action Items State
  const [newActionText, setNewActionText] = useState("");
  const [newActionAssigneeId, setNewActionAssigneeId] = useState<string>("none");
  const [newActionDueDate, setNewActionDueDate] = useState("This Week");
  const [newActionPriority, setNewActionPriority] = useState<"low" | "medium" | "high">("medium");
  const [actionFilterStatus, setActionFilterStatus] = useState<"all" | "open" | "completed">("all");
  const [actionFilterAssignee, setActionFilterAssignee] = useState<string>("all");

  // Summary Template Switching Simulation State
  const [isSwitchingTemplate, setIsSwitchingTemplate] = useState(false);

  // Copied Quote ID State
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);

  // Keyboard Shortcuts Modal
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Auto-scroll transcript container refs
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const activeSegmentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

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
    (seconds: number, autoPlay: boolean = false) => {
      if (!meeting) return;
      const target = Math.max(0, Math.min(seconds, meeting.duration));
      setCurrentTime(target);
      if (autoPlay) {
        setIsPlaying(true);
      }
    },
    [meeting]
  );

  // Keyboard shortcuts (Space: play/pause, J/Left: -10s, L/Right: +10s)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    showToast("Shareable link copied to clipboard");
  };

  // Copy Quote to Clipboard
  const handleCopyQuote = (seg: TranscriptSegment) => {
    const text = `"${seg.text}" — ${seg.speakerName} (${formatTime(seg.startTime)})`;
    navigator.clipboard.writeText(text);
    setCopiedQuoteId(seg.id);
    showToast("Quote copied to clipboard");
    setTimeout(() => setCopiedQuoteId(null), 2000);
  };

  // Toggle Highlight on a Transcript Segment
  const handleToggleSegmentHighlight = (seg: TranscriptSegment) => {
    if (!meeting) return;
    const added = toggleSegmentHighlight(meeting.id, seg, "Key Point", "yellow");
    if (added) {
      showToast(`⭐ Highlight added at ${formatTime(seg.startTime)}`);
    } else {
      showToast(`Highlight removed`);
    }
  };

  // Template Switch Handler with realistic AI generation feel
  const handleSelectTemplate = (templateId: string) => {
    if (!meeting) return;
    setIsSwitchingTemplate(true);
    setTimeout(() => {
      setSummaryTemplate(meeting.id, templateId);
      setIsSwitchingTemplate(false);
      showToast(`Template changed to ${templateId.replace("_", " ")}`);
    }, 280);
  };

  // Send Question to Ask Fathom AI
  const handleSendAiQuestion = async (customQuestion?: string) => {
    const q = (customQuestion || chatInput).trim();
    if (!q || !meeting) return;

    const userMsg: MeetingChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsChatThinking(true);

    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    // Grounded retrieval
    setTimeout(() => {
      const groundedResult = askMeetingIntelligence(meeting, q);
      const assistantMsg: MeetingChatMessage = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        text: groundedResult.text,
        citations: groundedResult.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
      setIsChatThinking(false);

      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 60);
    }, 450);
  };

  // Add Action Item Handler
  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionText.trim() || !meeting) return;

    let assignee: { name: string; avatar: string } | undefined = undefined;
    if (newActionAssigneeId !== "none") {
      const selectedSpeaker = meeting.speakers.find((s) => s.id === newActionAssigneeId);
      if (selectedSpeaker) {
        assignee = {
          name: selectedSpeaker.name,
          avatar: selectedSpeaker.avatar,
        };
      }
    }

    const payload: AddActionItemParams = {
      text: newActionText.trim(),
      timestamp: Math.floor(currentTime),
      assignee,
      dueDate: newActionDueDate,
      priority: newActionPriority,
    };

    addActionItem(meeting.id, payload);
    setNewActionText("");
    showToast("Action item created successfully");
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

  // Filter Transcript
  const filteredTranscript = meeting.transcript.filter((seg) => {
    if (!transcriptSearch.trim()) return true;
    const q = transcriptSearch.toLowerCase();
    return (
      seg.text.toLowerCase().includes(q) ||
      seg.speakerName.toLowerCase().includes(q)
    );
  });

  // Filter Action Items
  const filteredActionItems = meeting.actionItems.filter((act) => {
    if (actionFilterStatus === "open" && act.completed) return false;
    if (actionFilterStatus === "completed" && !act.completed) return false;
    if (
      actionFilterAssignee !== "all" &&
      act.assignee?.name !== actionFilterAssignee
    ) {
      return false;
    }
    return true;
  });

  const openActionCount = meeting.actionItems.filter((a) => !a.completed).length;
  const completedActionCount = meeting.actionItems.filter((a) => a.completed).length;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-indigo-500/40 text-xs font-semibold text-indigo-200 shadow-xl shadow-black/50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

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

            {/* AI / User Highlight Pins on Track */}
            {meeting.highlights.map((hl) => (
              <div
                key={hl.id}
                title={`⭐ ${hl.label}: ${hl.text}`}
                className="absolute top-0 bottom-0 w-2 bg-amber-400 z-10 shadow-md shadow-amber-500/50 hover:scale-125 transition-transform"
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
              id: "highlights",
              label: `Highlights (${meeting.highlights.length})`,
              icon: Star,
              highlightBadge: meeting.highlights.length > 0,
            },
            {
              id: "actions",
              label: `Action Items (${openActionCount} open)`,
              icon: CheckCircle2,
            },
            {
              id: "chat",
              label: "Ask Fathom ✨",
              icon: Sparkles,
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
                <Icon
                  className={`h-3.5 w-3.5 ${
                    tab.id === "highlights" && meeting.highlights.length > 0
                      ? "text-amber-400 fill-amber-400"
                      : ""
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Keyboard shortcut prompt */}
        <button
          onClick={() => setIsShortcutsOpen(true)}
          className="text-[11px] text-slate-500 hover:text-slate-300 font-mono hidden md:flex items-center gap-1 px-2 py-1 rounded bg-slate-900/60 border border-slate-800"
        >
          <span>Press</span>
          <kbd className="text-[10px] px-1 bg-slate-800 rounded text-slate-300">?</kbd>
          <span>for shortcuts</span>
        </button>
      </div>

      {/* 4. Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & TEMPLATES                               */}
        {/* ========================================================= */}
        {activeTab === "overview" && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Template Selector Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>AI Summary Template Format</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Switch template to re-structure AI takeaways
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {AVAILABLE_TEMPLATES.map((tmpl) => {
                  const Icon = TEMPLATE_ICONS[tmpl.id] || Sparkles;
                  const isCurrent =
                    meeting.summary.templateId === tmpl.id ||
                    (tmpl.id === "general" && meeting.summary.templateId === "default") ||
                    (tmpl.id === "sales" && meeting.summary.templateId === "sales_meddic") ||
                    (tmpl.id === "customer_success" && meeting.summary.templateId === "user_research") ||
                    (tmpl.id === "engineering" && meeting.summary.templateId === "eng_sprint") ||
                    (tmpl.id === "interview" && meeting.summary.templateId === "interview_scorecard");

                  return (
                    <button
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex flex-col gap-1.5 ${
                        isCurrent
                          ? "bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-600/10"
                          : "bg-slate-950/60 border-slate-850 hover:bg-slate-900 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon
                          className={`h-4 w-4 ${
                            isCurrent ? "text-indigo-400" : "text-slate-400"
                          }`}
                        />
                        {isCurrent && (
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-bold truncate ${
                            isCurrent ? "text-white" : "text-slate-300"
                          }`}
                        >
                          {tmpl.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {tmpl.badge}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Summary Banner */}
            <div
              className={`p-6 rounded-2xl glass-card border-indigo-500/30 space-y-3 transition-opacity duration-200 ${
                isSwitchingTemplate ? "opacity-40" : "opacity-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>AI Executive Summary</span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {meeting.summary.templateName}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white leading-snug">
                {meeting.summary.headline}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {meeting.summary.overview}
              </p>
            </div>

            {/* Key Topics (Structured Discussion Sections) */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-indigo-400" />
                <span>Key Topics & Structured Pillars</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meeting.summary.sections.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-2">
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
                    </div>

                    {/* Citations with Click-to-Seek */}
                    {sec.citations && sec.citations.length > 0 && (
                      <div className="pt-3 mt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                        {sec.citations.map((cite, ci) => (
                          <button
                            key={ci}
                            onClick={() => handleSeek(cite.timestamp, true)}
                            className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
                            title={`Jump to audio at ${formatTime(cite.timestamp)}`}
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
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Key Decisions Agreed Upon
                </h3>
              </div>
              <ul className="space-y-2.5">
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
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  Manage All ({openActionCount} open) →
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
                          onClick={() => handleSeek(act.timestamp, true)}
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
        {/* TAB 2: TRANSCRIPT (With Hover Highlights & Visual States)  */}
        {/* ========================================================= */}
        {activeTab === "transcript" && (
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Search Filter Header */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-10 shadow-lg shadow-black/20">
              <div className="flex-1 max-w-md">
                <Input
                  icon={<Search className="h-3.5 w-3.5 text-slate-500" />}
                  placeholder="Filter transcript by keyword or speaker..."
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  className="py-1.5 text-xs"
                />
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="hidden sm:inline">
                  Hover turn to highlight ⭐
                </span>
                <span className="font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800">
                  {filteredTranscript.length} turns
                </span>
              </div>
            </div>

            {/* Transcript Stream */}
            <div ref={transcriptContainerRef} className="space-y-3 pb-12">
              {filteredTranscript.map((seg) => {
                const isActive =
                  currentTime >= seg.startTime && currentTime <= seg.endTime;
                const isHighlighted = Boolean(
                  seg.highlightId ||
                    meeting.highlights.some(
                      (h) =>
                        h.segmentId === seg.id ||
                        h.id === seg.highlightId ||
                        (Math.abs(h.startTime - seg.startTime) < 0.5 &&
                          h.text === seg.text)
                    )
                );

                return (
                  <div
                    key={seg.id}
                    ref={isActive ? activeSegmentRef : null}
                    onClick={() => handleSeek(seg.startTime)}
                    className={`relative p-4 rounded-xl cursor-pointer transition-all duration-200 border group ${
                      isHighlighted
                        ? "border-l-4 border-l-amber-400 bg-amber-500/[0.04] border-slate-800 hover:border-amber-400/50"
                        : isActive
                        ? "bg-indigo-600/15 border-indigo-500/50 shadow-md shadow-indigo-600/10"
                        : "bg-slate-900/50 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700"
                    }`}
                  >
                    {/* Floating Hover Action Bar */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-slate-900/95 backdrop-blur-md border border-slate-750 p-1 rounded-lg shadow-xl z-10"
                    >
                      {/* Highlight Toggle Button */}
                      <button
                        onClick={() => handleToggleSegmentHighlight(seg)}
                        className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                          isHighlighted
                            ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                            : "text-slate-300 hover:text-amber-300 hover:bg-slate-800"
                        }`}
                        title={isHighlighted ? "Remove highlight" : "Highlight this segment"}
                      >
                        <Star
                          className={`h-3.5 w-3.5 ${
                            isHighlighted ? "fill-amber-400 text-amber-400" : ""
                          }`}
                        />
                        <span>{isHighlighted ? "Highlighted" : "Highlight"}</span>
                      </button>

                      {/* Copy Quote Button */}
                      <button
                        onClick={() => handleCopyQuote(seg)}
                        className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                        title="Copy quote and timestamp"
                      >
                        {copiedQuoteId === seg.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>

                      {/* Share Clip Button */}
                      <button
                        onClick={() => handleOpenClipModal(seg.startTime, seg.endTime)}
                        className="p-1 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded transition-colors"
                        title="Share clip of this turn"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Segment Header */}
                    <div className="flex items-center justify-between gap-2 mb-2 pr-28 group-hover:pr-36 transition-all">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          name={seg.speakerName}
                          src={seg.speakerAvatar}
                          size="sm"
                          className={
                            isActive
                              ? "ring-2 ring-indigo-400"
                              : isHighlighted
                              ? "ring-2 ring-amber-400/50"
                              : ""
                          }
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
                        {isHighlighted && (
                          <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center gap-1">
                            <Star className="h-2.5 w-2.5 fill-amber-400" />
                            <span>Saved</span>
                          </span>
                        )}
                        <span
                          className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                            isActive
                              ? "bg-indigo-500 text-white font-bold"
                              : isHighlighted
                              ? "bg-amber-400/20 text-amber-300 font-semibold"
                              : "bg-slate-800 text-indigo-300"
                          }`}
                        >
                          {formatTime(seg.startTime)}
                        </span>
                      </div>
                    </div>

                    {/* Segment Body */}
                    <p
                      className={`text-xs leading-relaxed pl-10 ${
                        isHighlighted
                          ? "text-slate-100 font-medium"
                          : isActive
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
        {/* TAB 3: HIGHLIGHTS SECTION                                 */}
        {/* ========================================================= */}
        {activeTab === "highlights" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>Meeting Highlight Moments ({meeting.highlights.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any highlight to jump immediately to that exact timestamp in playback.
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveTab("transcript")}
                className="text-xs self-start sm:self-auto"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                <span>Highlight More from Transcript</span>
              </Button>
            </div>

            {meeting.highlights.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
                <Star className="h-8 w-8 text-slate-600 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-300">
                  No highlights saved yet
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Go to the Transcript tab, hover over any segment turn, and click{" "}
                  <strong className="text-slate-300">⭐ Highlight</strong> to bookmark important quotes.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab("transcript")}
                  className="text-xs"
                >
                  Go to Transcript
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meeting.highlights.map((hl) => (
                  <div
                    key={hl.id}
                    onClick={() => handleSeek(hl.startTime, true)}
                    className="p-5 rounded-xl glass-card border-slate-800 hover:border-amber-400/50 cursor-pointer transition-all space-y-3 group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-mono font-bold text-amber-300">
                          {formatTime(hl.startTime)}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 ml-1">
                          {hl.label}
                        </span>
                      </div>

                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `"${hl.text}" (${formatTime(hl.startTime)})`
                            );
                            showToast("Highlight quote copied");
                          }}
                          className="p-1 text-slate-400 hover:text-slate-200 rounded"
                          title="Copy quote"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            deleteHighlight(meeting.id, hl.id);
                            showToast("Highlight removed");
                          }}
                          className="p-1 text-slate-400 hover:text-rose-400 rounded"
                          title="Remove highlight"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 group-hover:text-white leading-relaxed font-medium italic">
                      &ldquo;{hl.text}&rdquo;
                    </p>

                    <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px] text-amber-400 font-semibold">
                      <span>⭐ Jump to {formatTime(hl.startTime)}</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: ACTION ITEMS                                       */}
        {/* ========================================================= */}
        {activeTab === "actions" && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Action Item Creation Form */}
            <form
              onSubmit={handleAddAction}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5 shadow-lg shadow-black/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <CheckSquare className="h-4 w-4 text-indigo-400" />
                  <span>Create Action Item / Task</span>
                </span>
                <span className="text-[11px] font-mono text-indigo-400">
                  Source pinned to: {formatTime(currentTime)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Describe task commitment (e.g., Deliver security review by Friday)..."
                    value={newActionText}
                    onChange={(e) => setNewActionText(e.target.value)}
                    className="py-2 text-xs"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {/* Assignee Dropdown */}
                  <select
                    value={newActionAssigneeId}
                    onChange={(e) => setNewActionAssigneeId(e.target.value)}
                    className="bg-slate-950 text-xs font-medium text-slate-200 border border-slate-800 rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="none">Assignee: None</option>
                    {meeting.speakers.map((spk) => (
                      <option key={spk.id} value={spk.id}>
                        {spk.name}
                      </option>
                    ))}
                  </select>

                  {/* Due Date Presets */}
                  <select
                    value={newActionDueDate}
                    onChange={(e) => setNewActionDueDate(e.target.value)}
                    className="bg-slate-950 text-xs font-medium text-slate-200 border border-slate-800 rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Today">Due: Today</option>
                    <option value="Tomorrow">Due: Tomorrow</option>
                    <option value="This Week">Due: This Week</option>
                    <option value="Next Monday">Due: Next Monday</option>
                    <option value="In 2 Weeks">Due: In 2 Weeks</option>
                  </select>

                  {/* Priority */}
                  <select
                    value={newActionPriority}
                    onChange={(e) => setNewActionPriority(e.target.value as any)}
                    className="bg-slate-950 text-xs font-medium text-slate-200 border border-slate-800 rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Med Priority</option>
                    <option value="low">Low Priority</option>
                  </select>

                  <Button type="submit" variant="primary" size="sm" className="text-xs whitespace-nowrap">
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    <span>Add Task</span>
                  </Button>
                </div>
              </div>
            </form>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <button
                  onClick={() => setActionFilterStatus("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    actionFilterStatus === "all"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  All ({meeting.actionItems.length})
                </button>
                <button
                  onClick={() => setActionFilterStatus("open")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    actionFilterStatus === "open"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  Open ({openActionCount})
                </button>
                <button
                  onClick={() => setActionFilterStatus("completed")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    actionFilterStatus === "completed"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  Completed ({completedActionCount})
                </button>
              </div>

              {/* Filter by Assignee */}
              <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                <span className="text-slate-500">Filter Assignee:</span>
                <select
                  value={actionFilterAssignee}
                  onChange={(e) => setActionFilterAssignee(e.target.value)}
                  className="bg-slate-950 text-xs font-semibold text-slate-300 border border-slate-800 rounded-lg px-2.5 py-1 focus:outline-none"
                >
                  <option value="all">All Assignees</option>
                  {meeting.speakers.map((spk) => (
                    <option key={spk.id} value={spk.name}>
                      {spk.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* List */}
            {filteredActionItems.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                <CheckCircle2 className="h-8 w-8 text-slate-600 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-300">
                  No action items match this filter
                </h4>
                <p className="text-xs text-slate-500">
                  Try switching filters or add a new action item using the form above.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredActionItems.map((act) => (
                  <div
                    key={act.id}
                    className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex items-start gap-3.5 group"
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

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-850 flex-wrap gap-2">
                        <button
                          onClick={() => handleSeek(act.timestamp, true)}
                          className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-semibold"
                        >
                          <Clock className="h-3.5 w-3.5" />
                          <span>Verbal source: {formatTime(act.timestamp)}</span>
                        </button>

                        <div className="flex items-center gap-3">
                          {act.priority && (
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                act.priority === "high"
                                  ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                  : act.priority === "medium"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                  : "bg-slate-800 text-slate-400 border-slate-700"
                              }`}
                            >
                              {act.priority}
                            </span>
                          )}

                          {act.assignee && (
                            <div className="flex items-center gap-1.5">
                              <Avatar
                                name={act.assignee.name}
                                src={act.assignee.avatar}
                                size="xs"
                              />
                              <span className="text-xs text-slate-300 font-medium">
                                {act.assignee.name}
                              </span>
                            </div>
                          )}

                          {act.dueDate && (
                            <span className="text-xs text-slate-400 font-mono">
                              Due {act.dueDate}
                            </span>
                          )}

                          <button
                            onClick={() => {
                              deleteActionItem(meeting.id, act.id);
                              showToast("Action item deleted");
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete task"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: ASK FATHOM (AI Q&A Grounded in Transcript)         */}
        {/* ========================================================= */}
        {activeTab === "chat" && (
          <div className="max-w-4xl mx-auto space-y-5 flex flex-col min-h-[600px]">
            {/* Header & Prompt Suggestions */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>Ask Fathom AI Assistant</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {meeting.speakers.length} speakers
                  </span>
                  <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {meeting.transcript.length} transcript turns
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Ask any question about this call. Answers are synthesized directly from speaker transcripts with clickable timestamps.
              </p>

              {/* Suggested Questions */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {[
                  "What were the main concerns?",
                  "What decisions were made?",
                  `What did ${meeting.speakers[0]?.name || "Sarah"} agree to do?`,
                  "What were the customer's objections?",
                  "What are the next steps?",
                ].map((promptText) => (
                  <button
                    key={promptText}
                    onClick={() => handleSendAiQuestion(promptText)}
                    className="text-xs px-3 py-1 rounded-full bg-slate-950/80 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3 text-indigo-400" />
                    <span>{promptText}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Thread Messages */}
            <div className="space-y-4 flex-1 overflow-y-auto pr-1 min-h-[360px]">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 text-xs leading-relaxed ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="h-7 w-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="h-4 w-4 text-indigo-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-2xl p-4 rounded-2xl space-y-2.5 ${
                      msg.role === "user"
                        ? "bg-indigo-600/25 border border-indigo-500/40 text-slate-100 rounded-tr-sm"
                        : "bg-slate-900/80 border border-slate-800 text-slate-200 rounded-tl-sm shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[10px] text-slate-400 border-b border-slate-800/80 pb-1.5 mb-1.5">
                      <span className="font-semibold text-slate-300">
                        {msg.role === "user" ? "You" : "Fathom AI"}
                      </span>
                      <span className="font-mono">{msg.timestamp}</span>
                    </div>

                    <div className="whitespace-pre-wrap font-sans text-xs space-y-2">
                      {msg.text}
                    </div>

                    {/* Grounded Source Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="pt-3 mt-2 border-t border-slate-800/80 space-y-1.5">
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                          <Clock className="h-3 w-3" />
                          <span>Grounded Transcript Sources:</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.citations.map((cite, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                handleSeek(cite.timestamp, true);
                                showToast(`⭐ Jumped to ${formatTime(cite.timestamp)}`);
                              }}
                              className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-400/20 hover:border-amber-400/50 transition-all text-left group flex items-start gap-2"
                              title={`Jump to ${formatTime(cite.timestamp)} in audio player`}
                            >
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono font-bold text-amber-300 text-[11px]">
                                    {formatTime(cite.timestamp)}
                                  </span>
                                  {cite.speakerName && (
                                    <span className="text-[10px] text-slate-400">
                                      {cite.speakerName}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-300 group-hover:text-white truncate mt-0.5">
                                  &ldquo;{cite.quote}&rdquo;
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="h-7 w-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-slate-200">
                      U
                    </div>
                  )}
                </div>
              ))}

              {isChatThinking && (
                <div className="flex gap-3 text-xs leading-relaxed justify-start">
                  <div className="h-7 w-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="h-4 w-4 text-indigo-400 animate-spin" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 text-indigo-300 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-pulse text-indigo-400" />
                    <span>Searching transcript dialogue & grounding citations...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendAiQuestion();
              }}
              className="p-3 rounded-2xl bg-slate-900/95 border border-slate-800 flex items-center gap-2 sticky bottom-0 z-10 shadow-xl"
            >
              <Input
                placeholder="Ask about concerns, decisions, speaker agreements, or next steps..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="py-2 text-xs flex-1"
                disabled={isChatThinking}
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="text-xs shrink-0"
                disabled={isChatThinking || !chatInput.trim()}
              >
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                <span>Ask AI</span>
              </Button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: SPLIT VIEW (Transcript + Notes Side-by-Side)       */}
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
                  const isHighlighted = Boolean(
                    seg.highlightId ||
                      meeting.highlights.some(
                        (h) =>
                          h.segmentId === seg.id ||
                          h.id === seg.highlightId ||
                          (Math.abs(h.startTime - seg.startTime) < 0.5 &&
                            h.text === seg.text)
                      )
                  );

                  return (
                    <div
                      key={seg.id}
                      onClick={() => handleSeek(seg.startTime, true)}
                      className={`p-3 rounded-xl cursor-pointer border text-xs transition-all relative group ${
                        isHighlighted
                          ? "border-l-4 border-l-amber-400 bg-amber-500/[0.04] border-slate-800"
                          : isActive
                          ? "bg-indigo-600/20 border-indigo-500/50 text-white font-medium"
                          : "bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-900/80"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-200">
                          {seg.speakerName}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {isHighlighted && (
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          )}
                          <span className="text-[10px] font-mono text-indigo-400">
                            {formatTime(seg.startTime)}
                          </span>
                        </div>
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
                  <span>Executive Notes • {meeting.summary.templateName}</span>
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

