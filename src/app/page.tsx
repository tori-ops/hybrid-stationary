import Link from 'next/link';
import { weddingConfig } from '@/config/weddingConfig';

export const metadata = {
  title: 'Hybrid Wedding Invitation System',
  description: 'Digital wedding invitation with interactive card, weather widget, and local information',
};

export default function Home() {
  const { couple } = weddingConfig;

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif mb-4">
            Hybrid Wedding Invitation System
          </h1>
          <p className="text-xl text-rose-100 max-w-2xl mx-auto">
            Bridging the gap between elegant print and digital innovation. 
            Send beautiful physical invitations paired with an interactive digital experience.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎫</div>
            <h2 className="text-2xl font-serif text-rose-900 mb-3">Interactive Invitation</h2>
            <p className="text-gray-700 mb-4">
              Flip between front and back of your invitation card. See elegant traditional design meet modern interaction.
            </p>
            <Link
              href="/invite"
              className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-2"
            >
              View Sample →
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🌤️</div>
            <h2 className="text-2xl font-serif text-rose-900 mb-3">10-Day Weather</h2>
            <p className="text-gray-700 mb-4">
              Guests can check the weather forecast for your wedding location to plan accordingly. Real-time data powered by Open-Meteo API.
            </p>
            <Link
              href="/invite#weather"
              className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-2"
            >
              See Forecast →
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="text-2xl font-serif text-rose-900 mb-3">Branded Emails</h2>
            <p className="text-gray-700 mb-4">
              Ready-to-use HTML and text email templates. Customize and send to your guest list with a direct link to the invitation.
            </p>
            <Link
              href="/email-template"
              className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-2"
            >
              View Templates →
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-rose-100 to-blue-100 rounded-lg p-12 mb-16 border-2 border-rose-300">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-rose-900 mb-6">
              Everything Your Hybrid Wedding Needs
            </h2>
            <p className="text-gray-700 text-lg mb-8">
              This system combines the charm of physical save-the-dates and RSVP cards with a comprehensive digital experience. 
              Guests receive both forms, creating a memorable and elegant invitation experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded p-4">
                <p className="font-semibold text-rose-900 mb-2">✓ Beautiful Design</p>
                <p className="text-sm text-gray-600">Elegant serif fonts and curated color schemes</p>
              </div>
              <div className="bg-white rounded p-4">
                <p className="font-semibold text-rose-900 mb-2">✓ No Database Needed</p>
                <p className="text-sm text-gray-600">Static site with easy configuration</p>
              </div>
              <div className="bg-white rounded p-4">
                <p className="font-semibold text-rose-900 mb-2">✓ Flexible Contact Info</p>
                <p className="text-sm text-gray-600">Toggle between planner and couple contact</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Invitation Preview */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-rose-600 text-white p-6">
              <h3 className="text-2xl font-serif">View the Invitation</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                See the full interactive wedding invitation page with all features:
              </p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li>✓ 3D flipping invitation card</li>
                <li>✓ Wedding venue details</li>
                <li>✓ Local area attractions</li>
                <li>✓ 10-day weather forecast</li>
                <li>✓ Contact options (planner/couple toggle)</li>
              </ul>
              <Link
                href="/invite"
                className="inline-block px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-semibold"
              >
                Launch Invitation →
              </Link>
            </div>
          </div>

          {/* Email Templates */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-6">
              <h3 className="text-2xl font-serif">Email Templates</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Branded email templates ready to send to your guests:
              </p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li>✓ HTML template with preview</li>
                <li>✓ Plain text alternative</li>
                <li>✓ Customizable with your details</li>
                <li>✓ Direct download as files</li>
                <li>✓ Compatible with all email providers</li>
              </ul>
              <Link
                href="/email-template"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                View Templates →
              </Link>
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="bg-blue-50 rounded-lg p-8 border-l-4 border-blue-400 mb-16">
          <h2 className="text-2xl font-serif text-blue-900 mb-4">How It Works</h2>
          <ol className="space-y-4 text-gray-700">
            <li className="flex gap-4">
              <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
              <span>
                <strong>Customize the config:</strong> Edit src/config/weddingConfig.ts with your couple details, venue info, and weather location.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
              <span>
                <strong>Design your invitation:</strong> Modify the InviteCard component text and styling to match your preferences.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
              <span>
                <strong>Prepare email templates:</strong> Download HTML and text templates from the email-template page.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
              <span>
                <strong>Deploy your site:</strong> Deploy to Vercel, Netlify, or any hosting provider with your custom domain.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-blue-600 flex-shrink-0">5.</span>
              <span>
                <strong>Send physical invites:</strong> Print and send physical save-the-dates and RSVP cards.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-blue-600 flex-shrink-0">6.</span>
              <span>
                <strong>Send emails:</strong> Send branded emails with link to the digital invitation using your email provider.
              </span>
            </li>
          </ol>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-300 pt-8 text-center">
          <p className="text-gray-600 mb-2">
            Built with <span className="text-rose-600">♥</span> for beautiful celebrations
          </p>
          <p className="text-gray-500 text-sm">
            Created by Missing Piece Planning | © {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </main>
  );
}
