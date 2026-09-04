import Header from "../components/Header";
import Footer from "../components/Footer";
import TeamGrid from "../components/TeamGrid";
import AnimatedCounter from "../components/AnimatedCounter";
import { fetchCompanyData } from "../lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | PREM Properties - Kongara Kalan Real Estate",
  description: "Learn about PREM Properties in Kongara Kalan, a rapidly developing industrial hub near Hyderabad, serving Future City, Adibatla, and Meerkanpet. Strategic location near ORR Exit 13, Foxconn, Hardware Park, and major job creation zones.",
  keywords: ["Kongara Kalan Real Estate", "Foxconn Hyderabad", "Hardware Park Hyderabad", "ORR Exit 13 Plots", "Ranga Reddy IDOC", "Industrial Growth Hyderabad", "Future City Hyderabad", "Adibatla Real Estate", "Meerkanpet Plots"],
};

export const dynamic = "force-dynamic";

async function getData() {
  return fetchCompanyData();
}

export default async function AboutPage() {
  const companyData = await getData();
  const { company, team, banners } = companyData;
  const aboutBanner = banners?.about || {
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
    title: "About PREM",
    subtitle: ""
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />

      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {aboutBanner.type === "video" ? (
            <video
              src={aboutBanner.url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={aboutBanner.url}
              alt="PREM Properties Office"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          {aboutBanner.tags && (
            <div className="flex gap-2 justify-center mb-6">
              {aboutBanner.tags.split(",").map((tag: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-widest rounded-full">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
            style={{ color: aboutBanner.titleColor || "#FFFFFF" }}
          >
            {aboutBanner.title || "About PREM"}
          </h1>
          {aboutBanner.subtitle && (
            <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
              {aboutBanner.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Story & Stats */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {company.aboutLong}
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-1">Our Mission</h3>
                <p className="text-gray-500">{company.mission}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Our Vision</h3>
                <p className="text-gray-500">{company.vision}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {company.stats.map((stat) => (
              <div key={stat.label} className="bg-[var(--secondary-bg)] p-8 rounded-lg text-center border border-gray-100">
                <div className="text-4xl font-bold text-[var(--primary)] mb-2">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-sm font-bold uppercase text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Team */}
      <section className="py-24 bg-gray-50 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold">Leadership Team</h2>
            <div className="h-1 w-20 bg-[var(--primary)] mx-auto mt-4" />
          </div>

          <TeamGrid team={team} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
