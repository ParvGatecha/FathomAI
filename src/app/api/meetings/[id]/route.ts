import { NextResponse } from "next/server";
import { SEED_MEETINGS } from "@/lib/seed-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const meeting = SEED_MEETINGS.find((m) => m.id === resolvedParams.id);

  if (!meeting) {
    return NextResponse.json(
      { success: false, error: "Meeting not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    meeting,
  });
}
