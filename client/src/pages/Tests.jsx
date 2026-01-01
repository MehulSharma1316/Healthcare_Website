import { useEffect, useMemo, useState } from "react";
import { fetchTests } from "../api";
import { Link } from "react-router-dom";

export default function Tests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetchTests()
      .then((data) => setTests(data))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(tests.map((t) => t.category))).filter(Boolean);
    return ["all", ...cats];
  }, [tests]);

  const filtered = useMemo(() => {
    if (category === "all") return tests;
    return tests.filter((t) => t.category === category);
  }, [tests, category]);

  return (
    <div className="section py-12 space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-sky-700 font-semibold">Tests</p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">All blood tests</h1>
        <p className="text-slate-600 leading-relaxed">
          Transparent pricing, fasting indicators, and report timelines to help you plan better.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full border text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400 focus-visible:ring-offset-slate-50 ${
              c === category ? "bg-sky-100 border-sky-200 text-sky-700" : "border-slate-200 text-slate-700 hover:border-sky-200 hover:text-sky-700"
            }`}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-slate-600">Loading tests...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <div key={t._id} className="card p-5 space-y-1.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{t.category}</p>
                </div>
                <p className="text-xl font-bold text-slate-900">₹{t.price}</p>
              </div>
              <p className="text-sm text-slate-600">
                Report time: <span className="font-semibold text-slate-800">{t.reportTime}</span>
              </p>
              <p className="text-sm text-slate-600">
                Fasting:{" "}
                <span className={t.fastingRequired ? "text-amber-600 font-semibold" : "text-emerald-600 font-semibold"}>
                  {t.fastingRequired ? "Required" : "Not required"}
                </span>
              </p>
              <div className="pt-2">
                <Link
                  to="/book"
                  state={{ source: "test", itemId: t._id, name: t.name, price: t.price }}
                  className="btn-primary text-sm"
                >
                  Book this test
                </Link>
              </div>
            </div>
          ))}
          {!filtered.length && <p className="text-sm text-slate-600">No tests in this category.</p>}
        </div>
      )}
    </div>
  );
}
