import { FormEvent, useEffect, useMemo, useState } from "react";
import { DataTable } from "../../components/DataTable";
import { PageState } from "../../components/PageState";
import { CreateManagedUserPayload, ManagedUserRecord, UpdateManagedUserPayload, api } from "../../lib/api";

type UserManagementPageProps = {
  token: string;
};

type UserRole = "CUSTOMER" | "ADMIN" | "DELIVERY";
type CustomerType = "HOUSEHOLD" | "STORE" | "RESTAURANT" | "OFFICE";

const initialCreateForm: CreateManagedUserPayload = {
  name: "",
  phone: "",
  email: "",
  role: "CUSTOMER",
  customerType: "HOUSEHOLD",
  businessName: "",
  password: "",
};

export function UserManagementPage({ token }: UserManagementPageProps) {
  const [users, setUsers] = useState<ManagedUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<CreateManagedUserPayload>(initialCreateForm);
  const [creating, setCreating] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UpdateManagedUserPayload & { password: string }>({
    password: "",
  });
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [filterRole, setFilterRole] = useState<"ALL" | UserRole>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      try {
        const data = await api.managedUsers(token);
        if (!cancelled) {
          setUsers(data);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load users.");
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

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const roleMatches = filterRole === "ALL" || user.role === filterRole;
      const query = searchTerm.trim().toLowerCase();
      const searchMatches =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.phone.includes(query) ||
        (user.email ?? "").toLowerCase().includes(query) ||
        (user.businessName ?? "").toLowerCase().includes(query);

      return roleMatches && searchMatches;
    });
  }, [filterRole, searchTerm, users]);

  const editingUser = users.find((user) => user.id === editingUserId) ?? null;

  function beginEdit(user: ManagedUserRecord) {
    setEditingUserId(user.id);
    setEditForm({
      name: user.name,
      phone: user.phone,
      email: user.email ?? "",
      role: user.role,
      customerType: user.customerType ?? "HOUSEHOLD",
      businessName: user.businessName ?? "",
      isActive: user.isActive,
      password: "",
    });
    setMessage(null);
    setError(null);
  }

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setMessage(null);
    setError(null);

    try {
      const payload: CreateManagedUserPayload = {
        ...createForm,
        name: createForm.name.trim(),
        phone: createForm.phone.trim(),
        email: createForm.email?.trim() || undefined,
        businessName:
          createForm.role === "CUSTOMER" ? createForm.businessName?.trim() || undefined : undefined,
        customerType: createForm.role === "CUSTOMER" ? createForm.customerType : undefined,
      };

      const created = await api.createManagedUser(token, payload);
      setUsers((currentUsers) => [created, ...currentUsers]);
      setCreateForm(initialCreateForm);
      setMessage(`${created.role} account created.`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to create user.");
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingUser) {
      return;
    }

    setSubmittingEdit(true);
    setMessage(null);
    setError(null);

    try {
      const updatePayload: UpdateManagedUserPayload = {
        name: editForm.name?.trim(),
        phone: editForm.phone?.trim(),
        email: editForm.email?.trim() || null,
        role: editForm.role as UserRole | undefined,
        customerType:
          editForm.role === "CUSTOMER"
            ? (editForm.customerType as CustomerType | undefined)
            : null,
        businessName:
          editForm.role === "CUSTOMER" ? editForm.businessName?.trim() || null : null,
        isActive: editForm.isActive,
      };

      const updated = await api.updateManagedUser(token, editingUser.id, updatePayload);

      if (editForm.password?.trim()) {
        await api.resetManagedUserPassword(token, editingUser.id, editForm.password.trim());
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) => (user.id === updated.id ? { ...user, ...updated } : user))
      );
      setEditingUserId(null);
      setEditForm({ password: "" });
      setMessage(`${updated.name} updated successfully.`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to update user.");
    } finally {
      setSubmittingEdit(false);
    }
  }

  async function handleToggleActive(user: ManagedUserRecord) {
    setMessage(null);
    setError(null);

    try {
      const updated = await api.updateManagedUser(token, user.id, {
        isActive: !user.isActive,
      });
      setUsers((currentUsers) =>
        currentUsers.map((currentUser) => (currentUser.id === updated.id ? { ...currentUser, ...updated } : currentUser))
      );
      setMessage(`${updated.name} is now ${updated.isActive ? "active" : "inactive"}.`);
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "Failed to update user status.");
    }
  }

  if (loading) {
    return <PageState title="Loading users" message="Fetching all user accounts from the UAT backend." />;
  }

  if (error && users.length === 0) {
    return <PageState title="User management unavailable" message={error} tone="error" />;
  }

  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Create user</h3>
            <p className="muted">Create customer, admin, or delivery accounts directly from the dashboard.</p>
          </div>
        </div>
        <form className="inline-form-grid" onSubmit={handleCreateUser}>
          <label className="field">
            <span>Name</span>
            <input
              value={createForm.name}
              onChange={(event) => setCreateForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </label>
          <label className="field">
            <span>Phone</span>
            <input
              value={createForm.phone}
              onChange={(event) => setCreateForm((current) => ({ ...current, phone: event.target.value }))}
              placeholder="03009998888"
              required
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={createForm.email ?? ""}
              onChange={(event) => setCreateForm((current) => ({ ...current, email: event.target.value }))}
            />
          </label>
          <label className="field">
            <span>Role</span>
            <select
              value={createForm.role}
              onChange={(event) =>
                setCreateForm((current) => ({
                  ...current,
                  role: event.target.value as UserRole,
                }))
              }
            >
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="DELIVERY">DELIVERY</option>
            </select>
          </label>
          {createForm.role === "CUSTOMER" ? (
            <>
              <label className="field">
                <span>Customer type</span>
                <select
                  value={createForm.customerType}
                  onChange={(event) =>
                    setCreateForm((current) => ({
                      ...current,
                      customerType: event.target.value as CustomerType,
                    }))
                  }
                >
                  <option value="HOUSEHOLD">HOUSEHOLD</option>
                  <option value="STORE">STORE</option>
                  <option value="RESTAURANT">RESTAURANT</option>
                  <option value="OFFICE">OFFICE</option>
                </select>
              </label>
              <label className="field">
                <span>Business name</span>
                <input
                  value={createForm.businessName ?? ""}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, businessName: event.target.value }))
                  }
                />
              </label>
            </>
          ) : null}
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={createForm.password}
              onChange={(event) => setCreateForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </label>
          <div className="form-actions">
            <button className="primary-button" disabled={creating} type="submit">
              {creating ? "Creating..." : "Create user"}
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Manage users</h3>
            <p className="muted">Search, filter, edit, deactivate, and reset passwords.</p>
          </div>
        </div>
        <div className="toolbar">
          <label className="field compact-field">
            <span>Search</span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Name, phone, email"
            />
          </label>
          <label className="field compact-field">
            <span>Role</span>
            <select
              value={filterRole}
              onChange={(event) => setFilterRole(event.target.value as "ALL" | UserRole)}
            >
              <option value="ALL">ALL</option>
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="DELIVERY">DELIVERY</option>
            </select>
          </label>
        </div>
        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
        <DataTable
          title="All users"
          subtitle="Live UAT accounts across customer, admin, and delivery roles."
          columns={["Name", "Phone", "Email", "Role", "Segment", "Status", "Actions"]}
          rows={filteredUsers}
          emptyMessage="No users match the current filters."
          renderRow={(user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.phone}</td>
              <td>{user.email ?? "No email"}</td>
              <td>{user.role}</td>
              <td>{user.businessName ?? user.customerType ?? "-"}</td>
              <td>{user.isActive ? "Active" : "Inactive"}</td>
              <td>
                <div className="row-actions">
                  <button className="secondary-button small-button" onClick={() => beginEdit(user)}>
                    Edit
                  </button>
                  <button
                    className="secondary-button small-button"
                    onClick={() => void handleToggleActive(user)}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      </section>

      {editingUser ? (
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Edit user</h3>
              <p className="muted">Update profile details, role, status, and optionally reset the password.</p>
            </div>
          </div>
          <form className="inline-form-grid" onSubmit={handleUpdateUser}>
            <label className="field">
              <span>Name</span>
              <input
                value={editForm.name ?? ""}
                onChange={(event) => setEditForm((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </label>
            <label className="field">
              <span>Phone</span>
              <input
                value={editForm.phone ?? ""}
                onChange={(event) => setEditForm((current) => ({ ...current, phone: event.target.value }))}
                required
              />
            </label>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={editForm.email ?? ""}
                onChange={(event) => setEditForm((current) => ({ ...current, email: event.target.value }))}
              />
            </label>
            <label className="field">
              <span>Role</span>
              <select
                value={(editForm.role as UserRole | undefined) ?? editingUser.role}
                onChange={(event) =>
                  setEditForm((current) => ({ ...current, role: event.target.value as UserRole }))
                }
              >
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="DELIVERY">DELIVERY</option>
              </select>
            </label>
            {(editForm.role ?? editingUser.role) === "CUSTOMER" ? (
              <>
                <label className="field">
                  <span>Customer type</span>
                  <select
                    value={
                      ((editForm.customerType as CustomerType | undefined) ??
                        editingUser.customerType ??
                        "HOUSEHOLD") as string
                    }
                    onChange={(event) =>
                      setEditForm((current) => ({
                        ...current,
                        customerType: event.target.value as CustomerType,
                      }))
                    }
                  >
                    <option value="HOUSEHOLD">HOUSEHOLD</option>
                    <option value="STORE">STORE</option>
                    <option value="RESTAURANT">RESTAURANT</option>
                    <option value="OFFICE">OFFICE</option>
                  </select>
                </label>
                <label className="field">
                  <span>Business name</span>
                  <input
                    value={(editForm.businessName as string | undefined) ?? editingUser.businessName ?? ""}
                    onChange={(event) =>
                      setEditForm((current) => ({ ...current, businessName: event.target.value }))
                    }
                  />
                </label>
              </>
            ) : null}
            <label className="field">
              <span>Status</span>
              <select
                value={String(editForm.isActive ?? editingUser.isActive)}
                onChange={(event) =>
                  setEditForm((current) => ({ ...current, isActive: event.target.value === "true" }))
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>
            <label className="field">
              <span>Reset password</span>
              <input
                type="password"
                value={editForm.password}
                onChange={(event) => setEditForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="Leave blank to keep current password"
              />
            </label>
            <div className="form-actions">
              <button className="primary-button" disabled={submittingEdit} type="submit">
                {submittingEdit ? "Saving..." : "Save changes"}
              </button>
              <button
                className="secondary-button"
                onClick={() => {
                  setEditingUserId(null);
                  setEditForm({ password: "" });
                }}
                type="button"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  );
}
