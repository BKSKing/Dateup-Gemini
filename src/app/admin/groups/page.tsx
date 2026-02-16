"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Apna path check kar lena
import { generateAccessId } from "@/lib/generateId";

export default function GroupsPage() {
  const [groupName, setGroupName] = useState("");
  const [accessId, setAccessId] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const orgName = "DATEUP"; // Ye context ya profile se bhi le sakte ho

  // 1. Fetch Groups (Logged-in User ke basis par)
  const fetchGroups = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("admin_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setGroups(data);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // 2. Handle Name Change (Auto-suggest Access ID)
  const handleNameChange = (val: string) => {
    setGroupName(val);
    if (val.trim().length > 2) {
      const suggestedId = generateAccessId(orgName, val);
      setAccessId(suggestedId);
    }
  };

  // 3. Create Group Logic
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Session expired! Please login again.");
      return;
    }

    const { error } = await supabase.from("groups").insert([
      {
        group_name: groupName,
        access_id: accessId.trim().toUpperCase(),
        admin_id: user.id,
        org_id: "UUID-HERE", // Agar org tracking chahiye toh
      },
    ]);

    if (error) {
      alert("Error: ID must be unique! Choose a different Access ID.");
      console.error(error);
    } else {
      alert(`Group "${groupName}" created successfully!`);
      setGroupName("");
      setAccessId("");
      fetchGroups();
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-black min-h-screen text-white font-sans">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Manage Groups</h1>
        <p className="text-zinc-400 mt-2">
          Create and share unique IDs with your members.
        </p>
      </header>

      {/* Input Form */}
      <form
        onSubmit={handleCreateGroup}
        className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-12 shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Target Group Name
            </label>
            <input
              required
              value={groupName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Male Staff or Class 10th"
              className="w-full bg-black border border-zinc-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Access ID (Unique)
            </label>
            <input
              required
              value={accessId}
              onChange={(e) => setAccessId(e.target.value.toUpperCase())}
              placeholder="AUTO-GENERATED"
              className="w-full bg-zinc-950 border border-zinc-700 p-3 rounded-xl text-blue-400 font-mono focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
        </div>
        <button
          disabled={loading}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98]"
        >
          {loading ? "Creating..." : "Generate & Save Group"}
        </button>
      </form>

      {/* Active Groups List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Active Groups
        </h2>

        {groups.length === 0 && !loading && (
          <div className="text-center py-10 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500">
            No groups found. Create your first one above!
          </div>
        )}

        <div className="grid gap-3">
          {groups.map((group) => (
            <div
              key={group.id}
              className="flex justify-between items-center bg-zinc-900/40 p-5 rounded-xl border border-zinc-800 hover:border-zinc-600 transition"
            >
              <div>
                <h3 className="font-bold text-lg text-zinc-100">
                  {group.group_name}
                </h3>
                <p className="text-blue-500 text-sm font-mono mt-1 select-all">
                  ID: {group.access_id}
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(group.access_id);
                  alert("Copied to clipboard!");
                }}
                className="px-4 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg border border-zinc-700 transition"
              >
                Copy ID
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
