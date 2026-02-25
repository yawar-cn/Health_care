import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { getUserByEmail } from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await login(form);
      const token = response?.token || response;
      if (!token) {
        throw new Error("Login failed");
      }

      let user = response?.user || null;
      if (!user?.email) {
        user = { ...(user || {}), email: form.email };
      }

      const needsProfileFetch =
        !user?.id ||
        !user?.role ||
        !user?.name ||
        (user?.role === "DOCTOR" && !user?.specialization);
      if (needsProfileFetch) {
        try {
          const profile = await getUserByEmail(form.email);
          if (profile) {
            user = profile;
          }
        } catch (profileError) {
          // Continue when auth response already provides role and email.
          if (!user?.role) {
            throw profileError;
          }
        }
      }

      setAuth(token, user);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">
          Sign in to MediConnect
        </h2>
        <p className="text-sm text-dusk/80">
          Access your secure healthcare workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
            Email
          </label>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-dusk">
            Password
          </label>
          <input
            className="input"
            type="password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error ? <p className="text-sm text-blush">{error}</p> : null}

        <button className="button w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="text-sm text-dusk/70">
        New to MediConnect?{" "}
        <a className="font-semibold text-ink underline" href="/register">
          Create an account
        </a>
      </p>
    </div>
  );
}
