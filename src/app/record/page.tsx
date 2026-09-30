"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { useMeetingsStore } from "@/lib/store";
import { formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Meeting, TranscriptSegment } from "@/lib/types";

const SIMULATED_STREAM_SCRIPT = [
  {
    speakerId: "spk-sim-1",
    speakerName: "Liam Johnson",
    speakerRole: "Chief Technology Officer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    text: "Thanks everyone for hopping on our emergency sync. We need to finalize our AI evaluation benchmark before tonight's code freeze.",
  },
  {
    speakerId: "spk-sim-2",
    speakerName: "Chloe Zhao",
    speakerRole: "Staff AI Engineer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    text: "I ran the test suite across our 6 mock customer datasets. The transcript synchronization and citation jumps passed with 100% precision.",
  },
  {
    speakerId: "spk-sim-3",
    speakerName: "Daniel Perez",
    speakerRole: "Product Lead",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    text: "Awesome. I also tested the MEDDIC template and the action item extraction. It detected all 4 follow-up tasks without any hallucination.",
  },
  {
    speakerId: "spk-sim-1",
    speakerName: "Liam Johnson",
    speakerRole: "Chief Technology Officer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    text: "Great. Let's make sure we have Chloe assigned to monitor deployment metrics, and Daniel to review the evaluator documentation.",
  },
  {
    speakerId: "spk-sim-2",
    speakerName: "Chloe Zhao",
    speakerRole: "Staff AI Engineer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    text: "Consider it done. I'll push the final container image right after this call.",
  },
];

