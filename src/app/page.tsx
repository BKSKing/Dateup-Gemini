"use client";

import "./globals.css";
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
        alert("Invalid Access ID. Please verify with your department.");
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
    // Background: Deep Navy Slate
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-6 relative">
      {/* Subtle Professional Ambient Light */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-900/10 blur-[120px] rounded-full"></div>

      <div className="relative w-full max-w-[400px]">
        {/* BRANDING: Bold, Straight, Clean */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white tracking-tight mb-2">
            DATE<span className="text-orange-500">UP</span>
          </h1>
          <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-[0.3em]">
            Digital Notice Board System
          </p>
        </div>

        {/* MAIN CARD: Solid Professional Feel */}
        <div className="bg-[#0F172A] border border-slate-800/60 p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleJoin} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Student Access Portal
              </label>
              <input
                type="text"
                placeholder="Enter Access ID"
                className="w-full bg-[#1E293B] border border-slate-700 p-4 rounded-xl text-white font-medium text-lg uppercase tracking-wider outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder:text-slate-600"
                value={accessId}
                onChange={(e) => setAccessId(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition-all active:scale-[0.98] shadow-lg shadow-orange-950/20 uppercase text-sm tracking-widest"
            >
              {loading ? "Verifying..." : "View Notices"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-[1px] flex-1 bg-slate-800"></div>
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">
              Admin Area
            </span>
            <div className="h-[1px] flex-1 bg-slate-800"></div>
          </div>

          <Link
            href="/admin/auth"
            className="w-full py-3 flex items-center justify-center gap-2 bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all text-[11px] font-bold uppercase tracking-wide"
          >
            Organization Login
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-slate-700 text-[10px] font-medium">
          Secure Institutional Access • © 2026 DateUp
        </p>
      </div>
    </div>
  );
}
