'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInvitation } from '@/hooks/useInvitation';
import { invitationToConfig } from '@/lib/invitationConfig';
import InviteCard from '@/components/InviteCard';
import WeatherWidget from '@/components/WeatherWidget';
import AreaFacts from '@/components/AreaFacts';
import ContactSection from '@/components/ContactSection';
import { weddingConfig } from '@/config/weddingConfig';

function InvitePageContent() {
  const searchParams = useSearchParams();
  const eventSlug = searchParams?.get('event') || 'default';
  const { invitation, loading, error } = useInvitation(eventSlug === 'default' ? undefined : eventSlug);
  
  // Convert invitation data to config format, fall back to default
  const config = invitationToConfig(invitation);
  const { weatherLocation, couple } = config;

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Loading invitation...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error: {error}</p>
          <p className="text-gray-600 mt-2">Using default invitation</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-2">
            {couple.brideName} & {couple.groomName}
          </h1>
          <p className="text-rose-100 text-lg">
            You are cordially invited to celebrate their wedding
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Invite Card Section */}
        <section className="mb-16">
          <InviteCard config={config} />
        </section>

        {/* Weather Widget Section - Conditional */}
        {invitation?.show_weather !== false && (
          <section className="mb-16 px-4">
            <WeatherWidget
              latitude={weatherLocation.latitude}
              longitude={weatherLocation.longitude}
              city={weatherLocation.city}
            />
          </section>
        )}

        {/* Area Facts Section - Conditional */}
        {invitation?.show_area_facts !== false && (
          <section className="mb-16 flex justify-center">
            <AreaFacts config={config} />
          </section>
        )}

        {/* Contact Section - Conditional */}
        {invitation?.show_contact_section !== false && (
          <section className="mb-16 flex justify-center">
            <ContactSection config={config} />
          </section>
        )}

        {/* Footer */}
        <footer className="mt-20 py-8 border-t border-gray-300 text-center">
          <p className="text-gray-600 text-sm mb-2">
            Created with care by Missing Piece Planning
          </p>
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </footer>
      </div>
    </main>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Loading...</p></div>}>
      <InvitePageContent />
    </Suspense>
  );
}
