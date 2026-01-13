'use client';

import { useState } from 'react';
import { weddingConfig } from '@/config/weddingConfig';

export default function EmailTemplatePage() {
  const { couple } = weddingConfig;
  const inviteUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}/invite`;
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Georgia', serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #fafafa;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
    }
    .header {
      background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      font-size: 32px;
      margin: 0 0 10px 0;
      font-weight: normal;
    }
    .header p {
      margin: 5px 0;
      font-size: 16px;
      letter-spacing: 1px;
    }
    .content {
      padding: 40px 20px;
    }
    .intro {
      text-align: center;
      margin-bottom: 30px;
      font-size: 16px;
    }
    .invite-link {
      text-align: center;
      margin: 30px 0;
    }
    .invite-link a {
      display: inline-block;
      background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
      color: white;
      padding: 15px 40px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      font-size: 16px;
    }
    .invite-link a:hover {
      opacity: 0.9;
    }
    .highlights {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 30px 0;
    }
    .highlight {
      background-color: #fce7f3;
      padding: 20px;
      border-radius: 5px;
      text-align: center;
    }
    .highlight h3 {
      color: #be123c;
      margin: 0 0 10px 0;
    }
    .highlight p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }
    .footer {
      background-color: #f3f4f6;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #e5e7eb;
    }
    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #ec4899, transparent);
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>${couple.brideName} & ${couple.groomName}</h1>
      <p>Together with their parents</p>
      <p>request the honour of your presence</p>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="intro">
        <p>Dear Guest,</p>
        <p>We are delighted to invite you to celebrate the wedding of <strong>${couple.brideName}</strong> and <strong>${couple.groomName}</strong>. 
        Your presence and blessings would mean the world to us as we embark on this beautiful journey together.</p>
      </div>

      <div class="divider"></div>

      <!-- Highlights -->
      <div class="highlights">
        <div class="highlight">
          <h3>📅 When</h3>
          <p>${couple.date}<br>${couple.time} ${couple.timezone}</p>
        </div>
        <div class="highlight">
          <h3>📍 Where</h3>
          <p>${weddingConfig.venue.name}<br>${weddingConfig.venue.city}</p>
        </div>
        <div class="highlight">
          <h3>🎫 View Invite</h3>
          <p>See the full invitation with all details</p>
        </div>
        <div class="highlight">
          <h3>🌤️ Weather</h3>
          <p>10-day forecast for the area</p>
        </div>
      </div>

      <!-- CTA Button -->
      <div class="invite-link">
        <a href="${inviteUrl}">View Your Invitation</a>
      </div>

      <div class="divider"></div>

      <!-- What's Inside -->
      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 5px; border-left: 4px solid #22c55e;">
        <h3 style="color: #15803d; margin-top: 0;">What You'll Find Inside:</h3>
        <ul style="color: #166534; padding-left: 20px; margin: 10px 0;">
          <li>Interactive invitation card (flip front and back!)</li>
          <li>Complete wedding details and venue information</li>
          <li>Local area attractions and recommendations</li>
          <li>10-day weather forecast for the wedding location</li>
          <li>Easy contact options for questions or RSVPs</li>
        </ul>
      </div>

      <p style="margin-top: 30px; text-align: center; color: #666;">
        We look forward to celebrating with you!
      </p>

      <p style="text-align: center; margin-top: 20px;">
        With love and excitement,<br>
        <strong>${couple.brideName} & ${couple.groomName}</strong>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 0;">Missing Piece Planning<br>Making Your Special Day Unforgettable</p>
      <p style="margin: 10px 0 0 0; font-size: 11px;">© 2026 All Rights Reserved</p>
    </div>
  </div>
</body>
</html>
`;

  const textTemplate = `
${couple.brideName} & ${couple.groomName}

Together with their parents
request the honour of your presence

---

Dear Guest,

We are delighted to invite you to celebrate the wedding of ${couple.brideName} and ${couple.groomName}. Your presence and blessings would mean the world to us as we embark on this beautiful journey together.

DATE: ${couple.date} at ${couple.time} ${couple.timezone}
LOCATION: ${weddingConfig.venue.name}, ${weddingConfig.venue.city}

VIEW YOUR INVITATION:
${inviteUrl}

What You'll Find:
✓ Interactive invitation card (flip front and back!)
✓ Complete wedding details and venue information
✓ Local area attractions and recommendations
✓ 10-day weather forecast for the wedding location
✓ Easy contact options for questions or RSVPs

We look forward to celebrating with you!

With love and excitement,
${couple.brideName} & ${couple.groomName}

---
Missing Piece Planning
Making Your Special Day Unforgettable
`;

  const handleSendTest = async () => {
    setSending(true);
    setSendStatus(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'tori@missingpieceplanning.com',
          subject: 'Test Email - Hybrid Stationary System',
          isTest: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSendStatus({
          type: 'success',
          message: 'Test email sent successfully! Check your inbox.',
        });
      } else {
        setSendStatus({
          type: 'error',
          message: data.message || 'Failed to send test email',
        });
      }
    } catch (error) {
      setSendStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setSending(false);
    }
  };

  const handleSendInvitation = async (recipientEmail: string) => {
    setSending(true);
    setSendStatus(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientEmail,
          subject: `You're Invited to ${couple.brideName} & ${couple.groomName}'s Wedding!`,
          htmlContent: htmlTemplate,
          textContent: textTemplate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSendStatus({
          type: 'success',
          message: `Invitation sent to ${recipientEmail}!`,
        });
      } else {
        setSendStatus({
          type: 'error',
          message: data.message || 'Failed to send invitation',
        });
      }
    } catch (error) {
      setSendStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif text-rose-900 mb-8">Email Template</h1>

        {/* Status Messages */}
        {sendStatus && (
          <div
            className={`mb-8 p-4 rounded-lg border-l-4 ${
              sendStatus.type === 'success'
                ? 'bg-green-50 border-green-400 text-green-800'
                : 'bg-red-50 border-red-400 text-red-800'
            }`}
          >
            <p className="font-semibold">{sendStatus.type === 'success' ? '✓ Success' : '✗ Error'}</p>
            <p>{sendStatus.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* HTML Preview */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">HTML Version (Preview)</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <iframe
                srcDoc={htmlTemplate}
                className="w-full"
                style={{ height: '600px', border: 'none' }}
                title="HTML Email Template"
              />
            </div>
            <button
              onClick={() => {
                const blob = new Blob([htmlTemplate], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'wedding-invite-email.html';
                a.click();
              }}
              className="mt-4 px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors w-full"
            >
              Download HTML Template
            </button>
          </div>

          {/* Text Version */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Plain Text Version</h2>
            <div className="bg-white rounded-lg shadow-lg p-6 font-mono text-sm h-96 overflow-auto border border-gray-200">
              <pre className="whitespace-pre-wrap">{textTemplate}</pre>
            </div>
            <button
              onClick={() => {
                const blob = new Blob([textTemplate], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'wedding-invite-email.txt';
                a.click();
              }}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full"
            >
              Download Text Template
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 border-l-4 border-blue-400">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">How to Use These Templates</h3>
          <ol className="space-y-3 text-gray-700">
            <li>
              <strong>1. Download the templates</strong> using the buttons above
            </li>
            <li>
              <strong>2. Use your email service</strong> (Gmail, Outlook, Mailchimp, SendGrid, etc.)
            </li>
            <li>
              <strong>3. Customize the URL</strong> - Replace the invite link with your actual domain
            </li>
            <li>
              <strong>4. Test send</strong> to yourself first before sending to guests
            </li>
            <li>
              <strong>5. Send campaigns</strong> using your email provider's bulk send feature
            </li>
          </ol>

          <div className="mt-6 p-4 bg-white rounded border border-blue-200">
            <p className="text-sm text-gray-600">
              <strong>Pro Tip:</strong> For personalized emails with guest names, use mail merge features in 
              your email service. This allows you to automatically insert each guest's name and customize the greeting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
