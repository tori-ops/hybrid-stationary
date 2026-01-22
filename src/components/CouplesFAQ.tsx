'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface CouplesFAQProps {
  faqItems?: Array<FAQItem>;
  secondaryColor?: string;
  accentColor?: string;
}

export default function CouplesFAQ({
  faqItems = [],
  secondaryColor = '#274E13',
  accentColor = '#db2777',
}: CouplesFAQProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Filter out empty questions
  const displayItems = faqItems.filter((item) => item.question && item.question.trim());

  if (displayItems.length === 0) return null;

  return (
    <div
      className="rounded-lg shadow-lg p-8 max-w-4xl relative"
      style={{
        zIndex: 10,
        background: `linear-gradient(135deg, white, rgba(39, 78, 19, 0.05))`,
        borderLeft: `4px solid ${secondaryColor}`,
      }}
    >
      <div
        className="p-6 rounded-lg border-2"
        style={{
          background: `linear-gradient(to right, ${secondaryColor}15, ${accentColor}15)`,
          borderColor: accentColor,
        }}
      >
        <h2 className="text-base md:text-lg font-serif mb-6" style={{ color: accentColor }}>
          Couples FAQ
        </h2>

        <div className="space-y-3">
          {displayItems.map((item, index) => (
            <div key={index} className="border rounded-lg" style={{ borderColor: accentColor }}>
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm md:text-base font-semibold text-gray-900">{item.question}</p>
                <span
                  className="text-lg"
                  style={{ color: accentColor, transition: 'transform 0.3s' }}
                >
                  {expandedIndex === index ? '−' : '+'}
                </span>
              </button>

              {expandedIndex === index && (
                <div
                  className="p-4 border-t text-sm md:text-base text-gray-700"
                  style={{ borderColor: accentColor, backgroundColor: `${accentColor}05` }}
                >
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
