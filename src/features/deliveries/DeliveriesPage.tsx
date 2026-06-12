import { DataTable } from "../../components/DataTable";
import { deliveries } from "../../lib/mock-data";

export function DeliveriesPage() {
  return (
    <DataTable
      title="Deliveries"
      subtitle="Monitor assignment load, execution progress, and delivery timing."
      columns={["Assignment ID", "Delivery staff", "Customer", "Status", "ETA"]}
      rows={deliveries}
      renderRow={(delivery) => (
        <tr key={delivery.id}>
          <td>{delivery.id}</td>
          <td>{delivery.staff}</td>
          <td>{delivery.customer}</td>
          <td>{delivery.status}</td>
          <td>{delivery.eta}</td>
        </tr>
      )}
    />
  );
}

