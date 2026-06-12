import { DataTable } from "../../components/DataTable";
import { customers } from "../../lib/mock-data";

export function CustomersPage() {
  return (
    <DataTable
      title="Customers"
      subtitle="View household and office accounts, engagement, and subscription health."
      columns={["Customer", "Phone", "Zone", "Subscriptions", "Orders"]}
      rows={customers}
      renderRow={(customer) => (
        <tr key={customer.id}>
          <td>{customer.name}</td>
          <td>{customer.phone}</td>
          <td>{customer.zone}</td>
          <td>{customer.activeSubscriptions}</td>
          <td>{customer.totalOrders}</td>
        </tr>
      )}
    />
  );
}

