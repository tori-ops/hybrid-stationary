import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { eventSlug } = await request.json();

    if (!eventSlug) {
      return NextResponse.json(
        { error: 'Missing eventSlug' },
        { status: 400 }
      );
    }

    // Create a Supabase client with service role key for admin access (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Find invitation by event slug
    const { data: invitation, error: fetchError } = await supabase
      .from('invitations')
      .select('id')
      .eq('event_slug', eventSlug)
      .single();

    if (fetchError || !invitation) {
      console.error('Invitation fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Mark updates as acknowledged by guests
    const { error: updateError } = await supabase
      .from('invitations')
      .update({
        updates_acknowledged_by_guests: true,
      })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to acknowledge updates' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Updates acknowledged by guests',
    });
  } catch (error) {
    console.error('Error acknowledging updates:', error);
    return NextResponse.json(
      { error: 'Failed to acknowledge updates: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
