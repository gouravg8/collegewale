import crypto from "crypto";
import Razorpay from "razorpay";

// Check for Razorpay credentials
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn(
        "Razorpay credentials not found. Payment functionality will be disabled.",
    );
}

const razorpay =
    process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
        ? new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        })
        : null;

export interface CreateOrderOptions {
    amount: number; // in paise
    currency?: string;
    receipt?: string;
    notes?: Record<string, string>;
}

export async function createPaymentOrder(options: CreateOrderOptions) {
    if (!razorpay) {
        console.error("Razorpay not configured. Cannot create payment order.");
        return { success: false, error: "Payment service not configured" };
    }

    try {
        const order = await razorpay.orders.create({
            amount: options.amount,
            currency: options.currency || "INR",
            receipt: options.receipt,
            notes: options.notes,
        });

        return { success: true, data: order };
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

export function verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string,
): boolean {
    if (!process.env.RAZORPAY_KEY_SECRET) {
        console.error("Razorpay secret not configured.");
        return false;
    }

    const text = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest("hex");

    return expectedSignature === signature;
}

export function verifyWebhookSignature(
    webhookBody: string,
    webhookSignature: string,
): boolean {
    if (!process.env.RAZORPAY_KEY_SECRET) {
        console.error("Razorpay secret not configured.");
        return false;
    }

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(webhookBody)
        .digest("hex");

    return expectedSignature === webhookSignature;
}
