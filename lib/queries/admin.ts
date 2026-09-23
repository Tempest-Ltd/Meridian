import { prisma } from "@/lib/prisma";

/* ---------------- Dashboard KPIs ---------------- */

export interface KpiDelta {
  value: number;
  deltaPct: number;
  direction: "up" | "down" | "flat";
  sparkline: number[]; // last 7 data points
}

function makeDelta(values: number[]): KpiDelta {
  const total = values.reduce((s, v) => s + v, 0);
  const half = Math.floor(values.length / 2);
  const first = values.slice(0, half).reduce((s, v) => s + v, 0) || 1;
  const second = values.slice(half).reduce((s, v) => s + v, 0);
  const deltaPct = Math.round(((second - first) / first) * 100);
  return {
    value: total,
    deltaPct: Math.abs(deltaPct),
    direction: deltaPct > 1 ? "up" : deltaPct < -1 ? "down" : "flat",
    sparkline: values,
  };
}

function dayKeys(days: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export async function getDashboardKpis() {
  const days = dayKeys(7);
  const since = new Date(days[0]);
  since.setUTCHours(0, 0, 0, 0);

  const [orders, products, users, orderRows] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.findMany({
      where: { createdAt: { gte: since }, status: { not: "CANCELLED" } },
      select: { createdAt: true, total: true },
    }),
  ]);

  const revByDay = days.map(() => 0);
  const ordersByDay = days.map(() => 0);
  orderRows.forEach((o) => {
    const key = o.createdAt.toISOString().slice(0, 10);
    const idx = days.indexOf(key);
    if (idx >= 0) {
      revByDay[idx] += Number(o.total);
      ordersByDay[idx] += 1;
    }
  });

  return {
    revenue: makeDelta(revByDay),
    orders: makeDelta(ordersByDay),
    products: {
      value: products,
      deltaPct: 4.3,
      direction: "up" as const,
      sparkline: [20, 21, 22, 22, 23, 24, products],
    },
    users: {
      value: users,
      deltaPct: 20,
      direction: "up" as const,
      sparkline: [8, 9, 10, 11, 11, 12, users],
    },
  };
}

/* ---------------- Revenue Over Time ---------------- */

export async function getRevenueSeries(days: 7 | 30 | 90) {
  const keys = dayKeys(days);
  const since = new Date(keys[0]);
  since.setUTCHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: since },
      status: { not: "CANCELLED" },
    },
    select: { createdAt: true, total: true },
  });

  const map = new Map<string, number>();
  keys.forEach((k) => map.set(k, 0));
  orders.forEach((o) => {
    const key = o.createdAt.toISOString().slice(0, 10);
    if (map.has(key)) {
      map.set(key, (map.get(key) ?? 0) + Number(o.total));
    }
  });

  return keys.map((k) => ({ date: k, revenue: map.get(k) ?? 0 }));
}

/* ---------------- Order Status Breakdown ---------------- */

export async function getOrderStatusBreakdown() {
  const rows = await prisma.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const STATUSES = [
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ] as const;

  const map = new Map<string, number>();
  rows.forEach((r) => map.set(r.status, r._count._all));

  const total = rows.reduce((s, r) => s + r._count._all, 0);

  return STATUSES.map((s) => ({
    status: s,
    count: map.get(s) ?? 0,
    pct: total > 0 ? Math.round(((map.get(s) ?? 0) / total) * 100) : 0,
  }));
}

/* ---------------- Recent Orders ---------------- */

export async function getRecentOrders(limit = 5) {
  return prisma.order.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true, imageUrl: true } },
      items: { select: { id: true } },
    },
  });
}

/* ---------------- Top Products ---------------- */

export async function getTopProducts(limit = 5) {
  const rows = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true, price: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });

  const ids = rows.map((r) => r.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, images: true, price: true, slug: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  return rows
    .map((r) => {
      const p = productMap.get(r.productId);
      if (!p) return null;
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        image: p.images[0] ?? "",
        price: Number(p.price),
        unitsSold: r._sum.quantity ?? 0,
        revenue: Number(r._sum.price ?? 0) * (r._sum.quantity ?? 0),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}

/* ---------------- Customers ---------------- */

export async function getCustomers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: true } },
      orders: {
        select: { total: true, status: true },
      },
    },
  });

  return users.map((u) => {
    const spend = u.orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((s, o) => s + Number(o.total), 0);
    return {
      id: u.id,
      name: u.name ?? "Unnamed",
      email: u.email,
      imageUrl: u.imageUrl,
      role: u.role,
      joinedAt: u.createdAt,
      orderCount: u._count.orders,
      spend,
      status: u._count.orders > 0 ? "Active" : "Inactive",
    };
  });
}

