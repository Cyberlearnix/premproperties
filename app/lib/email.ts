import nodemailer from 'nodemailer';

/**
 * Configure SMTP transporter using environment variables
 */
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(to: string, resetLink: string) {
    const mailOptions = {
        from: process.env.SMTP_FROM || '"PREM Properties" <noreply@premproperties.com>',
        to,
        subject: 'Reset your PREM Properties password',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password for the **PREM Properties Admin Panel**. Click the button below to set a new password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #DAA520; color: black; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Reset Password</a>
                </div>
                <p style="color: #666; font-size: 14px;">This link will expire in **1 hour**. If you didn't request this, you can safely ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} PREM Properties. All rights reserved.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Reset email sent to ${to}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending reset email:', error);
        throw new Error('Failed to send email');
    }
}

/**
 * Notify the admin inbox when a customer submits a contact or property enquiry
 */
export async function sendInquiryNotificationEmail(inquiry: {
    name: string;
    email: string;
    phone: string;
    message: string;
    property?: string | null;
}) {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'premproperties1609@gmail.com';

    const mailOptions = {
        from: process.env.SMTP_FROM || '"PREM Properties" <noreply@premproperties.com>',
        to: adminEmail,
        replyTo: inquiry.email,
        subject: inquiry.property
            ? `New Property Enquiry: ${inquiry.property}`
            : 'New Contact Form Submission',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #333; text-align: center;">${inquiry.property ? 'New Property Enquiry' : 'New Contact Message'}</h2>
                ${inquiry.property ? `<p><strong>Property:</strong> ${inquiry.property}</p>` : ''}
                <p><strong>Name:</strong> ${inquiry.name}</p>
                <p><strong>Email:</strong> ${inquiry.email}</p>
                <p><strong>Phone:</strong> ${inquiry.phone}</p>
                <p><strong>Message:</strong></p>
                <p style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${inquiry.message}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">This is an automated notification from the PREM Properties website.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Inquiry notification sent to ${adminEmail}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending inquiry notification email:', error);
        // Don't throw - a failed notification shouldn't fail the inquiry submission itself
        return { success: false };
    }
}

export async function sendOTPEmail(to: string, otp: string) {
    const mailOptions = {
        from: process.env.SMTP_FROM || '"PREM Properties" <noreply@premproperties.com>',
        to,
        subject: 'Your Login OTP - PREM Properties',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #333; text-align: center;">Security Verification</h2>
                <p>Hello,</p>
                <p>Your One-Time Password (OTP) for logging into the **PREM Properties Admin Panel** is:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <div style="display: inline-block; padding: 15px 30px; background-color: #f4f4f4; color: #DAA520; font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 5px; border-radius: 5px;">${otp}</div>
                </div>
                <p style="color: #666; font-size: 14px;">This OTP is valid for **10 minutes**. Do not share this code with anyone.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} PREM Properties. All rights reserved.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent to ${to}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending OTP email:', error);
        throw new Error('Failed to send email');
    }
}
