import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/LogoutButton';
import { CreateGlowForm } from '@/components/CreateGlowForm';
import { GlowCard } from '@/components/GlowCard';
import { getGlows } from '@/app/actions/glows';

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login');
  }

  // Get the user's profile for display
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  // Fetch Glows
  const glows = await getGlows();

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Mobile-style Header (Responsive) */}
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 pt-4 pb-3 px-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          {/* Brand Identity - Left Side */}
          <div className="flex items-center gap-3">
            <div 
              className="relative flex items-center justify-center bg-[#fef08a] border border-[#ca8a04] shadow-sm rounded-sm"
              style={{ width: '32px', height: '32px', transform: 'rotate(-5deg)' }}
            >
              <span className="font-bold text-[#1a0800] text-lg font-sans">G</span>
              <div className="absolute top-[3px] right-[12px] w-[7px] h-[7px] bg-red-500 rounded-full shadow-[1px_1px_2px_rgba(0,0,0,0.5)]" />
            </div>
            <h1 className="text-2xl font-bold tracking-wide select-none" style={{
              color: '#ffffff',
              textShadow: '0 0 10px rgba(216, 180, 254, 0.8), 0 0 20px rgba(168, 85, 247, 0.6), 0 0 30px rgba(147, 51, 234, 0.4)'
            }}>
              Glooooed
            </h1>
          </div>

          {/* User & Actions - Right Side */}
          <div className="flex items-center gap-4">
             <button className="text-white/70 hover:text-white hidden sm:block">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
             </button>
             
             {/* Profile Capsule */}
             <div className="flex items-center gap-2 bg-white/5 rounded-full pl-1.5 pr-3 py-1.5 border border-white/10">
               <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-accent to-purple-600 p-[2px] shadow-sm">
                 <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-[11px]">
                   {profile?.username?.charAt(0).toUpperCase() || 'U'}
                 </div>
               </div>
               <span className="text-sm font-semibold max-w-[80px] sm:max-w-[120px] truncate">{profile?.username || user.email?.split('@')[0]}</span>
             </div>

             <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 w-full max-w-5xl mx-auto">
        {/* Create Glow Form */}
        <div className="max-w-2xl mx-auto">
          <CreateGlowForm />
        </div>

        {/* Feed */}
        <div className="mt-8 space-y-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            Feed
          </h2>
          
          {glows.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center bg-card/50">
              <div className="mb-4 text-4xl text-muted">✦</div>
              <h3 className="text-lg font-semibold">No Glows yet</h3>
              <p className="mt-2 max-w-xs text-sm text-muted">
                Be the first to share what's sticking in your world!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start">
              {glows.map((glow) => (
                <GlowCard key={glow.id} glow={glow} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
