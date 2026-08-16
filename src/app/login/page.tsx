'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up with email, password, and username in metadata
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split('@')[0],
            },
          },
        });
        if (error) throw error;
      } else {
        // Sign in with email and password
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }

      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      {/* Brand */}
      <div className="mb-10 text-center relative z-10">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          <span className="text-accent">✦</span> Glow
        </h1>
        <p className="mt-2 text-white/60 text-sm font-medium tracking-wide uppercase">
          Memories that stick forever.
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#141416]/80 backdrop-blur-xl p-8 shadow-2xl relative z-10">
        <h2 className="mb-8 text-xl font-bold text-center text-white/90">
          {isSignUp ? "Let's get you glowing!" : 'Welcome back'} <span className="text-accent">✦</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose an Aura Name (Username)"
                className="w-full rounded-xl border border-white/5 bg-[#0a0a0c] px-4 py-3.5 text-sm text-foreground placeholder:text-white/30 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors"
              />
            </div>
          )}

          <div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className="w-full rounded-xl border border-white/5 bg-[#0a0a0c] px-4 py-3.5 text-sm text-foreground placeholder:text-white/30 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors"
            />
          </div>

          <div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Secret Password (min 6 chars)"
              minLength={6}
              className="w-full rounded-xl border border-white/5 bg-[#0a0a0c] px-4 py-3.5 text-sm text-foreground placeholder:text-white/30 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger border border-danger/20 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-accent px-4 py-3.5 text-sm font-bold text-black shadow-lg box-glow hover:bg-accent-hover hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed disabled:shadow-none transition-all mt-4"
          >
            {loading
              ? 'GLOWING IN...'
              : isSignUp
                ? 'CREATE AURA'
                : 'STICK IN'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="font-medium text-accent hover:text-accent-hover"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
}
