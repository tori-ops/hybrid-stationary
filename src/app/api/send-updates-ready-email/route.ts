import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { invitationId, changeSummary } = await request.json();

    if (!invitationId || !changeSummary) {
      return NextResponse.json(
        { error: 'Missing invitationId or changeSummary' },
        { status: 400 }
      );
    }

    // Create a Supabase client with service role key for admin access
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

    // Get couple names
    const coupleName = invitation.couple_name || `${invitation.bride_name || 'Friend'}`;

    // Build email content
    const textContent = `Hey there ${coupleName}!

We've completed the updates you requested for your hybrid stationery suite. Here's what we changed:

${buildTextChangesSection(changeSummary.textChanges)}
${buildArrayChangesSection(changeSummary.arrayChanges)}
${buildToggleChangesSection(changeSummary.toggleChanges)}

You can view the updated page here: ${publicLink}

Once you've reviewed everything and everything looks good, we'll send it back to you for final approval.

Warmly,
Tori & Dean
The Missing Piece Planning`;

    // Build HTML email
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #faf9f7; }
    .header { text-align: center; margin-bottom: 30px; }
    .content { margin-bottom: 30px; }
    .change-section { margin: 20px 0; padding: 15px; background-color: #f0f0f0; border-left: 4px solid #274E13; border-radius: 4px; }
    .change-title { font-weight: bold; color: #274E13; font-size: 16px; margin-bottom: 10px; }
    .change-item { margin: 8px 0; padding: 8px; background-color: white; border-radius: 3px; }
    .old-value { color: #999; text-decoration: line-through; font-size: 14px; }
    .new-value { color: #16a34a; font-weight: bold; }
    .added { color: #16a34a; }
    .removed { color: #dc2626; }
    .toggle-changed { color: #3b82f6; }
    .cta-button { 
      display: inline-block; 
      background-color: #274E13; 
      color: #D0CEB5 !important; 
      padding: 12px 30px; 
      text-decoration: none; 
      border-radius: 5px; 
      margin: 20px 0;
      font-weight: bold;
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
    <div class="content">
      <p>Hey there ${coupleName}!</p>
      
      <p>We've completed the updates you requested for your hybrid stationery suite. Here's what we changed:</p>
      
      ${buildHtmlChangesSection(changeSummary)}
      
      <center>
        <a href="${publicLink}" class="cta-button">View Your Updated Page</a>
      </center>
      
      <p>Once you've reviewed everything and it looks good, we'll send it back to you for final approval.</p>
      
      <p>Warmly,<br>
      Tori & Dean<br>
      The Missing Piece Planning</p>
    </div>
    
    <div class="footer">
      <p>This is an automated message from The Missing Piece Planning. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;

    // Send email using the sendEmail utility
    const { sendEmail } = await import('@/lib/email');
    
    await sendEmail({
      to: coupleEmail,
      subject: 'Your updates are ready to review!',
      textContent,
      htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: 'Updates ready email sent successfully',
    });
  } catch (error) {
    console.error('Error sending updates ready email:', error);
    return NextResponse.json(
      { error: 'Failed to send email: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

function buildTextChangesSection(textChanges: any[]): string {
  if (textChanges.length === 0) return '';
  let text = 'Text Updates:\n';
  for (const change of textChanges) {
    text += `• ${change.field}: "${change.oldValue}" → "${change.newValue}"\n`;
  }
  return text + '\n';
}

function buildArrayChangesSection(arrayChanges: any[]): string {
  if (arrayChanges.length === 0) return '';
  let text = 'Item Updates:\n';
  for (const change of arrayChanges) {
    text += `• ${change.field}:\n`;
    if (change.added.length > 0) {
      text += `  Added: ${change.added.map((item: any) => 
        typeof item === 'string' ? item : JSON.stringify(item)
      ).join(', ')}\n`;
    }
    if (change.removed.length > 0) {
      text += `  Removed: ${change.removed.map((item: any) => 
        typeof item === 'string' ? item : JSON.stringify(item)
      ).join(', ')}\n`;
    }
  }
  return text + '\n';
}

function buildToggleChangesSection(toggleChanges: any[]): string {
  if (toggleChanges.length === 0) return '';
  let text = 'Visibility Changes:\n';
  for (const change of toggleChanges) {
    text += `• ${change.field}: ${change.oldValue ? 'Hidden' : 'Shown'} → ${change.newValue ? 'Shown' : 'Hidden'}\n`;
  }
  return text + '\n';
}

function buildHtmlChangesSection(changeSummary: any): string {
  let html = '';

  // Text changes
  if (changeSummary.textChanges.length > 0) {
    html += '<div class="change-section">';
    html += '<div class="change-title">📝 Text Updates</div>';
    for (const change of changeSummary.textChanges) {
      html += `<div class="change-item">
        <strong>${change.field}:</strong><br>
        <span class="old-value">Was: "${change.oldValue}"</span><br>
        <span class="new-value">Now: "${change.newValue}"</span>
      </div>`;
    }
    html += '</div>';
  }

  // Array changes
  if (changeSummary.arrayChanges.length > 0) {
    html += '<div class="change-section">';
    html += '<div class="change-title">✨ Item Updates</div>';
    for (const change of changeSummary.arrayChanges) {
      html += `<div class="change-item"><strong>${change.field}</strong>`;
      if (change.added.length > 0) {
        html += `<div class="added">+ Added ${change.added.length} item${change.added.length > 1 ? 's' : ''}</div>`;
      }
      if (change.removed.length > 0) {
        html += `<div class="removed">- Removed ${change.removed.length} item${change.removed.length > 1 ? 's' : ''}</div>`;
      }
      html += '</div>';
    }
    html += '</div>';
  }

  // Toggle changes
  if (changeSummary.toggleChanges.length > 0) {
    html += '<div class="change-section">';
    html += '<div class="change-title">👁️ Visibility Changes</div>';
    for (const change of changeSummary.toggleChanges) {
      html += `<div class="change-item toggle-changed">
        <strong>${change.field}:</strong> ${change.oldValue ? 'Was Hidden' : 'Was Shown'} → ${change.newValue ? 'Now Shown' : 'Now Hidden'}
      </div>`;
    }
    html += '</div>';
  }

  return html;
}
