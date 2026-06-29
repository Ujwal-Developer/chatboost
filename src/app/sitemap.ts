import type { MetadataRoute } from "next";
import { env } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const updatedAt = new Date();

  return [
    {
      url: baseUrl,
      lastModified: updatedAt,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${baseUrl}/login/creator`,
      lastModified: updatedAt,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${baseUrl}/@nova`,
      lastModified: updatedAt,
      changeFrequency: "weekly",
      priority: 0.7
    }
  ];
}
