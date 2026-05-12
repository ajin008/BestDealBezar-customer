import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BestDealBazar",
    short_name: "BestDealBazar",
    description:
      "Shop groceries and daily essentials at wholesale prices. Fast delivery in Kozhikode.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f7f5",
    theme_color: "#059669",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
