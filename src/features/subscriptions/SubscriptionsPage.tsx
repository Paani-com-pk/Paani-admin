import { DataTable } from "../../components/DataTable";
import { subscriptions } from "../../lib/mock-data";

export function SubscriptionsPage() {
  return (
    <DataTable
      title="Subscriptions"
      subtitle="Keep 19L recurring delivery plans healthy across home and office customers."
      columns={["Subscription ID", "Customer", "Product", "Schedule", "Status"]}
      rows={subscriptions}
      renderRow={(subscription) => (
        <tr key={subscription.id}>
          <td>{subscription.id}</td>
          <td>{subscription.customer}</td>
          <td>{subscription.product}</td>
          <td>{subscription.schedule}</td>
          <td>{subscription.status}</td>
        </tr>
      )}
    />
  );
}

