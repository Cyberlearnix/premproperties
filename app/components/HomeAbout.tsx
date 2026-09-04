"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import AnimatedCounter from "./AnimatedCounter";

export default function HomeAbout({ company: initialCompany }: { company: any }) {
    const [company, setCompany] = useState(initialCompany);

    useEffect(() => {
        const fetchLive = async () => {
            const { data, error } = await supabase
                .from('site_content')
                .select('data')
                .eq('id', 'company')
                .single();

            if (data && !error) {
                setCompany(data.data.company);
            }
        };
        fetchLive();
    }, []);
    return (
        <section className="py-24 px-6 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Text Side */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-[var(--primary)] font-bold uppercase tracking-widest text-sm mb-4">About PREM Properties</h2>
                        <h3 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-8 leading-tight">
                            {company.tagline || "Building Dreams, Creating Legacies"}
                        </h3>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            {company.aboutShort || "With over 15 years of experience, we have redefined the skyline of Hyderabad."}
                        </p>

                        {company.mission && (
                            <blockquote className="border-l-4 border-[var(--primary)] pl-5 mb-10 italic text-gray-500">
                                "{company.mission}"
                            </blockquote>
                        )}

                        <div className="grid grid-cols-3 gap-8 mb-10">
                            {company.stats?.map((stat: any) => (
                                <div key={stat.label}>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">
                                        <AnimatedCounter value={stat.value} />
                                    </div>
                                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/about"
                            className="inline-block px-8 py-3 bg-black text-white font-bold rounded-lg hover:bg-[var(--primary)] hover:text-black transition-all duration-300"
                        >
                            Our Full Story
                        </Link>
                    </motion.div>

                    {/* Image Side */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                                alt="PREM Properties Building"
                                className="w-full h-[500px] object-cover"
                            />
                        </div>
                        {/* Decorative background block */}
                        <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-[var(--primary)] -z-10 rounded-2xl opacity-20" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
