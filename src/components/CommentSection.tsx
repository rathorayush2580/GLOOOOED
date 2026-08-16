'use client';

import { useState, useTransition } from 'react';
import { addComment, getComments } from '@/app/actions/interactions';

interface CommentSectionProps {
  glowId: string;
  initialCount: number;
}

export function CommentSection({ glowId, initialCount }: CommentSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggleComments = async () => {
    if (!isOpen) {
      setIsLoading(true);
      const fetchedComments = await getComments(glowId);
      setComments(fetchedComments);
      setIsLoading(false);
    }
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const content = newComment;
    setNewComment('');
    
    // Add optimistically
    const optimisticComment = {
      id: Math.random().toString(),
      content: content,
      created_at: new Date().toISOString(),
      profiles: { username: 'You' } // Optimistic placeholder
    };
    
    setComments(prev => [...prev, optimisticComment]);

    startTransition(async () => {
      try {
        await addComment(glowId, content);
        // Refresh true comments quietly
        const fetched = await getComments(glowId);
        setComments(fetched);
      } catch (error) {
        console.error('Failed to add comment', error);
      }
    });
  };

  return (
    <div className="w-full">
      <button 
        onClick={toggleComments}
        className="flex items-center gap-1.5 text-black/60 hover:text-black transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span className="text-sm font-medium">{initialCount > 0 ? initialCount : 'Comment'}</span>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-black/10 space-y-4">
          {isLoading ? (
            <div className="text-sm text-black/50 text-center py-2">Loading comments...</div>
          ) : comments.length > 0 ? (
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {comments.map((comment) => {
                const username = Array.isArray(comment.profiles) ? comment.profiles[0]?.username : comment.profiles?.username;
                return (
                  <div key={comment.id} className="text-sm bg-black/5 p-2 rounded-md break-words">
                    <span className="font-bold mr-2">{username || 'User'}:</span>
                    <span className="text-black/80">{comment.content}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-black/50 text-center py-2">No comments yet. Be the first!</div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-white/50 border border-black/10 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-black/20"
              disabled={isPending}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isPending}
              className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-medium disabled:opacity-50"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
