import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminBookings, adminPackages, adminTests } from "../api";

const emptyTest = {
  name: "",
  price: "",
  fastingRequired: false,
  reportTime: "",
  category: "",
  active: true,
};

const emptyPackage = {
  name: "",
  price: "",
  idealFor: "",
  testsIncluded: "",
  active: true,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("tests");
  const [tests, setTests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [testForm, setTestForm] = useState(emptyTest);
  const [packageForm, setPackageForm] = useState(emptyPackage);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => {
    if (!token) {
      navigate("/admin");
      return;
    }
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [t, p, b] = await Promise.all([
        adminTests.list(),
        adminPackages.list(),
        adminBookings.list(),
      ]);
      setTests(t);
      setPackages(p);
      setBookings(b);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await adminTests.create({ ...testForm, price: Number(testForm.price) });
      setTestForm(emptyTest);
      setStatus("Test created");
      loadAll();
    } catch (err) {
      console.error(err);
      setStatus("Error creating test");
    }
  };

  const handlePackageSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      const payload = {
        ...packageForm,
        price: Number(packageForm.price),
        testsIncluded: packageForm.testsIncluded
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      await adminPackages.create(payload);
      setPackageForm(emptyPackage);
      setStatus("Package created");
      loadAll();
    } catch (err) {
      console.error(err);
      setStatus("Error creating package");
    }
  };

  const toggleActive = async (type, item) => {
    const updateFn = type === "test" ? adminTests.update : adminPackages.update;
    await updateFn(item._id, { active: !item.active });
    loadAll();
  };

  const removeItem = async (type, id) => {
    const removeFn = type === "test" ? adminTests.remove : adminPackages.remove;
    await removeFn(id);
    loadAll();
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-sky-600">Admin</p>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadAll}
            className="px-4 py-2 rounded-full border border-slate-200 text-sm font-semibold text-slate-700"
          >
            Refresh
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {[
          { key: "tests", label: "Tests" },
          { key: "packages", label: "Packages" },
          { key: "bookings", label: "Bookings" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full border text-sm font-semibold ${
              tab === t.key ? "bg-sky-100 border-sky-200 text-sky-700" : "border-slate-200 text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {status && <p className="text-sm text-emerald-700 font-semibold">{status}</p>}
      {loading && <p className="text-sm text-slate-600">Loading...</p>}

      {tab === "tests" && (
        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={handleTestSubmit} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-3">
            <p className="text-lg font-bold text-slate-900">Create Test</p>
            <input
              required
              placeholder="Name"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              value={testForm.name}
              onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
            />
            <input
              required
              type="number"
              placeholder="Price"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              value={testForm.price}
              onChange={(e) => setTestForm({ ...testForm, price: e.target.value })}
            />
            <input
              required
              placeholder="Category"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              value={testForm.category}
              onChange={(e) => setTestForm({ ...testForm, category: e.target.value })}
            />
            <input
              required
              placeholder="Report time (e.g., 24 hours)"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              value={testForm.reportTime}
              onChange={(e) => setTestForm({ ...testForm, reportTime: e.target.value })}
            />
            <div className="flex items-center gap-2">
              <input
                id="fasting"
                type="checkbox"
                checked={testForm.fastingRequired}
                onChange={(e) => setTestForm({ ...testForm, fastingRequired: e.target.checked })}
              />
              <label htmlFor="fasting" className="text-sm text-slate-700">
                Fasting required
              </label>
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold"
            >
              Save Test
            </button>
          </form>

          <div className="space-y-3">
            {tests.map((t) => (
              <div key={t._id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  <p className="text-sm text-slate-600">
                    ₹{t.price} • {t.category} • {t.reportTime}
                  </p>
                  <p className="text-xs text-slate-500">
                    Fasting: {t.fastingRequired ? "Yes" : "No"} | Status: {t.active ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive("test", t)}
                    className="px-3 py-1 rounded-full border border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    {t.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => removeItem("test", t._id)}
                    className="px-3 py-1 rounded-full border border-rose-200 text-xs font-semibold text-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {!tests.length && <p className="text-sm text-slate-600">No tests yet.</p>}
          </div>
        </div>
      )}

      {tab === "packages" && (
        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={handlePackageSubmit} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-3">
            <p className="text-lg font-bold text-slate-900">Create Package</p>
            <input
              required
              placeholder="Name"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              value={packageForm.name}
              onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
            />
            <input
              required
              type="number"
              placeholder="Price"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              value={packageForm.price}
              onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
            />
            <input
              required
              placeholder="Ideal for"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              value={packageForm.idealFor}
              onChange={(e) => setPackageForm({ ...packageForm, idealFor: e.target.value })}
            />
            <textarea
              required
              rows={3}
              placeholder="Tests included (comma separated)"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              value={packageForm.testsIncluded}
              onChange={(e) => setPackageForm({ ...packageForm, testsIncluded: e.target.value })}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold"
            >
              Save Package
            </button>
          </form>

          <div className="space-y-3">
            {packages.map((p) => (
              <div key={p._id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{p.name}</p>
                  <p className="text-sm text-slate-600">₹{p.price} • {p.idealFor}</p>
                  <p className="text-xs text-slate-500">
                    Status: {p.active ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive("package", p)}
                    className="px-3 py-1 rounded-full border border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    {p.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => removeItem("package", p._id)}
                    className="px-3 py-1 rounded-full border border-rose-200 text-xs font-semibold text-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {!packages.length && <p className="text-sm text-slate-600">No packages yet.</p>}
          </div>
        </div>
      )}

      {tab === "bookings" && (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b._id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{b.patientName}</p>
                  <p className="text-sm text-slate-600">Mobile: {b.mobile}</p>
                </div>
                <div className="text-sm text-slate-600">
                  {b.selectionType.toUpperCase()} • {b.homeCollection ? "Home" : "Walk-in"}
                </div>
              </div>
              <p className="text-sm text-slate-600">
                Preferred: {b.preferredDate} at {b.preferredTime}
              </p>
              {b.address && <p className="text-sm text-slate-600">Address: {b.address}</p>}
              <p className="text-xs text-slate-500">Created: {new Date(b.createdAt).toLocaleString()}</p>
            </div>
          ))}
          {!bookings.length && <p className="text-sm text-slate-600">No bookings yet.</p>}
        </div>
      )}
    </div>
  );
}
