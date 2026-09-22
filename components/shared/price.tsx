import { cn, formatPrice } from "@/lib/utils";

interface PriceProps {
  price: number;
  comparePrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Price({ price, comparePrice, size = "md", className }: PriceProps) {
  const priceSize =
    size === "sm"
      ? "text-sm"
      : size === "lg"
      ? "text-2xl"
      : "text-base";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("price font-semibold text-foreground", priceSize)}>
        {formatPrice(price)}
      </span>
      {comparePrice && comparePrice > price && (
        <span
          className={cn(
            "price text-muted-foreground line-through",
            size === "lg" ? "text-base" : "text-xs"
          )}
        >
          {formatPrice(comparePrice)}
        </span>
      )}
    </div>
  );
}