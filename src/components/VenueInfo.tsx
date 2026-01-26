'use client';

export default function VenueInfo({ config }: { config?: any }) {
  const venue = config?.venue || {};
  const accentColor = config?.colors?.accent || '#db2777';
  const secondaryColor = config?.colors?.secondary || '#274E13';

  return (
    <div className="rounded-lg shadow-lg p-8 max-w-4xl relative" style={{ zIndex: 10, background: `linear-gradient(135deg, white, rgba(39, 78, 19, 0.05))`, borderLeft: `4px solid ${secondaryColor}` }}>
      <div className="p-6 rounded-lg border-2" style={{
        background: `linear-gradient(to right, ${secondaryColor}15, ${accentColor}15)`,
        borderColor: accentColor
      }}>
        <h3 className="text-base md:text-lg font-serif mb-4" style={{ color: accentColor }}>Venue Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide mb-1">
              Venue
            </p>
            <p className="text-sm md:text-base font-semibold text-gray-800">
              {venue.name}
            </p>
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide mb-1">
              Address
            </p>
            <p className="text-sm md:text-base text-gray-800">
              {venue.address}
              <br />
              {venue.city}, {venue.state || 'State'}
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide mb-1">
                  Latitude
                </p>
                <p className="text-sm md:text-base text-gray-800 font-mono">
                  {venue.latitude ? `${venue.latitude.toFixed(6)}` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide mb-1">
                  Longitude
                </p>
                <p className="text-sm md:text-base text-gray-800 font-mono">
                  {venue.longitude ? `${venue.longitude.toFixed(6)}` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide mb-1">
              Phone
            </p>
            <a
              href={`tel:${venue.phone}`}
              className="font-semibold text-sm md:text-base"
              style={{ color: accentColor }}
            >
              {venue.phone}
            </a>
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide mb-1">
              Website
            </p>
            <a
              href={venue.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sm md:text-base"
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



