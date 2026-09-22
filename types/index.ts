export type ProductBadge = "BEST_SELLER" | "NEW" | "SALE" | "POPULAR";

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  count?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  brand?: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  badge?: ProductBadge;
  colors?: { name: string; hex: string }[];
  createdAt: string;
}

export interface CartLine {
  id: string;
  productId: string;
  quantity: number;
  color: string | null;
  product: Product;
}

export interface WishlistLine {
  id: string;
  productId: string;
  product: Product;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface MegaMenuColumn {
  title: string;
  links: NavLink[];
}
export interface ShopFilterState {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  q?: string;
  sort?: string;
}