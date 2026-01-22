'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Sidebar from '@/components/Sidebar';
import InvitationForm from '@/components/InvitationForm';
import InvitationPreview from '@/components/InvitationPreview';
import { supabase } from '@/lib/supabase';

interface Invitation {
  id: string;
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
  show_event_timeline: boolean;
  show_rsvp_deadline: boolean;
  show_guest_info: boolean;
  show_planner_info: boolean;
  guest_arrival_time: string;
  parking_info: string;
  same_location: boolean;
  reception_venue_name: string;
  reception_venue_address: string;
  ceremony_indoor_outdoor: string;
  show_faq: boolean;
  faq_items: Array<{ question: string; answer: string }> | null;
  is_published: boolean;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedInviteId, setSelectedInviteId] = useState<string | null>(null);
  const [selectedInvite, setSelectedInvite] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Load selected invitation
  useEffect(() => {
    console.log('Dashboard useEffect - selectedInviteId:', selectedInviteId);
    if (selectedInviteId) {
      loadInvitation();
    } else {
      console.log('selectedInviteId is null/falsy, setting selectedInvite to null and loading to false');
      setSelectedInvite(null);
      setLoading(false);
    }
  }, [selectedInviteId]);

  const loadInvitation = async () => {
    if (!selectedInviteId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('id', selectedInviteId)
        .single();

      if (!error && data) {
        setSelectedInvite(data as Invitation);
      }
    } catch (err) {
      console.error('Failed to load invitation:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <Sidebar 
        selectedInviteId={selectedInviteId} 
        onSelectInvite={setSelectedInviteId}
        refreshTrigger={refreshTrigger}
      />

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto pt-36 lg:pt-0 lg:mt-0">
        {/* Page Header - Hidden on mobile since it's in the nav bar */}
        <div className="hidden lg:block bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="text-4xl md:text-5xl font-serif font-bold mb-1" style={{ color: '#274E13', lineHeight: '1.1' }}>
                Digital Invitation &<br />Guest Info Suite
              </div>
              <p className="text-sm mt-3" style={{ color: '#666' }}>
                Designed by The Missing Piece Planning and Events
              </p>
            </div>
            <div className="flex-shrink-0">
              <img 
                src="/logo.png" 
                alt="The Missing Piece Logo" 
                className="h-16 md:h-28 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto -mt-12">
          {loading ? (
            <p className="text-sm text-gray-600">Loading invitation...</p>
          ) : !selectedInvite ? (
            <>
              <h1 className="text-lg md:text-xl font-serif mb-2" style={{ color: '#274E13' }}>
                Create New Invitation
              </h1>
              <p className="text-xs lg:text-sm text-gray-600 mb-6">
                Customize a new hybrid invitation for your client
              </p>
              <InvitationForm
                invitation={null}
                onSave={() => {
                  console.log('Form saved, resetting state');
                  setSelectedInviteId(null);
                  setRefreshTrigger(prev => prev + 1);
                }}
              />
            </>
          ) : (
            <>
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-lg md:text-xl font-serif mb-1" style={{ color: '#274E13' }}>
                    {selectedInvite.bride_name} & {selectedInvite.groom_name}
                  </h1>
                  <p className="text-xs lg:text-sm text-gray-600">
                    {new Date(selectedInvite.wedding_date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-4 py-2 rounded-lg font-semibold text-xs lg:text-sm text-white transition-opacity hover:opacity-90 w-full lg:w-auto"
                  style={{ backgroundColor: '#274E13' }}
                >
                  {showPreview ? 'Edit' : 'Preview'}
                </button>
              </div>

              {showPreview ? (
                <InvitationPreview invitation={selectedInvite} />
              ) : (
                <InvitationForm
                  invitation={selectedInvite}
                  onSave={() => {
                    loadInvitation();
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
