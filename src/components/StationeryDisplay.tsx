'use client';

import { useState } from 'react';

interface StationeryItem {
  type: 'invite' | 'rsvp' | 'save_the_date';
  front_image_url: string;
  back_image_url: string;
}

interface StationeryDisplayProps {
  items: StationeryItem[];
  secondaryColor?: string;
  accentColor?: string;
}

export default function StationeryDisplay({ items, secondaryColor = '#274E13', accentColor = '#FF6B6B' }: StationeryDisplayProps) {
  const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({});

  if (!items || items.length === 0) {
    return null;
  }

  const toggleFlip = (key: string) => {
    setFlipped(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="w-full space-y-8">
      {items.map((item, idx) => {
        const key = `${item.type}-${idx}`;
        const isFlipped = flipped[key] || false;

        // Only show if both front and back images exist
        if (!item.front_image_url || !item.back_image_url) {
          return null;
        }

        return (
          <div key={key} className="flex flex-col items-center justify-center">
            {/* Flip Card Container */}
            <div
              className="w-full max-w-4xl cursor-pointer perspective"
              onClick={() => toggleFlip(key)}
              style={{
                perspective: '1000px',
                aspectRatio: 'auto',
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
                  className="absolute w-full h-full rounded-lg shadow-2xl overflow-hidden flex items-center justify-center bg-white"
                  style={{
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <img
                    src={item.front_image_url}
                    alt="Card Front"
                    className="w-full h-full object-contain"
                    style={{ display: 'block' }}
                  />
                </div>

                {/* Back Image */}
                <div
                  className="absolute w-full h-full rounded-lg shadow-2xl overflow-hidden flex items-center justify-center bg-white"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <img
                    src={item.back_image_url}
                    alt="Card Back"
                    className="w-full h-full object-contain"
                    style={{ display: 'block' }}
                  />
                </div>
              </div>
            </div>

            {/* Flip Button */}
            <button
              onClick={() => toggleFlip(key)}
              className="mt-16 px-8 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90 border-2"
              style={{
                backgroundColor: secondaryColor,
                color: accentColor,
                borderColor: accentColor
              }}
            >
              {isFlipped ? 'See Front' : 'See Back'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
