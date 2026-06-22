"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { getLocale, getText } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const locale = getLocale({ lang: searchParams.get("lang") || undefined });
  const t = (key: keyof typeof import("@/lib/i18n").translations[typeof locale]) => getText(locale, key);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="card w-full max-w-md p-8">
        <div className="mb-4 flex justify-end">
          <LanguageSwitcher locale={locale} />
        </div>
        <p className="text-sm uppercase tracking-[0.3em] text-gold">{t("loginTitle")}</p>
        <h1 className="mt-4 text-3xl font-semibold">Poker League Platform</h1>
        <p className="mt-3 text-sm text-slate-400">{t("loginSubtitle")}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
            required
          />
          <button type="submit" className="btn-primary w-full">
            {t("ctaPrimary")}
          </button>
        </form>

        {submitted && (
          <div className="mt-6 rounded-xl border border-gold/20 bg-gold/10 p-4 text-sm text-gold">
            {locale === "en" ? "Auth flow is ready. Connect Supabase Auth next." : locale === "fr" ? "Le flux d'authentification est prêt. Connectez Supabase Auth ensuite." : "登录/注册流程已准备好，接入 Supabase Auth 后即可启用真实邮箱登录。"}
          </div>
        )}

        <div className="mt-6">
          <Link href={`/?lang=${locale}`} className="text-sm text-slate-400 hover:text-white">
            {t("backHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
