'use client';

import { weddingConfig } from '@/config/weddingConfig';

export default function AreaFacts({ config }: { config?: any }) {
  const areaFacts = config?.areaFacts || weddingConfig.areaFacts;
  const venue = config?.venue || weddingConfig.venue;
  const secondaryColor = config?.secondary_color || '#274E13';
  const accentColor = config?.accent_color || '#FF6B6B';

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl">
      <div className="mb-8">
        <h2 className="text-3xl font-serif mb-2" style={{ color: secondaryColor }}>
          Discover {venue.city}
        </h2>
        <p className="text-gray-600">
          A beautiful destination to celebrate love
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {areaFacts?.map((fact: any, index: number) => (
          <div
            key={index}
            className="p-6 rounded-lg border hover:shadow-md transition-shadow"
            style={{
              background: `linear-gradient(to bottom right, ${secondaryColor}08, ${accentColor}08)`,
              borderColor: accentColor
            }}
          >
            <h3 className="text-xl font-serif mb-3" style={{ color: accentColor }}>
              {fact.title}
            </h3>
            <p className="text-gray-700">{fact.description}</p>
          </div>
        ))}
      </div>

      {/* Venue Details Card */}
      <div className="mt-8 p-6 rounded-lg border-2" style={{
        background: `linear-gradient(to right, ${secondaryColor}15, ${accentColor}15)`,
        borderColor: accentColor
      }}>
        <h3 className="text-2xl font-serif mb-4" style={{ color: secondaryColor }}>Venue Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">
              Venue
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {venue.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">
              Address
            </p>
            <p className="text-gray-800">
              {venue.address}
              <br />
              {venue.city}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">
              Phone
            </p>
            <a
              href={`tel:${venue.phone}`}
              className="font-semibold"
              style={{ color: accentColor }}
            >
              {venue.phone}
            </a>
          </div>
          <div>
            <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">
              Website
            </p>
            <a
              href={venue.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold"
              style={{ color: accentColor }}
            >
              Visit Website →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
