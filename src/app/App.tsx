import { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { PageState } from "../components/PageState";
import { LoginPage } from "../features/auth/LoginPage";
import { CustomersPage } from "../features/customers/CustomersPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { DeliveriesPage } from "../features/deliveries/DeliveriesPage";
import { OrdersPage } from "../features/orders/OrdersPage";
import { ProductsPage } from "../features/products/ProductsPage";
import { SubscriptionsPage } from "../features/subscriptions/SubscriptionsPage";
import { BackofficeUsersPage } from "../features/users/BackofficeUsersPage";
import { UserManagementPage } from "../features/users/UserManagementPage";
import { AdminProfile, api } from "../lib/api";
import { clearStoredToken, getStoredToken, setStoredToken } from "../lib/auth";

const links = [
  { to: "/", label: "Overview" },
  { to: "/customers", label: "Customers" },
  { to: "/products", label: "Products" },
  { to: "/orders", label: "Orders" },
  { to: "/deliveries", label: "Deliveries" },
  { to: "/subscriptions", label: "Subscriptions" },
  { to: "/users", label: "User Management" },
  { to: "/backoffice-users", label: "Backoffice Users" },
];

export function App() {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [authChecking, setAuthChecking] = useState(Boolean(getStoredToken()));
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setProfile(null);
      setAuthChecking(false);
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      try {
        const me = await api.me(token);
        if (cancelled) {
          return;
        }

        if (me.role !== "ADMIN") {
          throw new Error("This account does not have admin access.");
        }

        setProfile(me);
        setAuthError(null);
      } catch (error) {
        if (!cancelled) {
          clearStoredToken();
          setToken(null);
          setProfile(null);
          setAuthError(error instanceof Error ? error.message : "Admin session check failed.");
        }
      } finally {
        if (!cancelled) {
          setAuthChecking(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleLogin(phone: string, password: string) {
    setAuthSubmitting(true);
    setAuthError(null);

    try {
      const session = await api.login(phone, password);
      if (session.user.role !== "ADMIN") {
        throw new Error("This account does not have admin access.");
      }

      setStoredToken(session.accessToken);
      setToken(session.accessToken);
      setProfile({
        id: session.user.sub,
        role: session.user.role,
        name: session.user.name,
        phone: session.user.phone,
      });
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setAuthSubmitting(false);
    }
  }

  function handleLogout() {
    clearStoredToken();
    setToken(null);
    setProfile(null);
    setAuthError(null);
  }

  if (authChecking) {
    return <PageState title="Checking admin session" message="Validating your stored admin token." />;
  }

  if (!token || !profile) {
    return (
      <LoginPage
        submitting={authSubmitting}
        error={authError}
        onSubmit={handleLogin}
      />
    );
  }

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
            <p className="muted">Signed in as {profile.name}</p>
          </div>
          <div className="action-row">
            <button className="secondary-button" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<DashboardPage token={token} />} />
          <Route path="/customers" element={<CustomersPage token={token} />} />
          <Route path="/products" element={<ProductsPage token={token} />} />
          <Route path="/orders" element={<OrdersPage token={token} />} />
          <Route path="/deliveries" element={<DeliveriesPage token={token} />} />
          <Route path="/subscriptions" element={<SubscriptionsPage token={token} />} />
          <Route path="/users" element={<UserManagementPage token={token} />} />
          <Route path="/backoffice-users" element={<BackofficeUsersPage token={token} />} />
        </Routes>
      </main>
    </div>
  );
}
