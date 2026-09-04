import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { generateOTP, storeOTP } from '../../../lib/otp';
import { validateEmail } from '../../../lib/validation';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        // Validate email
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            return NextResponse.json(
                { error: emailValidation.error },
                { status: 400 }
            );
        }

        // Check if user exists
        const { data: user, error } = await supabase
            .from('admin_users')
            .select('email, username')
            .eq('email', emailValidation.sanitized)
            .single();

        if (error || !user) {
            // For security, don't reveal if email exists or not
            return NextResponse.json({
                success: true,
                message: 'If your email is registered, you will receive an OTP shortly.'
            });
        }

        // Generate OTP
        const otp = generateOTP(6);
        storeOTP(user.email, otp, 10); // Valid for 10 minutes

        // Send OTP via real email service
        try {
            const { sendOTPEmail } = await import('../../../lib/email');
            await sendOTPEmail(user.email, otp);
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError);
        }

        return NextResponse.json({
            success: true,
            message: 'OTP sent to your email'
        });

    } catch (error) {
        console.error('Request OTP error:', error);
        return NextResponse.json(
            { error: 'Failed to send OTP' },
            { status: 500 }
        );
    }
}
