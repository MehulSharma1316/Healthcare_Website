import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { createBooking, fetchPackages, fetchTests } from "../api";

const initialForm = {
  patientName: "",
  mobile: "",
  selectionType: "test",
  selectionId: "",
  homeCollection: false,
  address: "",
  preferredDate: "",
  preferredTime: "",
};

export default function BookTest() {
  const [tests, setTests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockInfo, setLockInfo] = useState(null);
  const location = useLocation();
  const bookingState = location.state;

  useEffect(() => {
    fetchTests().catch(() => []).then((data) => setTests(Array.isArray(data) ? data : []));
    fetchPackages().catch(() => []).then((data) => setPackages(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (bookingState?.source && bookingState?.itemId) {
      const selectionType = bookingState.source === "package" ? "package" : "test";
      setForm((prev) => ({
        ...prev,
        selectionType,
        selectionId: bookingState.itemId,
      }));
      setLockInfo({
        type: selectionType,
        name: bookingState.name,
        price: bookingState.price,
        itemId: bookingState.itemId,
        source: bookingState.source,
      });
    } else {
      setLockInfo(null);
    }
  }, [bookingState]);

  const options = useMemo(() => {
    return form.selectionType === "test" ? tests : packages;
  }, [form.selectionType, tests, packages]);

  const selectedItem =
    (Array.isArray(options) ? options.find((opt) => opt._id === form.selectionId) : null) ||
    (lockInfo && lockInfo.itemId === form.selectionId ? lockInfo : null);
  const selectedPrice = selectedItem?.price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);
    try {
      await createBooking(form);
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-sky-600">Book Test / Package</p>
        <h1 className="text-3xl font-bold text-slate-900">Schedule your blood test</h1>
        <p className="text-slate-600">
          Fill the form and our care team will confirm your slot. Home collection available for fasting and convenience.
        </p>
        {lockInfo && (
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 font-semibold">
              Booking from {lockInfo.type === "package" ? "Package" : "Test"}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
              {lockInfo.name} {lockInfo.price ? `• ₹${lockInfo.price}` : ""}
            </span>
          </div>
        )}
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-800">Patient name</label>
            <input
              required
              value={form.patientName}
              onChange={(e) => setForm({ ...form, patientName: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-800">Mobile number</label>
            <input
              required
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-800">Select type</label>
            <div className="mt-2 flex gap-3">
              {["test", "package"].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setForm({ ...form, selectionType: type, selectionId: "" })}
                  disabled={!!lockInfo}
                  className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${form.selectionType === type
                      ? "bg-sky-100 border-sky-200 text-sky-700"
                      : "border-slate-200 text-slate-700 hover:border-sky-200 hover:text-sky-700"
                    } ${lockInfo ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {type === "test" ? "Test" : "Package"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-800">
              {form.selectionType === "test" ? "Choose a test" : "Choose a package"}
            </label>
            <select
              required
              value={form.selectionId}
              onChange={(e) => setForm({ ...form, selectionId: e.target.value })}
              disabled={!!lockInfo}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none disabled:opacity-70 disabled:bg-slate-50"
            >
              <option value="">Select</option>
              {options.map((opt) => (
                <option key={opt._id} value={opt._id}>
                  {opt.name} {opt.price ? `- ₹${opt.price}` : ""}
                </option>
              ))}
            </select>
            {selectedPrice && (
              <p className="mt-2 text-sm font-semibold text-slate-900">
                Amount: <span className="text-emerald-700">₹{selectedPrice}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-800">Preferred date</label>
            <input
              type="date"
              required
              value={form.preferredDate}
              onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-800">Preferred time</label>
            <input
              type="time"
              required
              value={form.preferredTime}
              onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800">Home collection needed?</label>
          <div className="flex gap-3">
            {[true, false].map((val) => (
              <button
                type="button"
                key={val ? "yes" : "no"}
                onClick={() => setForm({ ...form, homeCollection: val })}
                className={`px-4 py-2 rounded-full border text-sm font-semibold ${form.homeCollection === val
                    ? "bg-emerald-100 border-emerald-200 text-emerald-700"
                    : "border-slate-200 text-slate-700"
                  }`}
              >
                {val ? "Yes" : "No"}
              </button>
            ))}
          </div>
          {form.homeCollection && (
            <textarea
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
              placeholder="Complete address for home collection"
              rows={3}
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold shadow disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit booking"}
          </button>
          {status === "success" && <p className="text-sm text-emerald-600 font-semibold">Booking saved!</p>}
          {status === "error" && <p className="text-sm text-rose-600 font-semibold">Failed. Try again.</p>}
        </div>
      </form>
    </div>
  );
}
