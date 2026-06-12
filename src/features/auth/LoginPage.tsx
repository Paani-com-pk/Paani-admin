import { FormEvent, useState } from "react";

type LoginPageProps = {
  submitting: boolean;
  error: string | null;
  onSubmit: (phone: string, password: string) => Promise<void>;
};

export function LoginPage({ submitting, error, onSubmit }: LoginPageProps) {
  const [phone, setPhone] = useState("03001112222");
  const [password, setPassword] = useState("StrongPassword123!");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(phone.trim(), password);
  }

  return (
    <div className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">PAANI Admin</p>
        <h1>Sign in</h1>
        <p className="muted">
          Use the seeded admin account to access live UAT data from the backend.
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Phone number</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="03001112222"
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin password"
            />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button className="primary-button" disabled={submitting} type="submit">
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </div>
  );
}
