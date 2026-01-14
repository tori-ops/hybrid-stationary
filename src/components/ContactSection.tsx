'use client';

import { useState } from 'react';
import { weddingConfig } from '@/config/weddingConfig';

type ContactType = 'planner' | 'couple';

export default function ContactSection({ config }: { config?: any }) {
  const [contactType, setContactType] = useState<ContactType>('planner');

  const contacts = config?.contacts || weddingConfig.contacts;
  const planner = contacts.planner;
  const couple = contacts.couple;
  const selectedContact = contactType === 'planner' ? planner : couple;
  
  // Get colors from config with fallbacks
  const primaryColor = config?.colors?.primary || '#ec4899';
  const secondaryColor = config?.colors?.secondary || '#3b82f6';
  const accentColor = config?.colors?.accent || '#db2777';

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
      <h2 className="text-xl md:text-2xl font-serif mb-6 text-center" style={{ color: accentColor }}>Questions?</h2>

      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-8 justify-center">
        <button
          onClick={() => setContactType('planner')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all border-2 ${
            contactType === 'planner'
              ? 'shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-200'
          }`}
          style={contactType === 'planner' ? {
            backgroundColor: secondaryColor,
            color: accentColor,
            borderColor: accentColor
          } : {}}
        >
          Contact Planner
        </button>
        <button
          onClick={() => setContactType('couple')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all border-2 ${
            contactType === 'couple'
              ? 'shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-200'
          }`}
          style={contactType === 'couple' ? {
            backgroundColor: secondaryColor,
            color: accentColor,
            borderColor: accentColor
          } : {}}
        >
          Contact Couple
        </button>
      </div>

      {/* Contact Information */}
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-sm md:text-base font-semibold text-gray-800 mb-4">{selectedContact.name}</p>

          {/* Email Option */}
          <div className="mb-4">
            <a
              href={`mailto:${selectedContact.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg hover:shadow-lg transition-all"
              style={{
                background: `linear-gradient(to right, ${secondaryColor}, ${secondaryColor}dd)`,
                color: accentColor
              }}
            >
              <span>✉️</span>
              <div className="text-left">
                <p className="text-xs md:text-sm" style={{ color: accentColor }}>Email</p>
                <p className="font-semibold text-sm md:text-base" style={{ color: accentColor }}>{selectedContact.email}</p>
              </div>
            </a>
          </div>

          {/* Phone Option */}
          <div>
            <a
              href={`tel:${selectedContact.phone}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg hover:shadow-lg transition-all"
              style={{
                background: `linear-gradient(to right, ${secondaryColor}, ${secondaryColor}dd)`,
                color: accentColor
              }}
            >
              <span>📱</span>
              <div className="text-left">
                <p className="text-xs md:text-sm" style={{ color: accentColor }}>Phone</p>
                <p className="font-semibold text-sm md:text-base" style={{ color: accentColor }}>{selectedContact.phone}</p>
              </div>
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-gray-50 rounded-lg p-4 border-l-4" style={{ borderColor: accentColor }}>
          <p className="text-sm text-gray-700">
            {contactType === 'planner'
              ? 'For planning questions, RSVP details, or logistics - reach out to the wedding planner. This helps keep the couple stress-free!'
              : 'For personal messages or special requests for the couple, feel free to reach out directly.'}
          </p>
        </div>
      </div>
    </div>
  );
}
