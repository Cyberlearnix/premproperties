"use client";

import { useEffect, useState } from "react";
import CloudinaryUpload from "../../components/CloudinaryUpload";

import { supabase } from "../../lib/supabase";

export default function SettingsAdmin() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("banners");
    const [settings, setSettings] = useState({
        banners: {
            home: [{ type: "video", url: "", title: "", subtitle: "", titleColor: "#FFFFFF", tags: "", position: "center" }] as any[],
            about: { type: "image", url: "", title: "", subtitle: "", titleColor: "#FFFFFF", tags: "" },
            properties: { type: "image", url: "", title: "", subtitle: "", titleColor: "#FFFFFF", tags: "" },
            contact: { type: "image", url: "", title: "", subtitle: "", titleColor: "#FFFFFF", tags: "" },
            gallery: { type: "image", url: "", title: "", subtitle: "", titleColor: "#FFFFFF", tags: "" },
        } as any,
        navigation: [
            { label: "", href: "" }
        ],
        appearance: {
            primaryColor: "#FFA600",
            secondaryColor: "#1A1A1A",
            fontSans: "Inter",
            fontSerif: "Playfair Display",
            logoHeight: "80",
            logo: "/logo.png"
        },
        seo: {
            defaultTitle: "",
            defaultDescription: "",
            keywords: ""
        },
        footer: {
            aboutText: "",
            copyright: "",
            social: {
                facebook: "",
                instagram: "",
                twitter: "",
                linkedin: ""
            }
        },
        propertyConfig: {
            categories: ["Residential", "Commercial", "Villa", "Land"]
        }
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from("site_content")
                .select("data")
                .eq("id", "company")
                .single();

            if (error) throw error;
            if (data?.data) {
                setSettings(prev => {
                    // Legacy data may store the home banner as a single object instead of a slideshow array
                    const rawHome = data.data.banners?.home;
                    const homeSlides = Array.isArray(rawHome)
                        ? rawHome
                        : rawHome
                            ? [rawHome]
                            : prev.banners.home;

                    return {
                        ...prev,
                        ...data.data,
                        banners: {
                            ...prev.banners,
                            ...data.data.banners,
                            home: homeSlides
                        },
                        propertyConfig: {
                            categories: data.data.propertyConfig?.categories?.length > 0
                                ? data.data.propertyConfig.categories
                                : prev.propertyConfig.categories
                        }
                    };
                });
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Get existing data first to merge
            const { data: existing } = await supabase
                .from("site_content")
                .select("data")
                .eq("id", "company")
                .single();

            const updatedData = {
                ...(existing?.data || {}),
                ...settings
            };

            const { error } = await supabase
                .from("site_content")
                .upsert({ id: "company", data: updatedData, updated_at: new Date().toISOString() });

            if (error) throw error;
            alert("Settings updated successfully!");
        } catch (error) {
            console.error("Error updating settings:", error);
            alert("Error updating settings");
        } finally {
            setSaving(false);
        }
    };

    const updateBanner = (page: string, field: string, value: string) => {
        setSettings({
            ...settings,
            banners: {
                ...settings.banners,
                [page]: {
                    ...settings.banners[page as keyof typeof settings.banners],
                    [field]: value,
                },
            },
        });
    };

    const updateHomeSlide = (index: number, field: string, value: string) => {
        const homeSlides = [...settings.banners.home];
        homeSlides[index] = { ...homeSlides[index], [field]: value };
        setSettings({ ...settings, banners: { ...settings.banners, home: homeSlides } });
    };

    const addHomeSlide = () => {
        const homeSlides = [
            ...settings.banners.home,
            { type: "image", url: "", title: "", subtitle: "", titleColor: "#FFFFFF", tags: "", position: "center" },
        ];
        setSettings({ ...settings, banners: { ...settings.banners, home: homeSlides } });
    };

    const removeHomeSlide = (index: number) => {
        if (settings.banners.home.length <= 1) {
            alert("You must keep at least one hero slide.");
            return;
        }
        if (!confirm("Remove this hero slide?")) return;
        const homeSlides = settings.banners.home.filter((_: any, i: number) => i !== index);
        setSettings({ ...settings, banners: { ...settings.banners, home: homeSlides } });
    };

    const updateNavItem = (index: number, field: string, value: string) => {
        const newNav = [...settings.navigation];
        newNav[index] = { ...newNav[index], [field]: value };
        setSettings({ ...settings, navigation: newNav });
    };

    const addNavItem = () => {
        setSettings({
            ...settings,
            navigation: [...settings.navigation, { label: "", href: "" }],
        });
    };

    const removeNavItem = (index: number) => {
        setSettings({
            ...settings,
            navigation: settings.navigation.filter((_, i) => i !== index),
        });
    };

    const updateAppearance = (field: string, value: string) => {
        setSettings({
            ...settings,
            appearance: { ...settings.appearance, [field]: value }
        });
    };

    const updateSEO = (field: string, value: string) => {
        setSettings({
            ...settings,
            seo: { ...settings.seo, [field]: value }
        });
    };

    const updateFooter = (field: string, value: string) => {
        setSettings({
            ...settings,
            footer: { ...settings.footer, [field]: value }
        });
    };

    const updateSocial = (platform: string, value: string) => {
        setSettings({
            ...settings,
            footer: {
                ...settings.footer,
                social: { ...settings.footer.social, [platform]: value }
            }
        });
    };

    const updateCategories = (index: number, value: string) => {
        const newCats = [...(settings.propertyConfig?.categories || [])];
        newCats[index] = value;
        setSettings({
            ...settings,
            propertyConfig: { categories: newCats }
        });
    };

    const addCategory = () => {
        setSettings({
            ...settings,
            propertyConfig: {
                categories: [...(settings.propertyConfig?.categories || []), ""]
            }
        });
    };

    const removeCategory = (index: number) => {
        setSettings({
            ...settings,
            propertyConfig: {
                categories: (settings.propertyConfig?.categories || []).filter((_, i) => i !== index)
            }
        });
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    const tabs = [
        { id: "banners", label: "Banners & Nav", icon: "🖼️" },
        { id: "appearance", label: "Appearance", icon: "🎨" },
        { id: "seo", label: "SEO", icon: "🔍" },
        { id: "footer", label: "Footer", icon: "🦶" },
        { id: "config", label: "Property Config", icon: "⚙️" },
    ];

    return (
        <div className="max-w-6xl">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                    <p className="text-gray-600">Global website configuration</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="px-8 py-3 bg-[var(--primary)] text-black font-bold rounded-lg hover:bg-black hover:text-white transition-colors disabled:opacity-50 shadow-lg"
                >
                    {saving ? "Saving..." : "Save All Changes"}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-gray-200 p-1 rounded-xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${activeTab === tab.id
                            ? "bg-white text-black shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="space-y-8">
                {activeTab === "banners" && (
                    <>
                        {/* Home Hero Slideshow */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-bold">Home Hero Slideshow</h2>
                                    <p className="text-gray-500 text-sm mt-1">Add one or more slides (image or video). They rotate automatically on the homepage.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addHomeSlide}
                                    className="px-4 py-2 bg-black text-white rounded-lg font-bold hover:bg-[var(--primary)] hover:text-black transition-colors whitespace-nowrap"
                                >
                                    + Add Slide
                                </button>
                            </div>

                            {settings.banners.home.map((slide: any, index: number) => (
                                <div key={index} className="mb-8 pb-8 border-b border-gray-200 last:border-0 last:pb-0 last:mb-0">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg">Slide {index + 1}</h3>
                                        <button
                                            type="button"
                                            onClick={() => removeHomeSlide(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                            🗑️ Remove
                                        </button>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                                            <select
                                                value={slide.type}
                                                onChange={(e) => updateHomeSlide(index, "type", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                            >
                                                <option value="image">Image</option>
                                                <option value="video">Video</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">URL</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="url"
                                                    value={slide.url}
                                                    onChange={(e) => updateHomeSlide(index, "url", e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                                />
                                                <CloudinaryUpload
                                                    onUploadSuccess={(url) => updateHomeSlide(index, "url", url)}
                                                    buttonText="📸"
                                                    resourceType={slide.type === "video" ? "video" : "image"}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={slide.title}
                                                onChange={(e) => updateHomeSlide(index, "title", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Subtitle</label>
                                            <input
                                                type="text"
                                                value={slide.subtitle}
                                                onChange={(e) => updateHomeSlide(index, "subtitle", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Title Color</label>
                                            <div className="flex gap-4 items-center">
                                                <input
                                                    type="color"
                                                    value={slide.titleColor || "#FFFFFF"}
                                                    onChange={(e) => updateHomeSlide(index, "titleColor", e.target.value)}
                                                    className="h-10 w-20 rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={slide.titleColor || "#FFFFFF"}
                                                    onChange={(e) => updateHomeSlide(index, "titleColor", e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-mono uppercase"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Image/Video Position</label>
                                            <select
                                                value={slide.position || "center"}
                                                onChange={(e) => updateHomeSlide(index, "position", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                            >
                                                <option value="center">Center</option>
                                                <option value="top">Top</option>
                                                <option value="bottom">Bottom</option>
                                                <option value="left">Left</option>
                                                <option value="right">Right</option>
                                                <option value="top left">Top Left</option>
                                                <option value="top right">Top Right</option>
                                                <option value="bottom left">Bottom Left</option>
                                                <option value="bottom right">Bottom Right</option>
                                            </select>
                                            <p className="text-xs text-gray-400 mt-1">Controls which part of the media stays visible when it's cropped to fill the banner.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Tags (comma separated)</label>
                                            <input
                                                type="text"
                                                value={slide.tags || ""}
                                                onChange={(e) => updateHomeSlide(index, "tags", e.target.value)}
                                                placeholder="e.g. Luxury, Premium, Hyderabad"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Banners */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold mb-6">Page Banners</h2>
                            {Object.entries(settings.banners).filter(([page]) => page !== "home").map(([page, banner]: [string, any]) => (
                                <div key={page} className="mb-8 pb-8 border-b border-gray-200 last:border-0">
                                    <h3 className="font-bold text-lg mb-4 capitalize">{page} Page</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                                            <select
                                                value={banner.type}
                                                onChange={(e) => updateBanner(page, "type", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                            >
                                                <option value="image">Image</option>
                                                <option value="video">Video</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">URL</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="url"
                                                    value={banner.url}
                                                    onChange={(e) => updateBanner(page, "url", e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                                />
                                                <CloudinaryUpload
                                                    onUploadSuccess={(url) => updateBanner(page, "url", url)}
                                                    buttonText="📸"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={banner.title}
                                                onChange={(e) => updateBanner(page, "title", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Subtitle</label>
                                            <input
                                                type="text"
                                                value={banner.subtitle}
                                                onChange={(e) => updateBanner(page, "subtitle", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Title Color</label>
                                            <div className="flex gap-4 items-center">
                                                <input
                                                    type="color"
                                                    value={banner.titleColor || "#FFFFFF"}
                                                    onChange={(e) => updateBanner(page, "titleColor", e.target.value)}
                                                    className="h-10 w-20 rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={banner.titleColor || "#FFFFFF"}
                                                    onChange={(e) => updateBanner(page, "titleColor", e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-mono uppercase"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Tags (comma separated)</label>
                                            <input
                                                type="text"
                                                value={banner.tags || ""}
                                                onChange={(e) => updateBanner(page, "tags", e.target.value)}
                                                placeholder="e.g. Luxury, Premium, Hyderabad"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Navigation Menu</h2>
                                <button
                                    type="button"
                                    onClick={addNavItem}
                                    className="px-4 py-2 bg-black text-white rounded-lg font-bold hover:bg-[var(--primary)] hover:text-black transition-colors"
                                >
                                    + Add Item
                                </button>
                            </div>
                            {settings.navigation.map((item, index) => (
                                <div key={index} className="flex gap-4 mb-4">
                                    <input
                                        type="text"
                                        value={item.label}
                                        onChange={(e) => updateNavItem(index, "label", e.target.value)}
                                        placeholder="Label"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        value={item.href}
                                        onChange={(e) => updateNavItem(index, "href", e.target.value)}
                                        placeholder="URL"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                    <button
                                        onClick={() => removeNavItem(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === "appearance" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">Style & Branding</h2>
                        <div className="grid md:grid-cols-2 gap-10">
                            <div>
                                <h3 className="font-bold text-gray-700 mb-4">Color Palette</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-2">Primary Color (Accent)</label>
                                        <div className="flex gap-4 items-center">
                                            <input
                                                type="color"
                                                value={settings.appearance.primaryColor}
                                                onChange={(e) => updateAppearance("primaryColor", e.target.value)}
                                                className="h-12 w-20 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.appearance.primaryColor}
                                                onChange={(e) => updateAppearance("primaryColor", e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono uppercase"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-2">Secondary Color (Backgrounds)</label>
                                        <div className="flex gap-4 items-center">
                                            <input
                                                type="color"
                                                value={settings.appearance.secondaryColor}
                                                onChange={(e) => updateAppearance("secondaryColor", e.target.value)}
                                                className="h-12 w-20 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.appearance.secondaryColor}
                                                onChange={(e) => updateAppearance("secondaryColor", e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono uppercase"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-700 mb-4">Typography & Assets</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-2">Sans Font Family</label>
                                        <input
                                            type="text"
                                            value={settings.appearance.fontSans}
                                            onChange={(e) => updateAppearance("fontSans", e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-2">Logo Display Height (px)</label>
                                        <input
                                            type="number"
                                            value={settings.appearance.logoHeight}
                                            onChange={(e) => updateAppearance("logoHeight", e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-2">Website Logo</label>
                                        <div className="flex gap-4 items-center">
                                            <div className="h-16 w-16 bg-gray-100 rounded border flex items-center justify-center overflow-hidden">
                                                {settings.appearance.logo ? (
                                                    <img src={settings.appearance.logo} alt="Logo Preview" className="h-full w-full object-contain" />
                                                ) : (
                                                    <span className="text-xs text-gray-400">No Logo</span>
                                                )}
                                            </div>
                                            <div className="flex-1 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={settings.appearance.logo}
                                                    onChange={(e) => updateAppearance("logo", e.target.value)}
                                                    placeholder="/logo.png or Cloudinary URL"
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                                                />
                                                <CloudinaryUpload
                                                    onUploadSuccess={(url) => updateAppearance("logo", url)}
                                                    buttonText="📁"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "seo" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">Search Engine Optimization</h2>
                        <div className="space-y-6 max-w-3xl">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Default Page Title</label>
                                <input
                                    type="text"
                                    value={settings.seo.defaultTitle}
                                    onChange={(e) => updateSEO("defaultTitle", e.target.value)}
                                    placeholder="e.g., PREM Properties | Premium Real Estate"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Default Meta Description</label>
                                <textarea
                                    value={settings.seo.defaultDescription}
                                    onChange={(e) => updateSEO("defaultDescription", e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Global Keywords (comma separated)</label>
                                <input
                                    type="text"
                                    value={settings.seo.keywords}
                                    onChange={(e) => updateSEO("keywords", e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "footer" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">Footer Management</h2>
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Footer About Text</label>
                                    <textarea
                                        value={settings.footer.aboutText}
                                        onChange={(e) => updateFooter("aboutText", e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Copyright Text</label>
                                    <input
                                        type="text"
                                        value={settings.footer.copyright}
                                        onChange={(e) => updateFooter("copyright", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-700 mb-4">Social Links</h3>
                                {Object.keys(settings.footer.social).map((platform) => (
                                    <div key={platform}>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{platform}</label>
                                        <input
                                            type="url"
                                            value={settings.footer.social[platform as keyof typeof settings.footer.social]}
                                            onChange={(e) => updateSocial(platform, e.target.value)}
                                            placeholder={`https://www.${platform}.com/...`}
                                            className="w-full px-4 py-1.5 border border-gray-300 rounded-lg text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "config" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h2 className="text-xl font-bold text-gray-900">Property Configuration</h2>
                            <button
                                type="button"
                                onClick={addCategory}
                                className="px-4 py-2 bg-black text-white rounded-lg font-bold hover:bg-[var(--primary)] hover:text-black transition-colors text-sm"
                            >
                                + Add Category
                            </button>
                        </div>

                        <div className="max-w-2xl">
                            <h3 className="font-bold text-gray-700 mb-4">Property Categories</h3>
                            <p className="text-gray-500 text-sm mb-6">Manage the categories available in the property edit form (e.g. Residential, Commercial).</p>

                            <div className="space-y-4">
                                {settings.propertyConfig?.categories?.map((cat, index) => (
                                    <div key={index} className="flex gap-4 items-center animate-in fade-in slide-in-from-left-2 transition-all">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={cat}
                                                onChange={(e) => updateCategories(index, e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none font-medium"
                                                placeholder="e.g., Residential"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeCategory(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                            title="Delete Category"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {settings.propertyConfig?.categories?.length === 0 && (
                                <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <p className="text-gray-400">No categories added yet.</p>
                                    <button onClick={addCategory} className="text-[var(--primary)] font-bold mt-2 hover:underline">Add the first one</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
