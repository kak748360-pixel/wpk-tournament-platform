import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Tournament } from "@/types";

const fallbackTournaments: Tournament[] = [
  {
    id: "demo-1",
    title: "WPK 春季公开赛",
    description: "线上德州扑克公开赛，适合新老玩家。",
    entry_fee: 20,
    prize_pool: 5000,
    start_time: "2026-07-10T20:00:00.000Z",
    registration_deadline: "2026-07-09T20:00:00.000Z",
    status: "open",
    rules: "报名费 20 USDT，冠军最高奖励 666，亚军 266，季军 166。",
  },
];

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return NextResponse.json(fallbackTournaments);

  const { data, error } = await supabase.from("tournaments").select("*").order("start_time", { ascending: true });
  if (error) return NextResponse.json(fallbackTournaments);
  return NextResponse.json(data ?? fallbackTournaments);
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ message: "Supabase 配置未完成，无法保存赛事" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("tournaments")
    .insert({
      title: payload.title,
      description: payload.description,
      entry_fee: Number(payload.entry_fee || 0),
      prize_pool: Number(payload.prize_pool || 0),
      start_time: payload.start_time,
      registration_deadline: payload.registration_deadline,
      status: payload.status || "draft",
      rules: payload.rules || "",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json({ message: "赛事创建成功", tournament: data });
}
