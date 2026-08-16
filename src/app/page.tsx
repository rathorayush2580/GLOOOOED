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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-purple-600 p-[2px] shadow-lg box-glow">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-sm">
                {profile?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">{profile?.username || user.email?.split('@')[0]} <span className="text-accent text-xs">✦</span></h2>
              <p className="text-xs text-white/50">Building GLOOOOED 🚀</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="text-white/70 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
             </button>
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
