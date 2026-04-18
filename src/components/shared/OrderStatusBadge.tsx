import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types";

const CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  PENDING:          { label: "Pending",          className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  CONFIRMED:        { label: "Confirmed",        className: "bg-blue-100 text-blue-700 border-blue-200" },
  PREPARING:        { label: "Preparing",        className: "bg-purple-100 text-purple-700 border-purple-200" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", className: "bg-orange-100 text-orange-700 border-orange-200" },
  DELIVERED:        { label: "Delivered",        className: "bg-green-100 text-green-700 border-green-200" },
  CANCELLED:        { label: "Cancelled",        className: "bg-red-100 text-red-700 border-red-200" },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = CONFIG[status];
  return (
    <Badge variant="outline" className={`text-xs font-medium ${className}`}>
      {label}
    </Badge>
  );
}