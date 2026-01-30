import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mp-hybrid-stationery.vercel.app';
    const approvalLink = `${baseUrl}/invite?event=${invitation.event_slug}&proof=${approvalToken}`;

    // Get couple name
    const coupleName = invitation.bride_name && invitation.groom_name 
      ? `${invitation.bride_name} & ${invitation.groom_name}`
      : 'there';

    // Email content
    const textContent = `Hey there ${coupleName}!

We've finished setting up the next portion of your wedding stationery, and it's ready for your eyes. 💚

Before anything goes live, we always pause here and invite you in. This version is a proof-only preview, created just for you to review, tweak, and make sure everything feels right.

Here's how to review your stationery:
1. Click "Review Your Stationery" below
2. Take a look at the page that opens and read through everything - check details, wording, and overall vibe
3. If you'd like to make changes, click "Edit & Update"
4. You can type directly into the fields or copy/paste notes
5. Add, remove, or adjust anything you'd like
6. When you're done, click "Send Edits"

A few things to know as you review:
• This version is clearly marked PROOF and is not public
• Nothing is published or shared without your approval
• This step helps ensure everything is intentional, accurate, and aligned with your vision

Once we receive your edits, we'll make the updates and within 2–3 days you'll receive another email asking you to approve your stationery. 💚

If everything looks perfect, you'll simply click Approve & Publish
Once approved, you'll receive a link to your finalized stationery suite, ready to share with your loved ones and esteemed guests 💚

${approvalLink}

We're so excited to keep things moving forward with you and truly appreciate you taking a moment to review. As always, if questions pop up along the way, just let us know — we're here. 🧩✨

Warmly,
Tori & Dean
The Missing Piece Planning`;

    const headerImageUrl = `${baseUrl}/suite-header.png`;
    const backgroundImageUrl = `${baseUrl}/suite-bg.png`;
    const toriSignatureUrl = `${baseUrl}/Tori-Walker.png`;
    const deanSignatureUrl = `${baseUrl}/Dean-Walker.png`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      font-size: 14px;
      line-height: 1.6; 
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #faf9f7;
      padding: 0;
    }
    .header-image {
      width: 100%;
      max-width: 100%;
      height: auto;
      display: block;
    }
    .content { 
      padding: 40px 30px;
      font-size: 14px;
    }
    p {
      margin: 15px 0;
      font-size: 14px;
    }
    ol {
      margin: 15px 0;
      padding-left: 25px;
    }
    ol li {
      margin: 8px 0;
      font-size: 14px;
    }
    ul {
      margin: 15px 0;
      padding-left: 25px;
    }
    ul li {
      margin: 8px 0;
      font-size: 14px;
    }
    .link-button { 
      display: inline-block; 
      background-color: #274E13; 
      color: #D0CEB5 !important;
      padding: 14px 40px; 
      text-decoration: none; 
      border-radius: 4px; 
      margin: 25px 0;
      font-weight: 600;
      text-align: center;
      font-size: 14px;
    }
    .link-button:hover {
      background-color: #1a3009;
      color: #D0CEB5 !important;
    }
    .signatures {
      text-align: left;
      margin-top: 30px;
      padding-top: 20px;
    }
    .signature-image {
      width: 180px;
      height: auto;
      display: inline-block;
      margin-right: 50px;
      margin-bottom: 20px;
    }
    .signature-image:last-child {
      margin-right: 0;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 20px 30px;
      font-size: 14px;
      color: #666;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="${headerImageUrl}" alt="Suite Header" class="header-image">
    
    <div class="content">
<p>Hey there ${coupleName}!</p>
      
      <p>We've finished setting up the next portion of your wedding stationery and it's ready for your review. 💚</p>
      
      <p>Before anything goes live, we always pause here and invite you in. This is a proof-only preview, created just for you to review, refine, and make sure everything feels exactly right.</p>

      <p><strong>✨ How to review your stationery: ✨</strong></p>
      <ol>
        <li>Click Review Your Stationery below</li>
        <li>Read through the page carefully — details, wording, and overall vibe</li>
        <li>If you'd like changes, click Edit & Update</li>
        <li>Type directly into the fields or paste in notes</li>
        <li>Add, remove, or adjust anything you'd like</li>
        <li>When you're finished, click Send Edits</li>
      </ol>

      <p style="text-align: center;">
        <a href="${approvalLink}" class="link-button">Review Your Stationery</a>
      </p>

      <p><strong>A few things to know:</strong></p>
      <ul>
        <li>This version is clearly marked PROOF and is not public</li>
        <li>Nothing is published or shared without your approval</li>
        <li>This step ensures everything is intentional, accurate, and aligned with your vision</li>
      </ul>

      <p>Once we receive your edits, we'll make the updates and, within 2–3 days, you'll receive another email inviting you to approve your stationery. 💚</p>

      <p>
        <span style="display: block; margin: 10px 0;">👉  If everything looks perfect, you'll simply click Approve & Publish</span>
        <span style="display: block; margin: 10px 0;">👉  Once approved, you'll receive a link to your finalized stationery suite, ready to share with your loved ones and guests</span>
      </p>

      <p>We're so excited to keep things moving forward with you and truly appreciate you taking the time to review. As always, if questions pop up along the way, just let us know- we're here. 🧩✨</p>

      <div class="signatures">
        <img src="${toriSignatureUrl}" alt="Tori Walker Signature" class="signature-image">
        <img src="${deanSignatureUrl}" alt="Dean Walker Signature" class="signature-image">
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0; line-height: 1.4;">
        The Missing Piece Planning and Events, LLC<br>
        The search for your perfect day ends here.
      </p>
    </div>
  </div>
</body>
</html>`;

    // Send email using the email library
    const result = await sendEmail({
      to: coupleEmail,
      subject: 'Your Hybrid Stationery and Guest Suite is available for review',
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
