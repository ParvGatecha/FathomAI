import type { Metadata } from "next";
import "@/styles/globals.css";
import { MeetingsProvider } from "@/lib/store";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Fathom — AI Meeting Notetaker & Intelligence",
  description:
    "AI meeting notetaker with synchronized transcript playback, MEDDIC templates, instant grounded Q&A citations, and live capture simulation.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen">
        <MeetingsProvider>
          <AppLayout>{children}</AppLayout>
        </MeetingsProvider>
      </body>
    </html>
  );
}
