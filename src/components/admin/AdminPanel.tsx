"use client";
import { useTestimonials } from "@/context/TestimonialContext";
import { useState } from "react";
import toast from "react-hot-toast";
import { RiDeleteBinLine, RiLoader4Line, RiUploadCloud2Line } from "react-icons/ri";

export default function AdminPanel() {
  const { refresh } = useTestimonials();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "deleting">("idle");

  const onUpload = async () => {
    if (!file && !youtubeUrl.trim()) return;
    setLoading(true);
    setStatus("uploading");
    try {
      const fd = new FormData();
      fd.append("title", title || "Untitled");
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
            disabled={loading || (!file && !youtubeUrl.trim())}
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
  const match = url.match(/[?&]v=([a-zA-Z0-9_-]{6,})/) || url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  const id = match?.[1];
  if (!id) {
    return (
      <a href={url} target="_blank" className="text-blue-600 underline">
        Open on YouTube
      </a>
    );
  }
  const embed = `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&controls=1&loop=1&playlist=${id}`;
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


