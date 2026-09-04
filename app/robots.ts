import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://premproperties.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin/", "/api/", "/login/", "/otp-login/", "/forgot-password/", "/reset-password/"],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
