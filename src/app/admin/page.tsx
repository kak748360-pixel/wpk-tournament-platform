import Link from "next/link";
import { getLocale, getText } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const params = await searchParams;
  const locale = getLocale(params);
  const t = (key: keyof typeof import("@/lib/i18n").translations[typeof locale]) => getText(locale, key);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold">{t("adminSubtitle")}</p>
            <h1 className="text-3xl font-semibold">{t("adminTitle")}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/?lang=${locale}`} className="btn-secondary">{t("backHome")}</Link>
            <LanguageSwitcher locale={locale} />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="card p-6">
            <div className="text-sm text-slate-400">Total Users</div>
            <div className="mt-3 text-3xl font-semibold">0</div>
          </div>
          <div className="card p-6">
            <div className="text-sm text-slate-400">Total Tournaments</div>
            <div className="mt-3 text-3xl font-semibold">0</div>
          </div>
          <div className="card p-6">
            <div className="text-sm text-slate-400">Today Registrations</div>
            <div className="mt-3 text-3xl font-semibold">0</div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-xl font-semibold">{t("adminButtonsLabel")}</h2>
            <div className="mt-6 space-y-3">
              <Link href={`/admin/tournaments?lang=${locale}`} className="btn-secondary block w-full">
                {t("formTitle")}
              </Link>
              <a href={`/api/leaderboard?lang=${locale}`} className="btn-secondary block w-full" target="_blank" rel="noreferrer">
                Leaderboard API
              </a>
              <a href={`/api/announcements?lang=${locale}`} className="btn-secondary block w-full" target="_blank" rel="noreferrer">
                Announcements API
              </a>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold">{t("adminTodo")}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>{t("adminCreateTournament")}</li>
              <li>{t("adminReviewResults")}</li>
              <li>{t("adminPublishNotice")}</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
