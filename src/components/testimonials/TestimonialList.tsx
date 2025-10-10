"use client";
import { useTestimonials } from "@/context/TestimonialContext";
import { useEffect, useRef, useState } from "react";
import { RiVolumeMuteFill, RiVolumeUpFill } from "react-icons/ri";

// Global state to track currently playing video
let currentlyPlayingVideo: string | null = null;
const videoRefs = new Map<string, HTMLVideoElement>();

export default function TestimonialList() {
  const { videos } = useTestimonials();
  if (!videos.length) return <p className="text-black/70 dark:text-white/70">No testimonials yet.</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((v) => (
        <figure key={v._id} className="space-y-2">
          {v.sourceType === "youtube" ? (
            <YouTubePlayer url={v.url} title={v.title} />
          ) : (
            <Html5VideoWithMute url={v.url} videoId={v._id!} />
          )}
          <figcaption className="text-black/90 dark:text-white/90 text-sm">{v.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function YouTubePlayer({ url, title }: { url: string; title: string }) {
  // Supports https://www.youtube.com/watch?v=VIDEO_ID and https://youtu.be/VIDEO_ID
  const match =
    url.match(/[?&]v=([a-zA-Z0-9_-]{6,})/) || url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
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
      className="w-full aspect-video rounded-lg border border-black/10 dark:border-white/10"
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}

function Html5VideoWithMute({ url, videoId }: { url: string; videoId: string }) {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
      videoRefs.set(videoId, videoRef.current);
    }
    return () => {
      videoRefs.delete(videoId);
    };
  }, [muted, videoId]);

  const handlePlay = () => {
    // Mute all other videos when this one starts playing
    if (currentlyPlayingVideo && currentlyPlayingVideo !== videoId) {
      const otherVideo = videoRefs.get(currentlyPlayingVideo);
      if (otherVideo) {
        otherVideo.muted = true;
        otherVideo.pause();
      }
    }
    currentlyPlayingVideo = videoId;
  };

  const handlePause = () => {
    if (currentlyPlayingVideo === videoId) {
      currentlyPlayingVideo = null;
    }
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={url}
        controls
        loop
        muted
        playsInline
        autoPlay
        controlsList="nodownload noplaybackrate noremoteplayback"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        onPlay={handlePlay}
        onPause={handlePause}
        className="w-full rounded-lg border border-black/10 dark:border-white/10"
      />
      <button
        onClick={() => setMuted((m) => !m)}
        className="absolute bottom-2 right-2 rounded-md bg-black/60 text-white p-1.5 hover:bg-black/70"
      >
        {muted ? <RiVolumeMuteFill size={14} /> : <RiVolumeUpFill size={14} />}
      </button>
    </div>
  );
}


