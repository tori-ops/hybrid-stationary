import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Initialize email transporter
let transporter: any = null;

try {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPassword) {
    console.warn('Gmail credentials not configured');
    transporter = null;
  } else {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    });
  }
} catch (error) {
  console.error('Failed to initialize email transporter:', error);
  transporter = null;
}

export async function POST(request: NextRequest) {
  try {
    if (!transporter) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

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

    // Send email
    const emailContent = `Hi there!

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

    try {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: coupleEmail,
        subject: 'Your Wedding Details Are Ready for Review',
        text: emailContent,
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      throw emailError;
    }

    return NextResponse.json({
      success: true,
      message: 'Approval email sent successfully',
      approvalToken,
    });
  } catch (error) {
    console.error('Error sending approval email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send approval email';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
