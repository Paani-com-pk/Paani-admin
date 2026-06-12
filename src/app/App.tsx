import { NavLink, Route, Routes } from "react-router-dom";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { CustomersPage } from "../features/customers/CustomersPage";
import { ProductsPage } from "../features/products/ProductsPage";
import { OrdersPage } from "../features/orders/OrdersPage";
import { DeliveriesPage } from "../features/deliveries/DeliveriesPage";
import { SubscriptionsPage } from "../features/subscriptions/SubscriptionsPage";

const links = [
  { to: "/", label: "Overview" },
  { to: "/customers", label: "Customers" },
  { to: "/products", label: "Products" },
  { to: "/orders", label: "Orders" },
  { to: "/deliveries", label: "Deliveries" },
  { to: "/subscriptions", label: "Subscriptions" }
];

export function App() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Paani</p>
          <h1>Admin Operations</h1>
          <p className="muted">
            Unified control room for water commerce, subscriptions, and delivery execution.
          </p>
        </div>
        <nav>
          {links.map((link) => (
            <NavLink
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              key={link.to}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Operations Today</p>
            <h2>Water delivery control center</h2>
          </div>
          <button className="primary-button">Export daily report</button>
        </header>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/deliveries" element={<DeliveriesPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
        </Routes>
      </main>
    </div>
  );
}

