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
  likesCount?: number;
  isLikedByMe?: boolean;
  commentsCount?: number;
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

// Function to generate a deeper, saturated pin color based on the note color
function getPinGradient(color: string) {
  switch (color) {
    case 'yellow': return 'radial-gradient(circle at 30% 30%, #eab308, #a16207)'; // Gold
    case 'pink': return 'radial-gradient(circle at 30% 30%, #ec4899, #be185d)'; // Deep Pink
    case 'blue': return 'radial-gradient(circle at 30% 30%, #3b82f6, #1d4ed8)'; // Royal Blue
    case 'green': return 'radial-gradient(circle at 30% 30%, #22c55e, #15803d)'; // Emerald
    case 'purple': return 'radial-gradient(circle at 30% 30%, #a855f7, #7e22ce)'; // Deep Purple
    default: return 'radial-gradient(circle at 30% 30%, #eab308, #a16207)';
  }
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
      className={`relative rounded-sm p-5 shadow-xl transition-transform hover:z-10 hover:shadow-2xl ${bgClass} paper-texture border border-black/5`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Cello Tape Effect */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-7 w-20 bg-white/30 backdrop-blur-[2px] border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1)] skew-x-[-15deg] skew-y-[3deg] z-10 rounded-sm">
        {/* Subtle tape texture/wrinkle */}
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* 3D Push Pin Effect (Restored to top right, with dynamic colors) */}
      <div className="absolute -top-3 -right-2 w-6 h-6 rounded-full shadow-md z-20 flex items-center justify-center border border-white/20"
           style={{ background: getPinGradient(glow.color) }}>
        <div className="w-2 h-2 rounded-full bg-white/50 blur-[1px] absolute top-1 left-1"></div>
        {/* The needle pointing out diagonally */}
        <div className="w-1 h-3 bg-gray-400 absolute -bottom-2 -left-1 rotate-45 -z-10 shadow-sm"></div>
      </div>

      <div className="mb-4 flex items-center justify-between relative z-20">
        <div className="font-bold text-sm tracking-tight">
          {username} <span className="text-black/40 font-normal text-xs ml-1">✦</span>
        </div>
        <div className="text-[11px] text-black/50 font-bold uppercase tracking-wider">{timestamp}</div>
      </div>
      
      <p className="whitespace-pre-wrap break-words text-2xl leading-snug font-handwriting text-black/90 pb-2">
        {glow.content}
      </p>

      {/* Week 3: Likes and Comments */}
      <div className="mt-6 text-black/60 border-t border-black/10 pt-3">
        <CommentSection 
          glowId={glow.id} 
          initialCount={glow.commentsCount} 
          leftAction={
            <LikeButton 
              glowId={glow.id} 
              initialLiked={glow.isLikedByMe} 
              initialCount={glow.likesCount} 
            />
          }
        />
      </div>
    </div>
  );
}
