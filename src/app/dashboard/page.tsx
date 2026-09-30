"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  Video,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Radio,
  Play,
  Calendar,
  Layers,
  Star,
} from "lucide-react";
import { useMeetingsStore } from "@/lib/store";
import { formatDuration, formatDate, formatTime, getCategoryBadgeColor } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function DashboardPage() {
  const { meetings, toggleActionItem, toggleFavorite } = useMeetingsStore();

  const totalSeconds = meetings.reduce((acc, m) => acc + m.duration, 0);
  const totalActionItems = meetings.reduce((acc, m) => acc + m.actionItems.length, 0);
  const completedActionItems = meetings.reduce(
    (acc, m) => acc + m.actionItems.filter((a) => a.completed).length,
    0
  );
  const totalHighlights = meetings.reduce((acc, m) => acc + m.highlights.length, 0);

  // Flatten pending action items across all meetings
  const allPendingActions = meetings.flatMap((m) =>
    m.actionItems
      .filter((a) => !a.completed)
      .map((a) => ({
        ...a,
        meetingId: m.id,
        meetingTitle: m.title,
      }))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome & Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Meeting Intelligence Workspace
            </h1>
            <Badge variant="brand" size="sm" className="hidden sm:inline-flex">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Browse automated transcripts, MEDDIC & sprint summaries, and grounded citations across all recorded meetings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/search">
            <Button variant="secondary" size="sm">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Ask Fathom AI</span>
            </Button>
          </Link>
          <Link href="/record">
            <Button variant="primary" size="sm">
              <Radio className="h-3.5 w-3.5 text-rose-300 animate-pulse" />
              <span>Simulate Live Bot</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900/60 border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Total Recorded Time</p>
            <p className="text-xl font-bold text-white tracking-tight">
              {formatDuration(totalSeconds)}
            </p>
          </div>
        </Card>

        <Card className="p-4 bg-slate-900/60 border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Meetings Processed</p>
            <p className="text-xl font-bold text-white tracking-tight">
              {meetings.length} Calls
            </p>
          </div>
        </Card>

        <Card className="p-4 bg-slate-900/60 border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Action Items</p>
            <p className="text-xl font-bold text-white tracking-tight">
              {completedActionItems} / {totalActionItems}{" "}
              <span className="text-xs font-normal text-slate-400">Done</span>
            </p>
          </div>
        </Card>

        <Card className="p-4 bg-slate-900/60 border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">AI Highlights</p>
            <p className="text-xl font-bold text-white tracking-tight">
              {totalHighlights} Moments
            </p>
          </div>
        </Card>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Recent Meetings List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-100">
                Recent Meetings
              </h2>
              <span className="text-xs text-slate-400 font-mono">({meetings.length})</span>
            </div>
            <Link
              href="/meetings"
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {meetings.map((meeting) => {
              const catColors = getCategoryBadgeColor(meeting.category);
              return (
                <div
                  key={meeting.id}
                  className="group relative p-5 rounded-2xl glass-card transition-all duration-200 hover:border-indigo-500/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${catColors.bg} ${catColors.text} ${catColors.border}`}
                        >
                          {meeting.category}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(meeting.date)}
                        </span>
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(meeting.duration)}
                        </span>
                      </div>

                      <Link href={`/meetings/${meeting.id}`}>
                        <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                          {meeting.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {meeting.summary?.headline || meeting.description}
                      </p>

                      {/* Attendees Avatars & Quick Stats */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
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
                          <span className="text-[11px] text-slate-400 ml-2">
                            {meeting.speakers.map((s) => s.name.split(" ")[0]).join(", ")}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {meeting.actionItems.length > 0 && (
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              {meeting.actionItems.filter((a) => a.completed).length}/
                              {meeting.actionItems.length}
                            </span>
                          )}
                          <Link href={`/meetings/${meeting.id}`}>
                            <Button
                              variant="glass"
                              size="sm"
                              className="text-xs py-1 px-3 group-hover:bg-indigo-600 group-hover:text-white transition-all"
                            >
                              <Play className="h-3 w-3 fill-current" />
                              <span>Open Call</span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFavorite(meeting.id)}
                      className="p-1 text-slate-400 hover:text-amber-400 transition-colors shrink-0"
                      title="Toggle Favorite"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          meeting.isFavorite
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-400"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Column: Action Items & Live Bot Card */}
        <div className="space-y-6">
          {/* Simulated Bot Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900/90 border border-indigo-500/30 relative overflow-hidden shadow-xl">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Live Speech Capture
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Simulate Meeting Bot</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Launch a live meeting simulation with streaming transcription, audio waveform, and instant AI summary extraction.
            </p>
            <div className="mt-4">
              <Link href="/record">
                <Button variant="primary" size="sm" className="w-full text-xs">
                  <Radio className="h-3.5 w-3.5 mr-1" />
                  Launch Live Studio
                </Button>
              </Link>
            </div>
          </div>

          {/* Pending Action Items Widget */}
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <CardTitle className="text-sm">Pending Action Items</CardTitle>
              </div>
              <Badge variant="warning" size="sm">
                {allPendingActions.length} open
              </Badge>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {allPendingActions.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  All action items completed! 🎉
                </p>
              ) : (
                allPendingActions.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start gap-3 group"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleActionItem(item.meetingId, item.id)}
                      className="mt-1 h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-200 font-medium leading-snug">
                        {item.text}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-850">
                        <Link
                          href={`/meetings/${item.meetingId}?t=${item.timestamp}`}
                          className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3" />
                          {formatTime(item.timestamp)}
                        </Link>
                        {item.assignee && (
                          <div className="flex items-center gap-1.5">
                            <Avatar
                              name={item.assignee.name}
                              src={item.assignee.avatar}
                              size="xs"
                            />
                            <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                              {item.assignee.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
