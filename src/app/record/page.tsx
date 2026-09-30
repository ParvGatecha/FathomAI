"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Radio,
  Square,
  Sparkles,
  Users,
  Clock,
  CheckCircle2,
  Mic,
  Activity,
  Layers,
  Check,
  Play,
  ArrowRight,
  ChevronLeft,
  Video,
  UserPlus,
  Briefcase,
  Cpu,
  GraduationCap,
  HeartHandshake,
  Loader2,
  FileCheck,
} from "lucide-react";
import { useMeetingsStore } from "@/lib/store";
import { formatTime, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Meeting, TranscriptSegment, Speaker, ActionItem, Highlight, MeetingCategory, MeetingPlatform } from "@/lib/types";

// Preset Meeting Scenarios for the Simulation
interface MeetingScenario {
  title: string;
  category: MeetingCategory;
  meetingType: string;
  platform: MeetingPlatform;
  speakers: Speaker[];
  script: {
    speakerName: string;
    speakerRole: string;
    avatar: string;
    text: string;
  }[];
  headline: string;
  overview: string;
  keyDecisions: string[];
  nextSteps: string[];
  actionItems: {
    text: string;
    assigneeName: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
    timestamp: number;
  }[];
  highlights: {
    text: string;
    label: "Decision" | "Action" | "Question" | "Blocker" | "Praise" | "Key Point";
    timestamp: number;
  }[];
}

