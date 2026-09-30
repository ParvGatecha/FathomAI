"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  Play,
  CheckCircle2,
  Star,
  Sparkles,
  LayoutGrid,
  List,
  Layers,
} from "lucide-react";
import { useMeetingsStore } from "@/lib/store";
import { formatDuration, formatDate, getCategoryBadgeColor } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { MeetingCategory } from "@/lib/types";

function MeetingsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as MeetingCategory | null;

  const { meetings, toggleFavorite } = useMeetingsStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam || "all"
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");

  const categories = [
    { label: "All Calls", value: "all" },
    { label: "Product & AI", value: "product" },
    { label: "Sales & Deals", value: "sales" },
    { label: "Engineering", value: "engineering" },
    { label: "1-on-1s", value: "1-on-1" },
    { label: "Executive", value: "executive" },
    { label: "User Research", value: "research" },
  ];

  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) => {
      // Category filter
      if (selectedCategory !== "all" && m.category !== selectedCategory) {
        return false;
      }
      // Platform filter
      if (selectedPlatform !== "all" && m.platform !== selectedPlatform) {
        return false;
      }
      // Text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesSummary = m.summary?.headline.toLowerCase().includes(q);
        const matchesSpeaker = m.speakers.some((s) =>
          s.name.toLowerCase().includes(q)
        );
        const matchesTag = m.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSummary && !matchesSpeaker && !matchesTag) {
          return false;
        }
      }
      return true;
    });
  }, [meetings, selectedCategory, selectedPlatform, searchQuery]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            All Meeting Recordings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Search, filter, and review synchronized recordings with AI notes and action items.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg border transition-colors ${
              viewMode === "list"
                ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
            title="List View"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg border transition-colors ${
              viewMode === "grid"
                ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <Input
            icon={<Search className="h-4 w-4 text-slate-500" />}
            placeholder="Filter by title, speaker, keyword, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Platform Dropdown */}
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="bg-slate-900 text-xs text-slate-300 border border-slate-800 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 w-full md:w-auto cursor-pointer"
        >
          <option value="all">All Platforms</option>
          <option value="zoom">Zoom</option>
          <option value="google_meet">Google Meet</option>
          <option value="teams">Microsoft Teams</option>
        </select>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-850">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Meetings Grid / List */}
      {filteredMeetings.length === 0 ? (
        <div className="py-20 text-center rounded-2xl glass-panel p-8">
          <Layers className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">
            No meetings found
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or switching the category filter.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedPlatform("all");
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-3">
          {filteredMeetings.map((meeting) => {
            const catColors = getCategoryBadgeColor(meeting.category);
            return (
              <div
                key={meeting.id}
                className="group p-5 rounded-2xl glass-card transition-all duration-200 hover:border-indigo-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
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
                    <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {meeting.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {meeting.summary?.headline}
                  </p>

                  {/* Speaker Avatars & Tags */}
                  <div className="flex items-center gap-4 mt-3">
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

                    <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                      {meeting.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-750"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  {meeting.actionItems.length > 0 && (
                    <div className="text-right hidden sm:block">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        {meeting.actionItems.filter((a) => a.completed).length}/
                        {meeting.actionItems.length} Actions
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => toggleFavorite(meeting.id)}
                    className="p-2 text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        meeting.isFavorite
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-400"
                      }`}
                    />
                  </button>

                  <Link href={`/meetings/${meeting.id}`}>
                    <Button variant="primary" size="sm" className="text-xs">
                      <Play className="h-3 w-3 fill-current" />
                      <span>Review</span>
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetings.map((meeting) => {
            const catColors = getCategoryBadgeColor(meeting.category);
            return (
              <div
                key={meeting.id}
                className="group p-5 rounded-2xl glass-card transition-all duration-200 hover:border-indigo-500/40 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${catColors.bg} ${catColors.text} ${catColors.border}`}
                    >
                      {meeting.category}
                    </span>
                    <button
                      onClick={() => toggleFavorite(meeting.id)}
                      className="text-slate-400 hover:text-amber-400"
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

                  <Link href={`/meetings/${meeting.id}`}>
                    <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2">
                      {meeting.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {meeting.summary?.headline}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex -space-x-1.5 overflow-hidden">
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

                  <Link href={`/meetings/${meeting.id}`}>
                    <Button variant="glass" size="sm" className="text-xs">
                      <Play className="h-3 w-3 fill-current" />
                      <span>Review</span>
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MeetingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading meetings catalogue...</div>}>
      <MeetingsContent />
    </Suspense>
  );
}
