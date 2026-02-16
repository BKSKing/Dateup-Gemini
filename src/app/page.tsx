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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0a0f1f] to-[#ff7a00] px-6">
      <div className="relative w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-10">
          <h1 className="text-6xl font-extrabold tracking-tighter">
            <span className="text-white">DATE</span>
            <span className="text-orange-500">UP</span>
          </h1>
          <p className="text-orange-500/60 text-[10px] uppercase tracking-[0.5em] mt-3 font-medium">
            Smart Digital Notice System
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-orange-500/20 p-10 rounded-3xl shadow-2xl">
          <form onSubmit={handleJoin} className="space-y-8">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                Student Access ID
              </label>

              <input
                type="text"
                placeholder="ENTER ACCESS ID"
                value={accessId}
                onChange={(e) => setAccessId(e.target.value)}
                required
                className="w-full bg-[#0a0f1f] border border-slate-700 p-4 rounded-2xl text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all uppercase tracking-widest placeholder:text-slate-600"
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-black font-black rounded-2xl transition-all duration-300 active:scale-95 shadow-lg shadow-orange-600/20 uppercase tracking-widest text-sm"
            >
              {loading ? "Verifying..." : "Access Notices"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-800"></div>
            <span className="text-slate-600 text-[9px] uppercase tracking-[0.3em]">
              Portal
            </span>
            <div className="flex-1 h-px bg-slate-800"></div>
          </div>

          <Link
            href="/admin/auth"
            className="w-full flex items-center justify-center py-3 border border-slate-800 text-slate-400 hover:text-orange-400 hover:border-orange-500/50 rounded-xl transition-all uppercase text-[10px] tracking-[0.2em] font-medium"
          >
            Admin Login
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-center gap-6">
          <span className="text-slate-500 text-[10px] uppercase tracking-widest">
            Secure
          </span>
          <span className="text-slate-500 text-[10px] uppercase tracking-widest">
            Institutional
          </span>
        </div>
      </div>
    </div>
  );
}
