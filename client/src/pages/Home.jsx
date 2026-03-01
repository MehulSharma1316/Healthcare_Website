import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPopularPackages, fetchPosters } from "../api";
import Carousel from "../components/Carousel";

const trustPoints = [
  { title: "99%+ Accuracy", desc: "Automated analyzers with dual QC" },
  { title: "Hygienic", desc: "Single-use vacutainers, sanitized labs" },
  { title: "Fast Reports", desc: "Same-day reporting on most tests" },
  { title: "Home Collection", desc: "NABL-grade protocol at your doorstep" },
];

const services = [
  { title: "Blood Tests", desc: "Complete blood counts, thyroid, diabetes, lipids and more." },
  { title: "Health Packages", desc: "Curated preventive health profiles for every need." },
  { title: "Home Collection", desc: "Certified phlebotomists, temperature-controlled transport." },
];

const steps = [
  { title: "Book", desc: "Choose test or package and preferred time." },
  { title: "Sample", desc: "Certified phlebotomist collects the sample." },
  { title: "Report", desc: "Doctor-verified report delivered quickly." },
];

export default function Home() {
  const [packages, setPackages] = useState([]);
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchPopularPackages(), fetchPosters()])
      .then(([pkgs, pstrs]) => {
        setPackages(pkgs);
        setPosters(pstrs);
      })
      .finally(() => setLoading(false));
  }, []);

  const dynamicSlides = posters.map((p) => ({
    id: p._id,
    title: p.title,
    subtitle: "",
    packageId: p.packageId,
    image: p.image,
  }));

  const fallbackSlides = [
    {
      id: "pkg-basic",
      title: "Executive Health Package",
      subtitle: "Comprehensive blood profile with fasting glucose, lipid, CBC, LFT, KFT.",
      packageId: packages[0]?._id,
      image:
        "https://images.unsplash.com/photo-1584515904893-ffcd0f5c1b2b?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "pkg-wellness",
      title: "Wellness Check",
      subtitle: "Thyroid, vitamins, and metabolic markers for proactive care.",
      packageId: packages[1]?._id,
      image:
        "https://images.unsplash.com/photo-1582719478248-54e9f2af44be?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "poster-home-collection",
      title: "Home Sample Collection",
      subtitle: "Book your slot. Hygienic, temperature-controlled transport.",
      image:
        "https://images.unsplash.com/photo-1530023367847-a683933f4177?auto=format&fit=crop&w=1200&q=80",
    },
  ].filter(Boolean);

  const slides = dynamicSlides.length > 0 ? dynamicSlides : fallbackSlides;

  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
        <div className="absolute inset-0 pointer-events-none opacity-50 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.15),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.12),transparent_35%)]" />
        <div className="max-w-6xl mx-auto px-4 py-16 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-sky-700 uppercase tracking-wide mb-3">
                Shree Shyam Healthcare
              </p>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight md:leading-[1.1]">
                Accurate. Hygienic. Fast.
                <span className="block text-sky-600">Your trusted diagnostic laboratory.</span>
              </h1>
              <p className="mt-5 text-base md:text-lg text-slate-600 leading-relaxed">
                Book reliable blood tests, curated health packages, and home sample collection with NABL-grade
                protocols.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/book" className="btn-primary">
                  Book a Test
                </Link>
                <Link to="/tests" className="btn-secondary">
                  View Tests
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Home Collection Available
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                  Doctor-verified Reports
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -left-6 h-24 w-24 rounded-2xl bg-emerald-100 blur-2xl" />
              <div className="absolute -bottom-8 -right-6 h-24 w-24 rounded-2xl bg-sky-100 blur-2xl" />
              <div className="relative bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
                <p className="text-sm font-semibold text-slate-500 mb-2">Why choose us</p>
                <ul className="space-y-3">
                  {trustPoints.slice(0, 3).map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
                      <div>
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="text-sm text-slate-600">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-sky-50 border border-slate-100">
                  <p className="text-sm text-slate-700">
                    Call / WhatsApp: <span className="font-semibold text-slate-900">+91 98765 43210</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Poster / Offer Slider */}
      <section className="section">
        <Carousel
          slides={slides}
          onViewImage={(slide) => setLightbox(slide)}
        />
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close"
              onClick={() => setLightbox(null)}
              className="absolute right-3 top-3 h-10 w-10 rounded-full bg-white/80 text-slate-700 shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400"
            >
              ×
            </button>
            {lightbox.image && (
              <img src={lightbox.image} alt={lightbox.title} className="w-full h-[60vh] object-cover" />
            )}
            <div className="p-4 md:p-6 space-y-1">
              <p className="text-xs uppercase tracking-wide text-sky-700 font-semibold">
                {lightbox.tagline || (lightbox.packageId ? "Offer" : "Announcement")}
              </p>
              <h3 className="text-xl font-bold text-slate-900">{lightbox.title}</h3>
              <p className="text-sm text-slate-600">{lightbox.subtitle}</p>

              {lightbox.packageId && (
                <div className="pt-4">
                  <Link
                    to="/packages"
                    state={{ highlightId: typeof lightbox.packageId === 'object' ? lightbox.packageId._id : lightbox.packageId }}
                    className="btn-primary"
                  >
                    Book This Package
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Services */}
      <section className="section">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-sky-700 font-semibold">Services</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">What we offer</h2>
          </div>
          <Link to="/book" className="hidden sm:inline-flex btn-secondary">
            Book now →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {services.map((s) => (
            <div key={s.title} className="card p-5">
              <p className="text-sm font-semibold text-sky-600">{s.title}</p>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Packages */}
      <section className="section">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-sky-700 font-semibold">Popular packages</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Preventive health picks</h2>
          </div>
          <Link to="/packages" className="hidden sm:inline-flex btn-secondary">
            View all →
          </Link>
        </div>
        {loading ? (
          <p className="text-sm text-slate-600">Loading packages...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {packages.map((pkg) => (
              <div key={pkg._id} className="card p-5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-sky-600">{pkg.name}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">₹{pkg.price}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{pkg.idealFor}</p>
                <ul className="mt-3 text-sm text-slate-600 space-y-1 list-disc list-inside">
                  {pkg.testsIncluded?.slice(0, 4).map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                  {pkg.testsIncluded?.length > 4 && <li>+{pkg.testsIncluded.length - 4} more</li>}
                </ul>
                <div className="pt-2">
                  <Link
                    to="/book"
                    state={{ source: "package", itemId: pkg._id, name: pkg.name, price: pkg.price }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Book this package →
                  </Link>
                </div>
              </div>
            ))}
            {!packages.length && (
              <div className="card p-6 flex flex-col items-start gap-3">
                <p className="text-base font-semibold text-slate-900">No packages yet</p>
                <p className="text-sm text-slate-600">
                  Our team is curating the best preventive packages. Please check back soon or call us for a custom panel.
                </p>
                <Link to="/book" className="btn-primary">
                  Talk to us
                </Link>
              </div>
            )}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="section">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">How it works</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step, idx) => (
            <div key={step.title} className="card p-5">
              <div className="h-10 w-10 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center mb-3">
                {idx + 1}
              </div>
              <p className="font-semibold text-slate-900">{step.title}</p>
              <p className="text-sm text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust highlights */}
      <section className="section">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Why patients trust us</h2>
        <div className="grid md:grid-cols-4 gap-5">
          {trustPoints.map((t) => (
            <div key={t.title} className="card p-5">
              <p className="font-semibold text-slate-900">{t.title}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact preview */}
      <section className="section">
        <div className="rounded-3xl bg-gradient-to-r from-sky-600 to-emerald-600 text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <p className="text-sm uppercase tracking-wide font-semibold">Need assistance?</p>
            <h3 className="text-2xl md:text-3xl font-bold mt-1">Talk to our care team</h3>
            <p className="text-sm md:text-base text-slate-100 mt-2 leading-relaxed">
              Call or WhatsApp for bookings, price lists, and sample collection slots.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a className="btn-secondary bg-white text-sky-700 border-white text-sm" href="tel:+919876543210">
              Call +91 98765 43210
            </a>
            <a
              className="btn-primary bg-white/20 border border-white/30 text-white hover:opacity-95"
              href="https://wa.me/919876543210"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
