'use client';

export default function ProofWatermark() {
  return (
    <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40">
      <div
        className="opacity-20"
        style={{
          fontSize: '120px',
          fontWeight: 'bold',
          color: '#666666',
          transform: 'rotate(-45deg)',
          whiteSpace: 'nowrap',
          letterSpacing: '10px',
        }}
      >
        PROOF
      </div>
    </div>
  );
}
