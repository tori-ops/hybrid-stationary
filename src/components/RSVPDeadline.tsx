'use client';

export default function RSVPDeadline({ rsvpDeadline, accentColor = '#db2777', secondaryColor = '#274E13' }: { rsvpDeadline?: string; accentColor?: string; secondaryColor?: string }) {
  if (!rsvpDeadline) return null;

  // Format the date for display
  const deadlineDate = new Date(rsvpDeadline);
  const formattedDate = deadlineDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl relative" style={{ zIndex: 10 }}>
      <div className="p-6 rounded-lg border-2" style={{
        background: `linear-gradient(to right, ${secondaryColor}15, ${accentColor}15)`,
        borderColor: accentColor
      }}>
        <p className="text-sm md:text-base text-gray-700">
          Kindly RSVP no later than <span style={{ color: accentColor }} className="font-bold">{formattedDate}</span>
        </p>
      </div>
    </div>
  );
}
