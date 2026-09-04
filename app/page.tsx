import Header from "./components/Header";
import Hero from "./components/Hero";
import HomeAbout from "./components/HomeAbout";
import FeaturedProjects from "./components/FeaturedProjects";
import Footer from "./components/Footer";
import HomeGallery from "./components/HomeGallery";

import { fetchCompanyData, fetchPropertiesData } from "./lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PREM Properties | Premium Real Estate in Kongara Kalan, Hyderabad",
  description: "Invest in Kongara Kalan, Hyderabad's fastest-growing real estate hub. Near ORR Exit 13, Foxconn, Hardware Park, Future City, and Adibatla. Premium residential plots, villas, and apartments.",
  keywords: ["Real Estate Hyderabad", "Kongara Kalan Plots", "Foxconn Hyderabad Projects", "Investment in Kongara Kalan", "Premium Villas Hyderabad", "Properties near Future City", "Real Estate near Adibatla", "Plots near Meerkanpet"],
};

async function getData() {
  const [propertiesData, companyData] = await Promise.all([
    fetchPropertiesData(),
    fetchCompanyData()
  ]);

  return { propertiesData, companyData };
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const { propertiesData, companyData } = await getData();
  const homeBanner = companyData?.banners?.home;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />
      <Hero banner={homeBanner} />

      {/* ABOUT SECTION */}
      <HomeAbout company={companyData?.company} />

      {/* FEATURED PROPERTIES PREVIEW */}
      <FeaturedProjects projects={propertiesData} />

      {/* HOME GALLERY */}
      <HomeGallery properties={propertiesData} galleryImages={companyData?.galleryImages} />

      <Footer />
    </main>
  );
}
