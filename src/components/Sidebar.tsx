'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Invitation {
  id: string;
  event_slug: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
}

interface SidebarProps {
  selectedInviteId: string | null;
  onSelectInvite: (id: string | null) => void;
  refreshTrigger?: number;
}

export default function Sidebar({ selectedInviteId, onSelectInvite, refreshTrigger }: SidebarProps) {
  const { user, signOut } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadInvitations();
    }
  }, [user?.id, refreshTrigger]);

  const loadInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('id, event_slug, bride_name, groom_name, wedding_date')
        .eq('planner_id', user?.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setInvitations(data);
      }
    } catch (err) {
      console.error('Failed to load invitations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-64 min-h-screen flex flex-col shadow-lg fixed left-0 top-0 bottom-0 hidden lg:flex"
      style={{ backgroundColor: '#D0CEB5' }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: '#274E13' }}>
        <h1 className="text-lg font-serif font-bold" style={{ color: '#274E13' }}>
          My Invitations
        </h1>
        <p className="text-xs mt-1" style={{ color: '#274E13' }}>
          {user?.email}
        </p>
      </div>

      {/* Create New Button */}
      <div className="p-3">
        <button
          onClick={() => onSelectInvite(null)}
          className="w-full py-2 px-3 rounded-lg font-semibold text-sm text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#274E13' }}
        >
          + Create New
        </button>
      </div>

      {/* Client List */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {loading ? (
          <p className="text-xs text-gray-600 p-2">Loading...</p>
        ) : invitations.length === 0 ? (
          <p className="text-xs text-gray-600 p-2">No invitations yet. Create one to get started!</p>
        ) : (
          <div className="space-y-1">
            {invitations.map((invite) => (
              <button
                key={invite.id}
                onClick={() => onSelectInvite(invite.id)}
                className={`w-full text-left p-2 rounded-lg transition-colors text-sm ${
                  selectedInviteId === invite.id
                    ? 'bg-white'
                    : 'hover:bg-white hover:bg-opacity-50'
                }`}
              >
                <p className="font-semibold text-xs" style={{ color: '#274E13' }}>
                  {invite.bride_name} & {invite.groom_name}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {new Date(invite.wedding_date + 'T00:00:00').toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="p-3 border-t" style={{ borderColor: '#274E13' }}>
        <button
          onClick={() => {
            signOut();
            window.location.href = '/';
          }}
          className="w-full py-2 px-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-75"
          style={{ color: '#274E13' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
