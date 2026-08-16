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
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-accent text-2xl">✦</span> 
            <span className="tracking-tight">Glow</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">
              {profile?.username || user.email?.split('@')[0]}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Create Glow Form */}
        <CreateGlowForm />

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
            <div className="grid gap-6 sm:grid-cols-2">
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
