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
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load selected invitation
  useEffect(() => {
    if (selectedInviteId) {
      loadInvitation();
    } else {
      setSelectedInvite(null);
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
    <main className="min-h-screen flex" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <Sidebar 
        selectedInviteId={selectedInviteId} 
        onSelectInvite={setSelectedInviteId}
        refreshTrigger={refreshTrigger}
      />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <p className="text-sm text-gray-600">Loading invitation...</p>
          ) : !selectedInvite ? (
            <>
              <h1 className="text-3xl font-serif mb-2" style={{ color: '#274E13' }}>
                Create New Invitation
              </h1>
              <p className="text-sm text-gray-600 mb-6">
                Customize a new hybrid invitation for your client
              </p>
              <InvitationForm
                invitation={null}
                onSave={() => {
                  setSelectedInviteId(null);
                  setRefreshTrigger(prev => prev + 1);
                }}
              />
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-serif mb-1" style={{ color: '#274E13' }}>
                    {selectedInvite.bride_name} & {selectedInvite.groom_name}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedInvite.wedding_date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-4 py-2 rounded-lg font-semibold text-sm text-white transition-opacity hover:opacity-90"
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
