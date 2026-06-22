import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return NextResponse.json([]);

  const { data, error } = await supabase.from("registrations").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json([]);
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const supabase = createSupabaseServerClient();

  if (!supabase) return NextResponse.json({ message: "Supabase 配置未完成，无法创建报名" }, { status: 500 });

  const { data, error } = await supabase
    .from("registrations")
    .insert({
      user_id: payload.user_id,
      tournament_id: payload.tournament_id,
      payment_status: payload.payment_status || "pending",
      payment_method: "USDT",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json({ message: "报名成功", registration: data });
}
