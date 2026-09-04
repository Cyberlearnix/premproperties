"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MemberLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            const res = await fetch("/api/member/session");
            const data = await res.json();
            if (data.authenticated) {
                router.push("/");
            }
        };
        checkSession();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/member/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Refresh to update header state
                window.location.href = "/";
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white">
            <Header />

            <section className="pt-32 pb-24 px-6 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-serif font-bold mb-4">Member Login</h1>
                        <p className="text-gray-500">Access exclusive property documents and details.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-[var(--primary)] hover:text-black transition-all duration-300 disabled:opacity-50 shadow-lg"
                        >
                            {loading ? "Authenticating..." : "Login to Member Area"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Don't have a member account? <br />
                        <span className="text-black font-bold">Please contact your relationship manager.</span>
                    </div>

                    <div className="mt-6 text-center">
                        <Link
                            href="/admin/login/"
                            className="inline-block text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-[var(--primary)] transition-colors"
                        >
                            Admin Login →
                        </Link>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
