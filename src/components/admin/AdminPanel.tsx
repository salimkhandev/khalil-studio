"use client";
import { useTestimonials } from "@/context/TestimonialContext";
import { useState } from "react";
import toast from "react-hot-toast";
import { RiDeleteBinLine, RiLightbulbFlashLine, RiLoader4Line, RiUploadCloud2Line, RiVideoLine } from "react-icons/ri";
import SkillManager from "./SkillManager";

export default function AdminPanel() {
  const { refresh } = useTestimonials();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "deleting">("idle");
  const [activeTab, setActiveTab] = useState<"videos" | "skills">("videos");

  const onUpload = async () => {
    if (!file && !youtubeUrl.trim()) return;
    if (!title.trim()) {
      toast.error("Please enter a title before uploading");
      return;
    }
    setLoading(true);
    setStatus("uploading");
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      if (file) fd.append("file", file);
      if (youtubeUrl.trim()) fd.append("youtubeUrl", youtubeUrl.trim());
      const res = await fetch("/api/videos", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      await refresh();
      setTitle("");
      setFile(null);
      setYoutubeUrl("");
      toast.success("Upload successful");
      setStatus("idle");
    } finally {
      setLoading(false);
      if (status === "uploading") {
        toast.error("Upload failed");
        setStatus("idle");
      }
    }
  };

  const onDelete = async (id: string) => {
    setLoading(true);
    setStatus("deleting");
    try {
      const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await refresh();
      toast.success("Deleted successfully");
      setStatus("idle");
    } finally {
      setLoading(false);
      if (status === "deleting") {
        toast.error("Delete failed");
        setStatus("idle");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("videos")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === "videos"
              ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <RiVideoLine />
          Video Projects
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === "skills"
              ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <RiLightbulbFlashLine />
          Skills
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "videos" && (
        <>
          <div className="rounded-xl border border-black/10 dark:border-white/15 p-4 bg-black/5 dark:bg-white/5">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                placeholder="Title"
                className="w-full rounded-lg bg-black/5 dark:bg-white/10 px-3 py-2 text-sm text-black dark:text-white outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                placeholder="YouTube URL (optional)"
                className="w-full rounded-lg bg-black/5 dark:bg-white/10 px-3 py-2 text-sm text-black dark:text-white outline-none"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="text-black/80 dark:text-white/80"
              />
              <button
                onClick={onUpload}
                disabled={loading || (!file && !youtubeUrl.trim()) || !title.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
              >
                {status === "uploading" ? (
                  <>
                    <RiLoader4Line className="animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <RiUploadCloud2Line /> Upload
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Manage list inline for admin convenience */}
          <AdminList onDelete={onDelete} loading={loading} />
        </>
      )}

      {activeTab === "skills" && <SkillManager />}
    </div>
  );
}

function AdminList({ onDelete, loading }: { onDelete: (id: string) => Promise<void>; loading: boolean }) {
  const { videos } = useTestimonials();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((v) => (
        <div key={v._id} className="rounded-lg border border-black/10 dark:border-white/10 p-3 bg-black/5 dark:bg-white/5 space-y-2">
          {v.sourceType === "youtube" ? (
            <AdminYouTubePlayer url={v.url} title={v.title} />
          ) : (
            <video
              src={v.url}
              controls
              loop
              muted
              playsInline
              controlsList="nodownload noplaybackrate noremoteplayback"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              className="w-full rounded"
            />
          )}
          <div className="flex items-center justify-between">
            <div className="text-black/90 dark:text-white/90 text-sm truncate">{v.title}</div>
            <button
              disabled={loading}
              onClick={() => onDelete(v._id!)}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 hover:bg-red-700 text-white px-3 py-1 disabled:opacity-50"
            >
              {status === "deleting" && loading && (
                <RiLoader4Line className="animate-spin" />
              )}
              <RiDeleteBinLine /> Delete
            </button>
          </div>
        </div>
      ))}
      {!videos.length && <p className="text-black/70 dark:text-white/70">No videos uploaded.</p>}
    </div>
  );
}

function AdminYouTubePlayer({ url, title }: { url: string; title: string }) {
  // Enhanced YouTube URL parsing to support more formats
  let videoId = null;
  
  // Try different YouTube URL patterns
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,  // youtube.com/watch?v=VIDEO_ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,  // youtu.be/VIDEO_ID
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,  // youtube.com/embed/VIDEO_ID
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,  // youtube.com/v/VIDEO_ID
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,  // youtube.com/shorts/VIDEO_ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      videoId = match[1];
      break;
    }
  }
  
  if (!videoId) {
    return (
      <div className="w-full aspect-video rounded flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline text-center">
          Open on YouTube
        </a>
      </div>
    );
  }
  
  const embed = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&loop=1&playlist=${videoId}`;
  return (
    <iframe
      src={embed}
      className="w-full aspect-video rounded"
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}


