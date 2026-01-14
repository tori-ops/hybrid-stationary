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
  backgroundImages?: { [key: string]: string | null };
}

interface ImageDimensions {
  width: number;
  height: number;
}

export default function StationeryDisplay({ items, secondaryColor = '#274E13', accentColor = '#FF6B6B', backgroundImages = {} }: StationeryDisplayProps) {
  const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({});
  const [dimensions, setDimensions] = useState<{ [key: string]: ImageDimensions }>({});

  if (!items || items.length === 0) {
    return null;
  }

  const toggleFlip = (key: string) => {
    setFlipped(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleImageLoad = (key: string, event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    setDimensions(prev => ({
      ...prev,
      [key]: { width: img.naturalWidth, height: img.naturalHeight }
    }));
  };

  return (
    <div className="w-full space-y-8">
      {items.map((item, idx) => {
        const key = `${item.type}-${idx}`;
        const isFlipped = flipped[key] || false;
        const dims = dimensions[key];
        const aspectRatio = dims ? (dims.width / dims.height) : (3 / 4);
        const backgroundImage = backgroundImages[item.type];
        // Calculate background position based on card aspect ratio
          const backgroundTopPercent = 20;

        return (
          <div key={key} className="flex flex-col items-center justify-center">
            {/* Background Image Container - presents the stationery */}
            {backgroundImage && (
              <div
                className="absolute pointer-events-none"
                style={{
                  zIndex: 1,
                  top: `${backgroundTopPercent}%`,
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'clamp(800px, 150vw, 2000px)',
                  height: 'clamp(800px, 150vw, 2000px)',
                  maxWidth: 'none'
                }}
              >
                <img
                  src={backgroundImage}
                  alt="Stationery background"
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            )}

            {/* Flip Card Container */}
            <div
              className="w-full cursor-pointer perspective relative"
              onClick={() => toggleFlip(key)}
              style={{
                perspective: '1000px',
                maxWidth: '700px',
                aspectRatio: aspectRatio.toString(),
                margin: '0 auto',
                zIndex: 2
              }}
            >
              <div
                className="relative w-full h-full transition-transform duration-500"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  zIndex: 2
                }}
              >
                {/* Front Image */}
                <div
                  className="absolute w-full h-full rounded-lg shadow-2xl overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <img
                    src={item.front_image_url}
                    alt="Card Front"
                    className="w-full h-full object-cover"
                    style={{ display: 'block' }}
                    onLoad={(e) => handleImageLoad(key, e)}
                  />
                </div>

                {/* Back Image */}
                <div
                  className="absolute w-full h-full rounded-lg shadow-2xl overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <img
                    src={item.back_image_url}
                    alt="Card Back"
                    className="w-full h-full object-cover"
                    style={{ display: 'block' }}
                    onLoad={(e) => handleImageLoad(`${key}-back`, e)}
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
