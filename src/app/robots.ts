import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/checkout",
          "/orders",
          "/cart",
          "/addresses",
          "/auth/",
        ],
      },
    ],
    sitemap: "https://www.bestdealbazar.com/sitemap.xml",
  };
}
