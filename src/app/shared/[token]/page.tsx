"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Play,
  Pause,
  Clock,
  Share2,
  Check,
  Copy,
  Video,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useMeetingsStore } from "@/lib/store";
import { formatTime, formatDate, getCategoryBadgeColor } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";

function SharedClipContent({ token }: { token: string }) {
  const searchParams = useSearchParams();
  const startTime = Number(searchParams.get("start") || "0");
  const endTime = Number(searchParams.get("end") || "30");

  const { getMeeting } = useMeetingsStore();
  const meeting = getMeeting(token);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= endTime) {
            setIsPlaying(false);
            return startTime;
          }
          return prev + 0.5;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, endTime, startTime]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!meeting) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-xl font-bold text-white">Clip not found</h2>
          <p className="text-sm text-slate-400">
            This shared clip link may be invalid or expired.
          </p>
          <Link href="/dashboard">
            <Button variant="primary" size="sm">
              Go to Workspace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const clipSegments = meeting.transcript.filter(
    (seg) => seg.endTime >= startTime && seg.startTime <= endTime
  );

  const catColor = getCategoryBadgeColor(meeting.category);

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-black text-sm">F</span>
            </div>
            <span className="font-bold text-sm text-white">
              Fathom <span className="text-indigo-400">Shared Clip</span>
            </span>
          </div>

          <Link href={`/meetings/${meeting.id}`}>
            <Button variant="ghost" size="sm" className="text-xs">
              <span>View Full Meeting</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Player Container */}
        <div className="rounded-2xl glass-panel border border-slate-800 p-6 space-y-6 shadow-2xl">
          {/* Header info */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${catColor.bg} ${catColor.text} ${catColor.border}`}
                >
                  {meeting.category}
                </span>
                <span className="text-xs text-slate-400">
                  {formatDate(meeting.date)}
                </span>
              </div>
              <h1 className="text-lg font-bold text-white">{meeting.title}</h1>
            </div>

            <Button variant="secondary" size="sm" onClick={handleCopyLink}>
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy Clip
                </>
              )}
            </Button>
          </div>

          {/* Animated Clip Visualizer Box */}
          <div className="h-40 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center relative p-6 text-center space-y-3">
            <div className="flex items-center gap-1 h-8">
              <div
                className={`w-1.5 bg-indigo-400 rounded-full ${
                  isPlaying ? "animate-wave-1" : "h-2"
                }`}
              />
              <div
                className={`w-1.5 bg-indigo-500 rounded-full ${
                  isPlaying ? "animate-wave-2" : "h-4"
                }`}
              />
              <div
                className={`w-1.5 bg-purple-500 rounded-full ${
                  isPlaying ? "animate-wave-3" : "h-3"
                }`}
              />
              <div
                className={`w-1.5 bg-indigo-400 rounded-full ${
                  isPlaying ? "animate-wave-4" : "h-5"
                }`}
              />
              <div
                className={`w-1.5 bg-purple-400 rounded-full ${
                  isPlaying ? "animate-wave-5" : "h-2"
                }`}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-10 w-10 rounded-full p-0 flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                )}
              </Button>
              <div className="font-mono text-xs text-indigo-300">
                {formatTime(currentTime)} / {formatTime(endTime)}
              </div>
            </div>
          </div>

          {/* Clip Synchronized Transcript */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Clip Transcript Snippet:
            </h3>
            <div className="space-y-2">
              {clipSegments.map((seg) => {
                const isActive =
                  currentTime >= seg.startTime && currentTime <= seg.endTime;
                return (
                  <div
                    key={seg.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isActive
                        ? "bg-indigo-600/15 border-indigo-500/40"
                        : "bg-slate-900/60 border-slate-800"
                    }`}
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
                      <span className="text-[10px] font-mono text-indigo-400">
                        {formatTime(seg.startTime)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {seg.text}
                    </p>
                  </div>
                );
              })}
            </div>
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
    <Suspense fallback={<div className="p-8 text-slate-400">Loading clip...</div>}>
      <SharedClipContent token={resolvedParams.token} />
    </Suspense>
  );
}
