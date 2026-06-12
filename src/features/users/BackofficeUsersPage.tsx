import { FormEvent, useEffect, useState } from "react";
import { DataTable } from "../../components/DataTable";
import { PageState } from "../../components/PageState";
import { BackofficeUserRecord, api } from "../../lib/api";

type BackofficeUsersPageProps = {
  token: string;
};

const initialForm = {
  name: "",
  phone: "",
  email: "",
  role: "ADMIN" as "ADMIN" | "DELIVERY",
  password: "",
};

export function BackofficeUsersPage({ token }: BackofficeUsersPageProps) {
  const [users, setUsers] = useState<BackofficeUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      try {
        const data = await api.backofficeUsers(token);
        if (!cancelled) {
          setUsers(data);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load backoffice users.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadUsers();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitMessage(null);
    setError(null);

    try {
      const createdUser = await api.createBackofficeUser(token, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        role: form.role,
        password: form.password,
      });

      setUsers((currentUsers) => [createdUser, ...currentUsers]);
      setForm(initialForm);
      setSubmitMessage(`${createdUser.role} user created successfully.`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <PageState title="Loading backoffice users" message="Fetching admin and rider accounts." />;
  }

  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Create backoffice user</h3>
            <p className="muted">Create new admin or rider accounts directly from the UAT dashboard.</p>
          </div>
        </div>
        <form className="inline-form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Bilal Ahmed"
              required
            />
          </label>
          <label className="field">
            <span>Phone</span>
            <input
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              placeholder="03009998888"
              required
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="ops@paani.pk"
            />
          </label>
          <label className="field">
            <span>Role</span>
            <select
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value as "ADMIN" | "DELIVERY",
                }))
              }
            >
              <option value="ADMIN">ADMIN</option>
              <option value="DELIVERY">DELIVERY</option>
            </select>
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="StrongPassword123!"
              required
            />
          </label>
          <div className="form-actions">
            <button className="primary-button" disabled={submitting} type="submit">
              {submitting ? "Creating..." : "Create user"}
            </button>
          </div>
        </form>
        {submitMessage ? <p className="success-text">{submitMessage}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
      </section>

      <DataTable
        title="Backoffice users"
        subtitle="Current admin and rider accounts available in the UAT backend."
        columns={["Name", "Phone", "Email", "Role", "Status", "Created"]}
        rows={users}
        emptyMessage="No backoffice users found."
        renderRow={(user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.phone}</td>
            <td>{user.email ?? "No email"}</td>
            <td>{user.role}</td>
            <td>{user.isActive ? "Active" : "Inactive"}</td>
            <td>{new Date(user.createdAt).toLocaleString()}</td>
          </tr>
        )}
      />
    </div>
  );
}
