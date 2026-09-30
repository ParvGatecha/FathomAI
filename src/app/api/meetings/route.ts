import { NextResponse } from "next/server";
import { SEED_MEETINGS } from "@/lib/seed-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const query = searchParams.get("q");

  let result = SEED_MEETINGS;

  if (category && category !== "all") {
    result = result.filter((m) => m.category === category);
  }

  if (query) {
    const q = query.toLowerCase();
    result = result.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q) ||
        m.summary?.headline.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    count: result.length,
    meetings: result,
  });
}
