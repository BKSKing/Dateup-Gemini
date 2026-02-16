"use client";
import { useState, useEffect } from "react";
import { uploadNoticeImage } from "@/lib/uploadImage";
import { createClient } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Group {
  id: string;
  group_name: string;
  access_id: string;
}

export default function AdminUpload() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [bulkGroups, setBulkGroups] = useState([{ name: "", id: "" }]);
  const [file, setFile] = useState<File | null>(null);

  // Naya State: Group List ko toggle karne ke liye
  const [showManage, setShowManage] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tag: "General",
    groupId: "",
  });

  // 1. Groups Fetch Logic
  const fetchMyGroups = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("groups")
          .select("id, group_name, access_id")
          .eq("org_id", user.id);
        if (error) throw error;
        if (data) setGroups(data as Group[]);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  useEffect(() => {
    fetchMyGroups();
  }, []);

  // 2. Bulk Save Logic
  const handleBulkSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Session expired! Please login again.");

    const newGroups = bulkGroups
      .filter((g) => g.name.trim() && g.id.trim())
      .map((g) => ({
        group_name: g.name,
        access_id: g.id.toUpperCase().trim(),
        org_id: user.id,
      }));

    if (newGroups.length === 0)
      return alert("Pehle Group ka naam aur ID bharo!");

    const { error } = await supabase.from("groups").insert(newGroups);

    if (!error) {
      alert("Mubarak ho! Saare groups save ho gaye.");
      setBulkGroups([{ name: "", id: "" }]);
      fetchMyGroups();
    } else {
      alert("Error: ID duplicate ho sakti hai: " + error.message);
    }
  };

  // 3. Delete Logic
  const deleteGroup = async (groupId: string) => {
    if (
      confirm(
        "🚨 Warning: Is group ko delete karne se iske saare notices bhi ud jayenge. Continue?",
      )
    ) {
      const { error } = await supabase
        .from("groups")
        .delete()
        .eq("id", groupId);

      if (!error) {
        alert("Group permanently delete ho gaya!");
        fetchMyGroups();
      } else {
        alert("Delete nahi ho paya: " + error.message);
      }
    }
  };

  // 4. Notice Submission Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.groupId) return alert("Pehle target group select karo!");

    setLoading(true);
    try {
      let imageUrl = "";
      if (file) imageUrl = await uploadNoticeImage(file);

      const res = await fetch("/api/notices/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, imageUrl }),
      });

      if (res.ok) {
        alert("Notice Published Successfully!");
        setFormData({ ...formData, title: "", content: "" });
        setFile(null);
      }
    } catch (err) {
      alert("System Error: Upload fail ho gaya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10 mb-20">
      {/* SECTION 1: POST NOTICE */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>📤</span> Post New Notice
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-zinc-500 uppercase font-bold ml-1">
              Target Group
            </label>
            <select
              className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 mt-1 cursor-pointer"
              onChange={(e) =>
                setFormData({ ...formData, groupId: e.target.value })
              }
              value={formData.groupId}
              required
            >
              <option value="">Select a target group...</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.group_name} ({g.access_id})
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Notice Title (e.g. Exam Timetable)"
            className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Write your notice description here..."
            rows={4}
            className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white cursor-pointer"
              onChange={(e) =>
                setFormData({ ...formData, tag: e.target.value })
              }
              value={formData.tag}
            >
              <option value="General">General</option>
              <option value="Urgent">Urgent</option>
              <option value="Holiday">Holiday</option>
              <option value="Event">Event</option>
            </select>
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden border-dashed hover:border-zinc-600 transition">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-xs text-zinc-400 font-medium text-center px-2">
                {file ? `✅ ${file.name.substring(0, 15)}` : "📷 Attach Image"}
              </span>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition shadow-lg shadow-blue-900/20 active:scale-[0.98]"
          >
            {loading ? "PUBLISHING..." : "PUSH NOTICE TO VIEWERS"}
          </button>
        </form>
      </div>

      {/* SECTION 2: BULK GROUP CREATOR */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 border-t-4 border-t-green-600">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>👥</span> Create New Groups
          </h3>
          <button
            type="button"
            onClick={() => setBulkGroups([...bulkGroups, { name: "", id: "" }])}
            className="text-blue-500 text-xs font-bold bg-blue-500/10 px-3 py-1 rounded-full hover:bg-blue-500/20 transition"
          >
            + Add Another Row
          </button>
        </div>

        <div className="space-y-3">
          {bulkGroups.map((group, index) => (
            <div key={index} className="flex gap-2">
              <input
                placeholder="Group Name (Class 10)"
                className="flex-1 bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-sm text-white outline-none focus:border-zinc-600 transition"
                value={group.name}
                onChange={(e) => {
                  const newArr = [...bulkGroups];
                  newArr[index].name = e.target.value;
                  setBulkGroups(newArr);
                }}
              />
              <input
                placeholder="ID (C10-XYZ)"
                className="w-1/3 bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-sm uppercase text-white outline-none focus:border-zinc-600 transition"
                value={group.id}
                onChange={(e) => {
                  const newArr = [...bulkGroups];
                  newArr[index].id = e.target.value;
                  setBulkGroups(newArr);
                }}
              />
            </div>
          ))}
          <button
            onClick={handleBulkSave}
            className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl font-bold text-white mt-4 transition active:scale-[0.98]"
          >
            SAVE ALL GROUPS
          </button>
        </div>
      </div>

      {/* SECTION 3: TOGGLEABLE GROUP IDS & MANAGEMENT */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 border-t-4 border-t-red-600 transition-all">
        {/* The Toggle Button */}
        <button
          onClick={() => setShowManage(!showManage)}
          className="w-full flex justify-between items-center py-2 px-2 text-zinc-400 hover:text-white transition group"
        >
          <span className="text-sm font-bold uppercase tracking-tighter flex items-center gap-2">
            {showManage ? "📂 Close Management" : "📁 View & Manage All Groups"}
          </span>
          <span className="text-xl font-mono group-hover:scale-125 transition-transform">
            {showManage ? "−" : "+"}
          </span>
        </button>

        {/* Expandable Content */}
        {showManage && (
          <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="overflow-x-auto border border-zinc-900 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-900 text-zinc-400 text-[10px] uppercase font-black">
                  <tr>
                    <th className="p-4">Group Name</th>
                    <th className="p-4 text-center">Viewer Access ID</th>
                    <th className="p-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {groups.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-10 text-center text-zinc-600 italic text-sm"
                      >
                        No groups found. Create one above!
                      </td>
                    </tr>
                  )}
                  {groups.map((g) => (
                    <tr
                      key={g.id}
                      className="hover:bg-zinc-900/30 transition group"
                    >
                      <td className="p-4 text-white font-medium">
                        {g.group_name}
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-md font-mono text-sm border border-blue-500/20 shadow-sm">
                          {g.access_id}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => deleteGroup(g.id)}
                          className="text-zinc-600 hover:text-red-500 p-2 transition-all hover:rotate-12"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-zinc-600 italic text-center px-4">
              * Note: Share the **Access ID** with your students/viewers so they
              can join their respective notice feeds.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
