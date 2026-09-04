"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCompanyData } from "../lib/data";

export default function Footer() {
  const [companyData, setCompanyData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCompanyData();
      setCompanyData(data);
    };
    loadData();
  }, []);

  const footer = companyData?.footer || {};
  const contact = companyData?.contact || {};
  const logoUrl = companyData?.appearance?.logo || "/logo.png";
  const logoHeight = companyData?.appearance?.logoHeight || "96";

  return (
    <footer className="bg-black text-white py-16 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">

        {/* Brand */}
        <div>
          <img
            src={logoUrl}
            alt={companyData?.company?.name || "PREM Properties"}
            style={{ height: `${logoHeight}px` }}
            className="w-auto object-contain mb-6"
          />
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            {footer.aboutText || "Building landmarks that redefine luxury living."}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-[var(--primary)]">Quick Links</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            {companyData?.navigation ? (
              companyData.navigation.map((item: any) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))
            ) : (
              <>
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/properties" className="hover:text-white transition-colors">Properties</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-[var(--primary)]">Contact</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>{contact.phone || "+91 89772 28322"}</li>
            <li>{contact.email || "premproperties1609@gmail.com"}</li>
            <li>{contact.address || "Hyderabad, India"}</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-[var(--primary)]">Follow Us</h3>
          <div className="flex gap-4">
            {footer.social && Object.entries(footer.social).map(([platform, url]: any) => (
              url && (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="capitalize text-gray-400 hover:text-[var(--primary)] transition-colors">
                  {platform}
                </a>
              )
            ))}
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-900 text-center text-xs text-gray-500">
        <p>{footer.copyright || `© ${new Date().getFullYear()} PREM Properties. All rights reserved.`}</p>
      </div>
    </footer>
  );
}
