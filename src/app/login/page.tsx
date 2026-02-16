"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ViewerLogin() {
  const [accessId, setAccessId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessId.trim()) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("access_id", accessId.toUpperCase())
        .single();

      if (error || !data) {
        alert("Invalid Access ID. Please check with your admin.");
      } else {
        router.push(`/feed/${accessId.toUpperCase()}`);
      }
    } catch (err) {
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full"></div>

      <div className="relative w-full max-w-[420px] animate-in fade-in zoom-in duration-700">
        {/* BRANDING */}
        <div className="text-center mb-12">
          <h1 className="text-7xl font-black text-white tracking-tighter italic mb-3">
            DATE<span className="text-blue-600">UP</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] opacity-80">
            Digital Notice Board System
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="bg-zinc-950/40 backdrop-blur-2xl border border-zinc-800/50 p-10 rounded-[3rem] shadow-3xl">
          <form onSubmit={handleJoin} className="space-y-8">
            <div className="space-y-4 text-center">
              <span className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em] bg-blue-500/10 px-3 py-1 rounded-full">
                Student Portal
              </span>
              <input
                type="text"
                placeholder="ENTER ACCESS ID"
                className="w-full bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-3xl text-white text-center font-mono text-xl uppercase tracking-[0.2em] outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600/40 transition-all placeholder:text-zinc-800"
                value={accessId}
                onChange={(e) => setAccessId(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-5 bg-white text-black font-black rounded-3xl hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
            >
              {loading ? "VERIFYING..." : "VIEW NOTICES"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-10">
            <div className="h-[1px] flex-1 bg-zinc-900"></div>
            <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">
              Control Center
            </span>
            <div className="h-[1px] flex-1 bg-zinc-900"></div>
          </div>

          {/* FIX: Direct path to our custom Auth Page */}
          <Link
            href="/admin/auth"
            className="group w-full py-4 flex items-center justify-center gap-3 bg-zinc-900/50 border border-zinc-800/50 text-zinc-500 hover:text-white hover:border-zinc-700 rounded-3xl transition-all text-xs font-black uppercase tracking-widest"
          >
            🛡️ Organization Login
          </Link>
        </div>
      </div>
    </div>
  );
}
