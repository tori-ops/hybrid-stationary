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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

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

  const handleSelectInvite = (id: string | null) => {
    onSelectInvite(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Menu with Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 p-3 z-50" style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg transition-opacity hover:opacity-75 flex-shrink-0"
            style={{ color: '#274E13' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-serif font-bold leading-tight" style={{ color: '#274E13', lineHeight: '1.2' }}>
              Digital Invitation &<br />Guest Info Suite
            </h1>
            <p className="text-xs truncate leading-tight" style={{ color: '#666' }}>
              Designed by The Missing Piece Planning and Events
            </p>
          </div>
          <div className="flex-shrink-0 ml-2">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-8 md:h-12 w-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
          style={{ top: '56px' }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`w-64 flex flex-col shadow-lg fixed left-0 bottom-0 z-40 transition-transform duration-300 overflow-y-auto lg:transition-none lg:relative lg:z-auto lg:top-0 lg:overflow-visible ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: '#D0CEB5', marginTop: 'env(safe-area-inset-top)', top: '56px', height: 'calc(100vh - 56px)' }}
      >
        {/* Header */}
        <div className="p-3 pt-12 border-b lg:p-4" style={{ borderColor: '#274E13' }}>
          <h1 className="text-base lg:text-lg font-serif font-bold leading-tight" style={{ color: '#274E13' }}>
            My Invitations
          </h1>
          <p className="text-xs mt-0.5 leading-tight" style={{ color: '#274E13' }}>
            {user?.email}
          </p>
        </div>

        {/* Create New Button */}
        <div className="p-3">
          <button
            onClick={() => handleSelectInvite(null)}
            className="w-full py-2 px-3 rounded-lg font-semibold text-sm text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#274E13' }}
          >
            + Create New
          </button>
        </div>

        {/* Client List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 pb-20">
          {loading ? (
            <p className="text-xs text-gray-600 p-2">Loading...</p>
          ) : invitations.length === 0 ? (
            <p className="text-xs text-gray-600 p-2">No invitations yet. Create one to get started!</p>
          ) : (
            <div className="space-y-1">
              {invitations.map((invite) => (
                <button
                  key={invite.id}
                  onClick={() => handleSelectInvite(invite.id)}
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

        {/* Logout & About */}
        <div className="p-3 border-t" style={{ borderColor: '#274E13' }}>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAboutModal(true)}
              className="flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-75"
              style={{ color: '#274E13' }}
            >
              About
            </button>
            <button
              onClick={async () => {
                await signOut();
                window.location.href = '/';
              }}
              className="flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-75"
              style={{ color: '#274E13' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* About Modal */}
      {showAboutModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAboutModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-serif font-bold" style={{ color: '#274E13' }}>
                About
              </h2>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Version</p>
                <p className="text-lg font-semibold" style={{ color: '#274E13' }}>1.4.2</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Created by</p>
                <p className="text-lg font-semibold" style={{ color: '#274E13' }}>
                  The Missing Piece Planning and Events, LLC
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Contact</p>
                <a
                  href="mailto:tori@missingpieceplanning.com"
                  className="inline-block py-2 px-4 rounded-lg font-semibold text-sm text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#274E13' }}
                >
                  Email Us
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full mt-6 py-2 px-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-75"
              style={{ color: '#274E13', borderColor: '#274E13', border: '2px solid' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
