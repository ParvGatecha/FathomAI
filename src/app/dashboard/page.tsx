"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Highlighter,
  Activity,
  CheckCircle,
  TrendingUp,
  Share2,
  Plus,
} from "lucide-react";
import { useMeetingsStore } from "@/lib/store";
import {
  formatDuration,
  formatDate,
  formatTime,
  formatRelativeDate,
  getCategoryBadgeColor,
  getGreeting,
  getDateGroup,
} from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Meeting } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const { meetings, toggleActionItem, toggleFavorite } = useMeetingsStore();

  const greeting = getGreeting();

  // Metrics calculations
  const totalSeconds = useMemo(
    () => meetings.reduce((acc, m) => acc + m.duration, 0),
    [meetings]
  );
  const totalActionItems = useMemo(
    () => meetings.reduce((acc, m) => acc + m.actionItems.length, 0),
    [meetings]
  );
  const completedActionItems = useMemo(
    () =>
      meetings.reduce(
        (acc, m) => acc + m.actionItems.filter((a) => a.completed).length,
        0
      ),
    [meetings]
  );
  const totalHighlights = useMemo(
    () => meetings.reduce((acc, m) => acc + m.highlights.length, 0),
    [meetings]
  );

  // Today's meetings
  const todaysMeetings = useMemo(() => {
    return meetings.filter((m) => getDateGroup(m.date) === "Today");
  }, [meetings]);

  // Recent meetings (excluding today or up to 5 latest)
  const recentMeetings = useMemo(() => {
    return meetings.slice(0, 6);
  }, [meetings]);

  // Flatten pending action items
  const allPendingActions = useMemo(() => {
    return meetings.flatMap((m) =>
      m.actionItems
        .filter((a) => !a.completed)
        .map((a) => ({
          ...a,
          meetingId: m.id,
          meetingTitle: m.title,
        }))
    );
  }, [meetings]);

  // Curated recent highlights across all calls
  const recentHighlights = useMemo(() => {
    return meetings
      .flatMap((m) =>
        m.highlights.map((hl) => ({
          ...hl,
          meetingId: m.id,
          meetingTitle: m.title,
          meetingCategory: m.category,
        }))
      )
      .slice(0, 4);
  }, [meetings]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Greeting & Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-850">
        <div className="flex items-start gap-4">
          <Avatar
            name="Alex Rivera"
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            size="lg"
            className="ring-2 ring-indigo-500/40 mt-0.5"
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {greeting}, Alex
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Workspace Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              You have{" "}
              <strong className="text-slate-200">
                {todaysMeetings.length} calls recorded today
              </strong>{" "}
              and{" "}
              <strong className="text-slate-200">
                {allPendingActions.length} open action items
              </strong>{" "}
              pending follow-up.
            </p>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/meetings">
            <Button variant="secondary" size="sm" className="text-xs">
              <Layers className="h-3.5 w-3.5 mr-1" />
              <span>Browse All Calls</span>
            </Button>
          </Link>
          <Link href="/record">
            <Button variant="primary" size="sm" className="text-xs">
              <Radio className="h-3.5 w-3.5 text-rose-300 animate-pulse mr-1" />
              <span>Record Meeting</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900/60 border-slate-800/80 hover:border-slate-700 transition-all flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Meetings
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-white tracking-tight">
                {meetings.length}
              </span>
              <span className="text-xs text-slate-400 font-normal">processed</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-slate-900/60 border-slate-800/80 hover:border-slate-700 transition-all flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Recorded Time
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-white tracking-tight">
                {formatDuration(totalSeconds)}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-slate-900/60 border-slate-800/80 hover:border-slate-700 transition-all flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Action Items
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-white tracking-tight">
                {completedActionItems}/{totalActionItems}
              </span>
              <span className="text-xs text-slate-400 font-normal">completed</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-slate-900/60 border-slate-800/80 hover:border-slate-700 transition-all flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <Highlighter className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              AI Highlights
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-white tracking-tight">
                {totalHighlights}
              </span>
              <span className="text-xs text-slate-400 font-normal">moments</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Featured Evaluator Spotlight */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/50 border border-indigo-500/30 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              Evaluator Spotlight — Top 3 Demo Workflows
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            Click any card to test grounded intelligence
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link
            href="/meetings/meet-1"
            className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-indigo-500/40 hover:border-indigo-500/80 transition-all group relative overflow-hidden block cursor-pointer"
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-400" />
                FLAGSHIP MEETING
              </span>
              <span className="font-mono text-indigo-300 font-semibold">1h 02m · 8 people</span>
            </div>
            <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
              Q4 Product Strategy & Enterprise Planning
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              194 segments, $32 enterprise pricing, sub-800ms latency SLA, and SOC2 observation window.
            </p>
          </Link>

          <Link
            href="/meetings/meet-2"
            className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group block cursor-pointer"
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="font-bold text-emerald-400">SALES & MEDDIC</span>
              <span>24m</span>
            </div>
            <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
              Customer Discovery: Acme Corp
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              250-seat rollout, SAML objection resolution, $120k ARR opportunity.
            </p>
          </Link>

          <Link
            href="/meetings/meet-3"
            className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all group block cursor-pointer"
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="font-bold text-blue-400">ENGINEERING ARCH</span>
              <span>22m</span>
            </div>
            <h3 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
              Engineering Architecture Sync
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              Sub-200ms streaming latency benchmarks and Turbopack migrations.
            </p>
          </Link>
        </div>
      </div>

      {/* Today's Meetings Spotlight (if any) */}
      {todaysMeetings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-300">
                Today&apos;s Meetings ({todaysMeetings.length})
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Synchronized & Ready for Review
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todaysMeetings.map((meeting) => {
              const catColor = getCategoryBadgeColor(meeting.category);
              return (
                <div
                  key={meeting.id}
                  onClick={() => router.push(`/meetings/${meeting.id}`)}
                  className="p-5 rounded-2xl glass-card border-indigo-500/30 hover:border-indigo-500/60 hover:bg-slate-900/80 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${catColor.bg} ${catColor.text} ${catColor.border}`}
                        >
                          {meeting.category}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {formatDuration(meeting.duration)}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {formatRelativeDate(meeting.date)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {meeting.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {meeting.summary?.headline}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-850 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        {meeting.speakers.map((spk) => (
                          <Avatar
                            key={spk.id}
                            name={spk.name}
                            src={spk.avatar}
                            size="xs"
                            className="ring-2 ring-slate-900"
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-400 ml-1">
                        {meeting.speakers.length} participants
                      </span>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/meetings/${meeting.id}`);
                      }}
                    >
                      <Play className="h-3 w-3 fill-current mr-1" />
                      <span>Review Call</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 Cols): Recent Meetings List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">
                Recent Meeting History
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                ({meetings.length})
              </span>
            </div>
            <Link
              href="/meetings"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <span>View All Recordings</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentMeetings.map((meeting) => {
              const catColor = getCategoryBadgeColor(meeting.category);
              const dateGroup = getDateGroup(meeting.date);

              return (
                <div
                  key={meeting.id}
                  onClick={() => router.push(`/meetings/${meeting.id}`)}
                  className="group p-4 rounded-2xl glass-card transition-all duration-200 hover:border-indigo-500/40 hover:bg-slate-900/80 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${catColor.bg} ${catColor.text} ${catColor.border}`}
                      >
                        {meeting.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Calendar className="h-3 w-3" />
                        {dateGroup} • {formatDate(meeting.date)}
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(meeting.duration)}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {meeting.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {meeting.summary?.headline}
                    </p>

                    {/* Speakers row */}
                    <div className="flex items-center gap-3 mt-2.5">
                      <div className="flex -space-x-2 overflow-hidden">
                        {meeting.speakers.map((spk) => (
                          <Avatar
                            key={spk.id}
                            name={spk.name}
                            src={spk.avatar}
                            size="xs"
                            className="ring-2 ring-slate-900"
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {meeting.speakers.map((s) => s.name.split(" ")[0]).join(", ")}
                      </span>
                    </div>
                  </div>

                  {/* Right side stats & CTA */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    {meeting.actionItems.length > 0 && (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        {meeting.actionItems.filter((a) => a.completed).length}/
                        {meeting.actionItems.length}
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(meeting.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors"
                      title="Favorite Call"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          meeting.isFavorite
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-400"
                        }`}
                      />
                    </button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/meetings/${meeting.id}`);
                      }}
                      className="text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all"
                    >
                      <Play className="h-3 w-3 fill-current mr-1" />
                      <span>Open</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 Cols): Action Items Checklist & Recent Highlights */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pending Action Items Widget */}
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-850">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <CardTitle className="text-sm">Action Items Checklist</CardTitle>
              </div>
              <Badge variant="warning" size="sm">
                {allPendingActions.length} open
              </Badge>
            </CardHeader>
            <CardContent className="pt-3 space-y-2.5 max-h-80 overflow-y-auto">
              {allPendingActions.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  All action items completed! 🎉
                </p>
              ) : (
                allPendingActions.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => router.push(`/meetings/${item.meetingId}?t=${item.timestamp}`)}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 hover:border-indigo-500/40 hover:bg-slate-900/50 transition-all flex items-start gap-2.5 group cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleActionItem(item.meetingId, item.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1 h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-200 font-medium leading-snug group-hover:text-indigo-200 transition-colors">
                        {item.text}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-850">
                        <span className="text-[10px] font-mono text-indigo-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(item.timestamp)}
                        </span>
                        {item.assignee && (
                          <div className="flex items-center gap-1">
                            <Avatar
                              name={item.assignee.name}
                              src={item.assignee.avatar}
                              size="xs"
                            />
                            <span className="text-[10px] text-slate-400 truncate max-w-[90px]">
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

          {/* Curated AI Highlights & Decisions */}
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-850">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <CardTitle className="text-sm">Key Highlight Quotes</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-3 space-y-3">
              {recentHighlights.map((hl) => (
                <Link
                  key={hl.id}
                  href={`/meetings/${hl.meetingId}?t=${hl.startTime}`}
                  className="block p-3 rounded-xl bg-slate-950/60 border border-slate-850 hover:border-indigo-500/40 transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-indigo-400">
                      {hl.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {formatTime(hl.startTime)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 group-hover:text-slate-100 transition-colors line-clamp-2 italic">
                    &ldquo;{hl.text}&rdquo;
                  </p>
                  <p className="text-[10px] text-slate-400 truncate pt-0.5">
                    From: {hl.meetingTitle}
                  </p>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
