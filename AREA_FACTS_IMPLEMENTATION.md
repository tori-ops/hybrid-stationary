# Area Facts Editor Implementation

## Overview
The area facts system has been completely redesigned to support dynamic, structured business listings with smart address autocomplete, age restrictions, and distance calculations.

## Features

### 1. Dynamic Collapsible Lists
- 4 independent categories: Attractions, Dining, Activities, Accommodations
- Maximum 10 items per category
- Collapsible UI for easy navigation
- Add/Remove buttons for each item

### 2. Google Places API Integration
- **Smart Address Autocomplete**: As planners type addresses, suggestions appear from Google Places
- **Auto-Distance Calculation**: Once an address is selected, distance from venue is calculated automatically using Haversine formula
- **Location-Based Results**: Autocomplete is biased toward the venue location (50km radius)

### 3. Structured Data Fields
Each business entry contains:
- **Business Name**: Name of the establishment
- **Address**: Full address (autocompleted)
- **Phone**: Contact phone number
- **Distance**: Miles from venue (auto-calculated)
- **Age Restrictions**: 18+ and/or 21+ checkboxes
- **Cuisine Type**: Dropdown selector (dining only)

### 4. Age Labels
- Restaurants and venues with age restrictions display 21+ or 18+ badges
- Badges appear on invitation display with accent color
- Helps guests quickly identify age-restricted venues

## Database Schema

### New Columns (JSONB)
```sql
attractions_list      -- Array of attraction objects
dining_list           -- Array of dining objects  
activities_list       -- Array of activity objects
accommodations_list   -- Array of accommodation objects
```

### Data Structure for Each Item
```json
{
  "id": "uuid-string",
  "name": "Business Name",
  "address": "123 Main St, City, State 12345",
  "phone": "(555) 123-4567",
  "distance": "2.5",
  "is_18_plus": false,
  "is_21_plus": false,
  "cuisine": "Italian"  // Only for dining items
}
```

## Implementation Details

### Components

#### AreaFactsEditor.tsx
- Main component for planners to manage business listings
- Handles Google Places API integration
- Manages form state and validation
- Location: `src/components/AreaFactsEditor.tsx`

**Props:**
```typescript
interface AreaFactsEditorProps {
  type: 'attractions' | 'dining' | 'activities' | 'accommodations';
  title: string;
  items: Attraction[];
  onItemsChange: (items: Attraction[]) => void;
  venueLatitude?: number;
  venueLongitude?: number;
}
```

#### InvitationForm.tsx
- Updated to import and use AreaFactsEditor
- Manages 4 separate state arrays (attractionsList, diningList, etc.)
- Saves all lists to database on form submission
- Location: `src/components/InvitationForm.tsx`

#### AreaFacts.tsx
- Updated invitation display component
- Shows both legacy text descriptions AND new structured listings
- Displays business cards with all details
- Shows age restriction badges
- Location: `src/components/AreaFacts.tsx`

### Configuration

#### invitationConfig.ts
- Maps database columns to config format
- Returns legacy areaFacts array + new lists
- Backwards compatible with old text-based system
- Location: `src/lib/invitationConfig.ts`

#### supabase.ts
- Updated Invitation interface with new columns
- Location: `src/lib/supabase.ts`

## Database Migration

Run the provided SQL migration to add the new columns:

```sql
-- Run in Supabase SQL Editor
-- File: migration-area-facts.sql

ALTER TABLE public.invitations 
ADD COLUMN IF NOT EXISTS attractions_list jsonb DEFAULT '[]'::jsonb;

ALTER TABLE public.invitations 
ADD COLUMN IF NOT EXISTS dining_list jsonb DEFAULT '[]'::jsonb;

ALTER TABLE public.invitations 
ADD COLUMN IF NOT EXISTS activities_list jsonb DEFAULT '[]'::jsonb;

ALTER TABLE public.invitations 
ADD COLUMN IF NOT EXISTS accommodations_list jsonb DEFAULT '[]'::jsonb;
```

