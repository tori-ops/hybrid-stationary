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

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
      <h2 className="text-3xl font-serif text-rose-900 mb-6 text-center">Questions?</h2>

      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-8 justify-center">
        <button
          onClick={() => setContactType('planner')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            contactType === 'planner'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Contact Planner
        </button>
        <button
          onClick={() => setContactType('couple')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            contactType === 'couple'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Contact Couple
        </button>
      </div>

      {/* Contact Information */}
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800 mb-4">{selectedContact.name}</p>

          {/* Email Option */}
          <div className="mb-4">
            <a
              href={`mailto:${selectedContact.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <span>✉️</span>
              <div className="text-left">
                <p className="text-xs text-blue-100">Email</p>
                <p className="font-semibold">{selectedContact.email}</p>
              </div>
            </a>
          </div>

          {/* Phone Option */}
          <div>
            <a
              href={`tel:${selectedContact.phone}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <span>📱</span>
              <div className="text-left">
                <p className="text-xs text-green-100">Phone</p>
                <p className="font-semibold">{selectedContact.phone}</p>
              </div>
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-rose-400">
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
