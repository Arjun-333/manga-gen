import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, Clock, User, Plus, X, Link as LinkIcon } from 'lucide-react';
import { ForumPost, ForumComment, CreatePostRequest, CreateCommentRequest } from '../types';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// --- Components ---

export const PostCard = ({ post, onClick }: { post: ForumPost; onClick: () => void }) => {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't open post
    if (liked) return; // Prevent spam

    setLiked(true);
    setLikes(prev => prev + 1);
    
    try {
       await axios.post(`${API_BASE_URL}/forum/posts/${post.id}/like`);
    } catch (err) {
       console.error("Failed to like", err);
       setLikes(prev => prev - 1); // Revert
       setLiked(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="bg-white dark:bg-mn-blue rounded-xl border border-gray-100 dark:border-mn-teal/20 p-6 cursor-pointer hover:shadow-lg dark:hover:shadow-mn-teal/10 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-mn-offwhite line-clamp-1">{post.title}</h3>
        {post.attached_project_id && (
            <span className="bg-mn-teal/10 text-mn-teal text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
                <LinkIcon className="w-3 h-3" /> Project
            </span>
        )}
      </div>
      <p className="text-gray-600 dark:text-mn-offwhite/80 text-sm line-clamp-3 mb-4">{post.content}</p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-mn-offwhite/60 border-t border-gray-100 dark:border-mn-navy/20 pt-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-medium">
            <User className="w-3 h-3" /> {post.author}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
             onClick={handleLike}
             className={`flex items-center gap-1 transition-colors ${liked ? 'text-red-500' : 'group-hover:text-red-500'}`}
          >
            <Heart className={`w-3 h-3 ${liked ? 'fill-current' : ''}`} /> {likes}
          </button>
          <span className="flex items-center gap-1 group-hover:text-mn-teal transition-colors">
            <MessageSquare className="w-3 h-3" /> {post.comments?.length || 0}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export const CreatePostModal = ({ onClose, onCreated, projects, initialProjectId }: { onClose: () => void; onCreated: () => void; projects: any[]; initialProjectId?: string }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedProject, setSelectedProject] = useState(initialProjectId || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/forum/posts`, {
        title,
        content,
        author: author || "AnonymousCreator",
        attached_project_id: selectedProject || undefined
      });
      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-mn-navy/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-mn-blue rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-gray-200 dark:border-mn-teal/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-mn-offwhite">New Discussion</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-mn-navy/30 rounded-full transition-colors">
            <X className="w-5 h-5 dark:text-mn-offwhite/70" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold dark:text-mn-offwhite uppercase tracking-wider mb-1">Display Name</label>
            <input 
              type="text" 
              value={author} 
              onChange={e => setAuthor(e.target.value)}
              className="w-full bg-gray-50 dark:bg-mn-navy/50 border border-gray-200 dark:border-mn-navy rounded-lg p-3 dark:text-white focus:outline-none focus:border-mn-teal"
              placeholder="Your username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold dark:text-mn-offwhite uppercase tracking-wider mb-1">Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-gray-50 dark:bg-mn-navy/50 border border-gray-200 dark:border-mn-navy rounded-lg p-3 dark:text-white focus:outline-none focus:border-mn-teal"
              placeholder="What's on your mind?"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold dark:text-mn-offwhite uppercase tracking-wider mb-1">Content</label>
            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)}
              className="w-full h-32 bg-gray-50 dark:bg-mn-navy/50 border border-gray-200 dark:border-mn-navy rounded-lg p-3 dark:text-white focus:outline-none focus:border-mn-teal resize-none"
              placeholder="Share your ideas..."
              required
            />
          </div>

          <div>
             <label className="block text-sm font-bold dark:text-mn-offwhite uppercase tracking-wider mb-1">Attach Project (Optional)</label>
             <select 
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full bg-gray-50 dark:bg-mn-navy/50 border border-gray-200 dark:border-mn-navy rounded-lg p-3 dark:text-white focus:outline-none focus:border-mn-teal appearance-none"
             >
                <option value="">No Attachment</option>
                {projects.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                ))}
             </select>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-mn-teal hover:bg-mn-teal/90 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 uppercase tracking-wide shadow-md"
          >
            {submitting ? 'Posting...' : <><Plus className="w-5 h-5" /> Create Post</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
