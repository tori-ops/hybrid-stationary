'use client';

import { weddingConfig } from '@/config/weddingConfig';

export default function AreaFacts({ config }: { config?: any }) {
  const areaFacts = config?.areaFacts || weddingConfig.areaFacts;
  const venue = config?.venue || weddingConfig.venue;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-rose-900 mb-2">
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
            className="p-6 bg-gradient-to-br from-rose-50 to-blue-50 rounded-lg border border-rose-100 hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-serif text-rose-900 mb-3">
              {fact.title}
            </h3>
            <p className="text-gray-700">{fact.description}</p>
          </div>
        ))}
      </div>

      {/* Venue Details Card */}
      <div className="mt-8 p-6 bg-gradient-to-r from-rose-100 to-blue-100 rounded-lg border-2 border-rose-300">
        <h3 className="text-2xl font-serif text-rose-900 mb-4">Venue Information</h3>
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
              className="text-rose-600 hover:text-rose-700 font-semibold"
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
              className="text-rose-600 hover:text-rose-700 font-semibold"
            >
              Visit Website →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
