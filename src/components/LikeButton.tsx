'use client';

import { useTransition, useState } from 'react';
import { toggleLike } from '@/app/actions/interactions';

interface LikeButtonProps {
  glowId: string;
  initialLiked: boolean;
  initialCount: number;
}

export function LikeButton({ glowId, initialLiked, initialCount }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticLiked, setOptimisticLiked] = useState(initialLiked);
  const [optimisticCount, setOptimisticCount] = useState(initialCount);

  const handleLike = () => {
    // Optimistic update for instant UI feedback
    setOptimisticLiked(!optimisticLiked);
    setOptimisticCount(optimisticLiked ? optimisticCount - 1 : optimisticCount + 1);

    startTransition(async () => {
      try {
        await toggleLike(glowId);
      } catch (error) {
        // Revert on failure
        setOptimisticLiked(optimisticLiked);
        setOptimisticCount(optimisticCount);
        console.error('Failed to toggle like', error);
      }
    });
  };

  return (
    <button 
      onClick={handleLike}
      disabled={isPending}
      className={`flex items-center gap-1.5 transition-colors ${
        optimisticLiked ? 'text-red-500 hover:text-red-600' : 'text-black/60 hover:text-black'
      }`}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" height="18" viewBox="0 0 24 24" 
        fill={optimisticLiked ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={optimisticLiked ? 'scale-110 transition-transform' : 'transition-transform'}
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
      <span className="text-sm font-medium">{optimisticCount > 0 ? optimisticCount : 'Like'}</span>
    </button>
  );
}
