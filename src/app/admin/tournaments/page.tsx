"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getLocale, getText } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export const dynamic = "force-dynamic";

export default function AdminTournamentsPage() {
  return (
    <Suspense fallback={<div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center text-slate-400">Loading...</div>}>
      <AdminTournamentsPageContent />
    </Suspense>
  );
}

function AdminTournamentsPageContent() {
  const searchParams = useSearchParams();
  const locale = getLocale({ lang: searchParams.get("lang") || undefined });
  const t = (key: keyof typeof import("@/lib/i18n").translations[typeof locale]) => getText(locale, key);

  const [form, setForm] = useState({
    title: "",
    description: "",
    entry_fee: "20",
    prize_pool: "5000",
    start_time: "",
    registration_deadline: "",
    status: "draft",
    rules: "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/tournaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMessage(data.message || "Event created");
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold">{t("formTitle")}</p>
            <h1 className="text-3xl font-semibold">{t("formTitle")}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/admin?lang=${locale}`} className="btn-secondary">{t("backHome")}</Link>
            <LanguageSwitcher locale={locale} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-8">
          <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="Event title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
          <div className="grid gap-4 md:grid-cols-2">
            <input type="number" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="Entry Fee" value={form.entry_fee} onChange={(e) => setForm({ ...form, entry_fee: e.target.value })} />
            <input type="number" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="Prize Pool" value={form.prize_pool} onChange={(e) => setForm({ ...form, prize_pool: e.target.value })} />
            <input type="datetime-local" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} />
            <input type="datetime-local" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" value={form.registration_deadline} onChange={(e) => setForm({ ...form, registration_deadline: e.target.value })} />
          </div>
          <textarea className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="Rules" value={form.rules} onChange={(e) => setForm({ ...form, rules: e.target.value })} rows={3} />
          <select className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="live">Live</option>
            <option value="closed">Closed</option>
          </select>
          <button className="btn-primary" type="submit">{t("formButton")}</button>
        </form>

        {message && <div className="mt-6 rounded-xl border border-gold/20 bg-gold/10 p-4 text-sm text-gold">{message}</div>}
      </div>
    </main>
  );
}
