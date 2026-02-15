"use client";

import { useEffect, useState } from "react";
import Head from "next/head"; // Head import karein metadata ke liye
import { supabase } from "@/lib/supabase";
import NoticeCard from "@/components/NoticeCard";
import Sidebar from "@/components/Sidebar";

export const dynamic = "force-dynamic";

export default function FeedPage({ params }: { params: { groupId: string } }) {
  const [allNotices, setAllNotices] = useState<any[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotices() {
      if (!supabase) return;

      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .eq("group_id", params.groupId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setAllNotices(data);
        setFilteredNotices(data);
      }
      setLoading(false);
    }
    fetchNotices();
  }, [params.groupId]);

  const handleFilter = (tag: string) => {
    if (tag === "All") {
      setFilteredNotices(allNotices);
    } else {
      setFilteredNotices(allNotices.filter((n) => n.category_tag === tag));
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center bg-black text-white min-h-screen">
        Loading notices...
      </div>
    );

  return (
    <>
      <Head>
        <title>DateUp | Important Notice</title>
        <meta
          property="og:title"
          content="DateUp - Professional Notice Board"
        />
        <meta
          property="og:description"
          content="Important notices that don't get lost in chats."
        />
        <meta property="og:image" content="/dateup-preview.png" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="flex min-h-screen bg-black text-white">
        {/* Sidebar */}
        <Sidebar groupId={params.groupId} onFilterChange={handleFilter} />

        {/* Main Feed */}
        <main className="flex-1 max-w-2xl mx-auto border-x border-zinc-800 min-h-screen pb-20">
          <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 border-b border-zinc-800">
            <h2 className="text-xl font-bold italic text-blue-500">
              DateUp Feed
            </h2>
          </header>

          <div className="flex flex-col">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))
            ) : (
              <p className="p-10 text-center text-zinc-500">
                No notices found in this category.
              </p>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
