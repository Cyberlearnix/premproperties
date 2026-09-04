import { MetadataRoute } from "next";
import { fetchPropertiesData } from "./lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://premproperties.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes = ["", "/about", "/properties", "/gallery", "/contact"].map((path) => ({
        url: `${SITE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: path === "" ? 1 : 0.8,
    }));

    let propertyRoutes: MetadataRoute.Sitemap = [];
    try {
        const properties = await fetchPropertiesData();
        propertyRoutes = (properties || []).map((p: any) => ({
            url: `${SITE_URL}/properties/${p.id}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));
    } catch {
        // If property data can't be loaded, still return the static routes
    }

    return [...staticRoutes, ...propertyRoutes];
}
