import { Metric } from "../lib/types";

export function MetricCard({ metric }: { metric: Metric }) {
  return (
    <article className="metric-card">
      <p className="metric-label">{metric.label}</p>
      <h3>{metric.value}</h3>
      <p className="metric-change">{metric.change}</p>
    </article>
  );
}

