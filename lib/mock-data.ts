export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "s1",
    eyebrow: "Premium Essentials",
    title: "Upgrade Your Everyday Living.",
    description:
      "Thoughtfully designed products for a better, simpler, more comfortable life. Premium quality. Modern style. Only at Meridian.",
    cta: "Shop Now",
    href: "/shop",
    image: "/images/hero/man.png",
  },
  {
    id: "s2",
    eyebrow: "New Arrivals",
    title: "Comfort, Redesigned.",
    description:
      "Ergonomic essentials that make long days at the desk feel lighter. Built for the way you actually work.",
    cta: "Explore Now",
    href: "/shop?category=home-living",
    image: "/images/hero/slide-1.png",
  },
  {
    id: "s3",
    eyebrow: "Best Sellers",
    title: "Sound That Moves You.",
    description:
      "Headphones engineered for immersive sound, all-day comfort, and world-class noise cancellation.",
    cta: "Shop Audio",
    href: "/shop?category=electronics",
    image: "/images/hero/slide-2.png",
  },
  {
    id: "s4",
    eyebrow: "Limited Time",
    title: "Everyday Essentials, Perfected.",
    description:
      "Discover the pieces our customers keep coming back for. Designed for comfort. Built to last.",
    cta: "Shop Now",
    href: "/shop",
    image: "/images/hero/slide-3.png",
  },
];