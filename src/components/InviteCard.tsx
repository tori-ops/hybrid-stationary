'use client';

import { useState } from 'react';

export default function InviteCard({ config }: { config?: any }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Use provided config or fallback
  const inviteText = config?.inviteText || {
    front: {
      title: 'Together with their parents',
      subtitle: 'request the honour of your presence',
      couple: 'Bride Name and Groom Name',
      event: 'at the marriage of',
    },
    back: {
      rsvpInstructions: 'Please respond by [DATE]',
      rsvpEmail: 'couple@email.com',
      additionalInfo: 'Dinner and dancing to follow',
      registry: 'Gifts are gratefully declined. Your presence is the present.',
    },
  };

  const couple = config?.couple || {
    brideName: 'Bride Name',
    groomName: 'Groom Name',
    date: 'June 15, 2024',
    time: '4:00 PM',
  };

  const venue = config?.venue || {
    name: 'Venue Name',
    address: '123 Street',
    city: 'City, State',
  };

  const primaryColor = config?.colors?.primary || '#ec4899';

  // Check if images are provided
  const hasFrontImage = config?.images?.front;
  const hasBackImage = config?.images?.back;
  const hasImages = hasFrontImage && hasBackImage;

  // If images exist, show them with flip interaction
  if (hasImages) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 to-blue-50 p-4">
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-rose-900 mb-2">Your Wedding Invitation</h1>
          <p className="text-gray-600 text-center">Click the card below to reveal both sides</p>
        </div>

        {/* Flip Card Container with Images */}
        <div
          className="h-96 w-full max-w-2xl cursor-pointer perspective"
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            perspective: '1000px',
          }}
        >
          <div
            className="relative w-full h-full transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front Image */}
            <div
              className="absolute w-full h-full rounded-lg shadow-2xl overflow-hidden bg-gray-100"
              style={{
                backfaceVisibility: 'hidden',
                maxHeight: '100%',
                maxWidth: '100%',
              }}
            >
              <img 
                src={hasFrontImage} 
                alt="Invitation Front" 
                className="w-full h-full object-contain"
                style={{ display: 'block' }}
              />
            </div>

            {/* Back Image */}
            <div
              className="absolute w-full h-full rounded-lg shadow-2xl overflow-hidden bg-gray-100"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                maxHeight: '100%',
                maxWidth: '100%',
              }}
            >
              <img 
                src={hasBackImage} 
                alt="Invitation Back" 
                className="w-full h-full object-contain"
                style={{ display: 'block' }}
              />
            </div>
          </div>
        </div>

        {/* Flip Instructions */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-semibold"
          >
            {isFlipped ? 'See Front' : 'See Back'}
          </button>
          <p className="text-gray-600 text-sm mt-4">
            {isFlipped
              ? 'Back of invitation'
              : 'Front of invitation'}
          </p>
        </div>
      </div>
    );
  }

  // Default generated card (shown when no images)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 to-blue-50 p-4">
      <div className="mb-8">
        <h1 className="text-4xl font-serif text-rose-900 mb-2">Your Wedding Invitation</h1>
        <p className="text-gray-600 text-center">Click the card below to reveal both sides</p>
      </div>

      {/* Flip Card Container */}
      <div
        className="h-96 w-full max-w-2xl cursor-pointer perspective"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          perspective: '1000px',
        }}
      >
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front of Card */}
          <div
            className="absolute w-full h-full bg-white rounded-lg shadow-2xl p-8 flex flex-col justify-center items-center text-center border-4 border-rose-200"
            style={{
              backfaceVisibility: 'hidden',
            }}
          >
            <div className="space-y-4">
              <p className="text-sm tracking-widest text-gray-600 uppercase">
                {inviteText.front.title}
              </p>
              <p className="text-sm tracking-widest text-gray-600 uppercase">
                {inviteText.front.subtitle}
              </p>
              <div className="py-6 border-y border-rose-300">
                <h2 className="text-3xl font-serif text-rose-900">{couple.brideName}</h2>
                <p className="text-sm text-gray-600 my-2">and</p>
                <h2 className="text-3xl font-serif text-rose-900">{couple.groomName}</h2>
              </div>
              <p className="text-xs text-gray-600 italic">Together with their parents</p>
              <p className="text-sm text-gray-600">
                request the honour of your presence<br />
                at the marriage of
              </p>
            </div>
          </div>

          {/* Back of Card */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-rose-50 to-white rounded-lg shadow-2xl p-8 flex flex-col justify-center items-center text-center border-4 border-rose-200"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-serif text-2xl text-rose-900 mb-2">{couple.date}</p>
                <p className="text-gray-700">{couple.time} {couple.timezone}</p>
              </div>

              <div className="border-t border-b border-rose-300 py-4 my-4">
                <p className="font-semibold text-rose-900">{venue.name}</p>
                <p className="text-gray-600 text-xs">{venue.address}</p>
                <p className="text-gray-600 text-xs">{venue.city}</p>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-2">{inviteText.back.rsvpInstructions}</p>
                <p className="text-xs text-gray-700 font-semibold">{inviteText.back.rsvpEmail}</p>
              </div>

              <p className="text-xs italic text-gray-500 mt-4">{inviteText.back.additionalInfo}</p>
              <p className="text-xs italic text-gray-500">{inviteText.back.registry}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flip Instructions */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-semibold"
        >
          {isFlipped ? 'See Front' : 'See Back'}
        </button>
        <p className="text-gray-600 text-sm mt-4">
          {isFlipped
            ? 'Wedding details and RSVP information'
            : 'Click to view wedding details and information'}
        </p>
      </div>
    </div>
  );
}
