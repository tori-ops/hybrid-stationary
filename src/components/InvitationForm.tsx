'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import AreaFactsEditor from './AreaFactsEditor';
import StationeryEditor from './StationeryEditor';
import LocationSuggestionsModal from './LocationSuggestionsModal';

interface Invitation {
  id?: string;
  event_slug: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  wedding_time?: string; // deprecated, replaced by ceremony_time
  ceremony_time?: string;
  reception_time?: string;
  be_out_by_time?: string;
  timezone: string;
  venue_name: string;
  venue_address: string;
  venue_city: string;
  venue_state: string;
  venue_phone: string;
  venue_website: string;
  venue_latitude: number;
  venue_longitude: number;
  planner_name: string;
  planner_email: string;
  planner_phone: string;
  planner_website?: string;
  couple_contact_name: string;
  couple_contact_email: string;
  couple_contact_phone: string;
  rsvp_link: string;
  couples_website?: string;
  rsvp_deadline: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
  invitation_front_image_url?: string;
  invitation_back_image_url?: string;
  invitation_background_image_url?: string;
  rsvp_background_image_url?: string;
  save_the_date_background_image_url?: string;
  logo_url?: string;
  background_image_url?: string;
  timeline_image_url?: string;
  timeline_events?: any[];
  area_facts_attraction?: string;
  area_facts_dining?: string;
  area_facts_activities?: string;
  area_facts_accommodations?: string;
  attractions_list?: any[];
  dining_list?: any[];
  activities_list?: any[];
  accommodations_list?: any[];
  stationery_items?: any[];
  show_weather: boolean;
  show_area_facts: boolean;
  show_dining: boolean;
  show_accommodations: boolean;
  show_activities: boolean;
  show_attractions: boolean;
  show_contact_section: boolean;
  show_venue_info: boolean;
  show_event_timeline: boolean;
  show_rsvp_deadline: boolean;
  show_guest_info: boolean;
  show_planner_info: boolean;
  guest_arrival_time?: string;
  parking_info?: string;
  same_location?: boolean;
  reception_venue_name?: string;
  reception_venue_address?: string;
  ceremony_indoor_outdoor?: string;
  show_faq: boolean;
  faq_items: Array<{ question: string; answer: string }> | null;
  is_published: boolean;
  approval_status?: string;
  approval_token?: string;
  approval_requested_at?: string;
  approval_approved_at?: string;
}

interface InvitationFormProps {
  invitation: Invitation | null;
  onSave: () => void;
}

