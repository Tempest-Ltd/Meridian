import { PrismaClient, ProductBadge } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  {
    name: "Electronics",
    slug: "electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  },
  {
    name: "Apparel",
    slug: "apparel",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
  },
  {
    name: "Home & Living",
    slug: "home-living",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
  },
  {
    name: "Footwear",
    slug: "footwear",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
  },
  {
    name: "Bags & Accessories",
    slug: "bags",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
  },
  {
    name: "Health & Beauty",
    slug: "health-beauty",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
  },
];

const PRODUCTS = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    slug: "wireless-noise-cancelling-headphones",
    categorySlug: "electronics",
    brand: "Meridian",
    description:
      "Experience world-class noise cancellation, immersive sound, and all-day comfort. Designed for people who want more from their music, travel, and everyday moments.",
    price: 129,
    comparePrice: 179,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    ],
    rating: 4.5,
    reviewCount: 1248,
    stock: 24,
    badge: "BEST_SELLER" as ProductBadge,
    featured: true,
    colors: [
      { name: "Black", hex: "#0a0a0a" },
      { name: "Sand", hex: "#d6cec2" },
      { name: "Slate", hex: "#6b7280" },
    ],
  },
  {
    name: "Oversized Hoodie",
    slug: "oversized-hoodie",
    categorySlug: "apparel",
    brand: "Meridian",
    description:
      "Heavyweight cotton fleece, boxy fit, and a soft brushed interior. The hoodie you'll reach for every day.",
    price: 69,
    comparePrice: 90,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
    ],
    rating: 4.4,
    reviewCount: 892,
    stock: 42,
    badge: "NEW" as ProductBadge,
    featured: true,
    colors: [
      { name: "Black", hex: "#0a0a0a" },
      { name: "Cream", hex: "#efe9dd" },
    ],
  },
  {
    name: "Classic Runner Sneakers",
    slug: "classic-runner-sneakers",
    categorySlug: "footwear",
    brand: "Meridian",
    description:
      "Everyday sneakers with cushioned soles and a clean silhouette. Built to go the distance.",
    price: 89,
    comparePrice: 119,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    ],
    rating: 4.7,
    reviewCount: 653,
    stock: 36,
    badge: "SALE" as ProductBadge,
    featured: true,
  },
  {
    name: "Urban Backpack",
    slug: "urban-backpack",
    categorySlug: "bags",
    brand: "Meridian",
    description:
      "Water-resistant, laptop-ready, and designed for the daily commute. Organization meets clean design.",
    price: 79,
    comparePrice: 99,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80",
    ],
    rating: 4.6,
    reviewCount: 421,
    stock: 15,
    badge: "POPULAR" as ProductBadge,
    featured: true,
  },
  {
    name: "Smart Watch Pro",
    slug: "smart-watch-pro",
    categorySlug: "electronics",
    brand: "Meridian",
    description:
      "Track your health, stay connected, and go longer with a 7-day battery. Premium materials, modern design.",
    price: 199,
    comparePrice: 249,
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    ],
    rating: 4.8,
    reviewCount: 512,
    stock: 27,
    badge: "SALE" as ProductBadge,
    featured: true,
  },
  {
    name: "Men's Skincare Set",
    slug: "mens-skincare-set",
    categorySlug: "health-beauty",
    brand: "Meridian",
    description:
      "A simple, effective routine. Cleanser, serum, and moisturizer formulated for daily use.",
    price: 45,
    comparePrice: 60,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80",
    ],
    rating: 4.5,
    reviewCount: 512,
    stock: 58,
    featured: true,
  },
  {
    name: "LED Desk Lamp",
    slug: "led-desk-lamp",
    categorySlug: "home-living",
    brand: "Meridian",
    description:
      "Adjustable brightness, warm-to-cool tone, and a matte finish. Clean light for focused work.",
    price: 59,
    comparePrice: 79,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
      "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=800&q=80",
    ],
    rating: 4.6,
    reviewCount: 389,
    stock: 33,
    badge: "POPULAR" as ProductBadge,
  },
  {
    name: "Smart Coffee Maker",
    slug: "smart-coffee-maker",
    categorySlug: "home-living",
    brand: "Meridian",
    description:
      "Schedule your brew, control from your phone, and wake up to fresh coffee. Clean design, smart inside.",
    price: 99,
    comparePrice: 139,
    images: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    ],
    rating: 4.5,
    reviewCount: 273,
    stock: 12,
  },
  {
    name: "Travel Duffel Bag",
    slug: "travel-duffel-bag",
    categorySlug: "bags",
    brand: "Meridian",
    description:
      "Built for the weekend. Durable canvas, leather trim, and a layout that just works.",
    price: 89,
    comparePrice: 129,
    images: [
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    ],
    rating: 4.7,
    reviewCount: 558,
    stock: 18,
    badge: "BEST_SELLER" as ProductBadge,
  },
  {
    name: "Polarized Sunglasses",
    slug: "polarized-sunglasses",
    categorySlug: "bags",
    brand: "Meridian",
    description:
      "UV400 protection, lightweight acetate frame, and a classic shape that fits everyone.",
    price: 69,
    comparePrice: 89,
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    ],
    rating: 4.3,
    reviewCount: 421,
    stock: 22,
  },
  {
    name: "Ergonomic Lumbar Support",
    slug: "ergonomic-lumbar-support",
    categorySlug: "home-living",
    brand: "Meridian",
    description:
      "Memory foam support that molds to your back. Designed to make long days at the desk feel better.",
    price: 49,
    comparePrice: 69,
    images: [
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80",
      "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&q=80",
    ],
    rating: 4.8,
    reviewCount: 317,
    stock: 44,
    badge: "NEW" as ProductBadge,
  },
  {
    name: "Leather Wallet",
    slug: "leather-wallet",
    categorySlug: "bags",
    brand: "Meridian",
    description:
      "Full-grain leather, slim profile, RFID blocking. Made to age beautifully.",
    price: 59,
    comparePrice: 79,
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    ],
    rating: 4.6,
    reviewCount: 286,
    stock: 30,
  },
];

async function main() {
  console.log("Seeding database...");

  // Wipe in dependency-safe order
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Categories
  const categoryMap: Record<string, string> = {};
  for (const c of CATEGORIES) {
    const created = await prisma.category.create({ data: c });
    categoryMap[c.slug] = created.id;
  }
  console.log(`✓ ${CATEGORIES.length} categories`);

  // Products
  for (const p of PRODUCTS) {
    const { categorySlug, ...rest } = p;
    await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoryMap[categorySlug],
      },
    });
  }
  console.log(`✓ ${PRODUCTS.length} products`);

  console.log("Seeding complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });