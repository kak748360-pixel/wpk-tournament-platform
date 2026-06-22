import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return NextResponse.json([]);

  const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json([]);
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const supabase = createSupabaseServerClient();

  if (!supabase) return NextResponse.json({ message: "Supabase 配置未完成，无法发布公告" }, { status: 500 });

  const { data, error } = await supabase
    .from("announcements")
    .insert({
      title: payload.title,
      content: payload.content,
      category: payload.category || "general",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json({ message: "公告发布成功", announcement: data });
}
