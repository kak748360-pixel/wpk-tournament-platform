import Link from "next/link";
import { getLocale, getText } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

async function getTournaments() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/tournaments`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const params = await searchParams;
  const locale = getLocale(params);
  const t = (key: keyof typeof import("@/lib/i18n").translations[typeof locale]) => getText(locale, key);
  const tournaments = await getTournaments();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),_transparent_35%)]">
      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 lg:px-10">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-xl font-semibold tracking-wide">Poker League Platform</div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/?lang=${locale}`} className="btn-secondary">{t("navHome")}</Link>
            <Link href={`/tournaments?lang=${locale}`} className="btn-secondary">{t("navTournaments")}</Link>
            <Link href={`/admin?lang=${locale}`} className="btn-secondary">{t("navAdmin")}</Link>
            <LanguageSwitcher locale={locale} />
          </div>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card p-8">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold">{t("heroEyebrow")}</p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{t("heroTitle")}</h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-300">{t("heroSubtitle")}</p>
            <p className="mt-4 text-slate-400">{t("heroDescription")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/tournaments?lang=${locale}`} className="btn-primary">{t("ctaPrimary")}</Link>
              <Link href={`/admin?lang=${locale}`} className="btn-secondary">{t("ctaSecondary")}</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-400">
              <span>{t("paymentNote")}</span>
              <span>•</span>
              <span>中文 / English / Français</span>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-xl font-semibold">{t("highlightTitle")}</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-gold/20 bg-gold/10 p-4">
                <div className="text-sm text-gold">{t("highlightPrize")}</div>
                <div className="mt-2 text-3xl font-semibold">$50,000</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-800/70 p-4">
                <div className="text-sm text-slate-400">{t("highlightNewest")}</div>
                <div className="mt-2 text-xl font-semibold">{tournaments?.[0]?.title || "WPK Spring Open"}</div>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="card p-6">
            <div className="text-sm uppercase tracking-[0.3em] text-gold">{t("eventCardTitle")}</div>
            <h3 className="mt-3 text-2xl font-semibold">{t("heroTitle")}</h3>
            <p className="mt-3 text-sm text-slate-400">{t("eventCardText")}</p>
          </div>
          {tournaments.slice(0, 2).map((t: any) => (
            <div key={t.id} className="card p-6">
              <div className="text-sm uppercase tracking-[0.3em] text-gold">{t.status}</div>
              <h3 className="mt-3 text-2xl font-semibold">{t.title}</h3>
              <p className="mt-3 text-sm text-slate-400">{t.description}</p>
              <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
                <span>Fee: ${t.entry_fee}</span>
                <span>Prize: ${t.prize_pool}</span>
              </div>
              <div className="mt-6">
                <Link href={`/tournaments/${t.id}?lang=${locale}`} className="btn-secondary w-full">
                  {t("ctaSecondary")}
                </Link>
              </div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
