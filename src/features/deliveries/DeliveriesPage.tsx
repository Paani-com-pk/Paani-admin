import { useEffect, useState } from "react";
import { DataTable } from "../../components/DataTable";
import { PageState } from "../../components/PageState";
import { DeliveryRecord, api } from "../../lib/api";

type DeliveriesPageProps = {
  token: string;
};

export function DeliveriesPage({ token }: DeliveriesPageProps) {
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDeliveries() {
      try {
        const data = await api.deliveries(token);
        if (!cancelled) {
          setDeliveries(data);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load deliveries.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDeliveries();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return <PageState title="Loading deliveries" message="Fetching delivery assignments from the backend." />;
  }

  if (error) {
    return <PageState title="Deliveries unavailable" message={error} tone="error" />;
  }

  return (
    <DataTable
      title="Deliveries"
      subtitle="Monitor assignment load, execution progress, and delivery timing."
      columns={["Assignment ID", "Delivery staff", "Customer", "Status", "Address"]}
      rows={deliveries}
      emptyMessage="No delivery assignments found in UAT."
      renderRow={(delivery) => (
        <tr key={delivery.id}>
          <td>{delivery.id}</td>
          <td>{delivery.deliveryStaff.name}</td>
          <td>{delivery.order.user.name}</td>
          <td>{delivery.status}</td>
          <td>{delivery.order.address?.addressLine ?? "No address"}</td>
        </tr>
      )}
    />
  );
}
