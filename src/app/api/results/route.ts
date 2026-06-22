import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ message: "Supabase 配置未完成，无法录入成绩" }, { status: 500 });
  }

  const points = {
    1: 100,
    2: 80,
    3: 60,
    4: 40,
    5: 30,
    6: 20,
    7: 10,
    8: 5,
  }[Number(payload.rank)] ?? 0;

  const { data, error } = await supabase
    .from("results")
    .insert({
      user_id: payload.user_id,
      tournament_id: payload.tournament_id,
      rank: Number(payload.rank),
      points,
      prize: Number(payload.prize || 0),
      proof_url: payload.proof_url || "",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "成绩录入成功", result: data });
}