## Environment Variables

The Google Places API key is stored in `.env.local`:
```
NEXT_PUBLIC_GOOGLE_API_KEY=AIzaSyCozMaE9nfMB6Pf22_d85gc44Pv3wrYk5c
```

This is loaded by the AreaFactsEditor component and used to initialize Google Maps JavaScript API.

## Usage Flow

### For Planners (Dashboard)
1. Open invitation customization form
2. Scroll to "Area Facts & Attractions" section
3. Click on category headers to expand (e.g., "Local Attractions (0/10)")
4. Click "+ Add" to add a new business
5. Fill in business name and phone
6. Start typing address to see Google Places suggestions
7. Select suggestion to auto-populate full address and distance
8. Add optional cuisine type (dining only) and age restrictions
9. Click "Remove" to delete an entry
10. Repeat for other categories
11. Save form

### For Guests (Invitation)
1. Open wedding invitation
2. Scroll to "Discover [City]" section
3. See legacy text descriptions (if available)
4. See new structured business listings organized by category
5. View business details: name, address, phone, distance, cuisine, age badges
6. Age badges help identify restricted venues (18+, 21+)

## API Integration

### Google Places Autocomplete API
- **Service**: AutocompleteService
- **Bias**: Venue location (50km radius)
- **Restriction**: US only
- **Fields Returned**: Predictions with place IDs

### Google Places Details API
- **Service**: PlacesService
- **Geometry Field**: Gets latitude/longitude for distance calculation
- **Usage**: Auto-calculate distance when address is selected

### Distance Calculation
- **Formula**: Haversine formula (great circle distance)
- **Units**: Miles
- **Precision**: 1 decimal place

## Future Enhancements

1. **Photos Integration**: Display Google Places photos in listings
2. **Ratings & Reviews**: Show Google ratings and review snippets
3. **Hours of Operation**: Display business hours
4. **Website Links**: Add clickable website links
5. **Map Integration**: Show venues on interactive map
6. **Mobile Optimization**: Improve address input on mobile
7. **Bulk Import**: CSV/spreadsheet import for multiple venues

## Backward Compatibility

- Legacy text fields (area_facts_attraction, area_facts_dining, etc.) remain in database
- Old invitations display legacy descriptions
- New system doesn't overwrite old data
- Both systems can coexist during transition period

## Troubleshooting

### Autocomplete Not Working
- Check Google API key is in .env.local
- Verify API key has Places API enabled
- Check browser console for CORS errors
- Ensure venue latitude/longitude are set (for location bias)

### Distance Not Calculating
- Ensure venue coordinates are set in form
- Check browser console for geometry errors
- Verify selected address has valid coordinates

### Age Badges Not Showing
- Check is_18_plus or is_21_plus flags are set
- Verify AreaFacts component is receiving config properly
- Check accent color is set in invitation config

## Testing Checklist

- [ ] Add business to each category
- [ ] Test Google autocomplete suggestions
- [ ] Verify distance auto-calculation
- [ ] Set age restrictions and verify badges display
- [ ] Set cuisine type for dining items
- [ ] Save form and verify data persists
- [ ] Load invitation and verify all listings display
- [ ] Test mobile responsive layout
- [ ] Test collapsible headers expand/collapse
- [ ] Verify max 10 items limit per category

## Files Modified

1. `src/components/AreaFactsEditor.tsx` - NEW
2. `src/components/InvitationForm.tsx` - UPDATED
3. `src/components/AreaFacts.tsx` - UPDATED
4. `src/lib/invitationConfig.ts` - UPDATED
5. `src/lib/supabase.ts` - UPDATED
6. `.env.local` - UPDATED (Google API key added)
7. `migration-area-facts.sql` - NEW

## Deployment Notes

1. Push code to main branch (auto-deploys via Vercel)
2. Run SQL migration in Supabase
3. Test on production URL: https://mp-hybrid-stationary.vercel.app
4. Verify backward compatibility with existing invitations
5. Monitor console for any API errors
