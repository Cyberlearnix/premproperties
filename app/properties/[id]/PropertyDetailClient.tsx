"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import PropertyEnquiry from "../../components/PropertyEnquiry";
import { supabase } from "../../lib/supabase";
import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("../../components/PropertyMap"), {
    ssr: false,
    loading: () => <div className="h-full bg-gray-100 animate-pulse flex items-center justify-center">Loading Map...</div>
});

export default function PropertyDetailClient({ initialProperty }: { initialProperty: any }) {
    const [property, setProperty] = useState(initialProperty);
    const [isMember, setIsMember] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check member session
                const memberRes = await fetch("/api/member/session");
                const memberData = await memberRes.json();
                setIsMember(memberData.authenticated);

                // Check admin session (httpOnly cookie, must go through API)
                const adminRes = await fetch("/api/auth/session");
                const adminData = await adminRes.json();
                setIsAdmin(!!adminData.authenticated);
            } catch (e) {
                console.error("Auth check failed:", e);
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        const fetchLive = async () => {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('id', initialProperty.id)
                .single();

            if (data && !error) {
                setProperty({
                    ...data,
                    id: String(data.id),
                    images: Array.isArray(data.images) ? data.images.filter((img: any) => img && img.trim() !== "") : [],
                    amenities: Array.isArray(data.amenities) ? data.amenities.filter((a: any) => a && a.trim() !== "") : [],
                    documents: Array.isArray(data.documents) ? data.documents.filter((d: any) => d && d.trim() !== "") : []
                });
            }
        };
        fetchLive();
    }, [initialProperty.id]);

    const docs = Array.isArray(property?.documents) ? property.documents.filter((d: any) => d && d.trim() !== "") : [];
    const galleryImages = Array.isArray(property?.images) ? property.images.filter((img: any) => img && img.trim() !== "") : [];

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Image */}
            <section className="relative h-[60vh] md:h-[70vh] w-full">
                <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="max-w-7xl mx-auto text-white">
                        <span className="px-3 py-1 bg-[var(--primary)] text-black text-xs font-bold uppercase rounded-sm mb-3 inline-block">
                            {property.status}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-2 shadow-sm">{property.title}</h1>
                        <p className="text-xl opacity-90">{property.location}</p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Key Specs */}
                    <div className="grid grid-cols-3 gap-4 p-6 bg-gray-900 rounded-lg border border-gray-100 shadow-sm">
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Price</p>
                            <p className="text-xl md:text-2xl font-bold text-[var(--primary)]">{property.price}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Type</p>
                            <p className="text-xl font-bold text-white">{property.category}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Area</p>
                            <p className="text-xl font-bold text-white">{property.specs?.area}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">About the Property</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {property.description}
                        </p>
                    </div>

                    {/* Amenities */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Amenities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                            {property.amenities?.map((amenity: string) => (
                                <div key={amenity} className="flex items-center gap-2 text-gray-700">
                                    <span className="w-2 h-2 bg-[var(--primary)] rounded-full" />
                                    {amenity}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    {galleryImages.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Gallery</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {galleryImages.map((img: string, i: number) => (
                                    <img key={i} src={img} alt="Gallery" className="rounded-lg hover:opacity-90 transition-opacity cursor-pointer aspect-video object-cover shadow-md" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Form */}
                <div>
                    <PropertyEnquiry propertyTitle={property.title} initialViews={500} />

                    {/* Property Documents - Member Only (Admins can also see) */}
                    {(isMember || isAdmin) && (
                        <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-xl">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                {isAdmin ? "👁️ Admin Preview: Original Papers" : "🔒 Original Papers"}
                            </h3>
                            {docs.length > 0 ? (
                                <div className="space-y-3">
                                    {docs.map((doc: string, i: number) => (
                                        <a
                                            key={i}
                                            href={doc}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-white hover:bg-green-50 rounded-lg border border-gray-100 transition-colors group"
                                        >
                                            {doc.match(/\.(jpg|jpeg|png|webp|gif|avif)$/i) ? (
                                                <img src={doc} className="w-12 h-12 object-cover rounded border" alt="Doc preview" />
                                            ) : (
                                                <span className="text-2xl">📄</span>
                                            )}
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-900">Document {i + 1}</p>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">Confidential Access</p>
                                            </div>
                                            <span className="text-gray-300 group-hover:text-green-500 transition-colors">&rarr;</span>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No original papers have been uploaded for this property yet.</p>
                            )}
                        </div>
                    )}

                    {!isMember && !isAdmin && docs.length > 0 && (
                        <div className="mt-8 p-6 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-center">
                            <span className="text-3xl mb-2 block text-gray-400">🔒</span>
                            <p className="text-sm font-bold text-gray-400 mb-2">Member Only Documents</p>
                            <Link href="/login" className="text-xs text-[var(--primary)] font-bold hover:underline">
                                Login to view original papers
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* LOCATION MAP */}
            <section className="bg-gray-50 py-16 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl font-bold mb-8">Property Location</h2>
                    <div className="w-full h-[450px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
                        <PropertyMap
                            lat={property.latitude}
                            lng={property.longitude}
                            address={property.map_address || property.location}
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
