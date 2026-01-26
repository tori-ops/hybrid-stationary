/**
 * Calculate distance between two geographic points using Haversine formula
 * Returns distance in miles
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
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
  return R * c;
}

/**
 * Reverse geocode coordinates to get full address using Nominatim
 */
export async function reverseGeocodeAddress(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'HybridWeddingInvite/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Build address from available parts
    const address = data.address;
    const addressParts = [];
    
    if (address.house_number && address.road) {
      addressParts.push(`${address.house_number} ${address.road}`);
    } else if (address.road) {
      addressParts.push(address.road);
    } else if (data.name) {
      addressParts.push(data.name);
    }
    
    if (address.city || address.town) {
      addressParts.push(address.city || address.town);
    }
    
    if (address.state) {
      addressParts.push(address.state);
    }
    
    if (address.postcode) {
      addressParts.push(address.postcode);
    }
    
    return addressParts.length > 0 ? addressParts.join(', ') : 'Address not found';
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return '';
  }
}

/**
 * Overpass API query for nearby locations
 * Categories: attractions, dining, shopping, accommodations
 */
export interface LocationSuggestion {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  distance: number; // in miles
  address?: string;
  phone?: string;
  email?: string;
}

interface OverpassNode {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    amenity?: string;
    tourism?: string;
    shop?: string;
    [key: string]: string | undefined;
  };
}

interface OverpassWay {
  id: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags: {
    name?: string;
    amenity?: string;
    tourism?: string;
    shop?: string;
    [key: string]: string | undefined;
  };
}

interface OverpassResponse {
  elements: (OverpassNode | OverpassWay)[];
}

/**
 * Build Overpass QL query for a category within radius
 */
function buildOverpassQuery(
  category: string,
  lat: number,
  lon: number,
  radiusKm: number
): string {
  let filters = '';

  switch (category) {
    case 'attractions':
      filters = `
        (
          node["tourism"="attraction"](around:${radiusKm * 1000},${lat},${lon});
          node["tourism"="museum"](around:${radiusKm * 1000},${lat},${lon});
          node["tourism"="viewpoint"](around:${radiusKm * 1000},${lat},${lon});
          node["leisure"="park"](around:${radiusKm * 1000},${lat},${lon});
          way["tourism"="attraction"](around:${radiusKm * 1000},${lat},${lon});
          way["tourism"="museum"](around:${radiusKm * 1000},${lat},${lon});
          way["leisure"="park"](around:${radiusKm * 1000},${lat},${lon});
        );
      `;
      break;
    case 'dining':
      filters = `
        (
          node["amenity"="restaurant"](around:${radiusKm * 1000},${lat},${lon});
          node["amenity"="cafe"](around:${radiusKm * 1000},${lat},${lon});
          node["amenity"="bar"](around:${radiusKm * 1000},${lat},${lon});
          node["amenity"="fast_food"](around:${radiusKm * 1000},${lat},${lon});
          way["amenity"="restaurant"](around:${radiusKm * 1000},${lat},${lon});
          way["amenity"="cafe"](around:${radiusKm * 1000},${lat},${lon});
          way["amenity"="bar"](around:${radiusKm * 1000},${lat},${lon});
        );
      `;
      break;
    case 'shopping':
      filters = `
        (
          node["shop"](around:${radiusKm * 1000},${lat},${lon});
          node["amenity"="marketplace"](around:${radiusKm * 1000},${lat},${lon});
          node["amenity"="shopping_centre"](around:${radiusKm * 1000},${lat},${lon});
          way["shop"](around:${radiusKm * 1000},${lat},${lon});
          way["amenity"="shopping_centre"](around:${radiusKm * 1000},${lat},${lon});
        );
      `;
      break;
    case 'accommodations':
      filters = `
        (
          node["tourism"="hotel"](around:${radiusKm * 1000},${lat},${lon});
          node["tourism"="guest_house"](around:${radiusKm * 1000},${lat},${lon});
          node["tourism"="bed_and_breakfast"](around:${radiusKm * 1000},${lat},${lon});
          node["tourism"="hostel"](around:${radiusKm * 1000},${lat},${lon});
          way["tourism"="hotel"](around:${radiusKm * 1000},${lat},${lon});
          way["tourism"="guest_house"](around:${radiusKm * 1000},${lat},${lon});
          way["tourism"="bed_and_breakfast"](around:${radiusKm * 1000},${lat},${lon});
        );
      `;
      break;
    default:
      return '';
  }

  return `
    [out:json];
    ${filters}
    out geom;
  `;
}

/**
 * Query Overpass API for location suggestions
 */
export async function getLocationSuggestions(
  category: string,
  venueLat: number,
  venueLon: number,
  maxDistance: number = 15 // miles
): Promise<LocationSuggestion[]> {
  try {
    const radiusKm = (maxDistance / 0.621371) * 1.1; // Convert miles to km with 10% buffer
    const query = buildOverpassQuery(category, venueLat, venueLon, radiusKm);

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'application/osm3s+xml' },
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.statusText}`);
    }

    const data: OverpassResponse = await response.json();

    // Process results - first pass, collect all items that meet distance criteria
    const suggestionsWithoutAddresses: Array<{
      element: any;
      lat: number;
      lon: number;
      distance: number;
    }> = [];

    data.elements.forEach((element) => {
      const name = element.tags.name;
      if (!name) return; // Skip unnamed places

      let lat = 0;
      let lon = 0;

      if ('lat' in element && 'lon' in element) {
        lat = element.lat;
        lon = element.lon;
      } else if ('center' in element && element.center) {
        lat = element.center.lat;
        lon = element.center.lon;
      } else {
        return; // Skip if no coordinates
      }

      const distance = calculateDistance(venueLat, venueLon, lat, lon);

      // Only include if within max distance
      if (distance <= maxDistance) {
        suggestionsWithoutAddresses.push({
          element,
          lat,
          lon,
          distance,
        });
      }
    });

    // Sort by distance and take top 15
    const topSuggestions = suggestionsWithoutAddresses
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 15);

    // Parallel reverse geocoding for all results
    const reverseGeocodePromises = topSuggestions.map((s) =>
      reverseGeocodeAddress(s.lat, s.lon)
        .catch((err) => {
          console.error('Failed to geocode:', err);
          return '';
        })
    );

    const addresses = await Promise.all(reverseGeocodePromises);

    // Build final suggestions with addresses
    const suggestions: LocationSuggestion[] = topSuggestions.map((s, index) => ({
      id: `${s.element.id}`,
      name: s.element.tags.name,
      type:
        s.element.tags.amenity ||
        s.element.tags.tourism ||
        s.element.tags.shop ||
        'location',
      latitude: s.lat,
      longitude: s.lon,
      distance: s.distance,
      address: addresses[index] || undefined,
      phone: s.element.tags.phone || undefined,
      email: s.element.tags.email || s.element.tags.contact_email || undefined,
    }));

    return suggestions;
  } catch (error) {
    console.error(`Error fetching ${category} suggestions:`, error);
    return [];
  }
}
