'use client';

import { useState } from 'react';
import { weddingConfig } from '@/config/weddingConfig';

export default function AreaFacts({ config }: { config?: any }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const areaFacts = config?.areaFacts || weddingConfig.areaFacts;
  const venue = config?.venue || weddingConfig.venue;
  const secondaryColor = config?.colors?.secondary || '#274E13';
  const accentColor = config?.colors?.accent || '#db2777';
  const backgroundImageUrl = config?.backgroundImageUrl;

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
      <p className="text-sm text-gray-600 mb-1">
        <a 
          href={`https://maps.google.com/?q=${encodeURIComponent(item.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: accentColor }} 
          className="font-semibold hover:underline"
        >
          📍 {item.address}
        </a>
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <a href={`tel:${item.phone}`} style={{ color: accentColor }} className="font-semibold hover:underline">
          📞 {item.phone}
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
    <div className="rounded-lg shadow-lg p-4 md:p-8 max-w-4xl" style={{ background: `linear-gradient(135deg, white, rgba(39, 78, 19, 0.05))`, borderLeft: `4px solid ${secondaryColor}` }}>
      <div className="mb-8">
        <h2 className="text-base md:text-lg font-serif mb-2" style={{ color: accentColor }}>
          Discover {venue.city}
        </h2>
        <p className="text-gray-600">
          A beautiful destination to celebrate love
        </p>
      </div>

      {/* Legacy Text Descriptions - Clickable Cards */}
      {areaFacts && areaFacts.length > 0 && (
        <div className="grid grid-cols-2 gap-6 mb-8">
          {areaFacts?.map((fact: any, index: number) => {
            const categoryMap: { [key: number]: string } = {
              0: 'attractions',
              1: 'dining',
              2: 'activities',
              3: 'accommodations',
            };
            const category = categoryMap[index];
            // Skip card if section is not enabled
            if ((category === "attractions" && !config?.sections?.attractions) ||
                (category === "dining" && !config?.sections?.dining) ||
                (category === "activities" && !config?.sections?.activities) ||
                (category === "accommodations" && !config?.sections?.accommodations)) {
              return null;
            }
            const hasBusinesses =
              (category === 'attractions' && attractionsList.length > 0) ||
              (category === 'dining' && diningList.length > 0) ||
              (category === 'activities' && activitiesList.length > 0) ||
              (category === 'accommodations' && accommodationsList.length > 0);

            return (
              <div
                key={index}
                onClick={() => {
                  if (hasBusinesses) {
                    setSelectedCategory(category);
                    setIsModalOpen(true);
                  }
                }}
                className={`p-6 rounded-lg border transition-shadow ${
                  hasBusinesses ? 'cursor-pointer hover:shadow-lg' : ''
                }`}
                style={{
                  background: `linear-gradient(to bottom right, ${secondaryColor}08, ${accentColor}08)`,
                  borderColor: accentColor,
                }}
              >
                <h3 className="text-base md:text-lg font-serif mb-3" style={{ color: accentColor }}>
                  {fact.title}
                </h3>
                <p className="text-sm md:text-base text-gray-700">{fact.description}</p>
                {hasBusinesses && (
                  <p className="text-sm mt-3" style={{ color: accentColor }}>
                    Click to view details →
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Business Listings */}
      {isModalOpen && selectedCategory && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          style={{
            backgroundImage: backgroundImageUrl ? `url('${backgroundImageUrl}')` : 'none',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } as any}
        >
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-base md:text-lg font-serif" style={{ color: accentColor }}>
                {selectedCategory === 'attractions'
                  ? 'Local Attractions'
                  : selectedCategory === 'dining'
                  ? 'Dining Scene'
                  : selectedCategory === 'activities'
                  ? 'Local Shopping'
                  : 'Accommodations'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedCategory(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedCategory === 'attractions' &&
                (attractionsList.length > 0 ? (
                  attractionsList.map((item: BusinessItem) => renderBusinessCard(item))
                ) : (
                  <p className="text-gray-500">No attractions added yet.</p>
                ))}

              {selectedCategory === 'dining' &&
                (diningList.length > 0 ? (
                  diningList.map((item: BusinessItem) => renderBusinessCard(item))
                ) : (
                  <p className="text-gray-500">No restaurants added yet.</p>
                ))}

              {selectedCategory === 'activities' &&
                (activitiesList.length > 0 ? (
                  activitiesList.map((item: BusinessItem) => renderBusinessCard(item))
                ) : (
                  <p className="text-gray-500">No activities added yet.</p>
                ))}

              {selectedCategory === 'accommodations' &&
                (accommodationsList.length > 0 ? (
                  accommodationsList.map((item: BusinessItem) => renderBusinessCard(item))
                ) : (
                  <p className="text-gray-500">No accommodations added yet.</p>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




