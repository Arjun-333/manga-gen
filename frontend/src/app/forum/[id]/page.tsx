"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Clock, MessageSquare, Send, Link as LinkIcon, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import { ForumPost } from '../../../types'; 

// Use useParam and useRouter properly
// Note: In Next.js App Router, params is a Promise or object. useParams hook is safer.

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Parse ID safely
  const postId = Array.isArray(params.id) ? params.id[0] : params.id;

  const fetchPost = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/forum/posts/${postId}`);
      setPost(response.data);
    } catch (error) {
      console.error("Failed to fetch post", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent || !commentAuthor) return;

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/forum/posts/${postId}/comments`, {
        content: commentContent,
        author: commentAuthor
      });
      setCommentContent("");
      fetchPost(); // Refresh
    } catch (error) {
      console.error("Failed to add comment", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenProject = () => {
      // Logic to open the project. In this simplified version, we might assume there's a route /library?projectId=... 
      // or we can just navigate to main page and set active tab via URL params if implemented.
      // For now, let's just alert or log. Ideally we navigate to a viewer page.
      if (post?.attached_project_id) {
          // This assumes the frontend can handle ?project_id or similar. 
          // Since we use client-side state in AppShell, deep linking might not be fully set up.
          // We'll show a simple "Open in Library" instruction.
          alert(`Opening Project ID: ${post.attached_project_id}. Go to Library to view.`);
          // Real implementations would link to /library/project/[id]
      }
  };

  if (loading) return <div className="p-8 text-center dark:text-mn-offwhite">Loading discussion...</div>;
  if (!post) return <div className="p-8 text-center dark:text-mn-offwhite">Post not found</div>;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-mn-navy dark:text-mn-offwhite/60 dark:hover:text-mn-offwhite mb-6 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Forum
      </button>

      <div className="bg-white dark:bg-mn-blue rounded-2xl border border-gray-200 dark:border-mn-teal/20 p-8 mb-8 shadow-sm">
        <div className="flex flex-col gap-4 mb-6 border-b border-gray-100 dark:border-mn-navy/20 pb-6">
          <h1 className="text-3xl font-black text-gray-900 dark:text-mn-offwhite">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-mn-offwhite/70">
            <span className="flex items-center gap-1 font-medium"><User className="w-4 h-4 text-mn-teal" /> {post.author}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-mn-offwhite/90 mb-8 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>

        {post.attached_project_id && (
          <div className="bg-mn-teal/5 border border-mn-teal/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-mn-teal/10 rounded-lg text-mn-teal">
                <LinkIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-mn-navy dark:text-mn-offwhite text-sm uppercase tracking-wide">Attached Project</h4>
                <p className="text-xs text-mn-navy/70 dark:text-mn-offwhite/60">This post references a manga project</p>
              </div>
            </div>
            <button 
                onClick={handleOpenProject}
                className="flex items-center gap-2 bg-mn-teal hover:bg-mn-teal/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors uppercase tracking-wide"
            >
                View Project <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-mn-navy border border-gray-100 dark:border-mn-teal/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-mn-offwhite mb-6 flex items-center gap-2 uppercase tracking-wide">
          <MessageSquare className="w-5 h-5 text-mn-teal" /> Comments ({post.comments?.length || 0})
        </h3>

        <div className="space-y-6 mb-8">
          {post.comments?.map((comment) => (
            <div key={comment.id} className="bg-white dark:bg-mn-blue rounded-xl p-4 border border-gray-100 dark:border-mn-teal/10 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-gray-900 dark:text-mn-offwhite flex items-center gap-2">
                  <User className="w-3 h-3 text-mn-teal" /> {comment.author}
                </span>
                <span className="text-xs text-gray-400 dark:text-mn-offwhite/50">{new Date(comment.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-600 dark:text-mn-offwhite/80 text-sm">{comment.content}</p>
            </div>
          ))}
          {(!post.comments || post.comments.length === 0) && (
              <p className="text-center text-gray-400 dark:text-mn-offwhite/40 text-sm py-4 italic">No comments yet. Start the conversation!</p>
          )}
        </div>

        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <div>
              <input
                type="text"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="Display Name"
                className="w-full md:w-1/3 bg-white dark:bg-mn-blue border border-gray-200 dark:border-mn-navy rounded-lg p-2 dark:text-mn-offwhite text-sm focus:outline-none focus:border-mn-teal mb-2 font-medium"
                required
              />
              <div className="flex gap-2">
                <input
                    type="text"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-white dark:bg-mn-blue border border-gray-200 dark:border-mn-navy rounded-lg p-3 dark:text-mn-offwhite focus:outline-none focus:border-mn-teal"
                    required
                />
                <button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-mn-teal hover:bg-mn-teal/90 text-white px-6 rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                    <Send className="w-4 h-4" />
                </button>
              </div>
          </div>
        </form>
      </div>
    </div>
  );
}
