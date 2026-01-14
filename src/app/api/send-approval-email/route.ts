import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { invitationId } = await request.json();

    if (!invitationId) {
      return NextResponse.json(
        { error: 'Missing invitationId' },
        { status: 400 }
      );
    }

    // Fetch invitation
    const { data: invitation, error: fetchError } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', invitationId)
      .single();

    if (fetchError || !invitation) {
      console.error('Invitation fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    const coupleEmail = invitation.couple_contact_email;
    if (!coupleEmail) {
      return NextResponse.json(
        { error: 'Couple email not configured' },
        { status: 400 }
      );
    }

    // Generate unique approval token
    const approvalToken = crypto.randomBytes(32).toString('hex');

    // Update invitation with token and status
    const { error: updateError } = await supabase
      .from('invitations')
      .update({
        approval_token: approvalToken,
        approval_status: 'sent_for_approval',
        approval_requested_at: new Date().toISOString(),
      })
      .eq('id', invitationId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update invitation' },
        { status: 500 }
      );
    }

    // Build approval link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mp-hybrid-stationary.vercel.app';
    const approvalLink = `${baseUrl}/invite/${invitation.event_slug}?proof=${approvalToken}`;

    // Email content
    const textContent = `Hi there!

We've finished setting up the next portion of your wedding details and it's ready for your review.

Before anything goes live, we want your eyes on it. This preview is a proof-only version, giving you the chance to read through what's been entered, confirm accuracy, and make sure everything feels like you.

A few important notes as you review:

• This version is clearly marked PROOF and will not be published or shared publicly yet
• Nothing moves forward without your approval
• This step ensures everything is intentional, accurate, and aligned with your vision

Please take a moment to review the page using the link below. If you have edits, questions, or approvals to share, you can reply directly or let us know through your planning workspace.

${approvalLink}

Once you give the green light, we'll take care of the rest and move it into its final, published form.

We're excited to keep things moving forward with you! Thank you for taking a moment to review!

Warmly,
Tori & Dean
The Missing Piece Planning
The search for your perfect day ends here.`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px; }
    .header { background: linear-gradient(135deg, #274E13 0%, #1a3009 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 5px; }
    .content { padding: 20px 0; }
    .link-button { display: inline-block; background-color: #274E13; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Your Wedding Details Are Ready!</h1>
      <p style="margin: 10px 0 0 0;">Proof Review</p>
    </div>
    <div class="content">
      <p>Hi there!</p>
      <p>We've finished setting up the next portion of your wedding details and it's ready for your review.</p>
      <p>Before anything goes live, we want your eyes on it. This preview is a proof-only version, giving you the chance to read through what's been entered, confirm accuracy, and make sure everything feels like you.</p>
      
      <h3 style="color: #274E13;">A few important notes as you review:</h3>
      <ul>
        <li>This version is clearly marked <strong>PROOF</strong> and will not be published or shared publicly yet</li>
        <li>Nothing moves forward without your approval</li>
        <li>This step ensures everything is intentional, accurate, and aligned with your vision</li>
      </ul>

      <p>Please take a moment to review the page using the button below. If you have edits, questions, or approvals to share, you can reply directly or let us know through your planning workspace.</p>

      <p style="text-align: center;">
        <a href="${approvalLink}" class="link-button">Review Your Invitation</a>
      </p>

      <p>Once you give the green light, we'll take care of the rest and move it into its final, published form.</p>
      <p>We're excited to keep things moving forward with you! Thank you for taking a moment to review!</p>

      <div class="footer">
        <p style="margin: 0;">Warmly,<br>
        Tori & Dean<br>
        The Missing Piece Planning<br>
        The search for your perfect day ends here.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    // Send email using the email library
    const result = await sendEmail({
      to: coupleEmail,
      subject: 'Your Wedding Details Are Ready for Review',
      textContent,
      htmlContent,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Approval email sent successfully',
        approvalToken,
      });
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending approval email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send approval email';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
