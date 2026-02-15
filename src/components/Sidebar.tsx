"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function Sidebar({
  groupId,
  onFilterChange,
}: {
  groupId: string;
  onFilterChange: (tag: string) => void;
}) {
  const [categories, setCategories] = useState<
    { tag: string; count: number }[]
  >([]);
  const [activeTag, setActiveTag] = useState("All");

  useEffect(() => {
    const fetchTags = async () => {
      // Logic: Group_id ke hisab se saare notices lao aur tags count karo
      const { data, error } = await supabase
        .from("notices")
        .select("category_tag")
        .eq("group_id", groupId);

      if (data) {
        const counts: any = { All: data.length };
        data.forEach((n) => {
          counts[n.category_tag] = (counts[n.category_tag] || 0) + 1;
        });

        const formatted = Object.keys(counts).map((key) => ({
          tag: key,
          count: counts[key],
        }));
        setCategories(formatted);
      }
    };
    fetchTags();
  }, [groupId]);

  return (
    <aside className="w-64 border-r border-zinc-800 h-screen sticky top-0 p-4 hidden md:block bg-black">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-500">DateUp</h1>
        <p className="text-xs text-zinc-500">Filters & Categories</p>
      </div>

      <nav className="space-y-2">
        {categories.map((item) => (
          <button
            key={item.tag}
            onClick={() => {
              setActiveTag(item.tag);
              onFilterChange(item.tag);
            }}
            className={`w-full flex justify-between items-center p-3 rounded-lg transition-all ${
              activeTag === item.tag
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:bg-zinc-900"
            }`}
          >
            <span className="font-medium">#{item.tag}</span>
            <span className="bg-zinc-700 text-[10px] px-2 py-0.5 rounded-full text-zinc-300">
              {item.count}
            </span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-10 left-4 text-[10px] text-zinc-600">
        © 2026 DateUp | Privacy-First Notices
      </div>
    </aside>
  );
}
