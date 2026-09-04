"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OTPLoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | '', message: string }>({ type: '', message: '' });

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('/api/auth/request-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: data.message });
                setStep('otp');
            } else {
                setStatus({ type: 'error', message: data.error || 'Failed to send OTP' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: 'Login successful! Redirecting...' });

                // Redirect to admin dashboard
                setTimeout(() => {
                    router.push('/admin');
                }, 1500);
            } else {
                setStatus({ type: 'error', message: data.error || 'Invalid OTP' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">OTP Login</h1>
                        <p className="text-gray-600">
                            {step === 'email' ? 'Enter your email to receive OTP' : 'Enter the OTP sent to your email'}
                        </p>
                    </div>

                    {/* Status Messages */}
                    {status.message && (
                        <div className={`mb-6 p-4 rounded-lg ${status.type === 'success'
                                ? 'bg-green-50 border border-green-200 text-green-800'
                                : 'bg-red-50 border border-red-200 text-red-800'
                            }`}>
                            {status.message}
                        </div>
                    )}


                    {/* Email Step */}
                    {step === 'email' && (
                        <form onSubmit={handleRequestOTP} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                                    placeholder="admin@prem.com"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-[var(--primary)] text-black font-bold rounded-lg hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </form>
                    )}

                    {/* OTP Step */}
                    {step === 'otp' && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                                    placeholder="000000"
                                    disabled={loading}
                                    maxLength={6}
                                />
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    OTP valid for 10 minutes
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="w-full py-3 bg-[var(--primary)] text-black font-bold rounded-lg hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setStep('email');
                                    setOtp('');
                                    setStatus({ type: '', message: '' });
                                }}
                                className="w-full text-sm text-gray-600 hover:text-[var(--primary)] font-medium"
                            >
                                ← Change Email
                            </button>
                        </form>
                    )}

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => router.push('/admin/login')}
                            className="text-sm text-gray-600 hover:text-[var(--primary)] font-medium"
                        >
                            ← Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
