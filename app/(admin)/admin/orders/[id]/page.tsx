import { OrderDetailDrawer } from "@/components/admin/orders/order-detail-drawer";

export default function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Order</span>
        <h1 className="mt-2 font-display text-3xl">Order Details</h1>
      </div>
      <div className="max-w-md">
        <OrderDetailDrawer orderId={params.id} />
      </div>
    </div>
  );
}