import { useEffect, useState } from "react";
import { DataTable } from "../../components/DataTable";
import { PageState } from "../../components/PageState";
import { OrderRecord, api } from "../../lib/api";

type OrdersPageProps = {
  token: string;
};

export function OrdersPage({ token }: OrdersPageProps) {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      try {
        const data = await api.orders(token);
        if (!cancelled) {
          setOrders(data);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load orders.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return <PageState title="Loading orders" message="Fetching live order data." />;
  }

  if (error) {
    return <PageState title="Orders unavailable" message={error} tone="error" />;
  }

  return (
    <DataTable
      title="Orders"
      subtitle="Track pending, active, and completed orders across customer segments."
      columns={["Order ID", "Customer", "Items", "Total", "Status", "Delivery slot", "Rider"]}
      rows={orders}
      emptyMessage="No live orders found in the UAT database."
      renderRow={(order) => (
        <tr key={order.id}>
          <td>{order.id}</td>
          <td>{order.user.name}</td>
          <td>{order.items.map((item) => `${item.quantity} x ${item.product.name}`).join(", ")}</td>
          <td>PKR {Number(order.totalAmount).toLocaleString()}</td>
          <td>{order.status}</td>
          <td>{order.deliverySlot ?? "Not set"}</td>
          <td>{order.deliveryAssignment?.deliveryStaff?.name ?? "Unassigned"}</td>
        </tr>
      )}
    />
  );
}
