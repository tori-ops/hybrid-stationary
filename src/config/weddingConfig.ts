// Wedding Configuration - Update with actual details
export const weddingConfig = {
  couple: {
    name: "Bride & Groom Names",
    brideName: "Bride Name",
    groomName: "Groom Name",
    date: "June 15, 2024",
    time: "4:00 PM",
    timezone: "EST",
  },
  venue: {
    name: "Venue Name",
    address: "123 Wedding Lane",
    city: "City, State",
    phone: "123-456-7890",
    website: "https://venuename.com",
  },
  areaFacts: [
    {
      title: "Local Attractions",
      description: "Popular spots to explore in the area",
    },
    {
      title: "Dining Scene",
      description: "Favorite restaurants worth checking out",
    },
    {
      title: "Local Shopping",
      description: "Unique shops and local retailers nearby",
    },
    {
      title: "Accommodations",
      description: "Great places to stay during your visit",
    },
  ],
  contacts: {
    planner: {
      name: "Tori - Wedding Planner",
      email: "tori@missingpieceplanning.com",
      phone: "269-213-5290",
    },
    couple: {
      name: "Bride & Groom",
      email: "couple@email.com",
      phone: "555-555-5555",
    },
  },
  // For weather widget
  weatherLocation: {
    latitude: 40.7128, // NYC example, change to venue location
    longitude: -74.006,
    city: "New York",
    state: "NY",
  },
  // Invite front & back card text
  inviteText: {
    front: {
      title: "Together with their parents",
      subtitle: "request the honour of your presence",
      couple: "Bride Name and Groom Name",
      event: "at the marriage of",
    },
    back: {
      rsvpInstructions: "Please respond by [DATE]",
      rsvpEmail: "couple@email.com",
      additionalInfo: "Dinner and dancing to follow",
      registry: "Gifts are gratefully declined. Your presence is the present.",
    },
  },
};
