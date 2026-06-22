"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getCurrentUser, signInWithEmail, signOut, signUpWithEmail } from "@/lib/supabase/auth";
import { getLocale, getText } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const locale = getLocale({ lang: searchParams.get("lang") || undefined });
  const t = (key: keyof typeof import("@/lib/i18n").translations[typeof locale]) => getText(locale, key);

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    getCurrentUser().then((user) => {
      if (active) setUserEmail(user?.email ?? null);
    });

    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUserEmail(session?.user?.email ?? null);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        await signUpWithEmail(email, password, nickname || email.split("@")[0]);
        setMessage(locale === "en" ? "Account created. Please check your inbox for confirmation." : locale === "fr" ? "Compte créé. Veuillez vérifier votre boîte mail pour confirmer." : "账号创建成功，请查收邮件完成确认。" );
      } else {
        await signInWithEmail(email, password);
        setMessage(locale === "en" ? "Signed in successfully." : locale === "fr" ? "Connexion réussie." : "登录成功。" );
      }
      setUserEmail(email);
    } catch (error: any) {
      setMessage(error?.message || "Auth failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUserEmail(null);
    setMessage(locale === "en" ? "Signed out." : locale === "fr" ? "Déconnecté." : "已退出登录。" );
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

        {userEmail ? (
          <div className="mt-8 rounded-xl border border-gold/20 bg-gold/10 p-4 text-sm text-gold">
            <div>{locale === "en" ? "Signed in as" : locale === "fr" ? "Connecté en tant que" : "当前登录账号"}: {userEmail}</div>
            <button onClick={handleLogout} className="btn-secondary mt-4 w-full">
              {locale === "en" ? "Sign Out" : locale === "fr" ? "Se déconnecter" : "退出登录"}
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6 flex gap-2 rounded-full border border-white/10 bg-slate-900/70 p-1">
              <button className={`flex-1 rounded-full px-3 py-2 ${mode === "login" ? "bg-gold text-slate-950" : "text-slate-300"}`} onClick={() => setMode("login")}>Login</button>
              <button className={`flex-1 rounded-full px-3 py-2 ${mode === "signup" ? "bg-gold text-slate-950" : "text-slate-300"}`} onClick={() => setMode("signup")}>Sign Up</button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {mode === "signup" && (
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={locale === "en" ? "Nickname" : locale === "fr" ? "Pseudo" : "昵称"}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
                />
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={locale === "en" ? "Password" : locale === "fr" ? "Mot de passe" : "密码"}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
                required
              />
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? (locale === "en" ? "Working..." : locale === "fr" ? "Traitement..." : "处理中...") : mode === "login" ? (locale === "en" ? "Sign In" : locale === "fr" ? "Se connecter" : "登录") : (locale === "en" ? "Create Account" : locale === "fr" ? "Créer un compte" : "创建账号")}
              </button>
            </form>
          </>
        )}

        {message && (
          <div className="mt-6 rounded-xl border border-gold/20 bg-gold/10 p-4 text-sm text-gold">
            {message}
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
