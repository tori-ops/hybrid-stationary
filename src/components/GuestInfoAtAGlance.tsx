'use client';

interface GuestInfoAtAGlanceProps {
  guestArrivalTime?: string;
  parkingInfo?: string;
  sameLocation: boolean;
  receptionVenueName?: string;
  receptionVenueAddress?: string;
  ceremonyIndoorOutdoor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export default function GuestInfoAtAGlance({
  guestArrivalTime,
  parkingInfo,
  sameLocation,
  receptionVenueName,
  receptionVenueAddress,
  ceremonyIndoorOutdoor,
  secondaryColor = '#274E13',
  accentColor = '#db2777',
}: GuestInfoAtAGlanceProps) {
  // Format time from HH:mm to 12-hour format
  const formatTime = (time: string): string => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  const infoItems = [
    { label: 'Arrival Time', value: guestArrivalTime ? formatTime(guestArrivalTime) : null },
    { label: 'Parking', value: parkingInfo },
    {
      label: 'Ceremony & Reception',
      value: sameLocation
        ? 'Ceremony with Reception to follow at the same location'
        : receptionVenueName
        ? `Ceremony at venue, reception at ${receptionVenueName}${receptionVenueAddress ? ', ' + receptionVenueAddress : ''}`
        : null,
    },
    {
      label: 'Ceremony',
      value: ceremonyIndoorOutdoor,
    },
  ];

  // Filter out empty values
  const displayItems = infoItems.filter((item) => item.value);

  if (displayItems.length === 0) return null;

  return (
    <div
      className="rounded-lg shadow-lg p-8 max-w-4xl"
      style={{
        background: `linear-gradient(135deg, white, rgba(39, 78, 19, 0.05))`,
        borderLeft: `4px solid ${secondaryColor}`,
      }}
    >
      <h2 className="text-xl md:text-2xl font-serif mb-6" style={{ color: accentColor }}>
        Guest Info At a Glance
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayItems.map((item, index) => (
          <div key={index} className="flex flex-col">
            <p className="text-xs font-semibold mb-1" style={{ color: '#000' }}>
              {item.label}
            </p>
            <p className="text-base text-gray-700">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
