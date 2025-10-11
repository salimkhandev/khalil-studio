"use client";

import SkillShimmer from '@/components/ui/SkillShimmer';
import { useEffect, useState } from 'react';

interface Skill {
  _id: string;
  title: string;
  description?: string;
  tools?: string[];
  order: number;
}

export default function SkillsList() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/skills');
      
      if (!response.ok) {
        throw new Error('Failed to fetch skills');
      }
      
      const data = await response.json();
      setSkills(data.skills || []);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SkillShimmer />;
  }

  if (error) {
    return (
      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <button 
          onClick={fetchSkills}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No skills available yet.</p>
      </div>
    );
  }

  return (
    <ul className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 text-sm sm:text-base text-black/90 dark:text-white/90">
      {skills.map((skill) => (
        <li 
          key={skill._id}
          className="rounded-xl border border-black/10 dark:border-white/10 p-4 sm:p-6 bg-black/5 dark:bg-white/5"
        >
          <div className="space-y-2">
            <h4 className="font-medium text-base">{skill.title}</h4>
            {skill.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {skill.description}
              </p>
            )}
            {skill.tools && skill.tools.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {skill.tools.map((tool, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
