import twilio from "twilio";

// Check for Twilio credentials
if (
    !process.env.TWILIO_ACCOUNT_SID ||
    !process.env.TWILIO_AUTH_TOKEN ||
    !process.env.TWILIO_PHONE_NUMBER
) {
    console.warn(
        "Twilio credentials not found. SMS functionality will be disabled.",
    );
}

const client =
    process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
        ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
        : null;

export interface SendSMSOptions {
    to: string;
    message: string;
}

export async function sendSMS(options: SendSMSOptions) {
    if (!client || !process.env.TWILIO_PHONE_NUMBER) {
        console.error("Twilio not configured. Cannot send SMS.");
        return { success: false, error: "SMS service not configured" };
    }

    try {
        const message = await client.messages.create({
            body: options.message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: options.to,
        });

        return { success: true, data: message };
    } catch (error) {
        console.error("SMS send error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

export function generateInvitationSMS(
    collegeName: string,
    invitationLink: string,
) {
    return `Welcome to CollegeWale! ${collegeName} has been invited to join our platform. Complete your registration: ${invitationLink}`;
}
