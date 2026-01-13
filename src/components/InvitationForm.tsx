'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface Invitation {
  id?: string;
  event_slug: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  wedding_time: string;
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
      wedding_time: '18:00',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (invitation?.id) {
        // Update existing
        const { error } = await supabase
          .from('invitations')
          .update(formData)
          .eq('id', invitation.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Invitation updated successfully!' });
      } else {
        // Create new
        const { error } = await supabase
          .from('invitations')
          .insert([
            {
              ...formData,
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
              Wedding Time
            </label>
            <input
              type="time"
              name="wedding_time"
              value={formData.wedding_time}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
