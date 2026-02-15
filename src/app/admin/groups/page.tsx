"use client";
import { useState, useEffect } from "react";
import { generateAccessId } from "@/lib/generateId";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function GroupManager() {
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const orgName = "DATEUP"; // Ye org profile se aayega
  const orgId = "UUID-HERE"; // Logged in org ki ID

  // 1. Fetch existing groups
  const fetchGroups = async () => {
    const { data } = await supabase
      .from("groups")
      .select("*")
      .eq("org_id", orgId);
    if (data) setGroups(data);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // 2. Create New Group Logic
  const handleCreate = async () => {
    const newAccessId = generateAccessId(orgName, groupName);

    const { error } = await supabase
      .from("groups")
      .insert([
        { org_id: orgId, group_name: groupName, access_id: newAccessId },
      ]);

    if (!error) {
      alert(`Group Created! ID: ${newAccessId}`);
      setGroupName("");
      fetchGroups();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8">Manage Groups & Access IDs</h1>

      {/* Create Section */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-10">
        <h3 className="text-lg font-semibold mb-4 text-blue-400">
          Create New Target Group
        </h3>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="e.g. Male Staff, Class 10th, HR Dept"
            className="flex-1 p-3 bg-black border border-zinc-700 rounded-lg focus:outline-none"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition"
          >
            Generate & Save
          </button>
        </div>
      </div>

      {/* List Section */}
      <div className="grid gap-4">
        <h3 className="text-xl font-semibold mb-2">Active Groups</h3>
        {groups.map((group) => (
          <div
            key={group.id}
            className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl"
          >
            <div>
              <p className="font-bold text-lg">{group.group_name}</p>
              <p className="text-zinc-500 text-sm italic">
                ID:{" "}
                <span className="text-blue-500 font-mono">
                  {group.access_id}
                </span>
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(group.access_id);
                alert("ID Copied! Ab ise WhatsApp par share kar do.");
              }}
              className="px-4 py-2 text-xs border border-zinc-700 hover:bg-zinc-800 rounded-md transition"
            >
              Copy Access ID
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
