'use client';

import { useState, useRef, useEffect } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

interface Attraction {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  distance: string;
  is_18_plus: boolean;
  is_21_plus: boolean;
  cuisine?: string; // Only for dining
}

interface AreaFactsEditorProps {
  type: 'attractions' | 'dining' | 'activities' | 'accommodations';
  title: string;
  items: Attraction[];
  onItemsChange: (items: Attraction[]) => void;
  venueLatitude?: number;
  venueLongitude?: number;
  onRequestSuggestions?: (type: string) => void;
}

const CUISINES = [
  'Italian',
  'Mexican',
  'Japanese',
  'Chinese',
  'French',
  'Indian',
  'Thai',
  'Vietnamese',
  'Korean',
  'Mediterranean',
  'American',
  'Steakhouse',
  'Seafood',
  'Vegetarian',
  'Vegan',
  'Fusion',
  'Other',
];

export default function AreaFactsEditor({
  type,
  title,
  items,
  onItemsChange,
  venueLatitude,
  venueLongitude,
  onRequestSuggestions,
}: AreaFactsEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [activeAddressIndex, setActiveAddressIndex] = useState<number | null>(null);
  const addressInputRefs = useRef<{ [key: string]: HTMLInputElement }>({});

  // Load Google Places API
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleAddItem = () => {
    const newItem: Attraction = {
      id: Date.now().toString(),
      name: '',
      address: '',
      phone: '',
      distance: '',
      is_18_plus: false,
      is_21_plus: false,
      ...(type === 'dining' && { cuisine: '' }),
    };
    onItemsChange([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: string, value: any) => {
    onItemsChange(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddressInput = async (id: string, value: string, index: number) => {
    handleItemChange(id, 'address', value);
    setActiveAddressIndex(index);

    if (value.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    if (!window.google) return;

    const service = new window.google.maps.places.AutocompleteService();
    const request: any = {
      input: value,
      componentRestrictions: { country: 'us' },
    };

    if (venueLatitude && venueLongitude) {
      request.location = new window.google.maps.LatLng(venueLatitude, venueLongitude);
      request.radius = 50000; // 50km
    }

    try {
      const result = await service.getPlacePredictions(request);
      setAddressSuggestions(result.predictions || []);
    } catch (error) {
      console.error('Autocomplete error:', error);
    }
  };

  const handleSelectSuggestion = (itemId: string, prediction: any, itemIndex: number) => {
    handleItemChange(itemId, 'address', prediction.description);
    setAddressSuggestions([]);
    setActiveAddressIndex(null);

    // Get details for distance calculation
    if (window.google && venueLatitude && venueLongitude) {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );
      service.getDetails(
        { placeId: prediction.place_id, fields: ['geometry'] },
        (place: any, status: any) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry) {
            const distance = calculateDistance(
              venueLatitude,
              venueLongitude,
              place.geometry.location.lat(),
              place.geometry.location.lng()
            );
            handleItemChange(itemId, 'distance', distance);
          }
        }
      );
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 3959; // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(1);
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-xxs font-normal"
          style={{ color: '#274E13' }}
        >
          <span>{isExpanded ? '▼' : '▶'}</span>
          {title} ({items.length}/10)
        </button>
        {isExpanded && (
          <div className="flex gap-2">
            {items.length < 10 && (
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1 rounded-lg text-white font-semibold text-xs"
                style={{ backgroundColor: '#274E13' }}
              >
                + Add
              </button>
            )}
            {typeof venueLatitude === 'number' && typeof venueLongitude === 'number' && 
             venueLatitude !== 0 && venueLongitude !== 0 && onRequestSuggestions && items.length < 10 && (
              <button
                type="button"
                onClick={() => onRequestSuggestions(type)}
                className="px-3 py-1 rounded-lg text-white font-semibold text-xs"
                style={{ backgroundColor: '#db2777' }}
              >
                💡 Get Suggestions
              </button>
            )}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: '#274E13' }}>
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    style={{ color: '#000' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: '#274E13' }}>
                    Phone
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="tel"
                      value={item.phone}
                      onChange={(e) => handleItemChange(item.id, 'phone', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      style={{ color: '#000' }}
                      placeholder="(555) 123-4567"
                    />
                    {item.phone && (
                      <a
                        href={`tel:${item.phone.replace(/\D/g, '')}`}
                        className="px-2 py-2 text-white rounded text-xs font-semibold whitespace-nowrap"
                        style={{ backgroundColor: '#274E13' }}
                        title="Click to call"
                      >
                        📞 Call
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-3 relative">
                <label className="text-xs font-medium block mb-1" style={{ color: '#274E13' }}>
                  Address
                </label>
                <div className="flex gap-2 items-start">
                  <div className="flex-1 relative">
                    <input
                      ref={(el) => {
                        if (el) addressInputRefs.current[item.id] = el;
                      }}
                      type="text"
                      value={item.address}
                      onChange={(e) => handleAddressInput(item.id, e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      style={{ color: '#000' }}
                      placeholder="Start typing address..."
                    />
                    {activeAddressIndex === index && addressSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded mt-1 z-10 max-h-48 overflow-y-auto">
                        {addressSuggestions.map((suggestion) => (
                          <div
                            key={suggestion.place_id}
                            onClick={() => handleSelectSuggestion(item.id, suggestion, index)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm border-b border-gray-200"
                          >
                            {suggestion.description}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {item.address && (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(item.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-2 text-white rounded text-xs font-semibold whitespace-nowrap"
                      style={{ backgroundColor: '#274E13' }}
                      title="Open in Google Maps"
                    >
                      🗺️ Maps
                    </a>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label className="text-xs font-medium block mb-1" style={{ color: '#274E13' }}>
                  Email
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="email"
                    value={item.email || ''}
                    onChange={(e) => handleItemChange(item.id, 'email', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    style={{ color: '#000' }}
                    placeholder="email@example.com"
                  />
                  {item.email && (
                    <a
                      href={`mailto:${item.email}`}
                      className="px-2 py-2 text-white rounded text-xs font-semibold whitespace-nowrap"
                      style={{ backgroundColor: '#274E13' }}
                      title="Send email"
                    >
                      ✉️ Email
                    </a>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label className="text-xs font-medium block mb-1" style={{ color: '#274E13' }}>
                  Website
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="url"
                    value={item.website || ''}
                    onChange={(e) => handleItemChange(item.id, 'website', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    style={{ color: '#000' }}
                    placeholder="https://example.com"
                  />
                  {item.website && (
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-2 text-white rounded text-xs font-semibold whitespace-nowrap"
                      style={{ backgroundColor: '#274E13' }}
                      title="Visit website"
                    >
                      🌐 Visit
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: '#274E13' }}>
                    Distance from Venue (miles)
                  </label>
                  <input
                    type="text"
                    value={item.distance}
                    onChange={(e) => handleItemChange(item.id, 'distance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    style={{ color: '#000' }}
                    placeholder="Auto-calculated"
                  />
                </div>
                {type === 'dining' && (
                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: '#274E13' }}>
                      Cuisine Type
                    </label>
                    <select
                      value={item.cuisine || ''}
                      onChange={(e) => handleItemChange(item.id, 'cuisine', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      style={{ color: '#000' }}
                    >
                      <option value="">Select Cuisine</option>
                      {CUISINES.map((cuisine) => (
                        <option key={cuisine} value={cuisine}>
                          {cuisine}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mb-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.is_18_plus}
                    onChange={(e) => handleItemChange(item.id, 'is_18_plus', e.target.checked)}
                  />
                  <span style={{ color: '#274E13' }}>18+ Only</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.is_21_plus}
                    onChange={(e) => handleItemChange(item.id, 'is_21_plus', e.target.checked)}
                  />
                  <span style={{ color: '#274E13' }}>21+ Only</span>
                </label>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="px-3 py-1 text-sm rounded text-white"
                style={{ backgroundColor: '#FF6B6B' }}
              >
                Remove
              </button>
            </div>
          ))}

          {items.length === 0 && (
            <p className="text-gray-500 text-sm">No items added yet. Click "+ Add" to add one.</p>
          )}
        </div>
      )}
    </div>
  );
}
