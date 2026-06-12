import { useEffect, useState } from "react";
import { DataTable } from "../../components/DataTable";
import { PageState } from "../../components/PageState";
import { CustomerRecord, api } from "../../lib/api";

type CustomersPageProps = {
  token: string;
};

export function CustomersPage({ token }: CustomersPageProps) {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCustomers() {
      try {
        const data = await api.customers(token);
        if (!cancelled) {
          setCustomers(data);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load customers.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCustomers();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return <PageState title="Loading customers" message="Fetching customer accounts from the backend." />;
  }

  if (error) {
    return <PageState title="Customers unavailable" message={error} tone="error" />;
  }

  return (
    <DataTable
      title="Customers"
      subtitle="View household and office accounts, engagement, and subscription health."
      columns={["Customer", "Phone", "Segment", "Primary Address", "Subscriptions", "Orders"]}
      rows={customers}
      emptyMessage="No customer accounts found in UAT."
      renderRow={(customer) => (
        <tr key={customer.id}>
          <td>{customer.name}</td>
          <td>{customer.phone}</td>
          <td>{customer.businessName ?? customer.customerType ?? "Household"}</td>
          <td>{customer.addresses[0]?.addressLine ?? "No address"}</td>
          <td>
            {customer.subscriptions.filter((subscription) => subscription.status === "ACTIVE").length}
          </td>
          <td>{customer.orders.length}</td>
        </tr>
      )}
    />
  );
}
