"use client";
import { useEffect } from "react";
import { Share2, Eye } from "lucide-react"; // Lucide icons use kar rahe hain for clean UI

export default function NoticeCard({ notice }: { notice: any }) {
  // 1. View count increment logic
  useEffect(() => {
    const incrementView = async () => {
      try {
        await fetch("/api/increment-view", {
          method: "POST",
          body: JSON.stringify({ id: notice.id }),
        });
      } catch (err) {
        console.error("Failed to increment view", err);
      }
    };
    incrementView();
  }, [notice.id]);

  // 2. WhatsApp Share Fallback (Jab browser Share API support na kare)
  const handleWhatsAppShare = () => {
    const title = `📢 *NEW NOTICE:* ${notice.title}`;
    const orgInfo = `🏢 *From:* ${notice.organization_name || "Organization"}`;
    const link = `${window.location.origin}/feed/${notice.group_id}`;
    const fullMessage = `${title}%0A${orgInfo}%0A%0A👇 *View full details here:*%0A${link}`;

    window.open(`https://wa.me/?text=${fullMessage}`, "_blank");
  };

  // 3. Main Web Share Function
  const shareNotice = async () => {
    const shareData = {
      title: notice.title,
      text: `📢 NEW NOTICE: ${notice.title}\nFrom: ${notice.organization_name || "Organization"}`,
      url: `${window.location.origin}/feed/${notice.group_id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      handleWhatsAppShare();
    }
  };

  return (
    <div className="border-b border-zinc-800 p-0 mb-4 bg-zinc-950">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600"></div>
          <span className="font-semibold text-sm">
            Notice from {notice.organization_name || "Organization"}
          </span>
        </div>
        <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-[10px] rounded-full uppercase font-bold">
          {notice.category_tag}
        </span>
      </div>

      {/* Image Section */}
      {notice.image_url && (
        <div className="w-full bg-zinc-900 aspect-square overflow-hidden">
          <img
            src={notice.image_url}
            alt="notice"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{notice.title}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-3">
          {notice.content}
        </p>

        {/* Footer: View Count, Date & Share */}
        <div className="flex items-center justify-between text-zinc-500 text-xs mt-4">
          <div className="flex items-center gap-4">
            {/* Views Display */}
            <div className="flex items-center gap-1">
              <Eye size={16} />
              <span>{notice.view_count || 0} views</span>
            </div>

            {/* Smart Share Button */}
            <button
              onClick={shareNotice}
              className="flex items-center gap-1.5 hover:text-white transition-colors py-1"
            >
              <Share2 size={16} />
              <span className="font-medium text-sm">Share</span>
            </button>
          </div>

          <span>{new Date(notice.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
