"use client";
import { useState, useEffect } from "react";
import { uploadNoticeImage } from "@/lib/uploadImage";
import { createClient } from "@/lib/utils"; // Path fix kiya gaya hai

export const dynamic = "force-dynamic";

// TypeScript interface for Group
interface Group {
  id: string;
  group_name: string;
}

export default function AdminUpload() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]); // Type safety add ki

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tag: "General",
    groupId: "",
  });
  const [file, setFile] = useState<File | null>(null);

  // Groups Fetch karne ka logic
  useEffect(() => {
    const fetchMyGroups = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("groups")
            .select("id, group_name")
            .eq("org_id", user.id);

          if (error) throw error;
          if (data) setGroups(data);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchMyGroups();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.groupId) {
      alert("Please select a target group!");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = "";
      if (file) {
        imageUrl = await uploadNoticeImage(file);
      }

      const res = await fetch("/api/notices/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, imageUrl }),
      });

      if (res.ok) {
        alert("Notice Posted Successfully!");
        // Form reset logic (Optional)
        setFormData({ ...formData, title: "", content: "" });
        setFile(null);
      } else {
        alert("Failed to post notice.");
      }
    } catch (err) {
      alert("Error uploading!");
      console.error(err);
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

        {/* Title */}
        <input
          type="text"
          placeholder="Notice Title"
          value={formData.title}
          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        {/* Content */}
        <textarea
          placeholder="Notice Description..."
          rows={4}
          value={formData.content}
          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        />

        {/* Tag Selector */}
        <select
          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
          value={formData.tag}
        >
          <option value="General">General</option>
          <option value="Urgent">Urgent</option>
          <option value="Event">Event</option>
          <option value="Holiday">Holiday</option>
        </select>

        {/* Image Upload Box */}
        <div className="relative border-2 border-dashed border-zinc-700 p-4 rounded-lg text-center cursor-pointer hover:border-blue-500 transition">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <p className="text-sm text-zinc-400">
            {file ? file.name : "Attach Image (Optional)"}
          </p>
          <p className="text-xs text-zinc-500 mt-1">PNG, JPG up to 5MB</p>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Posting..." : "Post Notice to DateUp"}
        </button>
      </form>
    </div>
  );
}
