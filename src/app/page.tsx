"use client";
 
import VirtualAssistant from "@/components/assistant/VirtualAssistant";
import StickyNav from "@/components/layout/StickyNav";
import TestimonialList from "@/components/testimonials/TestimonialList";
import ThemeToggle from "@/components/ui/ThemeToggle";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen text-black dark:text-white snap-y snap-mandatory" data-scroll-container>
      <StickyNav />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="py-6 sm:py-8 lg:py-10 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Profile picture from /public/images/khalil.png */}
            <Image
              src="/images/khalil.png"
              alt="Profile"
              width={48}
              height={48}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-black/10 dark:border-white/20"
              priority
            />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Khalil Studio</h1>
          </div>
          <ThemeToggle />
        </header>
      </div>
      <section id="home" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center snap-start">
        <motion.h2
          className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Creative Studio for Motion, 3D, and Web Experiences
        </motion.h2>
        <motion.p
          className="mt-3 sm:mt-4 text-base sm:text-lg text-black/70 dark:text-white/80 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          We blend design, code, and animation to craft immersive digital products.
        </motion.p>
      </section>


      <section id="skills" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 min-h-screen flex flex-col justify-center snap-start">
        <motion.h3 className="text-xl sm:text-2xl font-semibold" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          Skills
        </motion.h3>
        <ul className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 text-sm sm:text-base text-black/90 dark:text-white/90">
          <li className="rounded-xl border border-black/10 dark:border-white/10 p-4 sm:p-6 bg-black/5 dark:bg-white/5">Storytelling Sense 🎬</li>
          <li className="rounded-xl border border-black/10 dark:border-white/10 p-4 sm:p-6 bg-black/5 dark:bg-white/5">Color Correction & Sound Balancing 🎧</li>
          <li className="rounded-xl border border-black/10 dark:border-white/10 p-4 sm:p-6 bg-black/5 dark:bg-white/5">Smooth Transitions for Cinematic Results 🎞️</li>
          <li className="rounded-xl border border-black/10 dark:border-white/10 p-4 sm:p-6 bg-black/5 dark:bg-white/5">YouTube Thumbnails & Social Media Visuals (Canva, Photoshop) 🖌️</li>
          <li className="rounded-xl border border-black/10 dark:border-white/10 p-4 sm:p-6 bg-black/5 dark:bg-white/5">Video Formats, Frame Rates & Compression for Web/YouTube Optimization ⚙️</li>
          <li className="rounded-xl border border-black/10 dark:border-white/10 p-4 sm:p-6 bg-black/5 dark:bg-white/5">Timing, Rhythm & Pacing ⏱️</li>
          <li className="rounded-xl border border-black/10 dark:border-white/10 p-4 sm:p-6 bg-black/5 dark:bg-white/5">Strong Attention to Detail 👀</li>
          <li className="rounded-xl border border-black/10 dark:border-white/10 p-4 sm:p-6 bg-black/5 dark:bg-white/5">Flexible Editing: Vlogs, Cinematic Videos, Reels & YouTube Content 🎥</li>
          <li className="rounded-xl border border-black/10 dark:border-white/10 p-4 sm:p-6 bg-black/5 dark:bg-white/5">Familiar with Editing Tools (CapCut, Premiere Pro, DaVinci Resolve, Canva) 🧰</li>
        </ul>
      </section>


      <section id="VideoProjects" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 min-h-screen flex flex-col justify-center snap-start">
        <motion.h3 className="text-xl sm:text-2xl font-semibold" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          Video Projects
        </motion.h3>
        <div className="mt-4 sm:mt-6">
          <TestimonialList />
        </div>
        {/* Admin removed from homepage; now on hidden route */}
      </section>

      <WhatsAppButton />
      <VirtualAssistant />
    </main>
  );
}

