import type { Category, NavLink } from "@/types";

export const SITE = {
  name: "Meridian",
  tagline: "Better products. A brighter you.",
  description:
    "Premium everyday essentials designed for comfort, convenience, and confidence.",
  email: "support@meridian.com",
  phone: "+234 801 234 5678",
  address: "12 Victoria Island Road, Lagos, Lagos State 101241, Nigeria",
  hours: "Mon – Fri, 9AM – 6PM (WAT)",
  freeShippingThreshold: 50,
};

export const PRIMARY_NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/shop" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export const MEGA_MENU: Record<string, NavLink[]> = {
  Electronics: [
    { label: "All Electronics", href: "/shop?category=electronics" },
    { label: "Headphones", href: "/shop?category=electronics" },
    { label: "Smart Watches", href: "/shop?category=electronics" },
    { label: "Audio", href: "/shop?category=electronics" },
  ],
  Apparel: [
    { label: "All Apparel", href: "/shop?category=apparel" },
    { label: "Hoodies", href: "/shop?category=apparel" },
    { label: "Tees", href: "/shop?category=apparel" },
    { label: "Outerwear", href: "/shop?category=apparel" },
  ],
  "Home & Living": [
    { label: "All Home", href: "/shop?category=home-living" },
    { label: "Desk", href: "/shop?category=home-living" },
    { label: "Lighting", href: "/shop?category=home-living" },
    { label: "Kitchen", href: "/shop?category=home-living" },
  ],
  Footwear: [
    { label: "All Footwear", href: "/shop?category=footwear" },
    { label: "Sneakers", href: "/shop?category=footwear" },
    { label: "Running", href: "/shop?category=footwear" },
  ],
  Bags: [
    { label: "All Bags", href: "/shop?category=bags" },
    { label: "Backpacks", href: "/shop?category=bags" },
    { label: "Duffels", href: "/shop?category=bags" },
  ],
  "Health & Beauty": [
    { label: "All Beauty", href: "/shop?category=health-beauty" },
    { label: "Skincare", href: "/shop?category=health-beauty" },
    { label: "Grooming", href: "/shop?category=health-beauty" },
  ],
};

export const CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    count: 48,
  },
  {
    id: "2",
    name: "Apparel",
    slug: "apparel",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
    count: 12,
  },
  {
    id: "3",
    name: "Home & Living",
    slug: "home-living",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
    count: 10,
  },
  {
    id: "4",
    name: "Footwear",
    slug: "footwear",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
    count: 6,
  },
  {
    id: "5",
    name: "Bags & Accessories",
    slug: "bags",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    count: 8,
  },
  {
    id: "6",
    name: "Health & Beauty",
    slug: "health-beauty",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
    count: 6,
  },
];

export const FOOTER_LINKS = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "Electronics", href: "/shop?category=electronics" },
    { label: "Apparel", href: "/shop?category=apparel" },
    { label: "Backpacks & Bags", href: "/shop?category=bags" },
    { label: "Footwear", href: "/shop?category=footwear" },
    { label: "Skincare & Grooming", href: "/shop?category=health-beauty" },
    { label: "Home & Office", href: "/shop?category=home-living" },
    { label: "Accessories", href: "/shop?category=bags" },
  ],
    customerCare: [
    { label: "Help & Support", href: "/#contact" },
    { label: "Order History", href: "/account/orders" },
    { label: "Shipping Information", href: "/#contact" },
    { label: "Returns & Exchanges", href: "/#contact" },
    { label: "Payment Methods", href: "/account/payment-methods" },
    { label: "Privacy Policy", href: "/#about" },
    { label: "Terms of Service", href: "/#about" },
  ],
  about: [
    { label: "Our Story", href: "/#about" },
    { label: "Our Values", href: "/#about" },
    { label: "Sustainability", href: "/#about" },
    { label: "Careers", href: "/#about" },
    { label: "Press", href: "/#about" },
  ],
};