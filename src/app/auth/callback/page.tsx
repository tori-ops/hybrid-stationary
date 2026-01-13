import { Suspense } from 'react';
import AuthCallbackContent from '@/components/AuthCallbackContent';

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#D0CEB5' }}>
          <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
            <h2 className="text-2xl font-serif mb-4" style={{ color: '#274E13' }}>
              Email Verification
            </h2>
            <p style={{ color: '#274E13' }}>Processing verification...</p>
          </div>
        </main>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
