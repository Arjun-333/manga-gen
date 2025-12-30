"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, MessageSquare, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';
import { ForumPost } from '../../types';
import { PostCard, CreatePostModal } from '../../components/ForumComponents';

export default function ForumPage({ initialProjectId }: { initialProjectId?: string }) {
  const router = useRouter();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  // Auto-open modal if initialProjectId is provided on mount? Or just pass it.
  // Actually, if coming from Library, we probably want the modal open.
  const [showCreateModal, setShowCreateModal] = useState(!!initialProjectId);
  const [projects, setProjects] = useState([]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/forum/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchProjects = async () => {
      try {
          const response = await axios.get(`${API_BASE_URL}/projects`);
          setProjects(response.data);
      } catch (error) {
          console.error("Failed to fetch projects", error);
      }
  }

  useEffect(() => {
    fetchPosts();
    fetchProjects();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 text-center sm:text-left">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-mn-navy dark:text-mn-offwhite uppercase tracking-tight">
            Community Forum
          </h1>
          <p className="text-gray-500 dark:text-mn-offwhite/70 mt-1 font-medium">
            Share your scripts, designs, and ideas with the community.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-mn-teal hover:bg-mn-teal/90 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-md active:scale-95 uppercase tracking-wide"
        >
          <Plus className="w-5 h-5" /> New Post
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-mn-teal animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-mn-blue rounded-xl border-2 border-dashed border-gray-300 dark:border-mn-teal/30">
          <MessageSquare className="w-12 h-12 text-gray-300 dark:text-mn-teal/50 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-mn-offwhite">No posts yet</h3>
          <p className="text-gray-500 dark:text-mn-offwhite/60 text-sm">Be the first to create a discussion!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onClick={() => router.push(`/forum/${post.id}`)} 
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreatePostModal 
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchPosts}
          projects={projects}
          initialProjectId={initialProjectId}
        />
      )}
    </div>
  );
}
