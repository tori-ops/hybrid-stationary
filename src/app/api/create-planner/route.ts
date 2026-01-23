import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Only create supabase client if we have the service key
const supabase = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Generate random password
function generatePassword(): string {
  const length = 12;
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export async function POST(request: Request) {
  try {
    if (!supabase) {
      return Response.json(
        { error: 'Server not properly configured. Missing SUPABASE_SERVICE_ROLE_KEY' },
        { status: 500 }
      );
    }

    const { firstName, lastName, businessName, address, email, logoUrl, createdBy } = await request.json();

    // Verify that the request is from Tori (admin user)
    let isAuthorized = false;
    let errorDetails = '';

    try {
      const { data: requesterData, error: requesterError } = await supabase
        .from('planners')
        .select('id, email, is_admin')
        .eq('id', createdBy)
        .single();

      if (requesterError) {
        errorDetails = `Requester lookup failed: ${requesterError.message}`;
      } else if (requesterData) {
        // Check if is_admin is true OR if email is tori@missingpieceplanning.com
        if (requesterData.is_admin === true || requesterData.email === 'tori@missingpieceplanning.com') {
          isAuthorized = true;
        } else {
          errorDetails = `User ${requesterData.email} is not an admin (is_admin: ${requesterData.is_admin})`;
        }
      } else {
        errorDetails = 'Requester not found in planners table';
      }
    } catch (err: any) {
      errorDetails = `Error checking admin: ${err.message}`;
    }

    if (!isAuthorized) {
      console.error('Unauthorized planner creation attempt:', { createdBy, errorDetails });
      return Response.json(
        { error: `Unauthorized: Only admin can create planner profiles. ${errorDetails}` },
        { status: 403 }
      );
    }

    // Generate password
    const tempPassword = generatePassword();

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: false,
    });

    if (authError) {
      return Response.json(
        { error: `Failed to create auth user: ${authError.message}` },
        { status: 400 }
      );
    }

    const userId = authData.user?.id;
    if (!userId) {
      return Response.json(
        { error: 'Failed to get user ID' },
        { status: 400 }
      );
    }

    // Create planner record
    const { error: plannerError } = await supabase
      .from('planners')
      .insert([
        {
          id: userId,
          email,
          first_name: firstName,
          last_name: lastName,
          business_name: businessName,
          address,
          logo_url: logoUrl,
          is_admin: false,
          created_by: createdBy,
          created_at: new Date().toISOString(),
        },
      ]);

    if (plannerError) {
      return Response.json(
        { error: `Failed to create planner record: ${plannerError.message}` },
        { status: 400 }
      );
    }

    // Send welcome email with password
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #274E13; color: white; padding: 20px; border-radius: 5px; }
            .content { margin: 20px 0; }
            .footer { border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666; }
            .credentials { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Digital Invitation & Guest Info Suite!</h1>
            </div>
            
            <div class="content">
              <p>Hi ${firstName} ${lastName},</p>
              
              <p>Your planner profile has been created by The Missing Piece Planning and Events. You now have access to create and manage beautiful digital wedding invitations.</p>
              
              <h3>Your Login Credentials:</h3>
              <div class="credentials">
                <strong>Email:</strong> ${email}<br />
                <strong>Temporary Password:</strong> ${tempPassword}
              </div>
              
              <p><strong>Next Steps:</strong></p>
              <ol>
                <li>Visit: <a href="https://mp-hybrid-stationary.vercel.app/">https://mp-hybrid-stationary.vercel.app/</a></li>
                <li>Log in with the credentials above</li>
                <li>We recommend changing your password immediately after logging in</li>
                <li>Start creating beautiful invitations!</li>
              </ol>
              
              <p>If you have any questions, contact The Missing Piece Planning and Events.</p>
            </div>
            
            <div class="footer">
              <p>© 2026 The Missing Piece Planning and Events, LLC. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email via your email service
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: 'Your Digital Invitation Platform Account Created',
        html: emailHtml,
      }),
    });

    return Response.json({
      success: true,
      message: 'Planner profile created and welcome email sent',
      userId,
    });
  } catch (error) {
    console.error('Error creating planner:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
