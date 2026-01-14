import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { invitationId, editComments } = await request.json();

    if (!invitationId || !editComments) {
      return NextResponse.json(
        { error: 'Missing invitationId or editComments' },
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

    // Get planner email from environment or use a default
    const plannerEmail = process.env.PLANNER_EMAIL || 'tori@missingpieceplanning.com';

    // Build public link for reference
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mp-hybrid-stationery.vercel.app';
    const publicLink = `${baseUrl}/invite?event=${invitation.event_slug}`;

    // Get couple name
    const coupleName = invitation.couple_name || 'Couple';

    // Email content
    const textContent = `A client has requested edits to their wedding details page.

Client: ${coupleName}
Event: ${invitation.event_slug}
Edit Requests Link: ${publicLink}

--- EDIT REQUESTS ---

${editComments}

--- END EDIT REQUESTS ---

Please review these requested changes and update the page accordingly. You can mark the invitation as ready for re-approval once changes are complete.`;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .client-info { 
      background-color: #f5f5f5; 
      padding: 15px; 
      border-left: 4px solid #274E13; 
      margin-bottom: 20px;
    }
    .edits-box {
      background-color: #fffbf0;
      padding: 15px;
      border: 1px solid #e0d5c7;
      border-radius: 5px;
      margin: 20px 0;
      white-space: pre-wrap;
    }
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📝 Edit Request Received</h2>
    </div>
    
    <p>A client has requested edits to their wedding details page.</p>
    
    <div class="client-info">
      <strong>Client:</strong> ${coupleName}<br>
      <strong>Event:</strong> ${invitation.event_slug}
    </div>
    
    <h3>Requested Changes:</h3>
    <div class="edits-box">${editComments.split('\n').join('<br>')}</div>
    
    <center>
      <a href="${publicLink}" class="cta-button">Review Page & Make Changes</a>
    </center>
    
    <p>Once you've made the requested updates, you can mark the invitation as ready for re-approval so the client can review the changes.</p>
    
    <div class="footer">
      <p>This is an automated message from The Missing Piece Planning platform.</p>
    </div>
  </div>
</body>
</html>`;

    // Send email to planner
    await sendEmail({
      to: plannerEmail,
      subject: `Edit Request from ${coupleName}`,
      textContent: textContent,
      htmlContent: htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: 'Edit request sent to planner successfully',
    });
  } catch (error) {
    console.error('Error sending edit request:', error);
    return NextResponse.json(
      { error: 'Failed to send edit request: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
