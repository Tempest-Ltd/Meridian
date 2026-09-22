import { z } from "zod";

export const ColorSchema = z.object({
  name: z.string().min(1).max(30),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color"),
});

const ProductBadgeEnum = z.enum([
  "BEST_SELLER",
  "NEW",
  "SALE",
  "POPULAR",
]);

export const ProductCreateSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().min(10).max(5000),
  price: z.number().positive().max(1000000),
  comparePrice: z.number().positive().max(1000000).nullable().optional(),
  categoryId: z.string().min(1),
  images: z.array(z.string().url()).min(1).max(6),
  stock: z.number().int().min(0).max(100000),
  badge: ProductBadgeEnum.nullable().optional(),
  colors: z.array(ColorSchema).max(6).optional(),
  brand: z.string().max(60).nullable().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>;