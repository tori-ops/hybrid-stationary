'use client';

export default function VenueInfo({ config }: { config?: any }) {
  const venue = config?.venue || {};
  const accentColor = config?.colors?.accent || '#db2777';
  const secondaryColor = config?.colors?.secondary || '#274E13';

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl">
      <div className="p-6 rounded-lg border-2" style={{
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
