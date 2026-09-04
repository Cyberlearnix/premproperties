"use client";

import { useState } from "react";

export default function ContactForm() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("/api/inquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to send message");
            }

            setStatus("success");
            setFormData({ name: "", email: "", phone: "", message: "" });
        } catch (error: any) {
            console.error("Submission error:", error);
            setErrorMessage(error.message || "Failed to send message. Please try again.");
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="text-center py-12 bg-green-50 rounded-xl border border-green-100">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">Message Sent!</h3>
                <p className="text-green-700">Thank you for reaching out. We'll get back to you shortly.</p>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-green-900 font-bold underline"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Full Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-[var(--primary)] transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-[var(--primary)] transition-colors"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Email Address</label>
                <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
            </div>

            <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Message</label>
                <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
            </div>

            {status === "error" && (
                <p className="text-red-500 text-sm font-bold text-center">{errorMessage || "Failed to send message. Please try again."}</p>
            )}

            <button
                type="submit"
                disabled={status === "loading"}
                className="w-full md:w-auto px-12 py-4 bg-[var(--primary)] text-white font-bold uppercase tracking-wider rounded-sm hover:bg-[var(--primary-dark)] transition-colors shadow-lg disabled:opacity-50"
            >
                {status === "loading" ? "Sending..." : "Send Message"}
            </button>
        </form>
    );
}
