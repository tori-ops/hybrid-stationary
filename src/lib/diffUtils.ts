// Utility to compare invitations and generate a diff report
export interface ChangeSummary {
  textChanges: Array<{ field: string; oldValue: string; newValue: string }>;
  arrayChanges: Array<{ field: string; added: any[]; removed: any[] }>;
  toggleChanges: Array<{ field: string; oldValue: boolean; newValue: boolean }>;
}

const READABLE_FIELD_NAMES: Record<string, string> = {
  bride_name: 'Bride Name',
  groom_name: 'Groom Name',
  couple_name: 'Couple Name',
  wedding_date: 'Wedding Date',
  wedding_time: 'Wedding Time',
  ceremony_time: 'Ceremony Time',
  reception_time: 'Reception Time',
  be_out_by_time: 'Leave by Time',
  timezone: 'Timezone',
  venue_name: 'Venue Name',
  venue_address: 'Venue Address',
  venue_city: 'Venue City',
  venue_state: 'Venue State',
  venue_phone: 'Venue Phone',
  venue_website: 'Venue Website',
  rsvp_link: 'RSVP Link',
  couples_website: 'Couples Website',
  rsvp_deadline: 'RSVP Deadline',
  guest_arrival_time: 'Guest Arrival Time',
  parking_info: 'Parking Information',
  reception_venue_name: 'Reception Venue Name',
  reception_venue_address: 'Reception Venue Address',
  ceremony_indoor_outdoor: 'Ceremony Indoor/Outdoor',
  area_facts_attraction: 'Area Facts - Attractions',
  area_facts_dining: 'Area Facts - Dining',
  area_facts_activities: 'Area Facts - Activities',
  area_facts_accommodations: 'Area Facts - Accommodations',
  timeline_events: 'Day-of Itinerary',
  faq_items: 'Frequently Asked Questions',
  attractions_list: 'Attractions',
  dining_list: 'Dining Options',
  activities_list: 'Activities',
  accommodations_list: 'Accommodations',
};

export function generateInvitationDiff(oldData: any, newData: any): ChangeSummary {
  const summary: ChangeSummary = {
    textChanges: [],
    arrayChanges: [],
    toggleChanges: [],
  };

  // Text fields to compare
  const textFields = [
    'bride_name', 'groom_name', 'couple_name', 'wedding_date', 'wedding_time',
    'ceremony_time', 'reception_time', 'be_out_by_time', 'timezone',
    'venue_name', 'venue_address', 'venue_city', 'venue_state', 'venue_phone',
    'venue_website', 'rsvp_link', 'couples_website', 'rsvp_deadline',
    'guest_arrival_time', 'parking_info', 'reception_venue_name',
    'reception_venue_address', 'ceremony_indoor_outdoor',
    'area_facts_attraction', 'area_facts_dining', 'area_facts_activities',
    'area_facts_accommodations',
  ];

  for (const field of textFields) {
    const oldValue = oldData?.[field] || '';
    const newValue = newData?.[field] || '';
    if (oldValue !== newValue && newValue) {
      summary.textChanges.push({
        field: READABLE_FIELD_NAMES[field] || field,
        oldValue,
        newValue,
      });
    }
  }

  // Array fields to compare
  const arrayFields = ['timeline_events', 'faq_items', 'attractions_list', 'dining_list', 'activities_list', 'accommodations_list'];

  for (const field of arrayFields) {
    const oldArray = oldData?.[field] || [];
    const newArray = newData?.[field] || [];

    // Normalize arrays - ensure they're actual arrays
    const normalizedOld = Array.isArray(oldArray) ? oldArray : [];
    const normalizedNew = Array.isArray(newArray) ? newArray : [];

    if (JSON.stringify(normalizedOld) !== JSON.stringify(normalizedNew)) {
      // Simple diff: check for additions/removals
      const added = normalizedNew.filter((item: any) => !normalizedOld.some((oldItem: any) => JSON.stringify(oldItem) === JSON.stringify(item)));
      const removed = normalizedOld.filter((item: any) => !normalizedNew.some((newItem: any) => JSON.stringify(newItem) === JSON.stringify(item)));

      if (added.length > 0 || removed.length > 0) {
        summary.arrayChanges.push({
          field: READABLE_FIELD_NAMES[field] || field,
          added,
          removed,
        });
      }
    }
  }

  // Toggle fields (show_xxx)
  const toggleFields = [
    'show_weather', 'show_area_facts', 'show_dining', 'show_accommodations',
    'show_activities', 'show_attractions', 'show_contact_section', 'show_venue_info',
    'show_event_timeline', 'show_rsvp_deadline', 'show_guest_info', 'show_planner_info', 'show_faq',
  ];

  for (const field of toggleFields) {
    const oldValue = oldData?.[field] ?? false;
    const newValue = newData?.[field] ?? false;
    if (oldValue !== newValue) {
      summary.toggleChanges.push({
        field: READABLE_FIELD_NAMES[field] || field.replace('show_', '').replace(/_/g, ' ').toUpperCase(),
        oldValue,
        newValue,
      });
    }
  }

  return summary;
}
