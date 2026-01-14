'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import AreaFactsEditor from './AreaFactsEditor';
import StationeryEditor from './StationeryEditor';

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
  couple_contact_name: string;
  couple_contact_email: string;
  couple_contact_phone: string;
  rsvp_link: string;
  rsvp_deadline: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
  invitation_front_image_url?: string;
  invitation_back_image_url?: string;
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
  is_published: boolean;
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
      couple_contact_name: '',
      couple_contact_email: '',
      couple_contact_phone: '',
      rsvp_link: '',
      rsvp_deadline: '',
      primary_color: '#D0CEB5',
      secondary_color: '#274E13',
      accent_color: '#FF6B6B',
      font_family: 'Georgia',
      invitation_front_image_url: '',
      invitation_back_image_url: '',
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
      is_published: false,
    }
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Area facts list states - initialize from database
  const [attractionsList, setAttractionsList] = useState<any[]>(invitation?.attractions_list || []);
  const [diningList, setDiningList] = useState<any[]>(invitation?.dining_list || []);
  const [activitiesList, setActivitiesList] = useState<any[]>(invitation?.activities_list || []);
  const [accommodationsList, setAccommodationsList] = useState<any[]>(invitation?.accommodations_list || []);
  const [stationeryItems, setStationeryItems] = useState<any[]>(invitation?.stationery_items || []);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageField: 'invitation_front_image_url' | 'invitation_back_image_url' | 'logo_url' | 'background_image_url' | 'timeline_image_url') => {
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

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <style>{`
        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="date"],
        input[type="time"],
        textarea,
        select {
          color: #000 !important;
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
        </div>
      )}

      {/* Couple Information */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-2xl font-serif mb-4" style={{ color: '#274E13' }}>
          Couple Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Bride's Name
            </label>
            <input
              type="text"
              name="bride_name"
              value={formData.bride_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Groom's Name
            </label>
            <input
              type="text"
              name="groom_name"
              value={formData.groom_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Couple Contact Name
            </label>
            <input
              type="text"
              name="couple_contact_name"
              value={formData.couple_contact_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Couple Email
            </label>
            <input
              type="email"
              name="couple_contact_email"
              value={formData.couple_contact_email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Couple Phone
            </label>
            <input
              type="tel"
              name="couple_contact_phone"
              value={formData.couple_contact_phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
        </div>
      </section>

      {/* Wedding Details */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-2xl font-serif mb-4" style={{ color: '#274E13' }}>
          Wedding Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Event Slug (URL)
            </label>
            <input
              type="text"
              name="event_slug"
              value={formData.event_slug}
              onChange={handleChange}
              required
              placeholder="bride-groom-2024"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
            <p className="text-xs text-gray-500 mt-1">
              Used in URL: /invite?event={formData.event_slug}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Wedding Date
            </label>
            <input
              type="date"
              name="wedding_date"
              value={formData.wedding_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Ceremony Time
            </label>
            <input
              type="time"
              name="ceremony_time"
              value={formData.ceremony_time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Reception Time
            </label>
            <input
              type="time"
              name="reception_time"
              value={formData.reception_time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Be Out By Time
            </label>
            <input
              type="time"
              name="be_out_by_time"
              value={formData.be_out_by_time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Timezone
            </label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
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
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              RSVP Deadline
            </label>
            <input
              type="date"
              name="rsvp_deadline"
              value={formData.rsvp_deadline}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              RSVP Link
            </label>
            <input
              type="url"
              name="rsvp_link"
              value={formData.rsvp_link}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
        </div>
      </section>

      {/* Timeline Events */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-2xl font-serif mb-4" style={{ color: '#274E13' }}>
          Event Timeline
        </h2>
        <div className="space-y-4">
          {timelineEvents.map((event, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setTimelineEvents(timelineEvents.filter((_, i) => i !== index));
                }}
                className="md:col-span-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-sm font-medium"
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
      </section>

      {/* Venue Information */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-2xl font-serif mb-4" style={{ color: '#274E13' }}>
          Venue Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Venue Name
            </label>
            <input
              type="text"
              name="venue_name"
              value={formData.venue_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Address
            </label>
            <input
              type="text"
              name="venue_address"
              value={formData.venue_address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              City
            </label>
            <input
              type="text"
              name="venue_city"
              value={formData.venue_city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              State/Province
            </label>
            <input
              type="text"
              name="venue_state"
              value={formData.venue_state}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Phone
            </label>
            <input
              type="tel"
              name="venue_phone"
              value={formData.venue_phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Website
            </label>
            <input
              type="url"
              name="venue_website"
              value={formData.venue_website}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Latitude
            </label>
            <input
              type="number"
              name="venue_latitude"
              value={formData.venue_latitude}
              onChange={handleChange}
              step="0.000001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Longitude
            </label>
            <input
              type="number"
              name="venue_longitude"
              value={formData.venue_longitude}
              onChange={handleChange}
              step="0.000001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
        </div>
      </section>

      {/* Planner Information */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-2xl font-serif mb-4" style={{ color: '#274E13' }}>
          Planner Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Planner Name
            </label>
            <input
              type="text"
              name="planner_name"
              value={formData.planner_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Planner Phone
            </label>
            <input
              type="tel"
              name="planner_phone"
              value={formData.planner_phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Branding Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Logo (Bottom of Invitation)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'logo_url')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
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
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Background Image (Behind All Content)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'background_image_url')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
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
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Timeline Balance Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'timeline_image_url')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#274E13' } as React.CSSProperties}
            />
            {formData.timeline_image_url && (
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-2">Uploaded:</p>
                <img 
                  src={formData.timeline_image_url} 
                  alt="Timeline image preview" 
                  className="h-24 w-24 rounded-full border-4 object-cover"
                  style={{ borderColor: '#FF6B6B' }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Area Facts */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-2xl font-serif mb-4" style={{ color: '#274E13' }}>
          Area Facts & Attractions
        </h2>
        
        {/* Toggles for each category */}
        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="show_attractions"
              checked={formData.show_attractions}
              onChange={handleChange}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Show Attractions</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="show_dining"
              checked={formData.show_dining}
              onChange={handleChange}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Show Dining</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="show_activities"
              checked={formData.show_activities}
              onChange={handleChange}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Show Shopping</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="show_accommodations"
              checked={formData.show_accommodations}
              onChange={handleChange}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Show Accommodations</span>
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
          />
          <AreaFactsEditor
            type="dining"
            title="Dining Scene"
            items={diningList}
            onItemsChange={setDiningList}
            venueLatitude={formData.venue_latitude}
            venueLongitude={formData.venue_longitude}
          />
          <AreaFactsEditor
            type="activities"
            title="Local Shopping"
            items={activitiesList}
            onItemsChange={setActivitiesList}
            venueLatitude={formData.venue_latitude}
            venueLongitude={formData.venue_longitude}
          />
          <AreaFactsEditor
            type="accommodations"
            title="Accommodations"
            items={accommodationsList}
            onItemsChange={setAccommodationsList}
            venueLatitude={formData.venue_latitude}
            venueLongitude={formData.venue_longitude}
          />
        </div>
      </section>

      {/* Stationery Items */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-2xl font-serif mb-4" style={{ color: '#274E13' }}>
          Stationery Images
        </h2>
        <StationeryEditor
          items={stationeryItems}
          onItemsChange={setStationeryItems}
          userId={user?.id}
        />
      </section>

      {/* Styling */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-2xl font-serif mb-4" style={{ color: '#274E13' }}>
          Styling
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
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
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
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
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
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
            <label className="block text-sm font-medium mb-2" style={{ color: '#274E13' }}>
              Font Family
            </label>
            <select
              name="font_family"
              value={formData.font_family}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
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
      </section>

      {/* Section Visibility */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-2xl font-serif mb-4" style={{ color: '#274E13' }}>
          Section Visibility
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="show_weather"
              checked={formData.show_weather}
              onChange={handleChange}
              className="mr-3"
            />
            <span style={{ color: '#274E13' }}>Show Weather Widget</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="show_area_facts"
              checked={formData.show_area_facts}
              onChange={handleChange}
              className="mr-3"
            />
            <span style={{ color: '#274E13' }}>Show Area Facts</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="show_contact_section"
              checked={formData.show_contact_section}
              onChange={handleChange}
              className="mr-3"
            />
            <span style={{ color: '#274E13' }}>Show Contact Section</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="show_venue_info"
              checked={formData.show_venue_info}
              onChange={handleChange}
              className="mr-3"
            />
            <span style={{ color: '#274E13' }}>Show Venue Info</span>
          </label>
        </div>
      </section>

      {/* Publish */}
      <section className="bg-white rounded-lg p-6 shadow">
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
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: '#274E13' }}
        >
          {saving ? 'Saving...' : invitation?.id ? 'Update Invitation' : 'Create Invitation'}
        </button>
        {invitation?.id && (
          <a
            href={`/invite?event=${formData.event_slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#666' }}
          >
            View Public Link
          </a>
        )}
      </div>
    </form>
  );
}
