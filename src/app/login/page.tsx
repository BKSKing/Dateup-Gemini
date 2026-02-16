"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function ViewerLogin() {
  const [accessId, setAccessId] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Supabase Client Initialization
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessId.trim()) return;

    setLoading(true);

    // Note: Agar aap Access ID se hi auth karna chahte hain,
    // toh aapko Supabase mein common password ya custom function use karna hoga.
    // Filhal ye check kar raha hai ki ID valid format mein hai ya nahi.
    try {
      // Logic for Supabase check (Example: Checking if a group exists with this ID)
      const { data, error } = await supabase
        .from("groups") // 'groups' table check kar rahe hain
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
      {/* Premium Background Grid Effect */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>

      <div className="relative w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center mb-10">
          <h1 className="text-6xl font-black text-white tracking-tighter italic mb-2">
            DATE<span className="text-blue-600">UP</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">
            Premium Viewer Portal
          </p>
        </div>

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
              className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "VERIFYING..." : "ENTER PORTAL"}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-zinc-600 text-[10px] font-medium tracking-wide uppercase">
          Private Access Only • Secure Encryption
        </p>
      </div>
    </div>
  );
}
