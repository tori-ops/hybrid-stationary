import { sendEmail, sendTestEmail } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

interface SendEmailRequest {
  to: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  isTest?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body: SendEmailRequest = await req.json();

    // Validate required fields
    if (!body.to || !body.subject) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: to, subject' },
        { status: 400 }
      );
    }

    // Check if test email
    if (body.isTest) {
      const result = await sendTestEmail(body.to);
      return NextResponse.json(result);
    }

    // Validate HTML and text content
    if (!body.htmlContent || !body.textContent) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: htmlContent, textContent' },
        { status: 400 }
      );
    }

    // Send email
    const result = await sendEmail({
      to: body.to,
      subject: body.subject,
      htmlContent: body.htmlContent,
      textContent: body.textContent,
    });

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
