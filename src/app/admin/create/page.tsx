"use client";
import { useState, useEffect } from "react";
import { uploadNoticeImage } from "@/lib/uploadImage";
import { createClient } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Group {
  id: string;
  group_name: string;
  access_id?: string; // Unique ID support
}

export default function AdminUpload() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);

  // 1. Bulk State Logic
  const [bulkGroups, setBulkGroups] = useState([{ name: "", id: "" }]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tag: "General",
    groupId: "",
  });
  const [file, setFile] = useState<File | null>(null);

  // Groups Fetch logic
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
        if (data) setGroups(data);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  useEffect(() => {
    fetchMyGroups();
  }, [supabase]);

  // Bulk Actions
  const addRow = () => {
    if (bulkGroups.length < 10) {
      setBulkGroups([...bulkGroups, { name: "", id: "" }]);
    }
  };

  const handleBulkSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Session expired!");

    const newGroups = bulkGroups
      .filter((g) => g.name && g.id) // Khali rows filter karein
      .map((g) => ({
        group_name: g.name,
        access_id: g.id.toUpperCase(),
        org_id: user.id,
      }));

    const { error } = await supabase.from("groups").insert(newGroups);

    if (!error) {
      alert("Groups saved!");
      setBulkGroups([{ name: "", id: "" }]);
      fetchMyGroups();
    } else {
      alert("Error: " + error.message);
    }
  };

  const deleteGroup = async (groupId: string) => {
    if (
      confirm(
        "Kya aap sach mein ye group permanently delete karna chahte hain? Saare notices bhi ud jayenge!",
      )
    ) {
      const { error } = await supabase
        .from("groups")
        .delete()
        .eq("id", groupId);
      if (!error) fetchMyGroups();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.groupId) return alert("Please select a target group!");

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
        alert("Notice Posted Successfully!");
        setFormData({ ...formData, title: "", content: "" });
        setFile(null);
      }
    } catch (err) {
      alert("Error uploading!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-zinc-950 border border-zinc-800 rounded-2xl mt-10">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Post New Notice
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Target Group Dropdown */}
        <div className="space-y-1">
          <label className="text-sm text-zinc-400 ml-1">Target Group</label>
          <select
            className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setFormData({ ...formData, groupId: e.target.value })
            }
            required
            value={formData.groupId}
          >
            <option value="">Select a Group</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.group_name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. The Power Manager UI (Dropdown ke niche) */}
        <div className="mt-8 p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Manage Groups</h3>
            <button
              type="button"
              onClick={addRow}
              className="text-blue-500 hover:text-blue-400 text-sm font-bold"
            >
              + Add Row (Max 10)
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {bulkGroups.map((group, index) => (
              <div key={index} className="flex gap-2">
                <input
                  placeholder="Group Name"
                  className="flex-1 bg-black border border-zinc-800 p-2 rounded-lg text-sm text-white"
                  value={group.name}
                  onChange={(e) => {
                    const newArr = [...bulkGroups];
                    newArr[index].name = e.target.value;
                    setBulkGroups(newArr);
                  }}
                />
                <input
                  placeholder="ID (e.g. CS-10)"
                  className="flex-1 bg-black border border-zinc-800 p-2 rounded-lg text-sm uppercase text-white"
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
              type="button"
              onClick={handleBulkSave}
              className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-bold mt-2 text-white"
            >
              Save All New Groups
            </button>
          </div>

          <div className="border-t border-zinc-800 pt-6">
            <h4 className="text-sm font-bold text-zinc-500 mb-4 uppercase tracking-widest">
              Active Groups
            </h4>
            <div className="grid gap-2">
              {groups.map((g) => (
                <div
                  key={g.id}
                  className="flex justify-between items-center bg-black p-3 rounded-lg border border-zinc-800"
                >
                  <span className="text-sm font-medium text-white">
                    {g.group_name}{" "}
                    <span className="text-zinc-500 ml-2">
                      ({g.access_id || "No ID"})
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteGroup(g.id)}
                    className="text-red-500 hover:bg-red-500/10 p-2 rounded-md transition"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notice Form Continued */}
        <input
          type="text"
          placeholder="Notice Title"
          value={formData.title}
          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Notice Description..."
          rows={4}
          value={formData.content}
          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        />

        <select
          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white"
          onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
          value={formData.tag}
        >
          <option value="General">General</option>
          <option value="Urgent">Urgent</option>
          <option value="Event">Event</option>
          <option value="Holiday">Holiday</option>
        </select>

        <div className="relative border-2 border-dashed border-zinc-700 p-4 rounded-lg text-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <p className="text-sm text-zinc-400">
            {file ? file.name : "Attach Image (Optional)"}
          </p>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Notice to DateUp"}
        </button>
      </form>
    </div>
  );
}
