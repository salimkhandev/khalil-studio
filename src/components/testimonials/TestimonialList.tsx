"use client";
import { useTestimonials } from "@/context/TestimonialContext";
import { useEffect, useRef, useState } from "react";
import { RiPauseFill, RiPlayFill, RiVolumeMuteFill, RiVolumeUpFill } from "react-icons/ri";

// Global state to track currently playing video
let currentlyPlayingVideo: string | null = null;
const videoRefs = new Map<string, HTMLVideoElement>();

export default function TestimonialList() {
  const { videos, isLoading } = useTestimonials();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ShimmerCard key={index} />
        ))}
      </div>
    );
  }
  
  if (!videos.length) return <p className="text-black/70 dark:text-white/70 text-center py-8">No testimonials yet.</p>;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {videos.map((v) => (
        <figure key={v._id} className="space-y-2">
          {v.sourceType === "youtube" ? (
            <YouTubePlayer url={v.url} title={v.title} />
          ) : (
            <Html5VideoWithMute url={v.url} videoId={v._id!} />
          )}
          <figcaption className="text-black/90 dark:text-white/90 text-xs sm:text-sm line-clamp-2">{v.title}</figcaption>
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
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
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
    setIsPlaying(true);
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
    setIsPlaying(false);
    if (currentlyPlayingVideo === videoId) {
      currentlyPlayingVideo = null;
    }
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    > 
      <video
        ref={videoRef}
        src={url}
        controls={isPlaying || isHovered}
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
      {/* Play/Pause button overlay */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="w-16 h-16 rounded-full bg-black/60 dark:bg-white/20 flex items-center justify-center">
          {isPlaying ? (
            <RiPauseFill className="text-white dark:text-gray-900" size={24} />
          ) : (
            <RiPlayFill className="text-white dark:text-gray-900 ml-1" size={24} />
          )}
        </div>
      </div>
      <button
        onClick={() => setMuted((m) => !m)}
        className="absolute bottom-2 right-2 rounded-md bg-black/60 text-white p-1.5 hover:bg-black/70"
      >
        {muted ? <RiVolumeMuteFill size={14} /> : <RiVolumeUpFill size={14} />}
      </button>
    </div>
  );
}

function ShimmerCard() {
  return (
    <div className="space-y-2"> 
      <div className="relative w-full aspect-video rounded-lg border border-black/10 dark:border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/10 animate-shimmer"></div>
        </div>
        {/* Video placeholder content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-400 dark:bg-gray-500 rounded-sm"></div>
          </div>
        </div>
        {/* Title placeholder */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="h-2 sm:h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
      </div>
      {/* Caption shimmer */}
      <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
  );
}
