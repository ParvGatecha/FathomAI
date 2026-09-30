"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useMeetingsStore } from "@/lib/store";
import { Skeleton } from "../ui/Skeleton";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useMeetingsStore();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
          {!isLoaded ? (
            <div className="p-8 space-y-6 max-w-7xl mx-auto">
              <Skeleton className="h-10 w-64" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-28 rounded-2xl" />
                <Skeleton className="h-28 rounded-2xl" />
                <Skeleton className="h-28 rounded-2xl" />
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
