import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { approvalToken } = await request.json();

    if (!approvalToken) {
      return NextResponse.json(
        { error: 'Missing approval token' },
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

    console.log('Looking up approval token:', approvalToken.substring(0, 20) + '...');

    // Find invitation by approval token
    const { data: invitation, error: fetchError } = await supabase
      .from('invitations')
      .select('*')
      .eq('approval_token', approvalToken)
      .single();

    console.log('Fetch error:', fetchError);
    console.log('Invitation found:', !!invitation);

    if (fetchError || !invitation) {
      console.error('Token lookup failed:', fetchError?.message || 'No invitation found');
      return NextResponse.json(
        { error: 'Invalid or expired approval token' },
        { status: 404 }
      );
    }

    // Update invitation to approved/published
    const { error: updateError } = await supabase
      .from('invitations')
      .update({
        approval_status: 'published',
        is_published: true,
        approval_approved_at: new Date().toISOString(),
      })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to approve invitation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation approved and published successfully',
    });
  } catch (error) {
    console.error('Error approving invitation:', error);
    return NextResponse.json(
      { error: 'Failed to approve invitation' },
      { status: 500 }
    );
  }
}
