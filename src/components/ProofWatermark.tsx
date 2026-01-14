'use client';

export default function ProofWatermark() {
  // Fixed positions for PROOF watermarks
  const watermarkPositions = [
    { top: '15%', left: '10%' },
    { top: '35%', left: '80%' },
    { top: '55%', left: '15%' },
    { top: '75%', left: '85%' },
    { top: '45%', left: '50%' },
  ];

  return (
    <>
      {watermarkPositions.map((position, index) => (
        <div
          key={index}
          className="fixed pointer-events-none z-20"
          style={{
            top: position.top,
            left: position.left,
            transform: 'translate(-50%, -50%) rotate(-45deg)',
          }}
        >
          <div
            className="opacity-20 select-none"
            style={{
              fontSize: '120px',
              fontWeight: 'bold',
              color: '#666666',
              whiteSpace: 'nowrap',
              letterSpacing: '10px',
            }}
          >
            PROOF
          </div>
        </div>
      ))}
    </>
  );
}
