import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import { hasPermission } from "../../lib/auth";

export async function GET() {
    if (!await hasPermission("Inquiries")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from('inquiries')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data || []);
    } catch (error: any) {
        console.error("Error fetching inquiries:", error);
        return NextResponse.json({ error: "Failed to load inquiries" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const inquiry = await request.json();

        // Import validation utilities
        const { validateEmail, validatePhone, validateName, validateMessage, checkRateLimit } = await import("../../lib/validation");
        const { supabase } = await import("../../lib/supabase");

        // Rate limiting - max 3 inquiries per hour per IP
        const forwardedFor = request.headers.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
        const rateLimit = checkRateLimit(`inquiry_${ip}`, 3, 3600000);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: `Too many requests. Please try again in ${Math.ceil(rateLimit.resetIn / 60000)} minutes.` },
                { status: 429 }
            );
        }

        // Validate and sanitize inputs
        const nameValidation = validateName(inquiry.name || '');
        if (!nameValidation.isValid) {
            return NextResponse.json({ error: nameValidation.error }, { status: 400 });
        }

        const emailValidation = validateEmail(inquiry.email || '');
        if (!emailValidation.isValid) {
            return NextResponse.json({ error: emailValidation.error }, { status: 400 });
        }

        const phoneValidation = validatePhone(inquiry.phone || '');
        if (!phoneValidation.isValid) {
            return NextResponse.json({ error: phoneValidation.error }, { status: 400 });
        }

        const messageValidation = validateMessage(inquiry.message || '', 10, 1000);
        if (!messageValidation.isValid) {
            return NextResponse.json({ error: messageValidation.error }, { status: 400 });
        }

        const newInquiry = {
            id: Date.now().toString(),
            name: nameValidation.sanitized,
            phone: phoneValidation.sanitized,
            email: emailValidation.sanitized,
            message: messageValidation.sanitized,
            property: inquiry.property || null,
            date: new Date().toISOString(),
            status: 'new'
        };

        const { data, error } = await supabase
            .from('inquiries')
            .insert([newInquiry])
            .select()
            .single();

        if (error) {
            console.error("Supabase inquiry insert error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Notify the admin inbox; a failed email must not fail the submission
        const { sendInquiryNotificationEmail } = await import("../../lib/email");
        sendInquiryNotificationEmail(newInquiry).catch((err) =>
            console.error("Failed to send inquiry notification email:", err)
        );

        return NextResponse.json({ success: true, inquiry: data });
    } catch (error: any) {
        console.error("Inquiry submission error:", error);
        return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!await hasPermission("Inquiries")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await request.json();

        const { error } = await supabase
            .from('inquiries')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error deleting inquiry:", error);
        return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!await hasPermission("Inquiries")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, status } = await request.json();

        const { data, error } = await supabase
            .from('inquiries')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ success: true, inquiry: data });
    } catch (error: any) {
        console.error("Error updating inquiry:", error);
        return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
    }
}
