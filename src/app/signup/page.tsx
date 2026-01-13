'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function SignupPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    const result = await signUp(email, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setShowConfirmation(true);
    }
  };

  if (showConfirmation) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#D0CEB5' }}>
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <h2 className="text-2xl font-serif mb-4" style={{ color: '#274E13' }}>
              Check Your Email
            </h2>
            <p className="text-gray-600 mb-6">
              We've sent a confirmation link to <strong>{email}</strong>. Please verify your email to complete signup.
            </p>
            <Link href="/login" style={{ color: '#274E13' }} className="font-semibold hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#D0CEB5' }}>
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif mb-2" style={{ color: '#274E13' }}>
            Missing Piece Planning
          </h1>
          <p className="text-lg" style={{ color: '#274E13' }}>
            Hybrid Invitation System
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-serif text-center mb-6" style={{ color: '#274E13' }}>
            Create Account
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
                Password (min 8 characters)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#274E13' }} className="font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
