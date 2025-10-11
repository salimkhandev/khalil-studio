"use client";
 
import VirtualAssistant from "@/components/assistant/VirtualAssistant";
import StickyNav from "@/components/layout/StickyNav";
import SkillsList from "@/components/skills/SkillsList";
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
            {/* Desktop profile picture - hidden on mobile */}
            <Image
              src="/images/khalil.png"
              alt="Profile"
              width={64}
              height={64}
              className="hidden sm:block w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-full object-cover border border-black/10 dark:border-white/20"
              priority
            />
            {/* Desktop version - hidden on mobile */}
            <h1 className="hidden sm:block text-4xl font-medium bg-gradient-to-r from-red-400 via-blue-400 to-yellow-400 bg-clip-text text-transparent animate-pulse">Khalil Studio</h1>
          </div>
          <ThemeToggle />
        </header>
      </div>
        <section id="home" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 flex flex-col justify-center snap-start">
        {/* Mobile profile picture - hidden on desktop */}
        <motion.div 
          className="sm:hidden mb-4 flex justify-center -mt-26"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/images/khalil.png"
            alt="Profile"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover border border-black/10 dark:border-white/20"
            priority
          />
        </motion.div>
        {/* Mobile version - hidden on desktop */}
        <motion.h1 
          className="block sm:hidden text-4xl font-medium bg-gradient-to-r from-red-400 via-blue-400 to-yellow-400 bg-clip-text text-transparent animate-pulse mb-6 ml-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Khalil Studio
        </motion.h1>
        <motion.h2
          className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight ml-2 sm:ml-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
Expert Video Editor for YouTube Creators, Brand Promos, and Engaging Shorts
        </motion.h2>
      </section>


      <section id="skills" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 min-h-screen flex flex-col justify-center snap-start">
        <motion.h3 className="text-2xl sm:text-3xl" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          Skills
        </motion.h3>
        <SkillsList />
      </section>


      <section id="VideoProjects" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 min-h-screen flex flex-col justify-center snap-start">
        <motion.h3 className="text-2xl sm:text-3xl" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
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

