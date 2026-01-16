'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInvitation } from '@/hooks/useInvitation';
import { invitationToConfig } from '@/lib/invitationConfig';
import StationeryDisplay from '@/components/StationeryDisplay';
import VenueInfo from '@/components/VenueInfo';
import RSVPDeadline from '@/components/RSVPDeadline';
import WeatherWidget from '@/components/WeatherWidget';
import AreaFacts from '@/components/AreaFacts';
import ContactSection from '@/components/ContactSection';
import ProofWatermark from '@/components/ProofWatermark';
import ApprovalModal from '@/components/ApprovalModal';
import EditConfirmModal from '@/components/EditConfirmModal';
import EditRequestModal from '@/components/EditRequestModal';
import { weddingConfig } from '@/config/weddingConfig';

function InvitePageContent() {
  const searchParams = useSearchParams();
  const eventSlug = searchParams?.get('event') || 'default';
  const approvalToken = searchParams?.get('proof');
  const { invitation, loading, error } = useInvitation(eventSlug === 'default' ? undefined : eventSlug);
  
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [showEditCommentsModal, setShowEditCommentsModal] = useState(false);
  const [isSubmittingEdits, setIsSubmittingEdits] = useState(false);
  
  const isProofMode = !!approvalToken;

  // Debug logging
  console.log('InvitePageContent loaded');
  console.log('Event Slug:', eventSlug);
  console.log('Approval Token:', approvalToken);
  console.log('Is Proof Mode:', isProofMode);
  console.log('Invitation loaded:', !!invitation);
  
  // Convert invitation data to config format, fall back to default
  const config = invitationToConfig(invitation);
  const { weatherLocation, couple } = config;

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Loading invitation...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error: {error}</p>
          <p className="text-gray-600 mt-2">Using default invitation</p>
        </div>
      </main>
    );
  }

  const handleApproveClick = () => {
    setShowApprovalModal(true);
  };

  const handleApprovalConfirm = async () => {
    setIsApproving(true);
    try {
      console.log('Submitting approval with token:', approvalToken);
      const response = await fetch('/api/approve-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalToken }),
      });

      console.log('Approval response status:', response.status);
      const data = await response.json();
      console.log('Approval response data:', data);

      if (response.ok && invitation?.id) {
        // Send published confirmation email to couple
        try {
          console.log('Sending published confirmation email...');
          const emailResponse = await fetch('/api/send-published-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ invitationId: invitation.id }),
          });

          const emailData = await emailResponse.json();
          console.log('Published email response:', emailData);
        } catch (emailError) {
          console.error('Error sending published email:', emailError);
          // Don't fail the approval if email fails, but log it
        }

        // Show success message and remove proof mode
        setShowApprovalModal(false);
        window.location.href = `/invite?event=${eventSlug}`;
      } else {
        console.error('Approval failed:', data.error);
        alert('Failed to approve invitation: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error approving invitation:', error);
      alert('An error occurred while approving the invitation: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsApproving(false);
    }
  };

  const handleEditClick = () => {
    setShowEditConfirmModal(true);
  };

  const handleEditConfirm = async () => {
    setShowEditConfirmModal(false);
    setShowEditCommentsModal(true);
  };

  const handleEditCommentsSubmit = async (comments: string) => {
    setIsSubmittingEdits(true);
    try {
      console.log('Submitting edit request with comments');
      const response = await fetch('/api/send-edit-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          invitationId: invitation?.id,
          editComments: comments,
        }),
      });

      const data = await response.json();
      console.log('Edit request response:', data);

      if (response.ok) {
        setShowEditCommentsModal(false);
        alert('Thank you! Your edit requests have been sent to our team. We\'ll review and update your page shortly.');
        // Optionally redirect back to public view
        window.location.href = `/invite?event=${eventSlug}`;
      } else {
        console.error('Edit request failed:', data.error);
        alert('Failed to send edit request: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting edit request:', error);
      alert('An error occurred while submitting your edits: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSubmittingEdits(false);
    }
  };

  return (
    <main
      className="min-h-screen bg-gray-50 overflow-x-hidden"
      style={{
        backgroundImage: invitation?.background_image_url ? `url('${invitation.background_image_url}')` : 'none',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-12">
        {/* Proof Watermark - Show in proof mode */}
        {isProofMode && <ProofWatermark />}

        {/* Stationery Items Section - Conditional */}
        {invitation?.stationery_items && invitation.stationery_items.length > 0 && (
          <section className="mt-16 mb-40 px-4">
            {/* Buttons - Show only in proof mode - Fixed at top with high z-index */}
            {isProofMode && (
              <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-4">
                <button
                  onClick={handleApproveClick}
                  className="px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90 border-2 whitespace-nowrap bg-green-600 text-white border-green-600 hover:bg-green-700 shadow-lg"
                >
                  Approve & Publish
                </button>
                <button
                  onClick={handleEditClick}
                  className="px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90 border-2 whitespace-nowrap bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-lg"
                >
                  Edit & Update
                </button>
              </div>
            )}
            <StationeryDisplay 
              items={invitation.stationery_items}
              secondaryColor={invitation.secondary_color || '#274E13'}
              accentColor={invitation.accent_color || '#FF6B6B'}
              backgroundImages={{
                'invite': invitation.invitation_background_image_url || null,
                'rsvp': invitation.rsvp_background_image_url || null,
                'save_the_date': invitation.save_the_date_background_image_url || null
              }}
            />
          </section>
        )}

        {/* RSVP Deadline Section - Conditional */}
          {invitation?.show_rsvp_deadline !== false && invitation?.rsvp_deadline && (
            <section className="mb-12 flex
justify-center">
              <RSVPDeadline
                rsvpDeadline={invitation.rsvp_deadline}
                accentColor={invitation.accent_color || '#db2777'}
                secondaryColor={invitation.secondary_color || '#274E13'}
                onRsvpClick={() => {
                  if (invitation.rsvp_link) {
                    window.open(invitation.rsvp_link, '_blank');
                  }
                }}
              />
            </section>
          )}

          {/* Venue Information Section */}
        <section className="mb-12 flex justify-center">
          <VenueInfo config={config} />
        </section>

        {/* RSVP & Couples Website Buttons */}
        <section className="mb-12 flex justify-center gap-4 flex-wrap">
            {invitation?.couples_website && (
              <a
                href={invitation.couples_website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90 border-2 whitespace-nowrap text-sm sm:text-base"
                style={{
                  backgroundColor: invitation.secondary_color || '#274E13',
                  color: invitation.accent_color || '#db2777',
                  borderColor: invitation.accent_color || '#db2777'
                }}
              >
                Visit the Couples Website!
              </a>
            )}
            {invitation?.rsvp_link && (
              <a
                href={invitation.rsvp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90 border-2 whitespace-nowrap text-sm sm:text-base"
                style={{
                  backgroundColor: invitation.secondary_color || '#274E13',
                  color: invitation.accent_color || '#db2777',
                  borderColor: invitation.accent_color || '#db2777'
                }}
              >
                RSVP Now
              </a>
            )}
          </section>

        {/* Weather Widget Section - Conditional */}
        {invitation?.show_weather !== false && (
          <section className="mb-12 flex justify-center">
            <div className="max-w-4xl w-full">
              <WeatherWidget
              latitude={weatherLocation.latitude}
              longitude={weatherLocation.longitude}
              city={weatherLocation.city}
              secondaryColor={(config as any).colors?.secondary}
              accentColor={(config as any).colors?.accent}
              />
            </div>
          </section>
        )}

        {/* Event Timeline Section */}
        <section className="mb-12 flex justify-center relative px-4">
          <div className="rounded-lg shadow-lg p-4 md:p-8 max-w-4xl w-full flex flex-row" style={{
            background: `linear-gradient(135deg, white, rgba(39, 78, 19, 0.05))`,
            borderLeft: `4px solid ${invitation?.secondary_color || '#274E13'}`
          }}>
            <div className="flex flex-row gap-4 md:gap-8 items-center flex-1">
              {/* Left column: Heading and Timeline content */}
              <div className="flex-1 w-full">
                <h2 className="text-xl md:text-2xl font-serif mb-4 md:mb-8" style={{ color: invitation?.accent_color || '#FF6B6B' }}>
                  Event Timeline
                </h2>
                <div className="space-y-4">
                  {(invitation?.timeline_events || [
                    { time: '4:30 PM', name: 'Ceremony' },
                    { time: '5:15 PM', name: 'Cocktail Hour' },
                    { time: '6:00 PM', name: 'Dinner' },
                    { time: '10:00 PM', name: 'End of Event' },
                  ]).map((event: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 md:gap-4">
                      <div className="w-20 md:w-24 font-semibold text-sm md:text-base" style={{ color: invitation?.accent_color || '#FF6B6B' }}>
                        {event.time}
                      </div>
                      <div className="text-sm md:text-base text-gray-700">{event.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Timeline image on right in circle - aligned to top */}
              {invitation?.timeline_image_url && (
                <div className="flex-shrink-0 ml-auto">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-96 md:h-96 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={invitation.timeline_image_url}
                      alt="Timeline decoration"
                      className="w-56 h-56 sm:w-64 sm:h-64 md:w-96 md:h-96 object-contain object-center"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Area Facts Section - Conditional */}
        {invitation?.show_area_facts !== false && (
          <section className="mb-16 flex justify-center">
            <AreaFacts config={{...config, backgroundImageUrl: invitation?.background_image_url}} />
          </section>
        )}

        {/* Contact Section - Conditional */}
        {invitation?.show_contact_section !== false && (
          <section className="mb-16 flex justify-center">
            <ContactSection config={config} />
          </section>
        )}

        {/* Footer */}
        <footer className="mt-20 py-8 border-t border-gray-300 text-center">
          <p className="text-gray-600 text-sm mb-2">
            Coordinated with care by The Missing Piece Planning
          </p>
          <p className="text-gray-500 text-xs mb-4">
            © {new Date().getFullYear()} All rights reserved
          </p>
          {invitation?.logo_url && (
            <div className="flex justify-center">
              <img 
                src={invitation.logo_url} 
                alt="Logo" 
                className="h-16 object-contain"
              />
            </div>
          )}
        </footer>
      </div>

      {/* Approval Modal */}
      <ApprovalModal
        isOpen={showApprovalModal}
        onConfirm={handleApprovalConfirm}
        onCancel={() => setShowApprovalModal(false)}
        isLoading={isApproving}
      />

      {/* Edit Confirmation Modal */}
      <EditConfirmModal
        isOpen={showEditConfirmModal}
        onConfirm={handleEditConfirm}
        onCancel={() => setShowEditConfirmModal(false)}
        isLoading={false}
      />

      {/* Edit Comments Modal */}
      <EditRequestModal
        isOpen={showEditCommentsModal}
        onSubmit={handleEditCommentsSubmit}
        onCancel={() => setShowEditCommentsModal(false)}
        isLoading={isSubmittingEdits}
      />
    </main>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Loading...</p></div>}>
      <InvitePageContent />
    </Suspense>
  );
}




