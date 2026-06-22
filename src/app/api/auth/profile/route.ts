import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ message: "Supabase is not configured" }, { status: 500 });
  }

  const { error } = await supabase.from("users").upsert(
    {
      id: payload.user_id,
      email: payload.email,
      nickname: payload.nickname || payload.email?.split("@")[0] || "player",
      avatar_url: null,
      country: "CN",
    },
    { onConflict: "id" }
  );

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Profile synced" });
}
