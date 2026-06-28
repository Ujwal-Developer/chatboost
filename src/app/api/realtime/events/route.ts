import { NextRequest, NextResponse } from "next/server";
import { creatorRoom, type ChatBoostRealtimeEvent } from "@/lib/realtime/events";

export async function POST(request: NextRequest) {
  const event = (await request.json()) as ChatBoostRealtimeEvent;

  return NextResponse.json({
    accepted: true,
    room: "creatorId" in event ? creatorRoom(event.creatorId) : undefined,
    event
  });
}
