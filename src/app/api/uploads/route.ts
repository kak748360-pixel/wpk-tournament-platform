import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  const bucket = formData.get("bucket")?.toString() || "proofs";

  if (!file || typeof file === "string") {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ message: "Supabase is not configured" }, { status: 500 });
  }

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${(file as File).name.split(".").pop() || "jpg"}`;
  const arrayBuffer = await (file as File).arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await supabase.storage.from(bucket).upload(fileName, buffer, {
    contentType: (file as File).type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return NextResponse.json({ url: publicUrlData.publicUrl, path: data?.path });
}