export default function RecordPage() {
  const router = useRouter();
  const { addMeeting } = useMeetingsStore();

  const [isRecording, setIsRecording] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [streamedSegments, setStreamedSegments] = useState<TranscriptSegment[]>([]);
  const [detectedActions, setDetectedActions] = useState<string[]>([]);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Streaming speech simulator (pushes a new line every 4 seconds)
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < SIMULATED_STREAM_SCRIPT.length) {
          const item = SIMULATED_STREAM_SCRIPT[prev];
          const newSeg: TranscriptSegment = {
            id: `sim-tr-${Date.now()}`,
            speakerId: item.speakerId,
            speakerName: item.speakerName,
            speakerRole: item.speakerRole,
            speakerAvatar: item.avatar,
            startTime: prev * 8,
            endTime: (prev + 1) * 8,
            text: item.text,
          };
          setStreamedSegments((current) => [...current, newSeg]);

          if (prev === 2) {
            setDetectedActions((a) => [
              ...a,
              "Chloe Zhao: Monitor deployment metrics after release",
            ]);
          }
          if (prev === 3) {
            setDetectedActions((a) => [
              ...a,
              "Daniel Perez: Review evaluator documentation and seed datasets",
            ]);
          }

          return prev + 1;
        }
        return prev;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [isRecording]);

  // Auto-scroll streamed transcript
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [streamedSegments]);

  // Finish meeting & generate AI summary
  const handleEndMeeting = () => {
    setIsRecording(false);
    setIsGeneratingSummary(true);

    const newMeetingId = `meet-live-${Date.now()}`;
    const newMeeting: Meeting = {
      id: newMeetingId,
      title: "Live Standup & Release Readiness Sync",
      description: "Live captured meeting evaluating synchronization precision and benchmark SLAs.",
      date: new Date().toISOString(),
      duration: Math.max(elapsedSeconds, 45),
      category: "engineering",
      platform: "google_meet",
      tags: ["Live Capture", "Release", "AI Benchmark"],
      isFavorite: true,
      createdAt: new Date().toISOString(),
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
      transcript:
        streamedSegments.length > 0
          ? streamedSegments
          : SIMULATED_STREAM_SCRIPT.map((s, i) => ({
              id: `sim-tr-${i}`,
              speakerId: s.speakerId,
              speakerName: s.speakerName,
              speakerRole: s.speakerRole,
              speakerAvatar: s.avatar,
              startTime: i * 8,
              endTime: (i + 1) * 8,
              text: s.text,
            })),
      summary: {
        templateId: "eng_sprint",
        templateName: "Engineering Sprint",
        headline: "Team verified 100% precision on AI transcript sync and citation grounding prior to tonight's code freeze.",
        overview: "Emergency sync confirming that all 6 evaluation benchmarks passed. Chloe confirmed zero latency regression, and Daniel verified MEDDIC template support.",
        sections: [
          {
            id: "sec-live-1",
            title: "Release Verification Status",
            bullets: [
              "Transcript synchronization and citation jumps passed 100% of benchmark tests.",
              "MEDDIC and Engineering templates successfully generated structured summaries.",
            ],
          },
        ],
        keyDecisions: ["Proceed with container image deployment tonight"],
        nextSteps: [
          "Chloe to monitor deployment metrics post-release",
          "Daniel to review evaluator documentation",
        ],
      },
      actionItems: [
        {
          id: "act-live-1",
          text: "Chloe Zhao: Monitor deployment metrics and P95 latency post-release",
          assignee: {
            name: "Chloe Zhao",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          },
          completed: false,
          timestamp: 16,
          priority: "high",
          dueDate: "Tonight",
        },
        {
          id: "act-live-2",
          text: "Daniel Perez: Review evaluator documentation and seed datasets",
          assignee: {
            name: "Daniel Perez",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          },
          completed: false,
          timestamp: 24,
          priority: "medium",
          dueDate: "Tomorrow",
        },
      ],
      highlights: [
        {
          id: "hl-live-1",
          startTime: 8,
          endTime: 16,
          text: "Transcript synchronization and citation jumps passed with 100% precision.",
          color: "green",
          label: "Decision",
          createdByType: "ai",
        },
      ],
    };

    setTimeout(() => {
      addMeeting(newMeeting);
      router.push(`/meetings/${newMeetingId}`);
    }, 1200);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">
                Live Speech Capture Studio
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping" />
                Recording Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Fathom Notetaker Bot connected to Google Meet / Zoom audio stream
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-sm text-slate-200 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Clock className="h-4 w-4 text-indigo-400" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <Button
            variant="danger"
            size="md"
            onClick={handleEndMeeting}
            isLoading={isGeneratingSummary}
            className="text-xs"
          >
            <Square className="h-3.5 w-3.5 fill-current mr-1.5" />
            {isGeneratingSummary ? "Generating AI Notes..." : "End & Summarize"}
          </Button>
        </div>
      </div>

      {/* Main Grid: Stream & Real-time Action Detector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real-Time Streaming Speech Transcript */}
        <div className="lg:col-span-2 rounded-2xl glass-panel border border-slate-800 flex flex-col h-[480px] overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-200">
                Live Speech-to-Text Stream
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1 bg-indigo-400 rounded-full animate-wave-1 h-3" />
              <div className="w-1 bg-indigo-500 rounded-full animate-wave-2 h-4" />
              <div className="w-1 bg-purple-400 rounded-full animate-wave-3 h-2" />
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/60"
          >
            {streamedSegments.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-xs">
                Connecting to audio channel... Waiting for speech input...
              </div>
            ) : (
              streamedSegments.map((seg, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <div className="flex items-center gap-2 mb-1">
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
                  <p className="text-xs text-slate-300 leading-relaxed">
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
              Fathom AI is continuously analyzing speech context in real-time to detect action items and key decisions.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-slate-300 uppercase">
                Detected Action Items ({detectedActions.length}):
              </span>

              {detectedActions.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">
                  Listening for verbal commitments...
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

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <Activity className="h-3.5 w-3.5 text-indigo-400" />
              <span>Capture Engine Status</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Audio sampling: 48kHz stereo • STT model: Whisper Large v3 • Streaming delay: ~240ms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