export interface CustomerStats {
  total: number;
  newThisMonth: number;
  returning: number;
  avgOrderValue: number;
}

export async function getCustomerStats(): Promise<CustomerStats> {
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const [total, newThisMonth, withMultipleOrders, revenueAgg] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.user.count({ where: { orders: { some: {} } } }),
      prisma.order.aggregate({
        where: { status: { not: "CANCELLED" } },
        _avg: { total: true },
        _count: { _all: true },
      }),
    ]);

  return {
    total,
    newThisMonth,
    returning: withMultipleOrders,
    avgOrderValue: Number(revenueAgg._avg.total ?? 0),
  };
}

/* ---------------- Analytics ---------------- */

export async function getAnalyticsKpis() {
  const [revenueAgg, orders, users] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { total: true },
      _avg: { total: true },
    }),
    prisma.order.count(),
    prisma.user.count(),
  ]);

  return {
    revenue: Number(revenueAgg._sum.total ?? 0),
    orders,
    customers: users,
    avgOrderValue: Number(revenueAgg._avg.total ?? 0),
  };
}


/* ---------------- Admin Products ---------------- */

export async function getAdminProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  });
}

export async function getAdminProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  });
}

interface ProductInput {
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  categoryId: string;
  images: string[];
  stock: number;
  badge?: "BEST_SELLER" | "NEW" | "SALE" | "POPULAR" | null;
  colors?: { name: string; hex: string }[];
  brand?: string | null;
  rating?: number;
  reviewCount?: number;
}

export async function createAdminProduct(input: ProductInput) {
  return prisma.product.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description,
      price: input.price,
      comparePrice: input.comparePrice ?? null,
      categoryId: input.categoryId,
      images: input.images,
      stock: input.stock,
      badge: input.badge ?? null,
      colors: input.colors ?? undefined,
      brand: input.brand ?? null,
      rating: input.rating ?? 0,
      reviewCount: input.reviewCount ?? 0,
    },
  });
}

export async function updateAdminProduct(
  id: string,
  input: Partial<ProductInput>
) {
  // Build the update payload explicitly — no spread conditions, no ambiguity.
  const data: Record<string, unknown> = {};

  if (input.name !== undefined) data.name = input.name;
  if (input.slug !== undefined) data.slug = input.slug;
  if (input.description !== undefined) data.description = input.description;
  if (input.price !== undefined) data.price = input.price;
  if (input.comparePrice !== undefined) data.comparePrice = input.comparePrice;
  if (input.categoryId !== undefined) data.categoryId = input.categoryId;
  if (input.images !== undefined) data.images = input.images;
  if (input.stock !== undefined) data.stock = input.stock;
  if (input.badge !== undefined) data.badge = input.badge;
  if (input.colors !== undefined) data.colors = input.colors;
  if (input.brand !== undefined) data.brand = input.brand;

  console.log(`[admin] updating product ${id}`, data);

  const updated = await prisma.product.update({
    where: { id },
    data,
  });

  console.log(`[admin] product ${id} updated — new price: ${updated.price}`);

  return updated;
}

export async function deleteAdminProduct(id: string) {
  // Block deletion if the product is part of any order — protects order history
  const inOrders = await prisma.orderItem.count({ where: { productId: id } });
  if (inOrders > 0) {
    throw new Error("PRODUCT_IN_ORDERS");
  }
  return prisma.product.delete({ where: { id } });
}

/* ---------------- Admin Categories ---------------- */

export async function getAdminCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

interface CategoryInput {
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
}

export async function createAdminCategory(input: CategoryInput) {
  return prisma.category.create({ data: input });
}

export async function updateAdminCategory(id: string, input: Partial<CategoryInput>) {
  return prisma.category.update({ where: { id }, data: input });
}

export async function deleteAdminCategory(id: string) {
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) throw new Error("CATEGORY_HAS_PRODUCTS");
  return prisma.category.delete({ where: { id } });
}

/* ---------------- Admin Orders ---------------- */

export async function getAdminOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true, imageUrl: true } },
      items: true,
    },
  });
}

export async function getAdminOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, imageUrl: true } },
      items: true,
    },
  });
}

