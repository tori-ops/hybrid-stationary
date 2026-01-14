'use client';

interface StarburstProps {
  color: string;
  size?: number;
}

export default function Starburst({ color, size = 400 }: StarburstProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    >
      {/* Large circle background */}
      <circle cx="200" cy="200" r="180" fill={color} opacity="0.15" />
      
      {/* Rays */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * (Math.PI / 180);
        const x1 = 200 + 150 * Math.cos(angle);
        const y1 = 200 + 150 * Math.sin(angle);
        const x2 = 200 + 200 * Math.cos(angle);
        const y2 = 200 + 200 * Math.sin(angle);
        
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth="2"
            opacity="0.3"
          />
        );
      })}
      
      {/* Center circle */}
      <circle cx="200" cy="200" r="80" fill={color} opacity="0.08" />
    </svg>
  );
}
