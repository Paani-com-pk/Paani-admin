import { useEffect, useState } from "react";
import { DataTable } from "../../components/DataTable";
import { PageState } from "../../components/PageState";
import { SubscriptionRecord, api } from "../../lib/api";

type SubscriptionsPageProps = {
  token: string;
};

export function SubscriptionsPage({ token }: SubscriptionsPageProps) {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSubscriptions() {
      try {
        const data = await api.subscriptions(token);
        if (!cancelled) {
          setSubscriptions(data);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load subscriptions.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSubscriptions();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return <PageState title="Loading subscriptions" message="Fetching recurring plans from the backend." />;
  }

  if (error) {
    return <PageState title="Subscriptions unavailable" message={error} tone="error" />;
  }

  return (
    <DataTable
      title="Subscriptions"
      subtitle="Keep 19L recurring delivery plans healthy across home and office customers."
      columns={["Subscription ID", "Customer", "Product", "Schedule", "Quantity", "Status"]}
      rows={subscriptions}
      emptyMessage="No subscriptions found in UAT."
      renderRow={(subscription) => (
        <tr key={subscription.id}>
          <td>{subscription.id}</td>
          <td>{subscription.user.name}</td>
          <td>{subscription.product.name}</td>
          <td>{subscription.scheduleType}</td>
          <td>{subscription.quantity}</td>
          <td>{subscription.status}</td>
        </tr>
      )}
    />
  );
}
