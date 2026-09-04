import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFA600",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

import { fetchCompanyData } from "./lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://premproperties.com";

const LOCALITIES = [
  "Kongara Kalan",
  "Future City",
  "Adibatla",
  "Meerkanpet",
  "ORR Exit 13",
  "Ranga Reddy",
  "Hardware Park",
  "Hyderabad",
];

export async function generateMetadata() {
  const companyData = await fetchCompanyData();
  const seo = companyData?.seo || {};
  const title = seo.defaultTitle || "PREM Properties | Real Estate in Kongara Kalan & Future City, Hyderabad";
  const description =
    seo.defaultDescription ||
    "PREM Properties offers premium residential and commercial plots, villas, and apartments in Kongara Kalan, serving Future City, Adibatla, Meerkanpet, and the ORR Exit 13 corridor near Hyderabad.";
  const keywords =
    seo.keywords ||
    `real estate, luxury, ${LOCALITIES.join(", ")}, plots near Future City, properties near Adibatla, Kongara Kalan real estate`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
    authors: [{ name: "PREM Properties" }],
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: "PREM Properties",
      images: [{ url: "/logo.png", width: 1024, height: 853, alt: "PREM Properties" }],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Structured data so search engines recognize PREM Properties as a local real estate
// business serving Kongara Kalan and the neighboring Future City / Adibatla corridor
function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "PREM Properties",
    image: `${SITE_URL}/logo.png`,
    url: SITE_URL,
    telephone: "+91 89772 28322",
    email: "premproperties1609@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kongara Kalan",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      postalCode: "501510",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 17.2334,
      longitude: 78.5628,
    },
    areaServed: LOCALITIES.map((name) => ({ "@type": "Place", name })),
    priceRange: "₹₹₹",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const companyData = await fetchCompanyData();
  const appearance = companyData?.appearance || {
    primaryColor: "#FFA600",
    secondaryColor: "#1A1A1A",
    fontSans: "Inter",
    fontSerif: "Playfair Display",
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <LocalBusinessJsonLd />
        <style dangerouslySetInnerHTML={{
          __html: `
          :root {
            --primary: ${appearance.primaryColor};
            --primary-dark: ${appearance.primaryColor}dd;
            --secondary-bg: ${appearance.secondaryColor};
            --font-sans: ${appearance.fontSans}, system-ui, sans-serif;
            --font-serif: ${appearance.fontSerif}, serif;
          }
        `}} />
      </head>
      <body className="font-sans antialiased text-[var(--foreground)] bg-[var(--background)]">
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
