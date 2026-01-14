'use client';

import { useState, useEffect, useRef } from 'react';

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
  const [cardSizes, setCardSizes] = useState<{ [key: string]: { width: number; height: number } }>({});
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  if (!items || items.length === 0) {
    return null;
  }

  useEffect(() => {
    const resizeObservers = new Map<string, ResizeObserver>();

    items.forEach((item, idx) => {
      const key = `${item.type}-${idx}`;
      const element = cardRefs.current[key];
      
      if (element) {
        const observer = new ResizeObserver(() => {
          const rect = element.getBoundingClientRect();
          setCardSizes((prev) => ({
            ...prev,
            [key]: { width: rect.width, height: rect.height }
          }));
        });

        observer.observe(element);
        resizeObservers.set(key, observer);
      }
    });

    return () => {
      resizeObservers.forEach((observer) => observer.disconnect());
    };
  }, [items]);

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
          // Calculate background size based on card dimensions
          const cardSize = cardSizes[key];
          // Responsive background size: 800px on desktop, 650px on mobile
          const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768;
          const backgroundSize = isSmallScreen ? 650 : 800;

          return (
            <div key={key} className="flex flex-col items-center justify-center relative">              
            {/* Background Image Container - presents the stationery */}
            {backgroundImage && (
              <div
                className="absolute pointer-events-none"
                style={{
                  zIndex: 1,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: `${backgroundSize}px`,
                  height: `${backgroundSize}px`,
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
              ref={(el) => {
                if (el) cardRefs.current[key] = el;
              }}
              className="w-full cursor-pointer perspective relative"
              onClick={() => toggleFlip(key)}
              style={{
                perspective: '1000px',
                maxWidth: '400px',
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

          </div>
        );
      })}
    </div>
  );
}



