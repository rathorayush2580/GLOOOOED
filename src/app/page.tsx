import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/LogoutButton';

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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <h1 className="text-xl font-bold">
            <span className="text-accent">✦</span> Glow
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">
              {profile?.username || user.email?.split('@')[0]}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Feed placeholder — will be built in Week 2 */}
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <div className="mb-4 text-5xl">✦</div>
          <h2 className="text-xl font-semibold">Your feed is coming soon</h2>
          <p className="mt-2 max-w-xs text-sm text-muted">
            This is where you'll see Glows from the community. The feed will be built in Week 2.
          </p>
        </div>
      </main>
    </div>
  );
}
