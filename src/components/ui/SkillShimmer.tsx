"use client";

export default function SkillShimmer() {
  return (
    <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="relative rounded-xl border border-black/10 dark:border-white/10 p-4 sm:p-6 bg-black/5 dark:bg-white/5 overflow-hidden"
        >
          {/* Base gradient with pulse animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse">
            {/* Shimmer overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/10 animate-shimmer"></div>
          </div>
          
          <div className="relative space-y-3">
            {/* Title shimmer */}
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            
            {/* Description shimmer (optional) */}
            {index % 3 === 0 && (
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-1/2"></div>
              </div>
            )}
            
            {/* Tools shimmer (optional) */}
            {index % 4 === 0 && (
              <div className="flex gap-2">
                <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="h-3 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