export default function InvitationForm({ invitation, onSave }: InvitationFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Invitation>(
    invitation || {
      event_slug: '',
      bride_name: '',
      groom_name: '',
      wedding_date: '',
      ceremony_time: '15:00',
      reception_time: '17:00',
      be_out_by_time: '22:00',
      timezone: 'America/New_York',
      venue_name: '',
      venue_address: '',
      venue_city: '',
      venue_state: '',
      venue_phone: '',
      venue_website: '',
      venue_latitude: 0,
      venue_longitude: 0,
      planner_name: '',
      planner_email: user?.email || '',
      planner_phone: '',
      planner_website: '',
      couple_contact_name: '',
      couple_contact_email: '',
      couple_contact_phone: '',
      rsvp_link: '',
      couples_website: '',
      rsvp_deadline: '',
      primary_color: '#D0CEB5',
      secondary_color: '#274E13',
      accent_color: '#FF6B6B',
      font_family: 'Georgia',
      invitation_front_image_url: '',
      invitation_back_image_url: '',
      invitation_background_image_url: '',
      rsvp_background_image_url: '',
      save_the_date_background_image_url: '',
      logo_url: '',
      background_image_url: '',
      timeline_image_url: '',
      timeline_events: [
        { time: '4:30 PM', name: 'Ceremony' },
        { time: '5:15 PM', name: 'Cocktail Hour' },
        { time: '6:00 PM', name: 'Dinner' },
        { time: '10:00 PM', name: 'End of Event' },
      ],
      area_facts_attraction: 'Popular spots to explore in the area',
      area_facts_dining: 'Favorite restaurants worth checking out',
      area_facts_activities: 'Unique shops and local retailers nearby',
      area_facts_accommodations: 'Great places to stay during your visit',
      show_weather: true,
      show_area_facts: true,
      show_dining: true,
      show_accommodations: true,
      show_activities: true,
      show_attractions: true,
      show_contact_section: true,
      show_venue_info: true,
      show_event_timeline: true,
      show_rsvp_deadline: true,
      show_guest_info: true,
      show_planner_info: true,
      guest_arrival_time: '',
      parking_info: '',
      same_location: true,
      reception_venue_name: '',
      reception_venue_address: '',
      ceremony_indoor_outdoor: 'Indoor',
      show_faq: true,
      faq_items: [],
      is_published: false,
    }
  );

  const [saving, setSaving] = useState(false);
  const [sendingApproval, setSendingApproval] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [suggestionsModalOpen, setSuggestionsModalOpen] = useState(false);
  const [suggestionsCategory, setSuggestionsCategory] = useState<string>('attractions');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    coupleInfo: false,
    weddingDetails: false,
    eventTimeline: false,
    venueInfo: false,
    guestInfo: false,
    couplesFAQ: false,
    plannerInfo: false,
    areaFacts: false,
    stationery: false,
    styling: false,
    sectionVisibility: false,
    publish: false,
  });

  // Area facts list states - initialize from database
  const [attractionsList, setAttractionsList] = useState<any[]>(invitation?.attractions_list || []);
  const [diningList, setDiningList] = useState<any[]>(invitation?.dining_list || []);
  const [activitiesList, setActivitiesList] = useState<any[]>(invitation?.activities_list || []);
  const [accommodationsList, setAccommodationsList] = useState<any[]>(invitation?.accommodations_list || []);
  const [stationeryItems, setStationeryItems] = useState<any[]>(invitation?.stationery_items || []);
  const [faqItems, setFaqItems] = useState<Array<{ question: string; answer: string }>>(
    invitation?.faq_items || Array(7).fill(null).map(() => ({ question: '', answer: '' }))
  );
  const [timelineEvents, setTimelineEvents] = useState<any[]>(
    invitation?.timeline_events || [
      { time: '4:30 PM', name: 'Ceremony' },
      { time: '5:15 PM', name: 'Cocktail Hour' },
      { time: '6:00 PM', name: 'Dinner' },
      { time: '10:00 PM', name: 'End of Event' },
    ]
  );

  // Auto-save on window close
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      // Save data to database
      try {
        const saveData = {
          ...formData,
          attractions_list: attractionsList,
          dining_list: diningList,
          activities_list: activitiesList,
          accommodations_list: accommodationsList,
          stationery_items: stationeryItems,
          timeline_events: timelineEvents,
        };

        if (invitation?.id) {
          await supabase
            .from('invitations')
            .update(saveData)
            .eq('id', invitation.id);
        }
      } catch (error) {
        console.error('Auto-save error:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, attractionsList, diningList, activitiesList, accommodationsList, stationeryItems, timelineEvents, invitation?.id]);

  // Auto-fetch coordinates from Nominatim when venue address/city/state changes
  useEffect(() => {
    const geocodeVenue = async () => {
      const { venue_address, venue_city, venue_state } = formData;
      
      // Only geocode if city and state are filled
      if (!venue_city || !venue_state) {
        console.log('Skipping geocode - missing city or state');
        return;
      }
      
      try {
        const stateNames: { [key: string]: string } = {
          'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
          'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
          'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
          'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
          'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
          'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
          'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
          'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
          'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
          'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
        };
        
        const fullStateName = stateNames[venue_state.toUpperCase()] || venue_state;
        
        // Strategy: Try full address first (if available), then fallback to city+state
        let query = venue_address && venue_address.trim() 
          ? `${venue_address}, ${venue_city}, ${fullStateName}`
          : `${venue_city}, ${fullStateName}`;
        
        console.log('Geocoding query (first attempt):', query);
        
        let response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=us&limit=1`,
          {
            headers: {
              'User-Agent': 'HybridWeddingInvite/1.0'
            }
          }
        );
        
        let data = await response.json();
        console.log('Nominatim response:', data);
        
        // If full address didn't work and we had one, fallback to city+state
        if ((!data || data.length === 0) && venue_address && venue_address.trim()) {
          console.log('Full address query failed, trying fallback: city + state');
          const fallbackQuery = `${venue_city}, ${fullStateName}`;
          
          response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackQuery)}&countrycodes=us&limit=1`,
            {
              headers: {
                'User-Agent': 'HybridWeddingInvite/1.0'
              }
            }
          );
          
          data = await response.json();
          console.log('Fallback Nominatim response:', data);
        }
        
        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lon = parseFloat(result.lon);
          
          console.log(`Geocoded successfully: ${lat}, ${lon}`);
          
          setFormData((prev) => ({
            ...prev,
            venue_latitude: lat,
            venue_longitude: lon,
          }));
        } else {
          console.warn('No results from Nominatim for this location');
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    };

    // Debounce the geocoding to avoid too many requests
    const timer = setTimeout(geocodeVenue, 1000);
    return () => clearTimeout(timer);
  }, [formData.venue_address, formData.venue_city, formData.venue_state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageField: 'invitation_front_image_url' | 'invitation_back_image_url' | 'invitation_background_image_url' | 'rsvp_background_image_url' | 'save_the_date_background_image_url' | 'logo_url' | 'background_image_url' | 'timeline_image_url') => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      // Generate unique filename
      const timestamp = new Date().getTime();
      const filename = `${user.id}/${imageField}-${timestamp}-${file.name}`;
      
      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('invitation-images')
        .upload(filename, file, { upsert: false });

      if (error) throw error;

      // Construct the public URL manually using Supabase project ID
      const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')[0].replace('https://', '') || '';
      const publicUrl = `https://${projectId}.supabase.co/storage/v1/object/public/invitation-images/${filename}`;

      // Update form data with the public URL
      setFormData((prev) => ({
        ...prev,
        [imageField]: publicUrl,
      }));

      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to upload image',
      });
    }
  };

  const handleOpenSuggestions = (category: string) => {
    setSuggestionsCategory(category);
    setSuggestionsModalOpen(true);
  };

  const handleAddSuggestedLocations = (items: any[], category: string) => {
    // Create new items with all required fields
    const newItems = items.map(item => {
      const mappedItem = {
        id: item.id || (Date.now().toString() + Math.random()),
        name: item.name || '',
        address: item.address || '',
        phone: item.phone || '',
        distance: item.distance || '',
        is_18_plus: false,
        is_21_plus: false,
        cuisine: category === 'dining' ? '' : undefined,
        website: item.website || '',
      };
      console.log(`Adding suggested item to ${category}:`, mappedItem);
      return mappedItem;
    });

    // Add to appropriate list based on category
    if (category === 'attractions') {
      setAttractionsList((prev) => {
        const updated = [...prev, ...newItems];
        console.log('Updated attractions list:', updated);
        return updated;
      });
    } else if (category === 'dining') {
      setDiningList((prev) => {
        const updated = [...prev, ...newItems];
        console.log('Updated dining list:', updated);
        return updated;
      });
    } else if (category === 'shopping') {
      setActivitiesList((prev) => {
        const updated = [...prev, ...newItems];
        console.log('Updated activities list:', updated);
        return updated;
      });
    } else if (category === 'accommodations') {
      setAccommodationsList((prev) => {
        const updated = [...prev, ...newItems];
        console.log('Updated accommodations list:', updated);
        return updated;
      });
    }

    // Close modal
    setSuggestionsModalOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const saveData = {
        ...formData,
        attractions_list: attractionsList,
        dining_list: diningList,
        activities_list: activitiesList,
        accommodations_list: accommodationsList,
        stationery_items: stationeryItems,
        timeline_events: timelineEvents,
        faq_items: faqItems,
      };

      if (invitation?.id) {
        // Update existing
        const { error } = await supabase
          .from('invitations')
          .update(saveData)
          .eq('id', invitation.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Invitation updated successfully!' });
      } else {
        // Create new
        const { error } = await supabase
          .from('invitations')
          .insert([
            {
              ...saveData,
              planner_id: user?.id,
              planner_email: user?.email,
            },
          ]);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Invitation created successfully!' });
      }

      setTimeout(() => {
        onSave();
        setMessage(null);
      }, 1500);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save invitation',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSendForApproval = async () => {
    if (!invitation?.id) {
      setMessage({
        type: 'error',
        text: 'Please save the invitation first before sending for approval',
      });
      return;
    }

    if (!invitation.couple_contact_email) {
      setMessage({
        type: 'error',
        text: 'Please add the couple contact email before sending for approval',
      });
      return;
    }

    setSendingApproval(true);
    setMessage(null);

    try {
      const response = await fetch('/api/send-approval-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId: invitation.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send approval email');
      }

      setMessage({
        type: 'success',
        text: 'Approval email sent successfully to the couple!',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to send approval email',
      });
    } finally {
      setSendingApproval(false);
    }
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 lg:space-y-8">
        <p className="text-xs text-gray-600 mb-4">* Required fields</p>
      <style>{`
        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="date"],
        input[type="time"],
        input[type="number"],
        input[type="url"],
        input[type="password"],
        textarea,
        select {
          color: #000 !important;
          font-size: 0.75rem !important;
        }
        input::placeholder,
        textarea::placeholder {
          color: #999 !important;
        }
      `}</style>
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                name="show_rsvp_deadline"
                checked={formData.show_rsvp_deadline}
                onChange={handleChange}
                className="mr-3"
              />
              <span style={{ color: '#274E13' }}>Show on Viewer</span>
            </label></div>
      )}

      {/* Couple Information */}
      <section className="bg-white rounded-lg p-3 lg:p-6 shadow">
        <button
          type="button"
          onClick={() => toggleSection('coupleInfo')}
          className="w-full flex items-center justify-start hover:opacity-75 transition-opacity"
        >
          <span style={{ color: '#274E13', fontSize: '1.25rem', marginRight: '0.5rem' }}>
            {expandedSections.coupleInfo ? '−' : '+'}
          </span>
          <h2 className="text-lg font-serif" style={{ color: '#274E13' }}>
            Couple Information
          </h2>
        </button>
        {expandedSections.coupleInfo && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
                Bride's Name *
              </label>
              <input
                type="text"
                name="bride_name"
                value={formData.bride_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
                style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
                Groom's Name *
              </label>
              <input
                type="text"
                name="groom_name"
                value={formData.groom_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
                style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
                Couple Contact Name *
              </label>
              <input
                type="text"
                name="couple_contact_name"
                value={formData.couple_contact_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
                style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
                Couple Email *
              </label>
              <input
                type="email"
                name="couple_contact_email"
                value={formData.couple_contact_email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
                style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
                Couple Phone *
              </label>
              <input
                type="tel"
                name="couple_contact_phone"
                value={formData.couple_contact_phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
                style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
              />
            </div>
          </div>
        )}
      </section>

      {/* Wedding Details */}
      <section className="bg-white rounded-lg p-3 lg:p-6 shadow">
        <button
          type="button"
          onClick={() => toggleSection('weddingDetails')}
          className="w-full flex items-center justify-start hover:opacity-75 transition-opacity"
        >
          <span style={{ color: '#274E13', fontSize: '1.25rem', marginRight: '0.5rem' }}>
            {expandedSections.weddingDetails ? '−' : '+'}
          </span>
          <h2 className="text-lg font-serif" style={{ color: '#274E13' }}>
            Wedding Details
          </h2>
        </button>
        {expandedSections.weddingDetails && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4 mt-4">
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Event Slug (URL) *
            </label>
            <input
              type="text"
              name="event_slug"
              value={formData.event_slug}
              onChange={handleChange}
              required
              placeholder="bride-groom-2024"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
            <p className="text-xs text-gray-500 mt-1">
              Used in URL: /invite?event={formData.event_slug}
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Wedding Date *
            </label>
            <input
              type="date"
              name="wedding_date"
              value={formData.wedding_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Ceremony Time *
            </label>
            <input
              type="time"
              name="ceremony_time"
              value={formData.ceremony_time}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Timezone
            </label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            >
              <option>America/New_York</option>
              <option>America/Chicago</option>
              <option>America/Denver</option>
              <option>America/Los_Angeles</option>
              <option>Europe/London</option>
              <option>Europe/Paris</option>
              <option>Europe/Berlin</option>
              <option>Australia/Sydney</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              RSVP Deadline
            </label>
            <input
              type="date"
              name="rsvp_deadline"
              value={formData.rsvp_deadline}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
              <label className="block text-xs font-medium mt-2" style={{ color: '#274E13' }}>
                <input
                  type="checkbox"
                  name="show_rsvp_deadline"
                  checked={formData.show_rsvp_deadline}
                  onChange={handleChange}
                  className="mr-3"
                />
                Reveal to Guests
              </label>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              RSVP Link
            </label>
            <input
              type="url"
              name="rsvp_link"
              value={formData.rsvp_link}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
                Couples Website
              </label>
              <input
                type="url"
                name="couples_website"
                value={formData.couples_website}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
                style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
              />
            </div>
        </div>
        )}
      </section>

      {/* Timeline Events */}
      <section className="bg-white rounded-lg p-3 lg:p-6 shadow">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => toggleSection('eventTimeline')}
            className="flex-1 flex items-center justify-start hover:opacity-75 transition-opacity"
          >
            <span style={{ color: '#274E13', fontSize: '1.25rem', marginRight: '0.5rem' }}>
              {expandedSections.eventTimeline ? '−' : '+'}
            </span>
            <h2 className="text-lg font-serif" style={{ color: '#274E13' }}>
              'Day-of' Itinerary
            </h2>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'show_event_timeline', value: !formData.show_event_timeline } } as any)}
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
              style={{
                backgroundColor: formData.show_event_timeline ? '#274E13' : '#e5e7eb',
                color: formData.show_event_timeline ? 'white' : '#274E13',
                border: `2px solid #274E13`
              }}
            >
              {formData.show_event_timeline ? 'Exclude' : 'Include'}
            </button>
            <div className="relative group">
              <button
                type="button"
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold hover:opacity-75"
                style={{ backgroundColor: '#274E13', color: 'white' }}
              >
                ?
              </button>
              <div className="invisible group-hover:visible absolute bottom-full right-0 mb-2 w-48 bg-black text-white text-xs p-2 rounded z-50 whitespace-normal">
                Controls whether guests can see this section on the invitation. Click 'Include' to show it, or 'Exclude' to hide it.
              </div>
            </div>
          </div>
        </div>
        {expandedSections.eventTimeline && (
        <div className="space-y-2 mt-4">
          {timelineEvents.map((event, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#274E13' }}>
                  Time
                </label>
                <input
                  type="text"
                  value={event.time}
                  onChange={(e) => {
                    const updated = [...timelineEvents];
                    updated[index].time = e.target.value;
                    setTimelineEvents(updated);
                  }}
                  placeholder="4:30 PM"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
                  style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#274E13' }}>
                  Event Name
                </label>
                <input
                  type="text"
                  value={event.name}
                  onChange={(e) => {
                    const updated = [...timelineEvents];
                    updated[index].name = e.target.value;
                    setTimelineEvents(updated);
                  }}
                  placeholder="Ceremony"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
                  style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setTimelineEvents(timelineEvents.filter((_, i) => i !== index));
                }}
                className="md:col-span-2 px-4 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-xs font-medium"
              >
                Remove Event
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setTimelineEvents([...timelineEvents, { time: '', name: '' }]);
            }}
            className="w-full px-4 py-2 border-2 border-dashed rounded-lg text-center font-medium"
            style={{ borderColor: '#274E13', color: '#274E13' }}
          >
            + Add Event
          </button>
        </div>
        )}
      </section>

      {/* Venue Information */}
      <section className="bg-white rounded-lg p-3 lg:p-6 shadow">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => toggleSection('venueInfo')}
            className="flex-1 flex items-center justify-start hover:opacity-75 transition-opacity"
          >
            <span style={{ color: '#274E13', fontSize: '1.25rem', marginRight: '0.5rem' }}>
              {expandedSections.venueInfo ? '−' : '+'}
            </span>
            <h2 className="text-lg font-serif" style={{ color: '#274E13' }}>
              Venue Information
            </h2>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'show_venue_info', value: !formData.show_venue_info } } as any)}
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
              style={{
                backgroundColor: formData.show_venue_info ? '#274E13' : '#e5e7eb',
                color: formData.show_venue_info ? 'white' : '#274E13',
                border: `2px solid #274E13`
              }}
            >
              {formData.show_venue_info ? 'Exclude' : 'Include'}
            </button>
            <div className="relative group">
              <button
                type="button"
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold hover:opacity-75"
                style={{ backgroundColor: '#274E13', color: 'white' }}
              >
                ?
              </button>
              <div className="invisible group-hover:visible absolute bottom-full right-0 mb-2 w-48 bg-black text-white text-xs p-2 rounded z-50 whitespace-normal">
                Controls whether guests can see this section on the invitation. Click 'Include' to show it, or 'Exclude' to hide it.
              </div>
            </div>
          </div>
        </div>
        {expandedSections.venueInfo && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Venue Name *
            </label>
            <input
              type="text"
              name="venue_name"
              value={formData.venue_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Address *
            </label>
            <input
              type="text"
              name="venue_address"
              value={formData.venue_address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              City *
            </label>
            <input
              type="text"
              name="venue_city"
              value={formData.venue_city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              State/Province *
            </label>
            <input
              type="text"
              name="venue_state"
              value={formData.venue_state}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Phone
            </label>
            <input
              type="tel"
              name="venue_phone"
              value={formData.venue_phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Website *
            </label>
            <input
              type="url"
              name="venue_website"
              value={formData.venue_website}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Latitude
            </label>
            <input
              type="number"
              name="venue_latitude"
              value={formData.venue_latitude}
              onChange={handleChange}
              step="0.000001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Longitude
            </label>
            <input
              type="number"
              name="venue_longitude"
              value={formData.venue_longitude}
              onChange={handleChange}
              step="0.000001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
        </div>
        )}
      </section>

      {/* Guest Info At a Glance */}
      <section className="bg-white rounded-lg p-3 lg:p-6 shadow">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => toggleSection('guestInfo')}
            className="flex-1 flex items-center justify-start hover:opacity-75 transition-opacity"
          >
            <span style={{ color: '#274E13', fontSize: '1.25rem', marginRight: '0.5rem' }}>
              {expandedSections.guestInfo ? '−' : '+'}
            </span>
            <h2 className="text-lg font-serif" style={{ color: '#274E13' }}>
              Guest Info At a Glance
            </h2>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'show_guest_info', value: !formData.show_guest_info } } as any)}
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
              style={{
                backgroundColor: formData.show_guest_info ? '#274E13' : '#e5e7eb',
                color: formData.show_guest_info ? 'white' : '#274E13',
                border: `2px solid #274E13`
              }}
            >
              {formData.show_guest_info ? 'Exclude' : 'Include'}
            </button>
            <div className="relative group">
              <button
                type="button"
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold hover:opacity-75"
                style={{ backgroundColor: '#274E13', color: 'white' }}
              >
                ?
              </button>
              <div className="invisible group-hover:visible absolute bottom-full right-0 mb-2 w-48 bg-black text-white text-xs p-2 rounded z-50 whitespace-normal">
                Controls whether guests can see this section on the invitation. Click 'Include' to show it, or 'Exclude' to hide it.
              </div>
            </div>
          </div>
        </div>
        {expandedSections.guestInfo && (
        <>
          <div className="flex items-center gap-3 mt-4 mb-4">
            <input
              type="checkbox"
              name="show_guest_info"
              checked={formData.show_guest_info}
              onChange={handleChange}
              className="w-4 h-4 rounded"
            />
            <span className="text-xs font-medium text-gray-700">Show to Guests</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Guest Arrival Time
            </label>
            <input
              type="time"
              name="guest_arrival_time"
              value={formData.guest_arrival_time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Where Should I Park?
            </label>
            <input
              type="text"
              name="parking_info"
              value={formData.parking_info}
              onChange={handleChange}
              placeholder="e.g., Lot A on Main Street"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
        </div>

        <div className="mb-6 pb-6 border-b">
          <label className="flex items-center gap-3 text-xs font-medium" style={{ color: '#274E13' }}>
            <input
              type="checkbox"
              name="same_location"
              checked={formData.same_location}
              onChange={handleChange}
              className="w-4 h-4 rounded"
            />
            Ceremony & Reception at Same Location
          </label>
          {!formData.same_location && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
                  Reception Venue Name
                </label>
                <input
                  type="text"
                  name="reception_venue_name"
                  value={formData.reception_venue_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
                  style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
                  Reception Venue Address
                </label>
                <input
                  type="text"
                  name="reception_venue_address"
                  value={formData.reception_venue_address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
                  style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
            Ceremony Location
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="ceremony_indoor_outdoor"
                value="Indoor"
                checked={formData.ceremony_indoor_outdoor === 'Indoor'}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-xs text-gray-700">Indoor</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="ceremony_indoor_outdoor"
                value="Outdoor"
                checked={formData.ceremony_indoor_outdoor === 'Outdoor'}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-xs text-gray-700">Outdoor</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="ceremony_indoor_outdoor"
                value="Indoor and Outdoor (Weather Permitting)"
                checked={formData.ceremony_indoor_outdoor === 'Indoor and Outdoor (Weather Permitting)'}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-xs text-gray-700">Indoor and Outdoor (Weather Permitting)</span>
            </label>
          </div>
        </div>
        </>
        )}
      </section>

      {/* Couples FAQ */}
      <section className="bg-white rounded-lg p-3 lg:p-6 shadow">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => toggleSection('couplesFAQ')}
            className="flex-1 flex items-center justify-start hover:opacity-75 transition-opacity"
          >
            <span style={{ color: '#274E13', fontSize: '1.25rem', marginRight: '0.5rem' }}>
              {expandedSections.couplesFAQ ? '−' : '+'}
            </span>
            <h2 className="text-lg font-serif" style={{ color: '#274E13' }}>
              Couples FAQ
            </h2>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'show_faq', value: !formData.show_faq } } as any)}
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
              style={{
                backgroundColor: formData.show_faq ? '#274E13' : '#e5e7eb',
                color: formData.show_faq ? 'white' : '#274E13',
                border: `2px solid #274E13`
              }}
            >
              {formData.show_faq ? 'Exclude' : 'Include'}
            </button>
            <div className="relative group">
              <button
                type="button"
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold hover:opacity-75"
                style={{ backgroundColor: '#274E13', color: 'white' }}
              >
                ?
              </button>
              <div className="invisible group-hover:visible absolute bottom-full right-0 mb-2 w-48 bg-black text-white text-xs p-2 rounded z-50 whitespace-normal">
                Controls whether guests can see this section on the invitation. Click 'Include' to show it, or 'Exclude' to hide it.
              </div>
            </div>
          </div>
        </div>
        {expandedSections.couplesFAQ && (
        <>
          <div className="flex items-center gap-3 mt-4 mb-4">
            <input
              type="checkbox"
              name="show_faq"
            checked={formData.show_faq}
            onChange={handleChange}
            className="w-4 h-4 rounded"
          />
          <span className="text-xs font-medium text-gray-700">Show to Guests</span>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="mb-3">
                <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
                  Question {index + 1}
                </label>
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => {
                    const updated = [...faqItems];
                    updated[index].question = e.target.value;
                    setFaqItems(updated);
                  }}
                  placeholder="Enter question"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  style={{ color: '#000' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
                  Answer {index + 1}
                </label>
                <textarea
                  value={item.answer}
                  onChange={(e) => {
                    const updated = [...faqItems];
                    updated[index].answer = e.target.value;
                    setFaqItems(updated);
                  }}
                  placeholder="Enter answer"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  style={{ color: '#000' }}
                />
              </div>
            </div>
          ))}
        </div>
        </>
        )}
      </section>

      {/* Planner Information */}
      <section className="bg-white rounded-lg p-3 lg:p-6 shadow">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => toggleSection('plannerInfo')}
            className="flex-1 flex items-center justify-start hover:opacity-75 transition-opacity"
          >
            <span style={{ color: '#274E13', fontSize: '1.25rem', marginRight: '0.5rem' }}>
              {expandedSections.plannerInfo ? '−' : '+'}
            </span>
            <h2 className="text-lg font-serif" style={{ color: '#274E13' }}>
              Planner Information
            </h2>
          </button>
          <div className="flex items-center gap-2">
            <div className="relative group">
              <button
                type="button"
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold hover:opacity-75"
                style={{ backgroundColor: '#274E13', color: 'white' }}
              >
                ?
              </button>
              <div className="invisible group-hover:visible absolute bottom-full right-0 mb-2 w-48 bg-black text-white text-xs p-2 rounded z-50 whitespace-normal">
                Your planner information appears on all invitations.
              </div>
            </div>
          </div>
        </div>
        {expandedSections.plannerInfo && (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b mt-4">
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Planner Name *
            </label>
            <input
              type="text"
              name="planner_name"
              value={formData.planner_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Planner Phone *
            </label>
            <input
              type="tel"
              name="planner_phone"
              value={formData.planner_phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Planner Website
            </label>
            <input
              type="url"
              name="planner_website"
              value={formData.planner_website || ''}
              onChange={handleChange}
              placeholder="https://www.yourwebsite.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Branding Uploads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4">
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Logo (Bottom of Invitation)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'logo_url')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
            {formData.logo_url && (
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-2">Uploaded:</p>
                <img 
                  src={formData.logo_url} 
                  alt="Logo preview" 
                  className="h-20 object-contain rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Background Image (Behind All Content)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'background_image_url')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
            {formData.background_image_url && (
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-2">Uploaded:</p>
                <img 
                  src={formData.background_image_url} 
                  alt="Background preview" 
                  className="w-full h-24 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Timeline Balance Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'timeline_image_url')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
            {formData.timeline_image_url && (
              <div className="mt-2 flex justify-center">
                <p className="text-xs text-gray-600 mb-2">Uploaded:</p>
                <img 
                  src={formData.timeline_image_url} 
                  alt="Timeline image preview" 
                  className="h-24 w-24 rounded-full border-4 object-contain"
                  style={{ borderColor: '#FF6B6B' }}
                />
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </section>

      {/* Area Facts */}
      <section className="bg-white rounded-lg p-3 lg:p-6 shadow">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => toggleSection('areaFacts')}
            className="flex-1 flex items-center justify-start hover:opacity-75 transition-opacity"
          >
            <span style={{ color: '#274E13', fontSize: '1.25rem', marginRight: '0.5rem' }}>
              {expandedSections.areaFacts ? '−' : '+'}
            </span>
            <h2 className="text-lg font-serif" style={{ color: '#274E13' }}>
              Area Facts & Attractions
            </h2>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'show_area_facts', value: !formData.show_area_facts } } as any)}
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
              style={{
                backgroundColor: formData.show_area_facts ? '#274E13' : '#e5e7eb',
                color: formData.show_area_facts ? 'white' : '#274E13',
                border: `2px solid #274E13`
              }}
            >
              {formData.show_area_facts ? 'Exclude' : 'Include'}
            </button>
            <div className="relative group">
              <button
                type="button"
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold hover:opacity-75"
                style={{ backgroundColor: '#274E13', color: 'white' }}
              >
                ?
              </button>
              <div className="invisible group-hover:visible absolute bottom-full right-0 mb-2 w-48 bg-black text-white text-xs p-2 rounded z-50 whitespace-normal">
                Controls whether guests can see this section on the invitation. Click 'Include' to show it, or 'Exclude' to hide it.
              </div>
            </div>
          </div>
        </div>
        {expandedSections.areaFacts && (
        <>
        
        {/* Toggles for each category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4 mb-6 pb-6 border-b">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="show_attractions"
              checked={formData.show_attractions}
              onChange={handleChange}
              className="w-4 h-4 rounded"
            />
            <span className="text-xs font-medium text-gray-700">Show Attractions</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="show_dining"
              checked={formData.show_dining}
              onChange={handleChange}
              className="w-4 h-4 rounded"
            />
            <span className="text-xs font-medium text-gray-700">Show Dining</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="show_activities"
              checked={formData.show_activities}
              onChange={handleChange}
              className="w-4 h-4 rounded"
            />
            <span className="text-xs font-medium text-gray-700">Show Shopping</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="show_accommodations"
              checked={formData.show_accommodations}
              onChange={handleChange}
              className="w-4 h-4 rounded"
            />
            <span className="text-xs font-medium text-gray-700">Show Overnight Stays</span>
          </label>
        </div>

        <div className="space-y-4">
          <AreaFactsEditor
            type="attractions"
            title="Local Attractions"
            items={attractionsList}
            onItemsChange={setAttractionsList}
            venueLatitude={formData.venue_latitude}
            venueLongitude={formData.venue_longitude}
            onRequestSuggestions={() => handleOpenSuggestions('attractions')}
          />
          <AreaFactsEditor
            type="dining"
            title="Dining Scene"
            items={diningList}
            onItemsChange={setDiningList}
            venueLatitude={formData.venue_latitude}
            venueLongitude={formData.venue_longitude}
            onRequestSuggestions={() => handleOpenSuggestions('dining')}
          />
          <AreaFactsEditor
            type="activities"
            title="Local Shopping"
            items={activitiesList}
            onItemsChange={setActivitiesList}
            venueLatitude={formData.venue_latitude}
            venueLongitude={formData.venue_longitude}
            onRequestSuggestions={() => handleOpenSuggestions('shopping')}
          />
          <AreaFactsEditor
            type="accommodations"
            title="Accommodations"
            items={accommodationsList}
            onItemsChange={setAccommodationsList}
            venueLatitude={formData.venue_latitude}
            venueLongitude={formData.venue_longitude}
            onRequestSuggestions={() => handleOpenSuggestions('accommodations')}
          />
        </div>
        </>
        )}
      </section>

      {/* Stationery Items */}
      <section className="bg-white rounded-lg p-3 lg:p-6 shadow">
        <button
          type="button"
          onClick={() => toggleSection('stationery')}
          className="w-full flex items-center justify-start hover:opacity-75 transition-opacity"
        >
          <span style={{ color: '#274E13', fontSize: '1.25rem', marginRight: '0.5rem' }}>
            {expandedSections.stationery ? '−' : '+'}
          </span>
          <h2 className="text-lg font-serif" style={{ color: '#274E13' }}>
            Stationery Images
          </h2>
        </button>
        {expandedSections.stationery && (
        <div className="mt-4">
        <StationeryEditor
          items={stationeryItems}
          onItemsChange={setStationeryItems}
          userId={user?.id}
        />

        {/* Background Image Uploads */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-base font-semibold mb-4" style={{ color: '#274E13' }}>
            Stationery Background Images (Optional)
          </h3>
          <p className="text-xs text-gray-600 mb-4">
            Add background images behind each stationery piece. Image will extend beyond edges to create a frame effect.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Invitation Background */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
                Invitation Background
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageUpload(e, 'invitation_background_image_url');
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {formData.invitation_background_image_url && (
                <div className="mt-2 flex gap-2">
                  <img src={formData.invitation_background_image_url} alt="Preview" className="w-20 h-20 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleChange({ target: { name: 'invitation_background_image_url', value: '' } } as any)}
                    className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* RSVP Background */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
                RSVP Background
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageUpload(e, 'rsvp_background_image_url');
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {formData.rsvp_background_image_url && (
                <div className="mt-2 flex gap-2">
                  <img src={formData.rsvp_background_image_url} alt="Preview" className="w-20 h-20 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleChange({ target: { name: 'rsvp_background_image_url', value: '' } } as any)}
                    className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Save the Date Background */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
                Save the Date Background
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageUpload(e, 'save_the_date_background_image_url');
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {formData.save_the_date_background_image_url && (
                <div className="mt-2 flex gap-2">
                  <img src={formData.save_the_date_background_image_url} alt="Preview" className="w-20 h-20 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleChange({ target: { name: 'save_the_date_background_image_url', value: '' } } as any)}
                    className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
        )}
      </section>

      {/* Styling */}
      <section className="bg-white rounded-lg p-3 lg:p-6 shadow">
        <button
          type="button"
          onClick={() => toggleSection('styling')}
          className="w-full flex items-center justify-start hover:opacity-75 transition-opacity"
        >
          <span style={{ color: '#274E13', fontSize: '1.25rem', marginRight: '0.5rem' }}>
            {expandedSections.styling ? '−' : '+'}
          </span>
          <h2 className="text-lg font-serif" style={{ color: '#274E13' }}>
            Styling
          </h2>
        </button>
        {expandedSections.styling && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4 mt-4">
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Primary Color
            </label>
            <input
              type="color"
              name="primary_color"
              value={formData.primary_color}
              onChange={handleChange}
              className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Secondary Color
            </label>
            <input
              type="color"
              name="secondary_color"
              value={formData.secondary_color}
              onChange={handleChange}
              className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Accent Color
            </label>
            <input
              type="color"
              name="accent_color"
              value={formData.accent_color}
              onChange={handleChange}
              className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#274E13' }}>
              Font Family
            </label>
            <select
              name="font_family"
              value={formData.font_family}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-xs"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            >
              <option>Georgia</option>
              <option>Garamond</option>
              <option>Cambria</option>
              <option>Palatino</option>
              <option>Times New Roman</option>
            </select>
          </div>
        </div>
        )}
      </section>

      {/* Publish */}
      <section className="bg-white rounded-lg p-3 lg:p-6 shadow">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="is_published"
            checked={formData.is_published}
            onChange={handleChange}
            className="mr-3"
          />
          <span style={{ color: '#274E13' }} className="font-semibold">
            Publish this invitation (couples can view via link)
          </span>
        </label>
      </section>

      {/* Save Button */}
      <div className="flex gap-4 flex-wrap">
        {/* Status Indicator */}
        {invitation?.approval_status && (
          <div className="flex items-center px-4 py-3 rounded-lg bg-gray-100 border border-gray-300">
            <span className="text-xs font-semibold text-gray-700">
              Status:{' '}
              <span
                style={{
                  color:
                    invitation.approval_status === 'published'
                      ? '#16a34a'
                      : invitation.approval_status === 'approved'
                      ? '#3b82f6'
                      : invitation.approval_status === 'sent_for_approval'
                      ? '#f59e0b'
                      : '#6b7280',
                }}
              >
                {invitation.approval_status.charAt(0).toUpperCase() +
                  invitation.approval_status.slice(1).replace(/_/g, ' ')}
              </span>
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: '#274E13' }}
        >
          {saving ? 'Saving...' : invitation?.id ? 'Update Invitation' : 'Create Invitation'}
        </button>

        {invitation?.id && (
          <>
            <button
              type="button"
              onClick={handleSendForApproval}
              disabled={sendingApproval || invitation.approval_status === 'published'}
              className="px-8 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#f59e0b' }}
            >
              {sendingApproval ? 'Sending...' : 'Send for Approval'}
            </button>

            <a
              href={`/invite?event=${formData.event_slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#666' }}
            >
              View Public Link
            </a>
          </>
        )}

        {/* Location Suggestions Modal */}
        <LocationSuggestionsModal
          isOpen={suggestionsModalOpen}
          onClose={() => setSuggestionsModalOpen(false)}
          category={suggestionsCategory}
          venueLat={formData.venue_latitude}
          venueLon={formData.venue_longitude}
          onAddItems={(items) => handleAddSuggestedLocations(items, suggestionsCategory)}
          accentColor={formData.accent_color}
          secondaryColor={formData.secondary_color}
        />
      </div>
    </form>
  );
}














