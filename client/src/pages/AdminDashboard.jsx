import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminBookings, adminPackages, adminTests, adminPosters, adminUpload } from "../api";

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
  isPopular: false,
};

const emptyPoster = {
  title: "",
  active: true,
  packageId: "",
  order: 0,
  publicId: "",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("tests");
  const [tests, setTests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [posters, setPosters] = useState([]);
  const [testForm, setTestForm] = useState(emptyTest);
  const [packageForm, setPackageForm] = useState(emptyPackage);
  const [posterForm, setPosterForm] = useState(emptyPoster);
  const [posterImage, setPosterImage] = useState(null);
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
      const [t, p, b, pst] = await Promise.all([
        adminTests.list().catch(() => []),
        adminPackages.list().catch(() => []),
        adminBookings.list().catch(() => []),
        adminPosters.list().catch(() => []),
      ]);
      setTests(Array.isArray(t) ? t : []);
      setPackages(Array.isArray(p) ? p : []);
      setBookings(Array.isArray(b) ? b : []);
      setPosters(Array.isArray(pst) ? pst : []);
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
        isPopular: packageForm.isPopular,
      };
      await adminPackages.create(payload);
      setPackageForm(emptyPackage);
      setStatus("Package created");
      loadAll();
    } catch (err) {
      if (err.response?.status === 400) {
        setStatus(err.response.data.message);
      } else {
        console.error(err);
        setStatus("Error creating package");
      }
    }
  };

  const toggleActive = async (type, item) => {
    let updateFn;
    if (type === "test") updateFn = adminTests.update;
    else if (type === "package") updateFn = adminPackages.update;
    else if (type === "poster") updateFn = adminPosters.update;
    await updateFn(item._id, { active: !item.active });
    loadAll();
  };

  const togglePopular = async (pkg) => {
    try {
      await adminPackages.update(pkg._id, { isPopular: !pkg.isPopular });
      loadAll();
      setStatus(`Package ${!pkg.isPopular ? "marked as popular" : "removed from popular"}`);
    } catch (err) {
      if (err.response?.status === 400) {
        setStatus(err.response.data.message);
      } else {
        console.error(err);
        setStatus("Error updating package");
      }
    }
  };

  const removeItem = async (type, id) => {
    let removeFn;
    if (type === "test") removeFn = adminTests.remove;
    else if (type === "package") removeFn = adminPackages.remove;
    else if (type === "poster") removeFn = adminPosters.remove;
    await removeFn(id);
    loadAll();
  };

  const handlePosterSubmit = async (e) => {
    e.preventDefault();
    if (!posterImage) {
      setStatus("Please select an image");
      return;
    }
    setStatus("Uploading image...");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", posterImage);
      const { url, publicId } = await adminUpload(formData);

      const payload = {
        title: posterForm.title,
        order: Number(posterForm.order),
        active: posterForm.active,
        image: url,
        publicId: publicId,
      };
      if (posterForm.packageId) payload.packageId = posterForm.packageId;

      await adminPosters.create(payload);
      setPosterForm(emptyPoster);
      setPosterImage(null);
      if (document.getElementById("posterInput")) document.getElementById("posterInput").value = "";
      setStatus("Poster created");
      loadAll();
    } catch (err) {
      console.error(err);
      setStatus("Error creating poster");
      setLoading(false);
    }
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
          { key: "posters", label: "Posters" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full border text-sm font-semibold ${tab === t.key ? "bg-sky-100 border-sky-200 text-sky-700" : "border-slate-200 text-slate-700"
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
            <div className="flex items-center gap-2">
              <input
                id="isPopular"
                type="checkbox"
                checked={packageForm.isPopular}
                onChange={(e) => setPackageForm({ ...packageForm, isPopular: e.target.checked })}
              />
              <label htmlFor="isPopular" className="text-sm text-slate-700">
                Mark as Popular Package (Max 3)
              </label>
            </div>
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
                  <p className="text-xs text-slate-500 mt-1">
                    Status: {p.active ? "Active" : "Inactive"}
                    {p.isPopular && <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold">Popular</span>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePopular(p)}
                    className={`px-3 py-1 rounded-full border text-xs font-semibold ${p.isPopular ? "border-amber-200 text-amber-700" : "border-slate-200 text-slate-700"}`}
                  >
                    {p.isPopular ? "Unmark Popular" : "Make Popular"}
                  </button>
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
      {tab === "posters" && (
        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={handlePosterSubmit} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-3">
            <p className="text-lg font-bold text-slate-900">Create Poster</p>
            <input
              required
              id="posterInput"
              type="file"
              accept="image/*"
              className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              onChange={(e) => setPosterImage(e.target.files[0])}
            />
            <input
              placeholder="Title (Optional)"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              value={posterForm.title}
              onChange={(e) => setPosterForm({ ...posterForm, title: e.target.value })}
            />
            <input
              type="number"
              placeholder="Order"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              value={posterForm.order}
              onChange={(e) => setPosterForm({ ...posterForm, order: e.target.value })}
            />
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              value={posterForm.packageId}
              onChange={(e) => setPosterForm({ ...posterForm, packageId: e.target.value })}
            >
              <option value="">Link to Package (Optional)</option>
              {packages.filter((p) => p.active).map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold disabled:opacity-70"
            >
              Save Poster
            </button>
          </form>

          <div className="space-y-3">
            {posters.map((p) => (
              <div key={p._id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-4">
                <img src={p.image} alt={p.title || "Poster"} className="w-24 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{p.title || "Untitled"}</p>
                  <p className="text-xs text-slate-600">Order: {p.order} {p.packageId ? `• Linked: ${p.packageId.name}` : ""}</p>
                  <p className="text-xs text-slate-500">Status: {p.active ? "Active" : "Inactive"}</p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => toggleActive("poster", p)} className="px-3 py-1 rounded-full border border-slate-200 text-xs font-semibold text-slate-700">
                      {p.active ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => removeItem("poster", p._id)} className="px-3 py-1 rounded-full border border-rose-200 text-xs font-semibold text-rose-700">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!posters.length && <p className="text-sm text-slate-600">No posters yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
