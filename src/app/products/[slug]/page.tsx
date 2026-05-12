import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import ProductDetailClient from "./ProductDetailClient";

const BASE_URL = "https://www.bestdealbazar.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "name, short_description, selling_price, unit, slug, product_images(url, is_primary)"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!product) {
    return { title: "Product Not Found" };
  }

  const primaryImage =
    product.product_images?.find((i: { is_primary: boolean }) => i.is_primary)
      ?.url ?? product.product_images?.[0]?.url;

  const title = product.name;
  const description =
    product.short_description ??
    `Buy ${product.name} (${product.unit}) at ₹${product.selling_price} on BestDealBazar. Fast delivery in Kozhikode.`;
  const url = `${BASE_URL}/products/${product.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: primaryImage
        ? [{ url: primaryImage, alt: product.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: primaryImage ? [primaryImage] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "name, short_description, selling_price, actual_price, unit, slug, product_images(url, is_primary)"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  const primaryImage =
    product?.product_images?.find((i: { is_primary: boolean }) => i.is_primary)
      ?.url ?? product?.product_images?.[0]?.url;

  const productSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description:
          product.short_description ??
          `Buy ${product.name} at ₹${product.selling_price} on BestDealBazar.`,
        image: primaryImage ? [primaryImage] : undefined,
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: product.selling_price,
          availability: "https://schema.org/InStock",
          url: `${BASE_URL}/products/${product.slug}`,
          seller: { "@type": "Organization", name: "BestDealBazar" },
        },
      }
    : null;

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <ProductDetailClient />
    </>
  );
}
