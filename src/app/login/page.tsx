'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function LoginPage() {
  const { signIn, resetPassword } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await resetPassword(resetEmail);

    if (result.error) {
      setError(result.error);
    } else {
      setResetSent(true);
      setResetEmail('');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#D0CEB5' }}>
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
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-24 md:h-32 mx-auto mb-6 w-auto object-contain"
          />
        </div>
        
        {/* Logo/Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-serif mb-4" style={{ color: '#274E13' }}>
            Digital Invitation & Guest Info Suite
          </h1>
          <p className="text-sm md:text-base max-w-md mx-auto" style={{ color: '#274E13' }}>
            Bridging the gap between elegant print and digital innovation. Send beautiful physical invitations paired with an interactive digital experience.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          {!showResetForm ? (
            <>
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
                onClick={() => setShowResetForm(true)}
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
            </>
          ) : (
            <>
              <h2 className="text-lg font-serif text-center mb-6" style={{ color: '#274E13' }}>
                Reset Password
              </h2>

              {resetSent && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-800">
                  Check your email for a password reset link.
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
                  {error}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
                    style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
                    placeholder="your@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-lg font-semibold text-white transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: '#274E13' }}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <button
                onClick={() => setShowResetForm(false)}
                className="w-full mt-4 text-sm font-medium transition-opacity hover:opacity-75"
                style={{ color: '#274E13' }}
              >
                Back to login
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t py-6 text-center" style={{ borderColor: '#274E13', color: '#274E13', backgroundColor: '#D0CEB5' }}>
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
