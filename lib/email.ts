import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Default from address
const FROM_EMAIL = process.env.FROM_EMAIL || 'CACS Upra <noreply@cacsupra.com>';

interface EmailResult {
    success: boolean;
    error?: string;
}

/**
 * Send welcome email to new partner signups
 */
export async function sendWelcomeEmail(
    to: string,
    name: string
): Promise<EmailResult> {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: 'Welcome to CACS Upra - Partner Registration Received',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #1e40af;">Welcome to CACS Upra!</h1>
                    <p>Dear ${name},</p>
                    <p>Thank you for registering as a partner with CACS Upra. We're excited to have you join our network of legal and financial professionals.</p>
                    <p><strong>What happens next?</strong></p>
                    <ol>
                        <li>Our team will review your application and documents</li>
                        <li>You'll receive an email once your account is verified</li>
                        <li>After verification, you can start accepting orders</li>
                    </ol>
                    <p>This usually takes 1-2 business days.</p>
                    <p>If you have any questions, please contact our support team.</p>
                    <p>Best regards,<br>The CACS Upra Team</p>
                </div>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to send welcome email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}

/**
 * Send order confirmation to client
 */
export async function sendOrderConfirmationEmail(
    to: string,
    name: string,
    orderId: string,
    serviceName: string
): Promise<EmailResult> {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: `Order Confirmed - ${serviceName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #1e40af;">Order Confirmation</h1>
                    <p>Dear ${name},</p>
                    <p>Your order has been successfully placed!</p>
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Order ID:</strong> ${orderId}</p>
                        <p><strong>Service:</strong> ${serviceName}</p>
                        <p><strong>Status:</strong> Pending Payment</p>
                    </div>
                    <p><strong>Next Steps:</strong></p>
                    <ol>
                        <li>Complete your payment to proceed</li>
                        <li>A partner will be assigned to your order</li>
                        <li>You'll receive updates as your order progresses</li>
                    </ol>
                    <p>You can track your order status in your dashboard.</p>
                    <p>Best regards,<br>The CACS Upra Team</p>
                </div>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to send order confirmation email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}

/**
 * Send job notification to verified partners
 */
export async function sendPartnerJobNotificationEmail(
    to: string,
    partnerName: string,
    serviceName: string,
    orderId: string
): Promise<EmailResult> {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: `New Job Available - ${serviceName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #1e40af;">New Job Available!</h1>
                    <p>Dear ${partnerName},</p>
                    <p>A new job matching your expertise is now available!</p>
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Service:</strong> ${serviceName}</p>
                        <p><strong>Order ID:</strong> ${orderId}</p>
                    </div>
                    <p>Log in to your dashboard to view the full details and accept this job.</p>
                    <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                        View in Dashboard
                    </a>
                    <p><em>Note: Jobs are assigned on a first-come, first-served basis.</em></p>
                    <p>Best regards,<br>The CACS Upra Team</p>
                </div>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to send partner job notification:', error);
        return { success: false, error: 'Failed to send email' };
    }
}

/**
 * Send verification status update to partner
 */
export async function sendVerificationStatusEmail(
    to: string,
    name: string,
    status: 'VERIFIED' | 'REJECTED' | 'SUSPENDED'
): Promise<EmailResult> {
    const statusMessages = {
        VERIFIED: {
            subject: 'Account Verified - Start Accepting Orders!',
            message: 'Congratulations! Your partner account has been verified. You can now start accepting orders.',
            color: '#16a34a'
        },
        REJECTED: {
            subject: 'Verification Update - Action Required',
            message: 'Unfortunately, we couldn\'t verify your account with the documents provided. Please contact support for more information.',
            color: '#dc2626'
        },
        SUSPENDED: {
            subject: 'Account Suspended',
            message: 'Your partner account has been temporarily suspended. Please contact support for assistance.',
            color: '#f59e0b'
        }
    };

    const { subject, message, color } = statusMessages[status];

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: ${color};">${subject}</h1>
                    <p>Dear ${name},</p>
                    <p>${message}</p>
                    ${status === 'VERIFIED' ? `
                        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                            Go to Dashboard
                        </a>
                    ` : ''}
                    <p>Best regards,<br>The CACS Upra Team</p>
                </div>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to send verification status email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}

/**
 * Send order status update to client
 */
export async function sendOrderStatusUpdateEmail(
    to: string,
    name: string,
    orderId: string,
    serviceName: string,
    status: string
): Promise<EmailResult> {
    const statusConfig: Record<string, { subject: string; message: string }> = {
        PROCESSING: {
            subject: 'Order Update - Work in Progress',
            message: 'Great news! A partner has started working on your order.'
        },
        COMPLETED: {
            subject: 'Order Completed!',
            message: 'Your order has been completed successfully.'
        },
        CANCELLED: {
            subject: 'Order Cancelled',
            message: 'Your order has been cancelled.'
        }
    };

    const config = statusConfig[status] || {
        subject: 'Order Status Update',
        message: `Your order status has been updated to: ${status}`
    };

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: `${config.subject} - Order #${orderId.slice(0, 8)}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #1e40af;">${config.subject}</h1>
                    <p>Dear ${name},</p>
                    <p>${config.message}</p>
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Order ID:</strong> ${orderId}</p>
                        <p><strong>Service:</strong> ${serviceName}</p>
                        <p><strong>Status:</strong> ${status}</p>
                    </div>
                    <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                        View in Dashboard
                    </a>
                    <p>Best regards,<br>The CACS Upra Team</p>
                </div>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to send order status email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}
