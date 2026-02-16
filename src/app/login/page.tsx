"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Navigation ke liye Link add kiya

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
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>

      <div className="relative w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* LOGO SECTION */}
        <div className="text-center mb-10">
          <h1 className="text-6xl font-black text-white tracking-tighter italic mb-2">
            DATE<span className="text-blue-600">UP</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            Premium Viewer Portal
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-zinc-950/50 backdrop-blur-xl border border-zinc-800/50 p-8 rounded-[2.5rem] shadow-2xl">
          <form onSubmit={handleJoin} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
                Enter Group Access ID
              </label>
              <input
                type="text"
                placeholder="E.G. CS-BATCH-2024"
                className="w-full bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl text-white text-center font-mono text-lg uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/50 transition-all placeholder:text-zinc-700"
                value={accessId}
                onChange={(e) => setAccessId(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)] disabled:opacity-50"
            >
              {loading ? "VERIFYING..." : "ENTER PORTAL"}
            </button>
          </form>

          {/* HR LINE SEPARATOR */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-zinc-600">
              <span className="bg-[#0b0b0b] px-2">Admin Only</span>
            </div>
          </div>

          {/* ORG/ADMIN LOGIN REDIRECT */}
          <Link
            href="/admin/login"
            className="w-full py-3 flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-2xl transition-all text-xs font-bold"
          >
            <span>🛡️</span> Organization Login
          </Link>
        </div>

        <p className="text-center mt-8 text-zinc-600 text-[10px] font-medium tracking-wide uppercase">
          Private Access Only • Secure Encryption
        </p>
      </div>
    </div>
  );
}
