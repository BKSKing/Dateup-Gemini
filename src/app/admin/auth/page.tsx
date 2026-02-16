"use client";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN LOGIC
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        // SIGNUP LOGIC
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        alert("Verification link sent to your email!");
      }

      // Success: Redirect to Dashboard
      router.push("/admin/create");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full"></div>

      <div className="relative w-full max-w-[450px] animate-in fade-in slide-in-from-top-4 duration-700">
        {/* BACK TO HOME */}
        <Link
          href="/"
          className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-8 transition"
        >
          ← Back to Portal
        </Link>

        <div className="bg-zinc-950/40 backdrop-blur-2xl border border-zinc-800/50 p-10 rounded-[3rem] shadow-3xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">
              {isLogin ? "Admin Login" : "Create Org"}
            </h2>
            <p className="text-zinc-500 text-[10px] font-bold mt-2 uppercase tracking-widest">
              {isLogin
                ? "Manage your institution feed"
                : "Start broadcasting today"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@school.com"
                className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-600/40 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">
                Secret Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-600/40 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 shadow-xl disabled:opacity-50 mt-4"
            >
              {loading
                ? "PROCESSING..."
                : isLogin
                  ? "SIGN IN"
                  : "CREATE ACCOUNT"}
            </button>
          </form>

          {/* TOGGLE LOGIN/SIGNUP */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-black text-zinc-500 hover:text-blue-500 uppercase tracking-widest transition"
            >
              {isLogin
                ? "New here? Create an Organization"
                : "Already have an account? Log in"}
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-zinc-700 text-[9px] font-bold uppercase tracking-[0.2em]">
          End-to-End Encrypted Admin Session
        </p>
      </div>
    </div>
  );
}
