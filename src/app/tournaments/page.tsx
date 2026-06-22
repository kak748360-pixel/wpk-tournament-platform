import Link from "next/link";
import { getLocale, getText } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

async function getTournaments() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/tournaments`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function TournamentsPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const params = await searchParams;
  const locale = getLocale(params);
  const t = (key: keyof typeof import("@/lib/i18n").translations[typeof locale]) => getText(locale, key);
  const tournaments = await getTournaments();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold">{t("tournamentTitle")}</p>
            <h1 className="text-3xl font-semibold">{t("tournamentSubtitle")}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/?lang=${locale}`} className="btn-secondary">{t("backHome")}</Link>
            <LanguageSwitcher locale={locale} />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tournaments.map((t: any) => (
            <div key={t.id} className="card p-6">
              <div className="text-sm uppercase tracking-[0.3em] text-gold">{t.status}</div>
              <h3 className="mt-3 text-2xl font-semibold">{t.title}</h3>
              <p className="mt-3 text-sm text-slate-400">{t.description}</p>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <div>Open: {new Date(t.start_time).toLocaleString("zh-CN")}</div>
                <div>Entry: ${t.entry_fee}</div>
                <div>Prize: ${t.prize_pool}</div>
              </div>
              <div className="mt-6">
                <Link href={`/tournaments/${t.id}?lang=${locale}`} className="btn-primary w-full">
                  {t("ctaPrimary")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
