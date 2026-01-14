import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email';

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

    // Build public link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mp-hybrid-stationery.vercel.app';
    const publicLink = `${baseUrl}/invite?event=${invitation.event_slug}`;

    // Get couple names for greeting (use groom/bride names or couple name)
    const coupleName = invitation.couple_name || 'there';

    // Email content
    const textContent = `Hey ${coupleName}!

Thank you for reviewing everything! We've received your approval and your page is now officially published and ready to share.

You can use the link below for distribution with your guests moving forward. This is the final, live version and no longer marked as a proof.

${publicLink}

From here:
- This version is safe to share publicly
- Any updates going forward can be requested as needed
- We'll continue managing changes on our end so everything stays polished and intentional

If you think of anything you'd like adjusted down the road, just let us know; we're happy to help. Otherwise, you're good to go!

We're excited to see this out in the world and can't wait to keep building alongside you.

Warmly,
Tori & Dean
The Missing Piece Planning
The search for your perfect day ends here.`;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .content { margin-bottom: 30px; }
    .cta-button { 
      display: inline-block; 
      background-color: #274E13; 
      color: white; 
      padding: 12px 30px; 
      text-decoration: none; 
      border-radius: 5px; 
      margin: 20px 0;
    }
    .footer { 
      border-top: 1px solid #eee; 
      padding-top: 20px; 
      margin-top: 40px; 
      font-size: 12px; 
      color: #666; 
    }
    .highlight { color: #274E13; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Your Page is Live! 🎉</h2>
    </div>
    
    <div class="content">
      <p>Hey ${coupleName}!</p>
      
      <p>Thank you for reviewing everything! We've received your approval and your page is now officially <span class="highlight">published and ready to share.</span></p>
      
      <p>You can use the link below for distribution with your guests moving forward. This is the final, live version and no longer marked as a proof.</p>
      
      <center>
        <a href="${publicLink}" class="cta-button">View Your Live Page</a>
      </center>
      
      <p><strong>From here:</strong></p>
      <ul>
        <li>This version is safe to share publicly</li>
        <li>Any updates going forward can be requested as needed</li>
        <li>We'll continue managing changes on our end so everything stays polished and intentional</li>
      </ul>
      
      <p>If you think of anything you'd like adjusted down the road, just let us know; we're happy to help. Otherwise, you're good to go!</p>
      
      <p>We're excited to see this out in the world and can't wait to keep building alongside you.</p>
      
      <p>Warmly,<br>
      <strong>Tori & Dean</strong><br>
      <em>The Missing Piece Planning</em><br>
      <em>The search for your perfect day ends here.</em></p>
    </div>
    
    <div class="footer">
      <p>This is an automated message from The Missing Piece Planning. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;

    // Send email
    await sendEmail({
      to: coupleEmail,
      subject: `Your Wedding Page is Live!`,
      textContent: textContent,
      htmlContent: htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: 'Published confirmation email sent successfully',
    });
  } catch (error) {
    console.error('Error sending published email:', error);
    return NextResponse.json(
      { error: 'Failed to send email: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
