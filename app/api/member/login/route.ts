import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "../../../lib/supabase";
import { verifyPassword } from "../../../lib/password";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const { data: member, error } = await supabase
            .from("members")
            .select("*")
            .eq("email", email.toLowerCase())
            .single();

        if (error || !member) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Legacy plaintext accounts (created before hashing) compare directly
        const isValidPassword = member.password.startsWith('$2')
            ? await verifyPassword(password, member.password)
            : password === member.password;

        if (!isValidPassword) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const sessionData = {
            id: member.id,
            email: member.email,
            name: member.name,
            authenticated: true,
            role: "member"
        };

        const sessionValue = Buffer.from(JSON.stringify(sessionData)).toString("base64");

        cookies().set("member-session", sessionValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
