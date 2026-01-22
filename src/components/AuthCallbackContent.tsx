'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Processing verification...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the token from URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (type === 'email' && token) {
          // Verify the email token
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email',
          });

          if (error) {
            setMessage('❌ Verification failed: ' + error.message);
            setTimeout(() => router.push('/'), 3000);
          } else {
            setMessage('✅ Email verified! Redirecting to dashboard...');
            setTimeout(() => router.push('/dashboard'), 2000);
          }
        } else {
          setMessage('❌ Invalid verification link');
          setTimeout(() => router.push('/'), 3000);
        }
      } catch (err) {
        setMessage('❌ An error occurred: ' + (err instanceof Error ? err.message : 'Unknown error'));
        setTimeout(() => router.push('/'), 3000);
      }
    };

    handleAuthCallback();
  }, [searchParams, router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#D0CEB5' }}>
      <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
        <h2 className="text-2xl font-serif mb-4" style={{ color: '#274E13' }}>
          Email Verification
        </h2>
        <p style={{ color: '#274E13' }}>{message}</p>
      </div>
    </main>
  );
}
