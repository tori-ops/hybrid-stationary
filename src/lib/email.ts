import nodemailer from 'nodemailer';

// Create a transporter for Gmail
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
  textContent: string;
}

export async function sendEmail({
  to,
  subject,
  htmlContent,
  textContent,
}: EmailOptions): Promise<{ success: boolean; message: string }> {
  try {
    // Verify connection
    await transporter.verify();

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    return {
      success: true,
      message: `Email sent successfully. Message ID: ${info.messageId}`,
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

export async function sendTestEmail(recipientEmail: string): Promise<{ success: boolean; message: string }> {
  const testHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px; }
        .header { background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 5px; }
        .content { padding: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Test Email</h1>
          <p style="margin: 10px 0 0 0;">Hybrid Stationary Wedding Invitation System</p>
        </div>
        <div class="content">
          <p>Hello!</p>
          <p>This is a test email to confirm that your email configuration is working correctly.</p>
          <p>If you received this, your Gmail credentials are properly configured in Vercel.</p>
          <p style="margin-top: 30px; color: #666;">
            Best regards,<br>
            Missing Piece Planning
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const testText = `
    Test Email
    Hybrid Stationary Wedding Invitation System

    Hello!

    This is a test email to confirm that your email configuration is working correctly.

    If you received this, your Gmail credentials are properly configured in Vercel.

    Best regards,
    Missing Piece Planning
  `;

  return sendEmail({
    to: recipientEmail,
    subject: 'Test Email - Hybrid Stationary System',
    htmlContent: testHtml,
    textContent: testText,
  });
}
