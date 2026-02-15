"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [id, setId] = useState("");
  const router = useRouter();

  const handleJoin = async () => {
    const res = await fetch("/api/validate-access", {
      method: "POST",
      body: JSON.stringify({ accessId: id }),
    });

    const data = await res.json();
    if (data.success) {
      // Success! Move to the feed page with the Group ID
      router.push(`/feed/${data.groupId}`);
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4">
      <h1 className="text-4xl font-bold mb-2">DateUp</h1>
      <p className="text-slate-400 mb-8 text-center">
        Enter your unique group ID to see latest notices.
      </p>

      <div className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="e.g. DPS-MALE-99"
          className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-500 outline-none uppercase"
          onChange={(e) => setId(e.target.value)}
        />
        <button
          onClick={handleJoin}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-all"
        >
          View Notice Feed
        </button>
      </div>
    </div>
  );
}
