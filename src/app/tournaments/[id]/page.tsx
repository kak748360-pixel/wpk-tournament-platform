import Link from "next/link";
import { getLocale, getText } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import TournamentRegisterCard from "@/components/TournamentRegisterCard";

async function getTournament(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/tournaments/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function TournamentDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ lang?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  const locale = getLocale(query);
  const t = (key: keyof typeof import("@/lib/i18n").translations[typeof locale]) => getText(locale, key);
  const tournament = await getTournament(id);

  if (!tournament) {
    return <div className="p-10 text-center text-slate-400">{t("tournamentTitle")}</div>;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href={`/tournaments?lang=${locale}`} className="btn-secondary">{t("backHome")}</Link>
          <LanguageSwitcher locale={locale} />
        </div>

        <div className="card p-8">
          <div className="text-sm uppercase tracking-[0.3em] text-gold">{tournament.status}</div>
          <h1 className="mt-3 text-4xl font-semibold">{tournament.title}</h1>
          <p className="mt-5 text-lg text-slate-300">{tournament.description}</p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-6">
              <h2 className="text-xl font-semibold">{t("highlightTitle")}</h2>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <div>Entry: ${tournament.entry_fee}</div>
                <div>Prize: ${tournament.prize_pool}</div>
                <div>Start: {new Date(tournament.start_time).toLocaleString("zh-CN")}</div>
                <div>Deadline: {new Date(tournament.registration_deadline || tournament.start_time).toLocaleString("zh-CN")}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-6">
              <h2 className="text-xl font-semibold">{t("rulesTitle")}</h2>
              <p className="mt-4 text-sm text-slate-300">{tournament.rules || t("rulesText")}</p>
              <div className="mt-6">
                <a href={`/login?lang=${locale}`} className="btn-primary">
                  {t("ctaPrimary")}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <TournamentRegisterCard tournamentId={id} />
          </div>
        </div>
      </div>
    </main>
  );
}
