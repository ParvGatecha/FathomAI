"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Calendar,
  Clock,
  Play,
  CheckCircle2,
  Star,
  LayoutGrid,
  List,
  Layers,
  ArrowUpDown,
  Filter,
  Users,
} from "lucide-react";
import { useMeetingsStore } from "@/lib/store";
import {
  formatDuration,
  formatDate,
  getCategoryBadgeColor,
  getDateGroup,
} from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { MeetingCategory, Meeting } from "@/lib/types";

function MeetingsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as MeetingCategory | null;

  const { meetings, toggleFavorite } = useMeetingsStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam || "all"
  );
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "duration">(
    "date-desc"
  );

  const categories = [
    { label: "All Calls", value: "all" },
    { label: "Product & AI", value: "product" },
    { label: "Sales & Deals", value: "sales" },
    { label: "Engineering", value: "engineering" },
    { label: "1-on-1s", value: "1-on-1" },
    { label: "Executive", value: "executive" },
    { label: "Client Demos", value: "demo" },
    { label: "Design", value: "design" },
    { label: "Hiring", value: "hiring" },
    { label: "Research", value: "research" },
  ];

  // Filter and sort meetings
  const filteredMeetings = useMemo(() => {
    const result = meetings.filter((m) => {
      // Category filter
      if (selectedCategory !== "all" && m.category !== selectedCategory) {
        return false;
      }
      // Platform filter
      if (selectedPlatform !== "all" && m.platform !== selectedPlatform) {
        return false;
      }
      // Text search
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

    // Sort
    result.sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === "date-asc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === "duration") {
        return b.duration - a.duration;
      }
      return 0;
    });

    return result;
  }, [meetings, selectedCategory, selectedPlatform, searchQuery, sortBy]);

  // Group filtered meetings by date groups
  const groupedMeetings = useMemo(() => {
    const groups: { [key: string]: Meeting[] } = {};
    const order = ["Today", "Yesterday", "This Week", "Last Week", "Earlier This Month"];

    for (const m of filteredMeetings) {
      const g = getDateGroup(m.date);
      if (!groups[g]) {
        groups[g] = [];
      }
      groups[g].push(m);
    }

    return order
      .filter((groupName) => groups[groupName] && groups[groupName].length > 0)
      .map((groupName) => ({
        title: groupName,
        items: groups[groupName],
      }));
  }, [filteredMeetings]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Meeting Library
            </h1>
            <span className="text-xs font-mono text-slate-400">
              ({filteredMeetings.length} of {meetings.length} calls)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse, filter, and inspect synchronized recordings grouped by date.
          </p>
        </div>

        {/* View Switcher & Sorting */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 ml-1.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-300 text-xs focus:outline-none pr-2 cursor-pointer font-medium"
            >
              <option value="date-desc" className="bg-slate-900">Newest first</option>
              <option value="date-asc" className="bg-slate-900">Oldest first</option>
              <option value="duration" className="bg-slate-900">Longest duration</option>
            </select>
          </div>

          <div className="flex items-center border border-slate-800 rounded-xl bg-slate-900 p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <Input
            icon={<Search className="h-4 w-4 text-slate-500" />}
            placeholder="Search by title, speaker, keyword, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Platform Dropdown */}
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="bg-slate-900 text-xs text-slate-300 border border-slate-800 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 w-full md:w-auto cursor-pointer font-medium"
        >
          <option value="all">All Platforms (Zoom, Meet, Teams)</option>
          <option value="zoom">Zoom</option>
          <option value="google_meet">Google Meet</option>
          <option value="teams">Microsoft Teams</option>
        </select>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-850">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.value;
          const count =
            cat.value === "all"
              ? meetings.length
              : meetings.filter((m) => m.category === cat.value).length;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Meetings List with Date Grouping */}
      {filteredMeetings.length === 0 ? (
        <div className="py-20 text-center rounded-2xl glass-panel p-8">
          <Layers className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">
            No meetings found
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or reset your filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 text-xs"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedPlatform("all");
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedMeetings.map((group) => (
            <div key={group.title} className="space-y-3">
              {/* Date Group Header */}
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {group.title}
                </h2>
                <span className="text-[11px] font-mono text-slate-400">
                  ({group.items.length})
                </span>
              </div>

              {/* Group Items: List View */}
              {viewMode === "list" ? (
                <div className="space-y-2.5">
                  {group.items.map((meeting) => {
                    const catColor = getCategoryBadgeColor(meeting.category);
                    return (
                      <div
                        key={meeting.id}
                        className="group p-4 rounded-2xl glass-card transition-all duration-200 hover:border-indigo-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${catColor.bg} ${catColor.text} ${catColor.border}`}
                            >
                              {meeting.category}
                            </span>
                            {meeting.meetingType && (
                              <span className="text-[10px] font-semibold text-slate-400 px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-750">
                                {meeting.meetingType}
                              </span>
                            )}
                            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                              <Calendar className="h-3 w-3" />
                              {formatDate(meeting.date)}
                            </span>
                            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(meeting.duration)}
                            </span>
                          </div>

                          <Link href={`/meetings/${meeting.id}`}>
                            <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                              {meeting.title}
                            </h3>
                          </Link>

                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                            {meeting.summary?.headline}
                          </p>

                          {/* Speaker list & tags */}
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

                            <div className="hidden sm:flex items-center gap-1 ml-2">
                              {meeting.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-400 border border-slate-800"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Action items & CTA */}
                        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                          {meeting.actionItems.length > 0 && (
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 hidden sm:inline-flex">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              {meeting.actionItems.filter((a) => a.completed).length}/
                              {meeting.actionItems.length}
                            </span>
                          )}

                          <button
                            onClick={() => toggleFavorite(meeting.id)}
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

                          <Link href={`/meetings/${meeting.id}`}>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all"
                            >
                              <Play className="h-3 w-3 fill-current mr-1" />
                              <span>Review</span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Group Items: Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((meeting) => {
                    const catColor = getCategoryBadgeColor(meeting.category);
                    return (
                      <div
                        key={meeting.id}
                        className="p-5 rounded-2xl glass-card transition-all duration-200 hover:border-indigo-500/40 flex flex-col justify-between space-y-4 group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${catColor.bg} ${catColor.text} ${catColor.border}`}
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
                            <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2">
                              {meeting.title}
                            </h3>
                          </Link>

                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {meeting.summary?.headline}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-850 flex items-center justify-between">
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
                              <Play className="h-3 w-3 fill-current mr-1" />
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
          ))}
        </div>
      )}
    </div>
  );
}

export default function MeetingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading meeting library...</div>}>
      <MeetingsContent />
    </Suspense>
  );
}
