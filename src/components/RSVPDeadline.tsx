'use client';

export default function RSVPDeadline({
  rsvpDeadline,
  accentColor = '#db2777',
  secondaryColor = '#274E13',
  onRsvpClick,
}: {
  rsvpDeadline?: string;
  accentColor?: string;
  secondaryColor?: string;
  onRsvpClick?: () => void;
}) {
  if (!rsvpDeadline) return null;

  // Parse date without timezone issues - treat as local date, not UTC
  // HTML5 date input returns YYYY-MM-DD format
  const [year, month, day] = rsvpDeadline.split('-');
  const deadlineDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  const formattedDate = deadlineDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className="rounded-lg shadow-lg p-8 max-w-4xl relative"
      style={{
        zIndex: 10,
        background: `linear-gradient(135deg, white, rgba(39, 78, 19, 0.05))`,
        borderLeft: `4px solid ${secondaryColor}`,
      }}
    >
      <button
        onClick={onRsvpClick}
        className="w-full p-6 rounded-lg border-2 text-left transition-opacity hover:opacity-90 cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${secondaryColor}15, ${accentColor}15)`,
          borderColor: accentColor,
        }}
      >
        <p className="text-sm md:text-base text-gray-700">
          Kindly RSVP no later than{' '}
          <span style={{ color: accentColor }} className="font-bold">
            {formattedDate}
          </span>
        </p>
      </button>
      <p className="text-center text-xs text-black mt-2">Please submit your response here</p>
    </div>
  );
}