const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function isValidOrderStatus(s: string): s is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(s);
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  return prisma.order.update({ where: { id }, data: { status } });
}

export async function getAdminOrderStats() {
  const [ordersAgg, total, byStatus] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { total: true },
      _count: { _all: true },
    }),
    prisma.order.count(),
    prisma.order.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const statusMap: Record<string, number> = {};
  byStatus.forEach((s) => {
    statusMap[s.status] = s._count._all;
  });

  const customers = await prisma.user.count({ where: { orders: { some: {} } } });

  return {
    total,
    revenue: Number(ordersAgg._sum.total ?? 0),
    customers,
    statusCounts: statusMap,
  };
}

/* ---------------- Analytics: Sales by Category ---------------- */

export async function getSalesByCategory() {
  const items = await prisma.orderItem.findMany({
    include: {
      product: {
        select: {
          category: { select: { id: true, name: true } },
        },
      },
    },
  });

  const map = new Map<string, { name: string; revenue: number; units: number }>();
  items.forEach((item) => {
    const cat = item.product.category;
    const key = cat?.id ?? "uncategorized";
    const name = cat?.name ?? "Uncategorized";
    const existing = map.get(key) ?? { name, revenue: 0, units: 0 };
    existing.revenue += Number(item.price) * item.quantity;
    existing.units += item.quantity;
    map.set(key, existing);
  });

  const total = Array.from(map.values()).reduce((s, c) => s + c.revenue, 0);

  return Array.from(map.entries())
    .map(([id, v]) => ({
      id,
      name: v.name,
      revenue: v.revenue,
      units: v.units,
      pct: total > 0 ? Math.round((v.revenue / total) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

/* ---------------- Analytics: Order Value Distribution ---------------- */

export async function getOrderValueDistribution() {
  const orders = await prisma.order.findMany({
    where: { status: { not: "CANCELLED" } },
    select: { total: true },
  });

  const buckets = [
    { label: "$0–50", min: 0, max: 50 },
    { label: "$50–100", min: 50, max: 100 },
    { label: "$100–200", min: 100, max: 200 },
    { label: "$200–500", min: 200, max: 500 },
    { label: "$500+", min: 500, max: Infinity },
  ];

  return buckets.map((b) => ({
    label: b.label,
    count: orders.filter((o) => {
      const t = Number(o.total);
      return t >= b.min && t < b.max;
    }).length,
  }));
}

/* ---------------- Analytics: KPI deltas ---------------- */

export interface MetricDelta {
  value: number;
  deltaPct: number;
  direction: "up" | "down" | "flat";
}

function computeDelta(current: number, previous: number): MetricDelta {
  if (previous === 0) {
    return {
      value: current,
      deltaPct: current > 0 ? 100 : 0,
      direction: current > 0 ? "up" : "flat",
    };
  }
  const pct = ((current - previous) / previous) * 100;
  return {
    value: current,
    deltaPct: Math.abs(Math.round(pct)),
    direction: pct > 1 ? "up" : pct < -1 ? "down" : "flat",
  };
}

export async function getAnalyticsKpisWithDelta(rangeDays: 7 | 30 | 90 = 30) {
  const now = new Date();
  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - rangeDays);
  start.setUTCHours(0, 0, 0, 0);

  const prevStart = new Date(start);
  prevStart.setUTCDate(prevStart.getUTCDate() - rangeDays);
  prevStart.setUTCHours(0, 0, 0, 0);

  const [current, previous] = await Promise.all([
    prisma.order.aggregate({
      where: {
        createdAt: { gte: start },
        status: { not: "CANCELLED" },
      },
      _sum: { total: true },
      _avg: { total: true },
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: prevStart, lt: start },
        status: { not: "CANCELLED" },
      },
      _sum: { total: true },
      _avg: { total: true },
      _count: { _all: true },
    }),
  ]);

  const [currentCustomers, prevCustomers] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: start } } }),
    prisma.user.count({
      where: { createdAt: { gte: prevStart, lt: start } },
    }),
  ]);

  return {
    revenue: computeDelta(
      Number(current._sum.total ?? 0),
      Number(previous._sum.total ?? 0)
    ),
    orders: computeDelta(current._count._all, previous._count._all),
    customers: computeDelta(currentCustomers, prevCustomers),
    avgOrderValue: computeDelta(
      Number(current._avg.total ?? 0),
      Number(previous._avg.total ?? 0)
    ),
  };
}

