"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else router.push("/admin/dashboard"); // Login ke baad seedha dashboard
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
      <input
        type="email"
        placeholder="Email"
        className="p-3 mb-4 bg-zinc-900 border border-zinc-800 rounded w-80"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="p-3 mb-6 bg-zinc-900 border border-zinc-800 rounded w-80"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 px-10 py-3 rounded-lg font-bold"
      >
        Entry
      </button>
    </div>
  );
}
