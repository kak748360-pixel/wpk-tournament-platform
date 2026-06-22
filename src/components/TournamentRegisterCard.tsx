"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/supabase/auth";
import { useEffect, useState } from "react";

export default function TournamentRegisterCard({ tournamentId }: { tournamentId: string }) {
  const [user, setUser] = useState<any>(null);
  const [txHash, setTxHash] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    getCurrentUser().then((currentUser) => {
      if (active) setUser(currentUser);
    });

    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage("Please sign in first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          tournament_id: tournamentId,
          payment_status: txHash ? "paid" : "pending",
          payment_method: "USDT",
          tx_hash: txHash,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      setMessage(`Registration submitted. Status: ${data.registration.payment_status}`);
      setTxHash("");
    } catch (error: any) {
      setMessage(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-6">
      <h2 className="text-xl font-semibold">USDT Registration</h2>
      <p className="mt-3 text-sm text-slate-400">Only USDT payment is accepted. Please send the payment and paste the transaction hash.</p>
      {user ? (
        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <input
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
            placeholder="USDT transaction hash"
          />
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Register"}
          </button>
        </form>
      ) : (
        <div className="mt-6 rounded-xl border border-gold/20 bg-gold/10 p-4 text-sm text-gold">
          Please sign in to register for this event.
        </div>
      )}
      {message && <div className="mt-4 text-sm text-slate-300">{message}</div>}
    </div>
  );
}
