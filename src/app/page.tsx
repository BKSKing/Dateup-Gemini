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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0B1120] to-black px-6 relative overflow-hidden">
      {/* Orange Glow Effect */}
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-orange-600/20 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-blue-900/20 blur-[120px] rounded-full"></div>

      <div className="relative w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-extrabold tracking-tight">
            <span className="text-white">DATE</span>
            <span className="text-orange-500">UP</span>
          </h1>
          <p className="text-slate-400 text-xs uppercase tracking-[0.4em] mt-2">
            Smart Digital Notice System
          </p>
        </div>

        {/* Glass Card */}
        <div className="bg-[#0F172A]/80 backdrop-blur-xl border border-slate-800 p-10 rounded-3xl shadow-[0_0_40px_rgba(255,115,0,0.15)]">
          <form onSubmit={handleJoin} className="space-y-8">
            {/* Input Section */}
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-widest mb-3">
                Student Access ID
              </label>
              <input
                type="text"
                placeholder="ENTER ACCESS ID"
                value={accessId}
                onChange={(e) => setAccessId(e.target.value)}
                required
                className="w-full bg-black border border-slate-700 p-4 rounded-2xl text-white text-lg tracking-widest uppercase outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all"
              />
            </div>

            {/* Button */}
            <button
              disabled={loading}
              className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-black font-bold rounded-2xl transition-all duration-300 active:scale-95 shadow-lg shadow-orange-900/30 uppercase tracking-wider"
            >
              {loading ? "Verifying..." : "Access Notices"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-10">
            <div className="flex-1 h-px bg-slate-800"></div>
            <span className="text-slate-600 text-[10px] uppercase tracking-widest">
              Organization
            </span>
            <div className="flex-1 h-px bg-slate-800"></div>
          </div>

          {/* Admin Button */}
          <Link
            href="/admin/auth"
            className="w-full flex items-center justify-center py-3 border border-slate-700 text-slate-400 hover:text-orange-400 hover:border-orange-500 rounded-2xl transition-all uppercase text-xs tracking-widest"
          >
            Admin Login
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center mt-10 text-slate-600 text-xs">
          Secure • Institutional • Encrypted
        </p>
      </div>
    </div>
  );
}
