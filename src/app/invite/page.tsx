'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInvitation } from '@/hooks/useInvitation';
import { invitationToConfig } from '@/lib/invitationConfig';
import StationeryDisplay from '@/components/StationeryDisplay';
import VenueInfo from '@/components/VenueInfo';
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
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Loading invitation...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error: {error}</p>
          <p className="text-gray-600 mt-2">Using default invitation</p>
        </div>
      </main>
    );
  }

  return (
    <main 
      className="min-h-screen bg-gray-50"
      style={{
        backgroundImage: invitation?.background_image_url ? `url('${invitation.background_image_url}')` : 'none',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-12">
        {/* Stationery Items Section - Conditional */}
        {invitation?.stationery_items && invitation.stationery_items.length > 0 && (
          <section className="mb-16 px-4">
            <StationeryDisplay 
              items={invitation.stationery_items}
              secondaryColor={invitation.secondary_color || '#274E13'}
              accentColor={invitation.accent_color || '#FF6B6B'}
            />
          </section>
        )}

        {/* Venue Information Section */}
        <section className="mb-12 flex justify-center">
          <VenueInfo config={config} />
        </section>

        {/* RSVP Button */}
        {invitation?.rsvp_link && (
          <section className="mb-12 flex justify-center">
            <a
              href={invitation.rsvp_link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90 border-2"
              style={{
                backgroundColor: invitation.secondary_color || '#274E13',
                color: invitation.accent_color || '#db2777',
                borderColor: invitation.accent_color || '#db2777'
              }}
            >
              RSVP Now
            </a>
          </section>
        )}

        {/* Weather Widget Section - Conditional */}
        {invitation?.show_weather !== false && (
          <section className="mb-12 flex justify-center">
            <div className="max-w-4xl w-full">
              <WeatherWidget
              latitude={weatherLocation.latitude}
              longitude={weatherLocation.longitude}
              city={weatherLocation.city}
              secondaryColor={(config as any).colors?.secondary}
              accentColor={(config as any).colors?.accent}
              />
            </div>
          </section>
        )}

        {/* Event Timeline Section */}
        <section className="mb-12 flex justify-center relative px-4">
          <div className="rounded-lg shadow-lg p-4 md:p-8 max-w-4xl w-full flex flex-row" style={{
            background: `linear-gradient(135deg, white, rgba(39, 78, 19, 0.05))`,
            borderLeft: `4px solid ${invitation?.secondary_color || '#274E13'}`
          }}>
            <div className="flex flex-row gap-4 md:gap-8 items-center flex-1">
              {/* Left column: Heading and Timeline content */}
              <div className="flex-1 w-full">
                <h2 className="text-2xl md:text-3xl font-serif mb-4 md:mb-8" style={{ color: invitation?.accent_color || '#FF6B6B' }}>
                  Event Timeline
                </h2>
                <div className="space-y-4">
                  {(invitation?.timeline_events || [
                    { time: '4:30 PM', name: 'Ceremony' },
                    { time: '5:15 PM', name: 'Cocktail Hour' },
                    { time: '6:00 PM', name: 'Dinner' },
                    { time: '10:00 PM', name: 'End of Event' },
                  ]).map((event: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 md:gap-4">
                      <div className="w-20 md:w-24 font-semibold text-sm md:text-base" style={{ color: invitation?.accent_color || '#FF6B6B' }}>
                        {event.time}
                      </div>
                      <div className="text-sm md:text-base text-gray-700">{event.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Timeline image on right in circle - aligned to top */}
              {invitation?.timeline_image_url && (
                <div className="flex-shrink-0 ml-auto">
                  <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-80 md:h-80 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={invitation.timeline_image_url}
                      alt="Timeline decoration"
                      className="w-56 h-56 sm:w-64 sm:h-64 md:w-96 md:h-96 object-cover object-center"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Area Facts Section - Conditional */}
        {invitation?.show_area_facts !== false && (
          <section className="mb-16 flex justify-center">
            <AreaFacts config={{...config, backgroundImageUrl: invitation?.background_image_url}} />
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
            Created with care by The Missing Piece Planning
          </p>
          <p className="text-gray-500 text-xs mb-4">
            © {new Date().getFullYear()} All rights reserved
          </p>
          {invitation?.logo_url && (
            <div className="flex justify-center">
              <img 
                src={invitation.logo_url} 
                alt="Logo" 
                className="h-16 object-contain"
              />
            </div>
          )}
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
