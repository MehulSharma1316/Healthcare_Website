export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-sky-600">About Us</p>
        <h1 className="text-3xl font-bold text-slate-900">Precision-led diagnostics with care</h1>
        <p className="text-slate-600 max-w-3xl">
          Shree Shyam Healthcare is a patient-first diagnostic laboratory delivering accurate blood test
          results, fast turnarounds, and hygienic sample handling. Our team combines experienced pathologists,
          certified phlebotomists, and automated analyzers to ensure quality at every step.
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        {[
          {
            title: "Mission",
            desc: "Make preventive diagnostics accessible, affordable, and trustworthy for every family.",
          },
          {
            title: "Quality Assurance",
            desc: "Dual quality-control runs daily, calibrated analyzers, and doctor-verified reports.",
          },
          {
            title: "Hygiene",
            desc: "Single-use consumables, cold-chain sample transport, and sanitized collection protocols.",
          },
        ].map((item) => (
          <div key={item.title} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-semibold text-sky-600">{item.title}</p>
            <p className="mt-2 text-slate-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Certifications & Standards</h2>
        <p className="text-sm text-slate-600 mb-3">
          NABL-aligned internal quality checks. External proficiency testing partners can be listed here.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-sm font-semibold text-slate-800">Accreditation placeholder</p>
            <p className="text-xs text-slate-600 mt-1">Upload or list certifications in next phase.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-sm font-semibold text-slate-800">Data & privacy</p>
            <p className="text-xs text-slate-600 mt-1">Secure storage planned for future reports module.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
