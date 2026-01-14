import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { approvalToken } = await request.json();

    if (!approvalToken) {
      return NextResponse.json(
        { error: 'Missing approval token' },
        { status: 400 }
      );
    }

    // Find invitation by approval token
    const { data: invitation, error: fetchError } = await supabase
      .from('invitations')
      .select('*')
      .eq('approval_token', approvalToken)
      .single();

    if (fetchError || !invitation) {
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
