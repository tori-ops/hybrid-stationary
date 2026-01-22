'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function Home() {
  const { signIn, user } = useAuth();
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

  // If logged in, redirect to dashboard
  if (user) {
    router.push('/dashboard');
    return null;
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#D0CEB5' }}>
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: '#D0CEB5' }}>
        <div className="max-w-4xl w-full">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-serif mb-6" style={{ color: '#274E13' }}>
              Digital Invitation & Guest Info Suite
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: '#274E13' }}>
              Bridging the gap between elegant print and digital innovation. Send beautiful physical invitations paired with an interactive digital experience.
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-auto">
            <h2 className="text-xl font-serif text-center mb-6" style={{ color: '#274E13' }}>
              Planner Login
            </h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black"
                  style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#274E13' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-4 text-center text-sm space-y-2">
              <div>
                <Link href="/login" style={{ color: '#274E13' }} className="font-semibold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="text-gray-600">
                Don't have an account?{' '}
                <Link href="/signup" style={{ color: '#274E13' }} className="font-semibold hover:underline">
                  Sign up
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-20 text-center border-t pt-8" style={{ borderColor: '#274E13', color: '#274E13' }}>
            <p className="text-sm">
              Created by The Missing Piece Planning and Events
            </p>
            <p className="text-xs mt-2">
              Version 1.4.2 © 2026
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
