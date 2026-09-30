"use client";

import React, { useState, useEffect, use, Suspense, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Share2,
  Check,
  Copy,
  Video,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Users,
  Calendar,
  Layers,
  Volume2,
  ExternalLink,
  MessageSquare,
  Flame,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useMeetingsStore } from "@/lib/store";
import { decodeClipToken, SEED_CLIPS, ResolvedClip } from "@/lib/clips";
import { formatTime, formatDate, getCategoryBadgeColor } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

function SharedClipContent({ token }: { token: string }) {
  const searchParams = useSearchParams();
  const startParam = searchParams.get("start") ? Number(searchParams.get("start")) : undefined;
  const endParam = searchParams.get("end") ? Number(searchParams.get("end")) : undefined;

  const { meetings } = useMeetingsStore();

  // Resolve clip using decode helper
  const [clip, setClip] = useState<ResolvedClip | null>(() => {
    return decodeClipToken(token, meetings, startParam, endParam);
  });

  useEffect(() => {
    const resolved = decodeClipToken(token, meetings, startParam, endParam);
    setClip(resolved);
  }, [token, meetings, startParam, endParam]);

  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(clip ? clip.startTime : 0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync initial currentTime when clip resolves
  useEffect(() => {
    if (clip) {
      setCurrentTime(clip.startTime);
    }
  }, [clip]);

  // Audio Playback Simulation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && clip) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= clip.endTime) {
            setIsPlaying(false);
            return clip.startTime;
          }
          return Math.min(prev + 0.25 * playbackSpeed, clip.endTime);
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, clip]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setToastMessage("Clip link copied to clipboard!");
      setTimeout(() => setCopied(false), 2400);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handleReplay = () => {
    if (!clip) return;
    setCurrentTime(clip.startTime);
    setIsPlaying(true);
  };

  // Invalid / Expired Token Fallback
  if (!clip) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl glass-panel border border-slate-800 space-y-6 shadow-2xl">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
            <Info className="h-6 w-6" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Clip Not Found</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              This shared clip link may be invalid, expired, or refers to a recording not present in this session.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80 text-left">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Try a Sample Verified Clip:
            </span>
            <div className="space-y-1.5">
              <Link
                href="/shared/clip-enterprise-sla"
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-indigo-300 font-medium flex items-center justify-between transition-colors group"
              >
                <span>Enterprise SLA & Dedicated Pods</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </Link>
              <Link
                href="/shared/clip-pricing-model"
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-indigo-300 font-medium flex items-center justify-between transition-colors group"
              >
                <span>Acme Corp 250-Seat Pricing Agreement</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </Link>
              <Link
                href="/shared/clip-latency-benchmark"
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-indigo-300 font-medium flex items-center justify-between transition-colors group"
              >
                <span>Sub-200ms Streaming Benchmark</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/dashboard">
              <Button variant="secondary" size="md" className="w-full text-xs">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Return to Workspace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { meeting, segments, startTime, endTime, title: clipTitle, notes } = clip;
  const catColor = getCategoryBadgeColor(meeting.category);
  const duration = Math.max(1, Math.round(endTime - startTime));
  const progressPercent = Math.max(0, Math.min(((currentTime - startTime) / duration) * 100, 100));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 selection:bg-indigo-500/30">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs font-semibold text-emerald-200 shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Top Public Header */}
        <header className="flex items-center justify-between py-2 border-b border-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-black text-sm tracking-tighter">F</span>
            </div>
            <div>
              <span className="font-bold text-sm text-white tracking-tight">Fathom</span>
              <span className="text-[11px] text-indigo-400 font-medium ml-2 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                Shared Clip
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyLink}
              className="text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1 text-slate-400" />
                  <span>Copy Clip Link</span>
                </>
              )}
            </Button>

            <Link href={`/meetings/${meeting.id}`}>
              <Button variant="primary" size="sm" className="text-xs hidden sm:flex">
                <span>Open Full Meeting</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </header>

        {/* Core Clip Card */}
        <div className="rounded-3xl glass-panel border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Meeting Context & Clip Title */}
          <div className="space-y-2 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${catColor.bg} ${catColor.text} ${catColor.border}`}
              >
                {meeting.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Calendar className="h-3 w-3 text-slate-500" />
                {formatDate(meeting.date)}
              </span>
              <span className="text-xs text-indigo-300 font-mono flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 font-bold">
                <Clock className="h-3 w-3" />
                {formatTime(startTime)} → {formatTime(endTime)} ({duration}s clip)
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {clipTitle}
            </h1>

            <p className="text-xs text-slate-400">
              Excerpt from: <strong className="text-slate-200">{meeting.title}</strong>
            </p>
          </div>

          {/* Participants in this Call */}
          <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Users className="h-4 w-4 text-indigo-400 shrink-0" />
              <span className="font-semibold text-slate-200">Call Participants:</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              {meeting.speakers.map((spk) => (
                <div
                  key={spk.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0"
                  title={`${spk.name} (${spk.role})`}
                >
                  <Avatar name={spk.name} src={spk.avatar} size="xs" />
                  <span className="text-xs text-slate-300 font-medium">
                    {spk.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulated Audio Player Box */}
          <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-indigo-500/30 p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Controls */}
              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-12 w-12 rounded-full p-0 flex items-center justify-center shadow-lg shadow-indigo-600/30"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 fill-current" />
                  ) : (
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  )}
                </Button>

                <button
                  onClick={handleReplay}
                  className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors"
                  title="Replay from clip start"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                <div className="font-mono text-sm font-bold text-indigo-300">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-slate-600 mx-1.5">/</span>
                  <span className="text-slate-400">{formatTime(endTime)}</span>
                </div>
              </div>

              {/* Animated Waveform Visualizer */}
              <div className="flex items-center gap-1.5 h-8 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isPlaying
                        ? `bg-indigo-400 animate-wave-${(i % 5) + 1}`
                        : "bg-slate-700 h-2"
                    }`}
                  />
                ))}
              </div>

              {/* Playback Speed Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
                {[1, 1.25, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                      playbackSpeed === spd
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Scrubbable Scrubber Bar */}
            <div className="space-y-1.5 pt-2">
              <input
                type="range"
                min={startTime}
                max={endTime}
                step={0.1}
                value={currentTime}
                onChange={(e) => {
                  setCurrentTime(Number(e.target.value));
                  if (!isPlaying) setIsPlaying(true);
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 px-0.5">
                <span>Start: {formatTime(startTime)}</span>
                <span>{Math.round(progressPercent)}% played</span>
                <span>End: {formatTime(endTime)}</span>
              </div>
            </div>
          </div>

          {/* Transcript Excerpt */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                <span>Transcript Excerpt ({segments.length} turns):</span>
              </h3>
              <span className="text-[11px] text-slate-500">
                Click any line to jump audio
              </span>
            </div>

            <div className="space-y-2.5">
              {segments.map((seg) => {
                const isActive =
                  currentTime >= seg.startTime && currentTime <= seg.endTime;
                return (
                  <div
                    key={seg.id}
                    onClick={() => {
                      setCurrentTime(seg.startTime);
                      setIsPlaying(true);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-indigo-600/15 border-indigo-500/50 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30"
                        : "bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-750"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={seg.speakerName}
                          src={seg.speakerAvatar}
                          size="xs"
                        />
                        <span className="text-xs font-bold text-slate-200">
                          {seg.speakerName}
                        </span>
                        {seg.speakerRole && (
                          <span className="text-[11px] text-slate-400">
                            • {seg.speakerRole}
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                          isActive
                            ? "bg-indigo-500 text-white font-bold"
                            : "bg-slate-800 text-indigo-300"
                        }`}
                      >
                        {formatTime(seg.startTime)}
                      </span>
                    </div>

                    <p
                      className={`text-xs md:text-sm leading-relaxed ${
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

          {/* AI Context / Takeaway Note if available */}
          {notes && (
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs space-y-1">
              <span className="font-bold text-indigo-300 uppercase text-[10px] tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-indigo-400" />
                Clip Takeaway Note:
              </span>
              <p className="text-slate-300 leading-relaxed">{notes}</p>
            </div>
          )}
        </div>

        {/* Viral Product Conversion Footer */}
        <div className="rounded-2xl glass-panel border border-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Never take meeting notes again</span>
            </h4>
            <p className="text-xs text-slate-400">
              Fathom automatically records, transcribes, highlights, and summarizes meetings with AI.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/dashboard">
              <Button variant="primary" size="md" className="text-xs">
                <span>Try Fathom Free</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SharedClipPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 p-8 text-slate-400 flex items-center justify-center">Loading clip...</div>}>
      <SharedClipContent token={resolvedParams.token} />
    </Suspense>
  );
}