/* ---------------- Analytics: Metric Series (Revenue / Orders / Customers) ---------------- */

export async function getMetricSeries(
  metric: "revenue" | "orders" | "customers",
  days: 7 | 30 | 90
) {
  const keys = dayKeys(days);
  const since = new Date(keys[0]);
  since.setUTCHours(0, 0, 0, 0);

  if (metric === "customers") {
    const users = await prisma.user.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    });
    const map = new Map<string, number>();
    keys.forEach((k) => map.set(k, 0));
    users.forEach((u) => {
      const key = u.createdAt.toISOString().slice(0, 10);
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
    });
    return keys.map((k) => ({ date: k, value: map.get(k) ?? 0 }));
  }

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: since },
      status: { not: "CANCELLED" },
    },
    select: { createdAt: true, total: true },
  });

  const map = new Map<string, number>();
  keys.forEach((k) => map.set(k, 0));
  orders.forEach((o) => {
    const key = o.createdAt.toISOString().slice(0, 10);
    if (map.has(key)) {
      const add = metric === "revenue" ? Number(o.total) : 1;
      map.set(key, (map.get(key) ?? 0) + add);
    }
  });

  return keys.map((k) => ({ date: k, value: map.get(k) ?? 0 }));
}

/* ---------------- Dashboard: Bundle ---------------- */

export async function getDashboardBundle() {
  const [kpis, revenue7, revenue30, revenue90, statusBreakdown, recentOrders, topProducts] =
    await Promise.all([
      getDashboardKpis(),
      getRevenueSeries(7),
      getRevenueSeries(30),
      getRevenueSeries(90),
      getOrderStatusBreakdown(),
      getRecentOrders(5),
      getTopProducts(5),
    ]);

  return {
    kpis,
    revenueSeries: { 7: revenue7, 30: revenue30, 90: revenue90 },
    statusBreakdown,
    recentOrders,
    topProducts,
  };
}

/* ---------------- Analytics: Bundle ---------------- */

export async function getAnalyticsBundle() {
  const [
    kpis7,
    kpis30,
    kpis90,
    revenue7,
    revenue30,
    revenue90,
    orders7,
    orders30,
    orders90,
    customers7,
    customers30,
    customers90,
    salesByCategory,
    valueDistribution,
    topProducts,
  ] = await Promise.all([
    getAnalyticsKpisWithDelta(7),
    getAnalyticsKpisWithDelta(30),
    getAnalyticsKpisWithDelta(90),
    getMetricSeries("revenue", 7),
    getMetricSeries("revenue", 30),
    getMetricSeries("revenue", 90),
    getMetricSeries("orders", 7),
    getMetricSeries("orders", 30),
    getMetricSeries("orders", 90),
    getMetricSeries("customers", 7),
    getMetricSeries("customers", 30),
    getMetricSeries("customers", 90),
    getSalesByCategory(),
    getOrderValueDistribution(),
    getTopProducts(5),
  ]);

  return {
    kpis: { 7: kpis7, 30: kpis30, 90: kpis90 },
    series: {
      revenue: { 7: revenue7, 30: revenue30, 90: revenue90 },
      orders: { 7: orders7, 30: orders30, 90: orders90 },
      customers: { 7: customers7, 30: customers30, 90: customers90 },
    },
    salesByCategory,
    valueDistribution,
    topProducts,
  };
}

/* ---------------- Admin Users ---------------- */

export interface AdminUserRow {
  id: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
  role: string;
  createdAt: Date;
  orderCount: number;
  spend: number;
}

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: true } },
      orders: { select: { total: true, status: true } },
    },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    imageUrl: u.imageUrl,
    role: u.role,
    createdAt: u.createdAt,
    orderCount: u._count.orders,
    spend: u.orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((s, o) => s + Number(o.total), 0),
  }));
}

export async function updateAdminUserRole(id: string, role: "USER" | "ADMIN") {
  return prisma.user.update({ where: { id }, data: { role } });
}

export async function getAdminUserStats() {
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const [total, newThisMonth, returning, revenueAgg] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.user.count({ where: { orders: { some: {} } } }),
    prisma.order.aggregate({
      where: { status: { not: "CANCELLED" } },
      _avg: { total: true },
    }),
  ]);

  return {
    total,
    newThisMonth,
    returning,
    avgOrderValue: Number(revenueAgg._avg.total ?? 0),
  };
}