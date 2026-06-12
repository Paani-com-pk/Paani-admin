import { MetricCard } from "../../components/MetricCard";
import { deliveries, metrics, orders } from "../../lib/mock-data";

export function DashboardPage() {
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
          <h3>Delivery operations are healthy</h3>
          <p className="muted">
            31 drivers are active, 6 orders need assignment, and subscription routes are pacing ahead
            of plan in Gulshan and DHA clusters.
          </p>
        </article>
        <article className="panel">
          <p className="eyebrow">Attention Queue</p>
          <ul className="plain-list">
            <li>3 support tickets need escalation</li>
            <li>2 orders are waiting for reassignment</li>
            <li>1 subscription payment exception is pending review</li>
          </ul>
        </article>
      </section>

      <section className="two-column-grid">
        <article className="panel">
          <h3>Recent orders</h3>
          <div className="plain-list">
            {orders.map((order) => (
              <div className="list-row" key={order.id}>
                <div>
                  <strong>{order.customer}</strong>
                  <p className="muted">{order.items}</p>
                </div>
                <span className="pill">{order.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <h3>Live delivery board</h3>
          <div className="plain-list">
            {deliveries.map((delivery) => (
              <div className="list-row" key={delivery.id}>
                <div>
                  <strong>{delivery.staff}</strong>
                  <p className="muted">
                    {delivery.customer} • ETA {delivery.eta}
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

