import Header from "../components/Header";
import Footer from "../components/Footer";

import { fetchPropertiesData, fetchCompanyData } from "../lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Project Gallery | PREM Properties - Kongara Kalan & Future City",
    description: "View our portfolio of premium properties and successful real estate developments near Kongara Kalan, Future City, Adibatla, and Meerkanpet, Hyderabad.",
    keywords: "PREM Properties gallery, Kongara Kalan projects, Future City developments",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
    const [propertiesData, companyData] = await Promise.all([
        fetchPropertiesData(),
        fetchCompanyData()
    ]);

    const galleryBanner = companyData?.banners?.gallery || {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80",
        title: "Project Gallery",
        subtitle: "A visual journey through our finest developments",
        titleColor: "#FFFFFF",
        tags: ""
    };

    // Filter only valid gallery images from company data
    const allImages = (companyData?.galleryImages || []).filter((img: string) => img && img.trim() !== "");

    return (
        <main className="min-h-screen bg-[var(--background)]">
            <Header />

            {/* Banner */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    {galleryBanner.type === "video" ? (
                        <video
                            src={galleryBanner.url}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src={galleryBanner.url}
                            alt="Gallery"
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 text-center text-white px-4">
                    {galleryBanner.tags && (
                        <div className="flex gap-2 justify-center mb-4">
                            {galleryBanner.tags.split(",").map((tag: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-widest rounded-full">
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>
                    )}
                    <h1
                        className="text-5xl md:text-6xl font-bold mb-4"
                        style={{ color: galleryBanner.titleColor || "#FFFFFF" }}
                    >
                        {galleryBanner.title || "Project Gallery"}
                    </h1>
                    {galleryBanner.subtitle && (
                        <p className="text-xl max-w-2xl mx-auto">{galleryBanner.subtitle}</p>
                    )}
                </div>
            </section>

            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {allImages.length > 0 ? (
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                            {allImages.map((img, i) => (
                                <div key={i} className="break-inside-avoid rounded-lg overflow-hidden group relative hover:shadow-xl transition-shadow duration-300">
                                    <img src={img} alt="Gallery" className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <div className="text-6xl mb-4">📸</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gallery coming soon</h2>
                            <p className="text-gray-500 max-w-md mx-auto">
                                We are currently curating a visual tour of our finest projects. Please check back later.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
