"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const changeLocale = (next: Locale) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("lang", next);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-2 text-sm">
      <span className="text-slate-400">语言</span>
      {locales.map((item) => (
        <button
          key={item}
          onClick={() => changeLocale(item)}
          className={`rounded-full px-2 py-1 ${item === locale ? "bg-gold text-slate-950" : "text-slate-300 hover:bg-slate-800"}`}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
