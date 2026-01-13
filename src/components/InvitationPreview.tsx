'use client';

interface Invitation {
  event_slug: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  venue_name: string;
  venue_city: string;
  is_published: boolean;
}

interface InvitationPreviewProps {
  invitation: Invitation;
}

export default function InvitationPreview({ invitation }: InvitationPreviewProps) {
  const inviteUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}/invite?event=${invitation.event_slug}`;

  return (
    <div className="space-y-6">
      {!invitation.is_published && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          ⚠️ This invitation is not published. Couples won't be able to access it via the link yet.
        </div>
      )}

      {invitation.is_published && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          ✓ This invitation is published and couples can view it at the link below.
        </div>
      )}

      {/* Invitation Link */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#274E13' }}>
          Public Invitation Link
        </h3>
        <div className="flex items-center gap-4">
          <code className="flex-1 p-3 bg-gray-100 rounded text-sm overflow-x-auto">
            {inviteUrl}
          </code>
          <button
            onClick={() => navigator.clipboard.writeText(inviteUrl)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Copy
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Share this link with your guests via email, text, or social media.
        </p>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#274E13' }}>
          Invitation Preview
        </h3>
        <iframe
          src={inviteUrl}
          className="w-full rounded-lg border border-gray-300"
          style={{ height: '800px' }}
          title="Invitation Preview"
        />
      </div>

      {/* Email Template */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#274E13' }}>
          Share Instructions
        </h3>
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>Option 1: Direct Share</strong>
            <br />
            Copy the link above and send it directly to guests via email or text.
          </p>
          <p>
            <strong>Option 2: Email Template</strong>
            <br />
            Go to the{' '}
            <a href="/email-template" className="font-semibold underline" style={{ color: '#274E13' }}>
              Email Template
            </a>{' '}
            page to send a branded email with the invitation link.
          </p>
          <p>
            <strong>Option 3: Physical + Digital</strong>
            <br />
            Include this link in your printed save-the-dates for the "hybrid" experience.
          </p>
        </div>
      </div>
    </div>
  );
}
