import { DataTable } from "../../components/DataTable";
import { orders } from "../../lib/mock-data";

export function OrdersPage() {
  return (
    <DataTable
      title="Orders"
      subtitle="Track pending, active, and completed orders across customer segments."
      columns={["Order ID", "Customer", "Items", "Total", "Status", "Delivery slot"]}
      rows={orders}
      renderRow={(order) => (
        <tr key={order.id}>
          <td>{order.id}</td>
          <td>{order.customer}</td>
          <td>{order.items}</td>
          <td>{order.total}</td>
          <td>{order.status}</td>
          <td>{order.slot}</td>
        </tr>
      )}
    />
  );
}

