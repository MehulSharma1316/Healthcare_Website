import { useEffect, useRef, useState } from "react";
import { fetchPackages } from "../api";
import { Link, useLocation } from "react-router-dom";

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const cardRefs = useRef({});

  useEffect(() => {
    fetchPackages()
      .catch(() => [])
      .then((data) => setPackages(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const highlightId = location.state?.highlightId;
    if (highlightId) {
      setOpenId(highlightId);
      setTimeout(() => {
        const el = cardRefs.current[highlightId];
        if (el?.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [location.state, packages]);

  return (
    <div className="section py-12 space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-sky-700 font-semibold">Packages</p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Preventive health packages</h1>
        <p className="text-slate-600 leading-relaxed">
          Curated profiles covering essential markers. Expand to see included tests and ideal audience.
        </p>
      </header>

      {loading ? (
        <p className="text-sm text-slate-600">Loading packages...</p>
      ) : (
        <div className="space-y-3">
          {packages.map((pkg) => {
            const open = openId === pkg._id;
            return (
              <div
                key={pkg._id}
                ref={(el) => (cardRefs.current[pkg._id] = el)}
                className={`card overflow-hidden ${location.state?.highlightId === pkg._id ? "ring-2 ring-sky-200" : ""}`}
              >
                <button
                  onClick={() => setOpenId(open ? null : pkg._id)}
                  className="w-full flex items-start justify-between gap-3 p-5 text-left hover:bg-slate-50 transition"
                >
                  <div>
                    <p className="text-sm font-semibold text-sky-600">{pkg.name}</p>
                    <p className="text-2xl font-bold text-slate-900">₹{pkg.price}</p>
                    <p className="text-sm text-slate-600 mt-1">{pkg.idealFor}</p>
                  </div>
                  <span className="text-2xl text-slate-500 leading-none">{open ? "−" : "+"}</span>
                </button>
                {open && (
                  <div className="px-5 pb-5 space-y-3 bg-white">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 mb-1">Tests included</p>
                      <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                        {pkg.testsIncluded?.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                    <Link
                      to="/book"
                      state={{ source: "package", itemId: pkg._id, name: pkg.name, price: pkg.price }}
                      className="btn-primary w-full sm:w-auto"
                    >
                      Book this package →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
          {!packages.length && (
            <div className="card p-6 flex flex-col gap-3">
              <p className="text-base font-semibold text-slate-900">No packages yet</p>
              <p className="text-sm text-slate-600">
                We’re preparing curated panels. Please check back soon or contact us for a custom quote.
              </p>
              <Link to="/book" className="btn-primary w-full sm:w-auto">
                Talk to us
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
