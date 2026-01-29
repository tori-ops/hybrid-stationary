import { NextRequest, NextResponse } from  ' next/server ' ;
import { createClient } from  ' @supabase/supabase-js ' ;
import { sendEmail } from  ' @/lib/email ' ;

export async function POST(request: NextRequest) {
  try {
    const { invitationId } = await request.json();

    if (!invitationId) {
      return NextResponse.json(
        { error:  ' Missing invitationId '  },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ||  '  ' ,
      process.env.SUPABASE_SERVICE_ROLE_KEY ||  '  ' ,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: invitation, error: fetchError } = await supabase
      .from( ' invitations ' )
      .select( ' * ' )
      .eq( ' id ' , invitationId)
      .single();

    if (fetchError || !invitation) {
      console.error( ' Invitation fetch error: ' , fetchError);
      return NextResponse.json(
        { error:  ' Invitation not found '  },
        { status: 404 }
      );
    }

    const coupleEmail = invitation.couple_contact_email;
    if (!coupleEmail) {
      return NextResponse.json(
        { error:  ' Couple email not configured '  },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||  ' https://mp-hybrid-stationery.vercel.app ' ;
    const publicLink = ${baseUrl}/invite?event=;
    const coupleName = invitation.couple_name ||  ' there ' ;
    const liveHeaderUrl = ${baseUrl}/live-suite-header.png;
    const toriSignatureUrl = ${baseUrl}/Tori-Walker.png;
    const deanSignatureUrl = ${baseUrl}/Dean-Walker.png;

    const textContent = We ' re so glad you loved it- thank you for taking the time to review everything. We ' ve received your approval, and your stationery is now officially published and live. ?

You can use the link below to share with your guests moving forward. This is the final version and is no longer marked as a proof.



Here ' s what that means from here:

-This version is fully live and safe to share publicly

-You ' re all set to distribute it to your loved ones and guests

-If anything needs adjusting down the road, just let us know- we ' ll take care of it on our end so everything stays polished and intentional. We can edit these at any time.

No action needed right now unless inspiration strikes later. Otherwise, you ' re good to go.

We ' re so excited to see this out in the world and can ' t wait to keep building alongside you. ????

As always, we ' re here if you need anything.

Tori & Dean
The Missing Piece Planning and Events, LLC;

    const htmlContent = <!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family:  ' Segoe UI ' , Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #faf9f7; }
    .header { text-align: center; margin-bottom: 30px; }
    .header img { max-width: 100%; height: auto; }
    .content { margin-bottom: 30px; font-size: 14px; }
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
    .signatures { text-align: center; margin: 30px 0; }
    .signatures img { max-width: 180px; margin: 0 10px; }
    .footer {
      border-top: 1px solid #ddd;
      padding-top: 20px;
      margin-top: 40px;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="" alt="Live Suite Header" />
    </div>

    <div class="content">
      <p>We ' re so glad you loved it- thank you for taking the time to review everything. We ' ve received your approval, and your stationery is now officially published and live. ?</p>

      <p>You can use the link below to share with your guests moving forward. This is the final version and is no longer marked as a proof.</p>

      <center>
        <a href="" class="cta-button">View Your Live Page</a>
      </center>

      <p><strong>Here ' s what that means from here:</strong></p>
      <ul>
        <li>This version is fully live and safe to share publicly</li>
        <li>You ' re all set to distribute it to your loved ones and guests</li>
        <li>If anything needs adjusting down the road, just let us know- we ' ll take care of it on our end so everything stays polished and intentional. We can edit these at any time.</li>
      </ul>

      <p>No action needed right now unless inspiration strikes later. Otherwise, you ' re good to go.</p>

      <p>We ' re so excited to see this out in the world and can ' t wait to keep building alongside you. ????</p>

      <p>As always, we ' re here if you need anything.</p>
    </div>

    <div class="signatures">
      <img src="" alt="Tori Walker" />
      <img src="" alt="Dean Walker" />
    </div>

    <div class="footer">
      <p style="margin: 0; line-height: 1.4;">
        The Missing Piece Planning and Events, LLC<br>
        The search for your perfect day ends here.
      </p>
    </div>
  </div>
</body>
</html>;

    await sendEmail({
      to: coupleEmail,
      subject:  ' Your hybrid stationery and guest suite is live! ' ,
      textContent: textContent,
      htmlContent: htmlContent,
    });

    return NextResponse.json({
      success: true,
      message:  ' Published confirmation email sent successfully ' ,
    });
  } catch (error) {
    console.error( ' Error sending published email: ' , error);
    return NextResponse.json(
      { error:  ' Failed to send email:  '  + (error instanceof Error ? error.message :  ' Unknown error ' ) },
      { status: 500 }
    );
  }
}
