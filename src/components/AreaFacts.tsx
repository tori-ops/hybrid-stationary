'use client';

import { weddingConfig } from '@/config/weddingConfig';

export default function AreaFacts({ config }: { config?: any }) {
  const areaFacts = config?.areaFacts || weddingConfig.areaFacts;
  const venue = config?.venue || weddingConfig.venue;
  const secondaryColor = config?.colors?.secondary || '#274E13';
  const accentColor = config?.colors?.accent || '#db2777';

  const attractionsList = config?.attractionsList || [];
  const diningList = config?.diningList || [];
  const activitiesList = config?.activitiesList || [];
  const accommodationsList = config?.accommodationsList || [];

  interface BusinessItem {
    name: string;
    address: string;
    phone: string;
    distance: string;
    is_18_plus: boolean;
    is_21_plus: boolean;
    cuisine?: string;
  }

  const renderBusinessCard = (item: BusinessItem) => (
    <div
      key={item.name}
      className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
      style={{ borderColor: accentColor }}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900">{item.name}</h4>
        <div className="flex gap-1">
          {item.is_21_plus && (
            <span
              className="px-2 py-1 text-xs font-bold rounded text-white"
              style={{ backgroundColor: accentColor }}
            >
              21+
            </span>
          )}
          {item.is_18_plus && !item.is_21_plus && (
            <span
              className="px-2 py-1 text-xs font-bold rounded text-white"
              style={{ backgroundColor: accentColor }}
            >
              18+
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-1">{item.address}</p>
      <p className="text-sm text-gray-600 mb-1">
        <a href={`tel:${item.phone}`} style={{ color: accentColor }} className="font-semibold">
          {item.phone}
        </a>
      </p>
      {item.distance && (
        <p className="text-xs text-gray-500">{item.distance} miles from venue</p>
      )}
      {item.cuisine && (
        <p className="text-xs text-gray-700 mt-1">
          <span style={{ color: secondaryColor }}>Cuisine:</span> {item.cuisine}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl">
      <div className="mb-8">
        <h2 className="text-3xl font-serif mb-2" style={{ color: accentColor }}>
          Discover {venue.city}
        </h2>
        <p className="text-gray-600">
          A beautiful destination to celebrate love
        </p>
      </div>

      {/* Legacy Text Descriptions */}
      {areaFacts && areaFacts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
      )}

      {/* Structured Business Listings */}
      {(attractionsList.length > 0 || diningList.length > 0 || activitiesList.length > 0 || accommodationsList.length > 0) && (
        <div className="space-y-8 mb-8">
          {attractionsList.length > 0 && (
            <div>
              <h3 className="text-2xl font-serif mb-4" style={{ color: accentColor }}>
                Local Attractions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attractionsList.map((item: BusinessItem) => renderBusinessCard(item))}
              </div>
            </div>
          )}

          {diningList.length > 0 && (
            <div>
              <h3 className="text-2xl font-serif mb-4" style={{ color: accentColor }}>
                Dining Scene
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diningList.map((item: BusinessItem) => renderBusinessCard(item))}
              </div>
            </div>
          )}

          {activitiesList.length > 0 && (
            <div>
              <h3 className="text-2xl font-serif mb-4" style={{ color: accentColor }}>
                Local Activities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activitiesList.map((item: BusinessItem) => renderBusinessCard(item))}
              </div>
            </div>
          )}

          {accommodationsList.length > 0 && (
            <div>
              <h3 className="text-2xl font-serif mb-4" style={{ color: accentColor }}>
                Accommodations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accommodationsList.map((item: BusinessItem) => renderBusinessCard(item))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Venue Details Card */}
      <div className="mt-8 p-6 rounded-lg border-2" style={{
        background: `linear-gradient(to right, ${secondaryColor}15, ${accentColor}15)`,
        borderColor: accentColor
      }}>
        <h3 className="text-2xl font-serif mb-4" style={{ color: accentColor }}>Venue Information</h3>
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
