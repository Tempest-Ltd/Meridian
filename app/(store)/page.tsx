import { HeroCarousel } from "@/components/store/home/hero-carousel";
import { TrustStrip } from "@/components/store/footer/trust-strip";
import { CategoryScroller } from "@/components/store/home/category-scroller";
import { BestSellers } from "@/components/store/home/best-sellers";
import { AboutSection } from "@/components/store/home/about-section";
import { ContactSection } from "@/components/store/home/contact-section";
import { getAllCategories } from "@/lib/queries/categories";
import { getFeaturedProducts } from "@/lib/queries/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getAllCategories(),
    getFeaturedProducts(6),
  ]);

  return (
    <>
      <HeroCarousel />
      <TrustStrip />
      <CategoryScroller categories={categories} />
      <BestSellers products={products} />
      <AboutSection />
      <ContactSection />
    </>
  );
}