import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for database
export interface Invitation {
  id: string;
  planner_id: string;
  event_slug: string;
  bride_name: string | null;
  groom_name: string | null;
  wedding_date: string | null;
  wedding_time: string | null;
  ceremony_time: string | null;
  reception_time: string | null;
  be_out_by_time: string | null;
  timezone: string | null;
  venue_name: string | null;
  venue_address: string | null;
  venue_city: string | null;
  venue_state: string | null;
  venue_phone: string | null;
  venue_website: string | null;
  venue_latitude: number | null;
  venue_longitude: number | null;
  planner_name: string | null;
  planner_email: string | null;
  planner_phone: string | null;
  couple_contact_name: string | null;
  couple_contact_email: string | null;
  couple_contact_phone: string | null;
  rsvp_link: string | null;
  rsvp_deadline: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  font_family: string | null;
  logo_url: string | null;
  background_image_url: string | null;
  timeline_image_url: string | null;
  timeline_events: any[] | null;
  invitation_front_image_url: string | null;
  invitation_back_image_url: string | null;
  area_facts: any[] | null;
  area_facts_attraction: string | null;
  area_facts_dining: string | null;
  area_facts_activities: string | null;
  area_facts_accommodations: string | null;
  attractions_list: any[] | null;
  dining_list: any[] | null;
  activities_list: any[] | null;
  accommodations_list: any[] | null;
  invite_text: any | null;
  stationery_items: any[] | null;
  show_weather: boolean;
  show_area_facts: boolean;
  show_dining: boolean;
  show_accommodations: boolean;
  show_activities: boolean;
  show_attractions: boolean;
  show_contact_section: boolean;
  show_venue_info: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Fetch invitation by event slug
export async function getInvitationBySlug(slug: string): Promise<Invitation | null> {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('event_slug', slug)
      .single();

    if (error) {
      console.error('Error fetching invitation:', error);
      return null;
    }

    return data as Invitation;
  } catch (error) {
    console.error('Unexpected error fetching invitation:', error);
    return null;
  }
}

// Get invitation assets (images)
export async function getInvitationAssets(invitationId: string) {
  try {
    const { data, error } = await supabase
      .from('invitation_assets')
      .select('*')
      .eq('invitation_id', invitationId);

    if (error) {
      console.error('Error fetching assets:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching assets:', error);
    return [];
  }
}
