"use client";
import type { Video } from "@/types/video";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface TestimonialContextValue {
  videos: Video[];
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const TestimonialContext = createContext<TestimonialContextValue | undefined>(undefined);

export function TestimonialProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVideos = async () => {
    setIsLoading(true);
    const res = await fetch("/api/videos", { cache: "no-store" });
    if (!res.ok) {
      setIsLoading(false);
      return;
    }
    const data = (await res.json()) as Video[];
    setVideos(data);
    setIsLoading(false);
  };

  useEffect(() => {
    void fetchVideos();
  }, []);

  const value = useMemo(
    () => ({
      videos,
      isLoading,
      refresh: fetchVideos,
    }),
    [videos, isLoading]
  );

  return <TestimonialContext.Provider value={value}>{children}</TestimonialContext.Provider>;
}

export function useTestimonials(): TestimonialContextValue {
  const ctx = useContext(TestimonialContext);
  if (!ctx) throw new Error("useTestimonials must be used within TestimonialProvider");
  return ctx;
}


