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
      title: "Local Attraction",
      description: "Beautiful scenic overlook with hiking trails",
    },
    {
      title: "Dining Scene",
      description: "Award-winning restaurants and farm-to-table options",
    },
    {
      title: "Activities",
      description: "Wine tastings, kayaking, and historic sites",
    },
    {
      title: "Accommodations",
      description: "Boutique hotels and charming bed & breakfasts",
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
