import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return NextResponse.json([]);

  const { data, error } = await supabase.from("results").select("*, users(nickname)").order("points", { ascending: false });
  if (error) return NextResponse.json([]);
  return NextResponse.json(data ?? []);
}
