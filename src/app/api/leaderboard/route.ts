import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return NextResponse.json([]);

  const { data, error } = await supabase.from("results").select("user_id, points, prize, users(nickname)").order("points", { ascending: false });
  if (error) return NextResponse.json([]);

  const grouped = new Map<string, { user_id: string; nickname: string; points: number; prize: number; entries: number }>();
  for (const row of data ?? []) {
    const nickname = (row.users as { nickname?: string } | null)?.nickname || "Player";
    const entry = grouped.get(row.user_id) || { user_id: row.user_id, nickname, points: 0, prize: 0, entries: 0 };
    entry.points += Number(row.points || 0);
    entry.prize += Number(row.prize || 0);
    entry.entries += 1;
    grouped.set(row.user_id, entry);
  }

  return NextResponse.json(Array.from(grouped.values()).sort((a, b) => b.points - a.points));
}
