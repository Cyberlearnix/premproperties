import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PropertiesGrid from "../components/PropertiesGrid";

import { fetchCompanyData, fetchPropertiesData } from "../lib/data";

async function getData() {
    const [propertiesData, companyData] = await Promise.all([
        fetchPropertiesData(),
        fetchCompanyData()
    ]);

    return { propertiesData, companyData };
}

export const metadata = {
    title: "Properties for Sale | Kongara Kalan, Future City & Adibatla | PREM Properties",
    description: "Browse premium residential plots, villas, and commercial properties for sale near Kongara Kalan, Future City, Adibatla, and Meerkanpet in Hyderabad's fastest-growing corridor.",
    keywords: "properties near Future City, plots in Kongara Kalan, Adibatla real estate, Meerkanpet plots, ORR Exit 13 properties",
};

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
    const { propertiesData, companyData } = await getData();
    const propertiesBanner = companyData.banners?.properties || {
        url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2000&q=80",
        title: "Our Properties",
        subtitle: "Discover your dream home"
    };

    return (
        <main className="min-h-screen bg-[var(--background)]">
            <Header />

            {/* Banner */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    {propertiesBanner.type === "video" ? (
                        <video
                            src={propertiesBanner.url}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src={propertiesBanner.url}
                            alt="Properties"
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 text-center text-white px-4">
                    {propertiesBanner.tags && (
                        <div className="flex gap-2 justify-center mb-4">
                            {propertiesBanner.tags.split(",").map((tag: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-widest rounded-full">
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>
                    )}
                    <h1
                        className="text-5xl md:text-6xl font-bold mb-4"
                        style={{ color: propertiesBanner.titleColor || "#FFFFFF" }}
                    >
                        {propertiesBanner.title || "Our Properties"}
                    </h1>
                    {propertiesBanner.subtitle && (
                        <p className="text-xl max-w-2xl mx-auto">{propertiesBanner.subtitle}</p>
                    )}
                </div>
            </section>

            {/* Filter & Grid */}
            {/* Properties Grid Component */}
            <PropertiesGrid properties={propertiesData} />

            <Footer />
        </main>
    );
}
