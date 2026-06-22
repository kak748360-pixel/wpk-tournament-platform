"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { getLocale, getText } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function AdminResultsPage() {
  const searchParams = useSearchParams();
  const locale = getLocale({ lang: searchParams.get("lang") || undefined });
  const t = (key: keyof typeof import("@/lib/i18n").translations[typeof locale]) => getText(locale, key);

  const [form, setForm] = useState({
    user_id: "",
    tournament_id: "",
    rank: "1",
    prize: "666",
    proof_url: "",
  });
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let proofUrl = form.proof_url;
      if (proofFile) {
        const formData = new FormData();
        formData.append("file", proofFile);
        const uploadRes = await fetch("/api/uploads", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || "Upload failed");
        proofUrl = uploadData.url;
      }

      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, prize: Number(form.prize), rank: Number(form.rank), proof_url: proofUrl }),
      });
      const data = await res.json();
      setMessage(data.message || "Result recorded");
    } catch (error: any) {
      setMessage(error.message || "Failed to record result");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Result Entry</p>
            <h1 className="text-3xl font-semibold">{t("adminReviewResults")}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/admin?lang=${locale}`} className="btn-secondary">{t("backHome")}</Link>
            <LanguageSwitcher locale={locale} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-8">
          <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="User ID" value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} required />
          <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="Tournament ID" value={form.tournament_id} onChange={(e) => setForm({ ...form, tournament_id: e.target.value })} required />
          <div className="grid gap-4 md:grid-cols-2">
            <input type="number" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="Rank" value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })} />
            <input type="number" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="Prize" value={form.prize} onChange={(e) => setForm({ ...form, prize: e.target.value })} />
          </div>
          <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="Proof URL" value={form.proof_url} onChange={(e) => setForm({ ...form, proof_url: e.target.value })} />
          <input type="file" accept="image/*" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" onChange={(e) => setProofFile(e.target.files?.[0] || null)} />
          <button className="btn-primary" type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Submit Result"}
          </button>
        </form>

        {message && <div className="mt-6 rounded-xl border border-gold/20 bg-gold/10 p-4 text-sm text-gold">{message}</div>}
      </div>
    </main>
  );
}
