"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Video,
  Search,
  Radio,
  Briefcase,
  Code2,
  Users2,
  Crown,
  Sparkles,
  RotateCcw,
  Layers,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMeetingsStore } from "@/lib/store";
import { Badge } from "../ui/Badge";

export function Sidebar() {
  const pathname = usePathname();
  const { meetings, resetToSeedData } = useMeetingsStore();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: "All Meetings",
      href: "/meetings",
      icon: Video,
      badge: meetings.length.toString(),
    },
    {
      label: "Global Search",
      href: "/search",
      icon: Search,
      badge: null,
    },
    {
      label: "Live Studio",
      href: "/record",
      icon: Radio,
      badge: "LIVE",
      badgeVariant: "danger" as const,
    },
  ];

  const categories = [
    { label: "Product & AI", slug: "product", icon: Sparkles, color: "text-indigo-400" },
    { label: "Sales & Deals", slug: "sales", icon: Briefcase, color: "text-emerald-400" },
    { label: "Engineering & SRE", slug: "engineering", icon: Code2, color: "text-blue-400" },
    { label: "1-on-1 Syncs", slug: "1-on-1", icon: Users2, color: "text-purple-400" },
    { label: "Executive & Board", slug: "executive", icon: Crown, color: "text-amber-400" },
  ];

  const handleReset = () => {
    if (confirm("Reset workspace to the original 6 seeded meetings?")) {
      resetToSeedData();
    }
  };

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-slate-950/90 border-r border-slate-850 flex flex-col justify-between select-none z-30">
      {/* Brand Header */}
      <div>
        <div className="p-5 flex items-center justify-between border-b border-slate-850">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200 ring-1 ring-white/20">
              <span className="text-white font-black text-lg tracking-wider">F</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  Fathom
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Meeting Intelligence</p>
            </div>
          </Link>
        </div>

        {/* Action Button: Record New Meeting */}
        <div className="px-3.5 pt-4 pb-2">
          <Link
            href="/record"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium text-xs shadow-md shadow-indigo-500/20 border border-indigo-400/20 transition-all duration-200 active:scale-[0.98]"
          >
            <Radio className="h-3.5 w-3.5 animate-pulse text-rose-300" />
            <span>Simulate Live Bot</span>
          </Link>
        </div>

        {/* Primary Navigation */}
        <div className="px-3 py-2 space-y-1">
          <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === "/meetings" && pathname.startsWith("/meetings"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive
                        ? "text-indigo-400"
                        : "text-slate-400 group-hover:text-slate-300"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge
                    variant={item.badgeVariant || "default"}
                    size="sm"
                    className="text-[10px]"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>

        {/* Categories / Meeting Folders */}
        <div className="px-3 py-2 space-y-1 mt-2">
          <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Categories</span>
            <Layers className="h-3 w-3 text-slate-400" />
          </div>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/meetings?category=${cat.slug}`}
                className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-all duration-150 group"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("h-3.5 w-3.5", cat.color)} />
                  <span>{cat.label}</span>
                </div>
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 text-slate-500 transition-opacity" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile / Evaluator Status */}
      <div className="p-3 border-t border-slate-850 space-y-2">
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <p className="text-[11px] font-semibold text-slate-200">
                Evaluator Mode
              </p>
              <p className="text-[10px] text-slate-300">Public Demo Access</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            title="Reset workspace to default seed data"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
