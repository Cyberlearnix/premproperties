import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";

import { fetchCompanyData } from "../lib/data";

export const metadata = {
    title: "Contact Us | PREM Properties - Kongara Kalan, Hyderabad",
    description: "Get in touch with PREM Properties for real estate enquiries near Kongara Kalan, Future City, Adibatla, and Meerkanpet, Hyderabad. Call, WhatsApp, or visit us today.",
    keywords: "contact PREM Properties, real estate agent Kongara Kalan, real estate near Future City",
};

export const dynamic = "force-dynamic";

async function getData() {
    return fetchCompanyData();
}

export default async function ContactPage() {
    const companyData = await getData();
    const { contact } = companyData;

    return (
        <main className="min-h-screen bg-[var(--background)]">
            <Header />

            {/* Banner */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    {(companyData.banners?.contact?.type === "video") ? (
                        <video
                            src={companyData.banners.contact.url}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src={companyData.banners?.contact?.url || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"}
                            alt="Contact Us"
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 text-center text-white px-4">
                    {companyData.banners?.contact?.tags && (
                        <div className="flex gap-2 justify-center mb-4">
                            {companyData.banners.contact.tags.split(",").map((tag: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-widest rounded-full">
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>
                    )}
                    <h1
                        className="text-5xl md:text-6xl font-bold mb-4"
                        style={{ color: companyData.banners?.contact?.titleColor || "#FFFFFF" }}
                    >
                        {companyData.banners?.contact?.title || "Get in Touch"}
                    </h1>
                    {companyData.banners?.contact?.subtitle && (
                        <p className="text-xl max-w-2xl mx-auto">{companyData.banners.contact.subtitle}</p>
                    )}
                </div>
            </section>

            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">

                    {/* Info Side */}
                    <div className="p-10 bg-gray-50 text-gray-900 flex flex-col justify-between border-r border-gray-100">
                        <div>
                            <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <span className="text-[var(--primary)] text-xl">📍</span>
                                    <p className="text-gray-600 leading-relaxed">{contact.address}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[var(--primary)] text-xl">📞</span>
                                    <a href={`tel:${contact.phone}`} className="font-bold text-lg text-gray-900 hover:text-[var(--primary)] transition-colors">{contact.phone}</a>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[var(--primary)] text-xl">✉️</span>
                                    <a href={`mailto:${contact.email}`} className="text-gray-600 hover:text-black transition-colors">{contact.email}</a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <p className="text-sm text-gray-400 mb-4 font-bold uppercase tracking-widest">Connect with us on</p>
                            <a href={contact.whatsapp} target="_blank" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#128C7E] transition-all duration-300 shadow-md hover:shadow-lg">
                                WhatsApp Us
                            </a>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="p-10">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Send a Message</h2>
                        <ContactForm />
                    </div>

                </div>
            </section>

            {/* Map */}
            <section className="h-[400px] w-full">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5235.722351587704!2d78.56282259465826!3d17.23342974423806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcba53a806d8305%3A0x66014e09b75d15a3!2sKongarakalan%20Plots%20Sales%20%26%20Purchase!5e0!3m2!1sen!2sin!4v1788360531875!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="PREM Properties Office Location"
                ></iframe>
            </section>

            <Footer />
        </main>
    );
}
