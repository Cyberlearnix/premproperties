import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { hasPermission } from "../../../lib/auth";
import { hashPassword } from "../../../lib/password";

export async function GET() {
    if (!await hasPermission("Members")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from("members")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!await hasPermission("Members")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if member already exists
        const { data: existing } = await supabase
            .from("members")
            .select("id")
            .eq("email", email)
            .single();

        if (existing) {
            return NextResponse.json({ error: "Member with this email already exists" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const { data, error } = await supabase
            .from("members")
            .insert({
                name,
                email,
                password: hashedPassword,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (!await hasPermission("Members")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await req.json();
        const { error } = await supabase
            .from("members")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
