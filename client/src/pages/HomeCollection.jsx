export default function HomeCollection() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-sky-600">Home Sample Collection</p>
        <h1 className="text-3xl font-bold text-slate-900">Hospital-grade collection at your doorstep</h1>
        <p className="text-slate-600 max-w-3xl">
          Certified phlebotomists, single-use consumables, and cold-chain transport to keep your samples stable
          until processing.
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        {[
          {
            title: "Coverage",
            desc: "Jaipur city & nearby areas. Call for same-day slots before 5 PM.",
          },
          {
            title: "Timings",
            desc: "Morning fasting slots from 6:30 AM. Evening slots till 8:00 PM.",
          },
          {
            title: "Hygiene & Safety",
            desc: "Gloves, masks, single-use vacutainers, and sealed biohazard bags.",
          },
        ].map((item) => (
          <div key={item.title} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-semibold text-sky-600">{item.title}</p>
            <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Process</h2>
        <ol className="space-y-3 text-slate-700 text-sm list-decimal list-inside">
          <li>Book a slot with test/package names and preferred time.</li>
          <li>Receive a confirmation call for address and fasting instructions.</li>
          <li>Phlebotomist arrives with sealed kit, collects sample, and labels on-site.</li>
          <li>Sample transported in insulated carrier to our lab for processing.</li>
          <li>Doctor-verified report prepared; you’ll be notified when ready.</li>
        </ol>
      </section>

      <section className="rounded-3xl bg-gradient-to-r from-sky-50 to-emerald-50 border border-slate-100 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Book your home collection</h3>
        <p className="text-sm text-slate-700 mb-4">
          Call/WhatsApp or use the booking form to request home collection. Please mention fasting requirements if
          applicable.
        </p>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <a className="px-4 py-2 rounded-full bg-sky-600 text-white" href="tel:+919876543210">
            Call +91 98765 43210
          </a>
          <a className="px-4 py-2 rounded-full bg-emerald-600 text-white" href="https://wa.me/919876543210">
            WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
