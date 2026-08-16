import { LikeButton } from '@/components/LikeButton';
import { CommentSection } from '@/components/CommentSection';

interface Profile {
  username: string;
}

interface Glow {
  id: string;
  content: string;
  color: string;
  created_at: string;
  user_id: string;
  profiles: Profile | Profile[] | null; 
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function GlowCard({ glow }: { glow: Glow }) {
  // Supabase joins can return arrays or single objects depending on the relationship setup.
  // Profiles is typically a 1:1 or N:1, so we expect an object, but we handle arrays just in case.
  const profile = Array.isArray(glow.profiles) ? glow.profiles[0] : glow.profiles;
  const username = profile?.username || 'Unknown User';
  
  const timestamp = timeAgo(glow.created_at);

  // Map the color from DB to the Tailwind class
  const colorMap: Record<string, string> = {
    yellow: 'bg-note-yellow text-black',
    pink: 'bg-note-pink text-black',
    blue: 'bg-note-blue text-black',
    green: 'bg-note-green text-black',
    purple: 'bg-note-purple text-black',
  };

  const bgClass = colorMap[glow.color] || colorMap['yellow'];
  
  // Add a slight random rotation for the sticky note effect (between -2deg and 2deg)
  // We use the ID to generate a consistent rotation so it doesn't jump around on re-renders
  const rotationSeed = glow.id.charCodeAt(0) + glow.id.charCodeAt(glow.id.length - 1);
  const rotation = (rotationSeed % 5) - 2; // -2, -1, 0, 1, 2

  return (
    <div 
      className={`relative rounded-sm p-6 shadow-md transition-transform hover:z-10 hover:shadow-xl ${bgClass}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Tape/Pin decoration effect */}
      <div className="absolute -top-3 left-1/2 h-6 w-12 -translate-x-1/2 bg-white/40 shadow-sm skew-x-[-10deg] rounded-sm"></div>

      <div className="mb-3 flex items-center justify-between">
        <div className="font-bold">
          {username} <span className="text-black/50 font-normal text-sm ml-1">✦</span>
        </div>
        <div className="text-xs text-black/60 font-medium">{timestamp}</div>
      </div>
      
      <p className="whitespace-pre-wrap break-words text-lg leading-relaxed font-medium">
        {glow.content}
      </p>

      {/* Week 3: Likes and Comments */}
      <div className="mt-6 flex flex-col gap-3 text-black/60 border-t border-black/10 pt-3">
        <div className="flex items-center gap-6">
          <LikeButton 
            glowId={glow.id} 
            initialLiked={glow.isLikedByMe} 
            initialCount={glow.likesCount} 
          />
          <CommentSection 
            glowId={glow.id} 
            initialCount={glow.commentsCount} 
          />
        </div>
      </div>
    </div>
  );
}
