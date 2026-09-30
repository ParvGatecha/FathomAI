"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Radio, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { CommandPalette } from "./CommandPalette";

export function Header() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 shrink-0 bg-slate-950/60 backdrop-blur-md border-b border-slate-850 px-6 flex items-center justify-between sticky top-0 z-20">
        {/* Global Search Bar Trigger */}
        <div className="flex-1 max-w-md">
          <button
            onClick={() => setIsCommandOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all text-xs group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="h-4 w-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span>Search meetings, transcripts & action items...</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-800 border border-slate-700 rounded shadow-sm">
                ⌘K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link href="/search">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Ask Fathom AI</span>
            </Button>
          </Link>

          <Link href="/record">
            <Button variant="primary" size="sm" className="text-xs">
              <Radio className="h-3.5 w-3.5 text-rose-300 animate-pulse" />
              <span>Live Capture</span>
            </Button>
          </Link>
        </div>
      </header>

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </>
  );
}
