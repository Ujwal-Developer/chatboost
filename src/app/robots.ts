import type { MetadataRoute } from "next";
import { env } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/dashboard", "/creator/verification", "/overlay/"]
    },
    sitemap: `${env.NEXT_PUBLIC_APP_URL}/sitemap.xml`
  };
}
