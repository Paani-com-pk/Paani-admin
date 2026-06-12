import { useEffect, useState } from "react";
import { MetricCard } from "../../components/MetricCard";
import { PageState } from "../../components/PageState";
import { DeliveryRecord, OrderRecord, OverviewMetrics, api } from "../../lib/api";
import { Metric } from "../../lib/types";

type DashboardPageProps = {
  token: string;
};

function formatCurrency(amount: number) {
  return `PKR ${amount.toLocaleString()}`;
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export function DashboardPage({ token }: DashboardPageProps) {
  const [overview, setOverview] = useState<OverviewMetrics | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const [overviewData, ordersData, deliveriesData] = await Promise.all([
          api.overview(token),
          api.orders(token),
          api.deliveries(token),
        ]);

        if (!cancelled) {
          setOverview(overviewData);
          setOrders(ordersData);
          setDeliveries(deliveriesData);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load dashboard.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return <PageState title="Loading dashboard" message="Fetching live admin metrics from the backend." />;
  }

  if (error || !overview) {
    return (
      <PageState
        title="Dashboard unavailable"
        message={error ?? "No dashboard data found."}
        tone="error"
      />
    );
  }

  const metrics: Metric[] = [
    { label: "Orders today", value: String(overview.daily.orders), change: "Live order volume" },
    {
      label: "Revenue today",
      value: formatCurrency(overview.daily.revenue),
      change: "Current database total",
    },
    {
      label: "Active subscriptions",
      value: String(overview.monthly.activeSubscriptions),
      change: "Recurring customers",
    },
    {
      label: "On-time delivery",
      value: formatPercent(overview.operational.orderCompletionRate),
      change: "Completed delivery ratio",
    },
  ];

  return (
    <div className="stack">
      <section className="metrics-grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="hero-grid">
        <article className="panel hero-card">
          <p className="eyebrow">Dispatch Pulse</p>
          <h3>Live UAT operational summary</h3>
          <p className="muted">
            {overview.daily.deliveries} deliveries tracked, {overview.monthly.activeCustomers} active
            customers, and an average delivery time of {overview.operational.averageDeliveryTimeMinutes} minutes.
          </p>
        </article>
        <article className="panel">
          <p className="eyebrow">Attention Queue</p>
          <ul className="plain-list">
            <li>{orders.filter((order) => order.status === "PENDING").length} orders are still pending.</li>
            <li>{deliveries.filter((delivery) => delivery.status === "ASSIGNED").length} deliveries are assigned.</li>
            <li>{deliveries.filter((delivery) => delivery.status === "IN_TRANSIT").length} deliveries are in transit.</li>
          </ul>
        </article>
      </section>

      <section className="two-column-grid">
        <article className="panel">
          <h3>Recent orders</h3>
          <div className="plain-list">
            {orders.slice(0, 5).map((order) => (
              <div className="list-row" key={order.id}>
                <div>
                  <strong>{order.user.name}</strong>
                  <p className="muted">
                    {order.items.map((item) => `${item.quantity} x ${item.product.name}`).join(", ")}
                  </p>
                </div>
                <span className="pill">{order.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <h3>Live delivery board</h3>
          <div className="plain-list">
            {deliveries.slice(0, 5).map((delivery) => (
              <div className="list-row" key={delivery.id}>
                <div>
                  <strong>{delivery.deliveryStaff.name}</strong>
                  <p className="muted">
                    {delivery.order.user.name} • {delivery.order.address?.addressLine ?? "Address unavailable"}
                  </p>
                </div>
                <span className="pill">{delivery.status}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
