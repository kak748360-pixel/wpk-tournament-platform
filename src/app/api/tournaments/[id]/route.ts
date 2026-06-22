import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createSupabaseServerClient();
  if (!supabase) return NextResponse.json(null);

  const { data, error } = await supabase.from("tournaments").select("*").eq("id", id).single();
  if (error) return NextResponse.json(null);
  return NextResponse.json(data);
}
