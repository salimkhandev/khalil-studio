"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
  import { RiHome5Line, RiLightbulbFlashLine, RiVideoLine } from "react-icons/ri";

  const sections = [
    { id: "home", label: "Home", icon: RiHome5Line },
    { id: "skills", label: "Skills", icon: RiLightbulbFlashLine },
    { id: "VideoProjects", label: "Video Projects", icon: RiVideoLine },
];

export default function StickyNav() {
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const sectionEls = sections
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    let ticking = false;
    const computeActive = () => {
      ticking = false;
      if (!sectionEls.length) return;
      const targetY = window.innerHeight * 0.25; // measure near top to prefer current page section
      let bestId = "home";
      let bestDist = Number.POSITIVE_INFINITY;
      for (const el of sectionEls) {
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - targetY);
        if (dist < bestDist) {
          bestDist = dist;
          bestId = el.id;
        }
      } 
      setActive((prev) => {
        if (prev !== bestId) {
          history.replaceState(null, "", `#${bestId}`);
        }
        return bestId;
      });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(computeActive);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    computeActive();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 text-black dark:text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-center gap-4 overflow-x-auto">
                {sections.map(({ id, label, icon: Icon }) => (
          <Link key={id} href={`/#${id}`} className="group">
            <span
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
                active === id
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-black/70 hover:text-black dark:text-white/80 dark:hover:text-white"
              }`}
            >
              <Icon className="text-xl" />
              <span className="text-sm font-medium">{label}</span>
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}