const PRESET_SCENARIOS: Record<string, MeetingScenario> = {
  engineering: {
    title: "Live Standup & Release Readiness Sync",
    category: "engineering",
    meetingType: "Architecture Sync",
    platform: "google_meet",
    speakers: [
      {
        id: "spk-sim-1",
        name: "Liam Johnson",
        role: "Chief Technology Officer",
        email: "liam.j@fathom.work",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "spk-sim-2",
        name: "Chloe Zhao",
        role: "Staff AI Engineer",
        email: "chloe.z@fathom.work",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "spk-sim-3",
        name: "Daniel Perez",
        role: "Product Lead",
        email: "daniel.p@fathom.work",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
    ],
    script: [
      {
        speakerName: "Liam Johnson",
        speakerRole: "Chief Technology Officer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        text: "Thanks everyone for hopping on our emergency sync. We need to finalize our AI evaluation benchmark before tonight's code freeze.",
      },
      {
        speakerName: "Chloe Zhao",
        speakerRole: "Staff AI Engineer",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        text: "I ran the test suite across our 6 mock customer datasets. The transcript synchronization and citation jumps passed with 100% precision.",
      },
      {
        speakerName: "Daniel Perez",
        speakerRole: "Product Lead",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        text: "Awesome. I also tested the MEDDIC template and the action item extraction. It detected all follow-up tasks without any hallucination.",
      },
      {
        speakerName: "Liam Johnson",
        speakerRole: "Chief Technology Officer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        text: "Great. Let's make sure we have Chloe assigned to monitor deployment metrics, and Daniel to review the evaluator documentation.",
      },
      {
        speakerName: "Chloe Zhao",
        speakerRole: "Staff AI Engineer",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        text: "Consider it done. I'll push the final container image right after this call.",
      },
    ],
    headline: "Team verified 100% precision on AI transcript sync and citation grounding prior to code freeze.",
    overview: "Emergency sync confirming all evaluation benchmarks passed. Chloe confirmed zero latency regressions with Redis chunk caching, and Daniel verified MEDDIC template support.",
    keyDecisions: [
      "Proceed with container deployment tonight at 8 PM UTC.",
      "Lock release freeze for core intelligence pipelines.",
    ],
    nextSteps: [
      "Chloe to monitor deployment metrics post-release.",
      "Daniel to review evaluator documentation and seed datasets.",
    ],
    actionItems: [
      {
        text: "Chloe Zhao: Monitor deployment metrics and P95 latency post-release",
        assigneeName: "Chloe Zhao",
        dueDate: "Tonight",
        priority: "high",
        timestamp: 16,
      },
      {
        text: "Daniel Perez: Review evaluator documentation and seed datasets",
        assigneeName: "Daniel Perez",
        dueDate: "Tomorrow",
        priority: "medium",
        timestamp: 24,
      },
    ],
    highlights: [
      {
        text: "Transcript synchronization and citation jumps passed with 100% precision.",
        label: "Decision",
        timestamp: 8,
      },
      {
        text: "I'll push the final container image right after this call.",
        label: "Action",
        timestamp: 32,
      },
    ],
  },
  sales: {
    title: "Client Discovery & Enterprise Demo: FinTech Global",
    category: "sales",
    meetingType: "MEDDIC Discovery",
    platform: "zoom",
    speakers: [
      {
        id: "spk-sim-1",
        name: "Alex Rivera",
        role: "Head of AI",
        email: "alex.r@fathom.work",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "spk-sim-4",
        name: "Mark Sterling",
        role: "VP Engineering, FinTech Global",
        email: "mark.s@fintechglobal.io",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      },
    ],
    script: [
      {
        speakerName: "Alex Rivera",
        speakerRole: "Head of AI",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        text: "Hi Mark, thanks for joining. Today I want to walk through how Fathom automates meeting knowledge capture and action item extraction.",
      },
      {
        speakerName: "Mark Sterling",
        speakerRole: "VP Engineering, FinTech Global",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        text: "Our biggest headache is lost context across 300 remote engineers. We need SOC2 compliance and zero LLM data retention.",
      },
      {
        speakerName: "Alex Rivera",
        speakerRole: "Head of AI",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        text: "We are SOC2 Type II certified with strict zero-retention DPA agreements. We can set up a 30-day pilot for your team by Monday.",
      },
      {
        speakerName: "Mark Sterling",
        speakerRole: "VP Engineering, FinTech Global",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        text: "That sounds excellent. Please send over the MSA and pilot agreement and we'll sign off by Friday.",
      },
    ],
    headline: "Commercial Discovery: Pre-approved 300-seat pilot with SOC2 compliance gate.",
    overview: "Commercial qualification sync with Mark Sterling. Confirmed $90k ARR budget envelope with 30-day pilot kickoff scheduled for Monday.",
    keyDecisions: [
      "Initiate 30-day pilot deployment for 300 engineers starting Monday.",
      "Send SOC2 Type II audit whitepaper and standard enterprise MSA.",
    ],
    nextSteps: [
      "Alex to provide pilot license keys and legal agreement by end of day.",
      "Mark to invite engineering managers to the onboarding session.",
    ],
    actionItems: [
      {
        text: "Send pilot agreement and SOC2 compliance packet to Mark Sterling",
        assigneeName: "Alex Rivera",
        dueDate: "Today",
        priority: "high",
        timestamp: 16,
      },
    ],
    highlights: [
      {
        text: "We are SOC2 Type II certified with strict zero-retention DPA agreements.",
        label: "Decision",
        timestamp: 16,
      },
    ],
  },
};

const PROCESSING_STEPS = [
  "Uploading recording",
  "Transcribing",
  "Identifying speakers",
  "Generating summary",
  "Extracting action items",
  "Detecting highlights",
];

export default function RecordPage() {
  const router = useRouter();
  const { addMeeting } = useMeetingsStore();

  // Capture Flow Stages: 'setup' | 'recording' | 'processing' | 'ready'
  const [stage, setStage] = useState<"setup" | "recording" | "processing" | "ready">("setup");

  // Setup State
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>("engineering");
  const [customTitle, setCustomTitle] = useState("");
  const [customType, setCustomType] = useState("Sprint Planning");

  // Recording State
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [streamedSegments, setStreamedSegments] = useState<TranscriptSegment[]>([]);
  const [detectedActions, setDetectedActions] = useState<string[]>([]);

  // Processing State
  const [activeProcessingIndex, setActiveProcessingIndex] = useState(0);
  const [createdMeetingId, setCreatedMeetingId] = useState<string>("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const scenario = PRESET_SCENARIOS[selectedScenarioKey] || PRESET_SCENARIOS.engineering;

  // Initialize title
  useEffect(() => {
    if (!customTitle) {
      setCustomTitle(scenario.title);
      setCustomType(scenario.meetingType);
    }
  }, [scenario, customTitle]);

  // Stage 2: Timer Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stage === "recording") {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [stage]);

  // Stage 2: Progressive Speech Dialogue Streamer
  useEffect(() => {
    if (stage !== "recording") return;

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < scenario.script.length) {
          const item = scenario.script[prev];
          const newSeg: TranscriptSegment = {
            id: `sim-tr-${Date.now()}-${prev}`,
            speakerId: `spk-sim-${prev + 1}`,
            speakerName: item.speakerName,
            speakerRole: item.speakerRole,
            speakerAvatar: item.avatar,
            startTime: prev * 8,
            endTime: (prev + 1) * 8,
            text: item.text,
          };
          setStreamedSegments((current) => [...current, newSeg]);

          if (prev === 1 && scenario.actionItems[0]) {
            setDetectedActions((a) => [...a, scenario.actionItems[0].text]);
          }
          if (prev === 2 && scenario.actionItems[1]) {
            setDetectedActions((a) => [...a, scenario.actionItems[1].text]);
          }

          return prev + 1;
        }
        return prev;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [stage, scenario]);

  // Auto-scroll streamed transcript
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [streamedSegments]);

  // Handle Start Recording
  const handleStartRecording = () => {
    setStreamedSegments([]);
    setDetectedActions([]);
    setElapsedSeconds(0);
    setCurrentStepIndex(0);
    setStage("recording");
  };

  // Handle End Meeting -> Start Processing Sequence
  const handleEndMeeting = async () => {
    setStage("processing");
    setActiveProcessingIndex(0);

    const newMeetingId = `meet-live-${Date.now()}`;
    setCreatedMeetingId(newMeetingId);

    const transcriptSegments =
      streamedSegments.length > 0
        ? streamedSegments
        : scenario.script.map((s, idx) => ({
            id: `tr-gen-${idx}`,
            speakerId: `spk-${idx}`,
            speakerName: s.speakerName,
            speakerRole: s.speakerRole,
            speakerAvatar: s.avatar,
            startTime: idx * 8,
            endTime: (idx + 1) * 8,
            text: s.text,
          }));

    const durationSec = Math.max(elapsedSeconds, transcriptSegments.length * 8, 45);

    // Progressive Processing Steps Animation (350ms per step)
    let step = 0;
    const procInterval = setInterval(async () => {
      step += 1;
      if (step < PROCESSING_STEPS.length) {
        setActiveProcessingIndex(step);
      } else {
        clearInterval(procInterval);

        // Attempt OpenAI AI summary extraction
        let generatedOverview = scenario.overview;
        let generatedDecisions = scenario.keyDecisions;
        let generatedActions = scenario.actionItems;
        let generatedHighlights = scenario.highlights;

        try {
          const res = await fetch(`/api/meetings/${newMeetingId}/summarize`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              templateId: scenario.category === "sales" ? "sales_meddic" : "eng_sprint",
              title: customTitle || scenario.title,
              category: scenario.category,
              transcript: transcriptSegments,
              speakers: scenario.speakers,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.overview) generatedOverview = data.overview;
            if (data.decisions?.length) generatedDecisions = data.decisions;
            if (data.highlights?.length) {
              generatedHighlights = data.highlights.map((h: any) => ({
                text: h.reason || h.quote || "Key takeaway",
                label: "Key Point" as const,
                timestamp: h.timestamp || 0,
              }));
            }
            if (data.actionItems?.length) {
              generatedActions = data.actionItems.map((a: any, i: number) => ({
                text: a.task,
                assigneeName: a.assignee || scenario.speakers[0]?.name || "Alex Rivera",
                dueDate: a.dueDate || "Next Sprint",
                priority: "high" as const,
                timestamp: i * 8,
              }));
            }
          }
        } catch {
          // Fall back gracefully to scenario seeded values
        }

        // Build and save final Meeting object to store
        const finalMeeting: Meeting = {
          id: newMeetingId,
          title: customTitle || scenario.title,
          description: `Live recorded ${customType || scenario.meetingType} with ${scenario.speakers.length} participants.`,
          date: new Date().toISOString(),
          duration: durationSec,
          category: scenario.category,
          meetingType: customType || scenario.meetingType,
          platform: scenario.platform,
          tags: ["Live Capture", customType || scenario.meetingType, "Simulated Bot"],
          isFavorite: true,
          createdAt: new Date().toISOString(),
          speakers: scenario.speakers,
          transcript: transcriptSegments,
          summary: {
            templateId: scenario.category === "sales" ? "sales_meddic" : "eng_sprint",
            templateName: scenario.category === "sales" ? "Sales Call (MEDDIC)" : "Engineering Sprint",
            headline: scenario.headline,
            overview: generatedOverview,
            sections: [
              {
                id: "sec-1",
                title: "Core Discussion Takeaways",
                bullets: [
                  "All team members aligned on deliverables with verifiable benchmarks.",
                  "Zero regressions detected across testing and compliance audits.",
                ],
                citations: [{ timestamp: 0, quote: scenario.script[0]?.text || "" }],
              },
            ],
            keyDecisions: generatedDecisions,
            nextSteps: scenario.nextSteps,
          },
          actionItems: generatedActions.map((act, i) => ({
            id: `act-live-${i}-${Date.now()}`,
            text: act.text,
            assignee: {
              name: act.assigneeName,
              avatar: scenario.speakers.find((s) => s.name === act.assigneeName)?.avatar || "",
            },
            completed: false,
            timestamp: act.timestamp,
            priority: act.priority,
            dueDate: act.dueDate,
          })),
          highlights: generatedHighlights.map((hl, i) => ({
            id: `hl-live-${i}-${Date.now()}`,
            startTime: hl.timestamp,
            endTime: hl.timestamp + 8,
            text: hl.text,
            color: "yellow",
            label: hl.label,
            createdByType: "ai",
            createdAt: new Date().toISOString(),
          })),
        };

        addMeeting(finalMeeting);
        setStage("ready");
      }
    }, 360);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      {/* Header Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
          Simulated Meeting Capture Studio
        </span>
      </div>

      {/* ========================================================= */}
      {/* STAGE 1: RECORDING SETUP                                  */}
      {/* ========================================================= */}
      {stage === "setup" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Step 1 of 4 • Setup
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Start a Simulated Meeting Recording
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Configure your meeting details. Fathom will simulate real-time bot audio capture, live speaker transcription, and instant post-meeting AI intelligence.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-5 shadow-xl">
            {/* Choose Scenario Preset */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Simulation Scenario:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedScenarioKey("engineering");
                    setCustomTitle(PRESET_SCENARIOS.engineering.title);
                    setCustomType(PRESET_SCENARIOS.engineering.meetingType);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    selectedScenarioKey === "engineering"
                      ? "bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-600/10"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <Cpu className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Engineering Standup & Release Sync
                    </span>
                    <span className="text-[11px] text-slate-400">
                      3 speakers • P95 latency benchmarks • Code freeze decisions
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedScenarioKey("sales");
                    setCustomTitle(PRESET_SCENARIOS.sales.title);
                    setCustomType(PRESET_SCENARIOS.sales.meetingType);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    selectedScenarioKey === "sales"
                      ? "bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-600/10"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <Briefcase className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Client Discovery & Enterprise Demo
                    </span>
                    <span className="text-[11px] text-slate-400">
                      2 speakers • MEDDIC qualification • 300 seats pilot approval
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Meeting Title Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Meeting Title:
              </label>
              <Input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Q4 Strategy Sync..."
                className="py-2.5 text-xs"
              />
            </div>

            {/* Meeting Type & Platform */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Meeting Type:
                </label>
                <select
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  className="w-full bg-slate-950 text-xs font-semibold text-slate-200 border border-slate-800 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Architecture Sync">Architecture Sync</option>
                  <option value="MEDDIC Discovery">MEDDIC Discovery</option>
                  <option value="Product Strategy">Product Strategy</option>
                  <option value="Sprint Planning">Sprint Planning</option>
                  <option value="1-on-1 Sync">1-on-1 Sync</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Meeting Platform:
                </label>
                <div className="flex items-center gap-2 h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  <Video className="h-4 w-4 text-indigo-400" />
                  <span>Google Meet & Zoom Audio Bridge</span>
                </div>
              </div>
            </div>

            {/* Participants Preview */}
            <div className="space-y-2 pt-2 border-t border-slate-805">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Simulated Participants ({scenario.speakers.length}):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {scenario.speakers.map((spk) => (
                  <div
                    key={spk.id}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2.5"
                  >
                    <Avatar name={spk.name} src={spk.avatar} size="sm" />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        {spk.name}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate block">
                        {spk.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Audio will stream into live speech recognizer.
              </span>
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartRecording}
                className="text-xs px-6 shadow-lg shadow-indigo-600/25"
              >
                <Radio className="h-4 w-4 mr-2 text-rose-300 animate-pulse" />
                <span>Start Recording</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 2: RECORDING STATE                                  */}
      {/* ========================================================= */}
      {stage === "recording" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Recording Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/40 to-slate-900 border border-rose-500/40 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
                <Radio className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-white">
                    {customTitle || scenario.title}
                  </h2>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-400 animate-ping" />
                    <span>Live Recording Active</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fathom AI Bot connected • Streaming multi-speaker audio
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-slate-200 bg-slate-950/90 px-3.5 py-1.5 rounded-xl border border-slate-800">
                <Clock className="h-4 w-4 text-indigo-400" />
                <span>{formatTime(elapsedSeconds)}</span>
              </div>

              <Button
                variant="danger"
                size="md"
                onClick={handleEndMeeting}
                className="text-xs shadow-md shadow-rose-950/40"
              >
                <Square className="h-3.5 w-3.5 fill-current mr-1.5" />
                <span>End Meeting</span>
              </Button>
            </div>
          </div>

          {/* Participant List with Speaking Pulse */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-300">
                Active Participants ({scenario.speakers.length}):
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {scenario.speakers.map((spk, idx) => (
                <div key={spk.id} className="flex items-center gap-2">
                  <Avatar
                    name={spk.name}
                    src={spk.avatar}
                    size="xs"
                    className="ring-2 ring-emerald-500/60"
                  />
                  <span className="text-xs font-medium text-slate-200">
                    {spk.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Grid: Live Speech Stream + Real-Time Extraction */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Live Speech-to-Text Stream */}
            <div className="lg:col-span-2 rounded-2xl glass-panel border border-slate-800 flex flex-col h-[460px] overflow-hidden shadow-lg">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white">
                    Live Transcript Simulation
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 bg-emerald-400 rounded-full animate-wave-1 h-3" />
                  <div className="w-1 bg-emerald-400 rounded-full animate-wave-2 h-4" />
                  <div className="w-1 bg-emerald-400 rounded-full animate-wave-3 h-2" />
                </div>
              </div>

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/60"
              >
                {streamedSegments.length === 0 ? (
                  <div className="py-20 text-center text-slate-500 text-xs">
                    Connecting audio stream... Listening for speech...
                  </div>
                ) : (
                  streamedSegments.map((seg, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={seg.speakerName}
                          src={seg.speakerAvatar}
                          size="xs"
                        />
                        <span className="text-xs font-bold text-slate-200">
                          {seg.speakerName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          • {seg.speakerRole}
                        </span>
                        <span className="text-[10px] font-mono text-indigo-400 ml-auto">
                          {formatTime(seg.startTime)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pl-7">
                        {seg.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right 1 Col: Real-Time AI Detection Preview */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span>Real-Time AI Extraction</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Analyzing speaker dialogue in real time to capture decisions and commitments.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-300 uppercase">
                    Detected Action Items ({detectedActions.length}):
                  </span>

                  {detectedActions.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">
                      Listening for commitments...
                    </p>
                  ) : (
                    detectedActions.map((action, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2 animate-in zoom-in-95"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 3: PROCESSING SEQUENCE                              */}
      {/* ========================================================= */}
      {stage === "processing" && (
        <div className="p-8 rounded-2xl glass-panel border border-indigo-500/30 space-y-6 max-w-lg mx-auto text-center animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center mx-auto">
            <Sparkles className="h-6 w-6 animate-spin text-indigo-400" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">
              Processing Meeting Intelligence
            </h2>
            <p className="text-xs text-slate-400">
              Running transcription alignment, summarization, and action extraction...
            </p>
          </div>

          {/* Sequential Processing Checklist */}
          <div className="space-y-2.5 text-left p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            {PROCESSING_STEPS.map((stepName, idx) => {
              const isDone = idx < activeProcessingIndex;
              const isCurrent = idx === activeProcessingIndex;
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between text-xs py-1 transition-all ${
                    isDone
                      ? "text-emerald-400 font-semibold"
                      : isCurrent
                      ? "text-indigo-300 font-bold"
                      : "text-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-400 shrink-0" />
                    ) : (
                      <span className="h-4 w-4 rounded-full border border-slate-700 inline-block shrink-0" />
                    )}
                    <span>{stepName}</span>
                  </div>
                  {isDone && (
                    <span className="text-[10px] font-mono text-emerald-500">
                      Done
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 4: MEETING READY                                    */}
      {/* ========================================================= */}
      {stage === "ready" && (
        <div className="p-8 rounded-2xl glass-panel border border-emerald-500/40 space-y-6 max-w-lg mx-auto text-center animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-7 w-7 text-emerald-400" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ✓ Ready
            </span>
            <h2 className="text-xl font-bold text-white">
              Meeting Ready!
            </h2>
            <p className="text-xs text-slate-300">
              {customTitle || scenario.title}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Executive Headline:</span>
              <span className="font-mono text-emerald-400">100% complete</span>
            </div>
            <p className="text-slate-200 font-medium leading-relaxed">
              {scenario.headline}
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push(`/meetings/${createdMeetingId}`)}
            className="w-full text-xs"
          >
            <span>Open Meeting Workspace</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

