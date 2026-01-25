import { Invitation } from '@/lib/supabase';
import { weddingConfig } from '@/config/weddingConfig';

/**
 * Convert Supabase Invitation record to weddingConfig format
 * Falls back to hardcoded config if any data is missing
 */
export function invitationToConfig(invitation: Invitation | null) {
  // If no invitation found, use default config
  if (!invitation) {
    return weddingConfig;
  }

  return {
    couple: {
      name: `${invitation.bride_name || ''} & ${invitation.groom_name || ''}`,
      brideName: invitation.bride_name || weddingConfig.couple.brideName,
      groomName: invitation.groom_name || weddingConfig.couple.groomName,
      date: invitation.wedding_date || weddingConfig.couple.date,
      time: invitation.wedding_time || weddingConfig.couple.time,
      timezone: invitation.timezone || weddingConfig.couple.timezone,
    },
    venue: {
      name: invitation.venue_name || weddingConfig.venue.name,
      address: invitation.venue_address || weddingConfig.venue.address,
      city: invitation.venue_city || weddingConfig.venue.city,
      state: invitation.venue_state || '',
      phone: invitation.venue_phone || weddingConfig.venue.phone,
      website: invitation.venue_website || weddingConfig.venue.website,
      latitude: invitation.venue_latitude || 0,
      longitude: invitation.venue_longitude || 0,
    },
    areaFacts: invitation.area_facts || [
      {
        title: 'Local Attraction',
        description: invitation.area_facts_attraction || weddingConfig.areaFacts[0]?.description,
      },
      {
        title: 'Dining Scene',
        description: invitation.area_facts_dining || weddingConfig.areaFacts[1]?.description,
      },
      {
        title: 'Local Shopping',
        description: invitation.area_facts_activities || weddingConfig.areaFacts[2]?.description,
      },
      {
        title: 'Overnight Stays',
        description: invitation.area_facts_accommodations || weddingConfig.areaFacts[3]?.description,
      },
    ],
    attractionsList: invitation.attractions_list || [],
    diningList: invitation.dining_list || [],
    activitiesList: invitation.activities_list || [],
    accommodationsList: invitation.accommodations_list || [],
    contacts: {
      planner: {
        name: invitation.planner_name || weddingConfig.contacts.planner.name,
        email: invitation.planner_email || weddingConfig.contacts.planner.email,
        phone: invitation.planner_phone || weddingConfig.contacts.planner.phone,
      },
      couple: {
        name: invitation.couple_contact_name || weddingConfig.contacts.couple.name,
        email: invitation.couple_contact_email || weddingConfig.contacts.couple.email,
        phone: invitation.couple_contact_phone || weddingConfig.contacts.couple.phone,
      },
    },
    weatherLocation: {
      latitude: invitation.venue_latitude || weddingConfig.weatherLocation.latitude,
      longitude: invitation.venue_longitude || weddingConfig.weatherLocation.longitude,
      city: invitation.venue_city || weddingConfig.weatherLocation.city,
      state: invitation.venue_state || weddingConfig.weatherLocation.state,
    },
    inviteText: invitation.invite_text || weddingConfig.inviteText,
    
    // Branding
    colors: {
      primary: invitation.primary_color || '#ec4899',
      secondary: invitation.secondary_color || '#3b82f6',
      accent: invitation.accent_color || '#db2777',
    },
    fonts: {
      family: invitation.font_family || 'serif',
    },
    images: {
      logo: invitation.logo_url,
      background: invitation.background_image_url,
      front: invitation.invitation_front_image_url,
      back: invitation.invitation_back_image_url,
    },
    
    // Section visibility
    sections: {
      weather: invitation.show_weather,
      areaFacts: invitation.show_area_facts,
      dining: invitation.show_dining,
      accommodations: invitation.show_accommodations,
      activities: invitation.show_activities,
      attractions: invitation.show_attractions,
      contactSection: invitation.show_contact_section,
      venueInfo: invitation.show_venue_info,
    },
    
    // External links
    rsvpLink: invitation.rsvp_link,
  };
}
