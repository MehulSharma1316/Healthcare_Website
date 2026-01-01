import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);
    try {
      const { token } = await adminLogin({ email, password });
      localStorage.setItem("adminToken", token);
      setStatus("success");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <p className="text-sm font-semibold text-sky-600 mb-2">Admin</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-800">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              placeholder="admin@shreeshyam.com"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-800">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold shadow disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
          {status === "error" && (
            <p className="text-sm text-rose-600 font-semibold">Invalid credentials. Try again.</p>
          )}
        </form>
      </div>
    </div>
  );
}
