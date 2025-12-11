import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiGrid, FiArrowRight } from 'react-icons/fi';
import Image from "next/image";

interface ProjectSummary {
  id: string;
  title: string;
  updated_at: string;
  thumbnail_url: string | null;
}

interface LibraryViewProps {
  onLoadProject: (id: string) => void;
}

export default function LibraryView({ onLoadProject }: LibraryViewProps) {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:8000/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-8 px-4 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Library</h2>
           <p className="text-sm text-gray-500 dark:text-gray-400">Continue where you left off</p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-gray-300 dark:border-zinc-700">
          <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <FiGrid size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No stories yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">Create your first manga chapter to see it appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
              onClick={() => onLoadProject(project.id)}
            >
              {/* Thumbnail Area */}
              <div className="aspect-[4/3] bg-gray-100 dark:bg-zinc-950 relative overflow-hidden">
                {project.thumbnail_url ? (
                  <Image 
                    src={project.thumbnail_url} 
                    alt={project.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-zinc-700">
                     <FiGrid size={32} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                  <span className="text-white font-medium text-sm flex items-center gap-2">
                    Open Project <FiArrowRight />
                  </span>
                </div>
              </div>

              {/* Info Area */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white truncate mb-1">{project.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <FiClock size={12} /> {formatDate(project.updated_at)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
