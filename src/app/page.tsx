'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function Home() {
  const { signIn, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(email, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  // If auth is still loading, show loading state
  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </main>
    );
  }

  // If logged in, redirect to dashboard
  if (user) {
    router.push('/dashboard');
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 pt-8" style={{ backgroundColor: '#D0CEB5' }}>
      <style>{`
        input[type="email"],
        input[type="password"] {
          color: #000 !important;
          font-size: 0.75rem !important;
        }
        input::placeholder {
          color: #999 !important;
        }
      `}</style>
      
      {/* Logo */}
      <div className="text-center mb-8 flex-shrink-0">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="h-32 md:h-48 mx-auto w-auto object-contain"
        />
      </div>
      
      {/* Title and Tagline */}
      <div className="text-center mb-8 w-full max-w-md">
        <h1 className="text-3xl md:text-4xl font-serif mb-4" style={{ color: '#274E13' }}>
          Digital Invitation & Guest Info Suite
        </h1>
        <p className="text-sm md:text-base max-w-md mx-auto" style={{ color: '#274E13' }}>
          Bridging the gap between elegant print and digital innovation. Send beautiful physical invitations paired with an interactive digital experience.
        </p>
      </div>

      <div className="w-full max-w-md mb-12">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-lg font-serif text-center mb-4" style={{ color: '#274E13' }}>
            Planner Login
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
                style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
                style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg font-semibold text-white transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#274E13' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <button
            onClick={() => router.push('/')}
            className="w-full mt-4 text-sm font-medium transition-opacity hover:opacity-75"
            style={{ color: '#274E13' }}
          >
            Forgot password?
          </button>

          <div className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" style={{ color: '#274E13' }} className="font-semibold hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full border-t py-6 text-center mt-8" style={{ borderColor: '#274E13', color: '#274E13' }}>
        <p className="text-sm">
          Created by The Missing Piece Planning and Events
        </p>
        <p className="text-xs mt-1">
          Version 1.4.2 © 2026
        </p>
      </div>
    </main>
  );
}
