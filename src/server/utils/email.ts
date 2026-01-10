import { Resend } from "resend";

// Check for Resend API key
if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not found. Email functionality will be disabled.");
}

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

export interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

export async function sendEmail(options: SendEmailOptions) {
    if (!resend) {
        console.error("Resend not configured. Cannot send email.");
        return { success: false, error: "Email service not configured" };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: options.from || "CollegeWale <noreply@collegewale.com>",
            to: options.to,
            subject: options.subject,
            html: options.html,
        });

        if (error) {
            console.error("Resend error:", error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Email send error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

export function generateInvitationEmail(
    collegeName: string,
    invitationLink: string,
) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; }
          .button { display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>College Invitation</h1>
          </div>
          <div class="content">
            <h2>Welcome to CollegeWale!</h2>
            <p>Dear ${collegeName} Administrator,</p>
            <p>You have been invited to join CollegeWale, the comprehensive college management system.</p>
            <p>To complete your registration and set up your college account, please click the button below:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${invitationLink}" class="button">Complete Registration</a>
            </p>
            <p><strong>Note:</strong> This invitation link is valid for 7 days and can only be used once.</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} CollegeWale. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
