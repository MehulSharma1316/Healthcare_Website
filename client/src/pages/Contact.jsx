export default function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-sky-600">Contact Us</p>
        <h1 className="text-3xl font-bold text-slate-900">We’re here to help</h1>
        <p className="text-slate-600 max-w-3xl">
          Call, WhatsApp, or visit us for bookings, pricing, or sample collection queries.
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-semibold text-sky-600">Address</p>
          <p className="mt-2 text-sm text-slate-700">21 Lab Street, Jaipur, Rajasthan</p>
          <p className="text-xs text-slate-500 mt-1">Landmark: Near City Hospital</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <p className="text-sm font-semibold text-sky-600">Phone & WhatsApp</p>
          <p className="text-sm text-slate-700">+91 98765 43210</p>
          <p className="text-sm text-slate-700">+91 98765 43211</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <p className="text-sm font-semibold text-sky-600">Timings</p>
          <p className="text-sm text-slate-700">Lab: 7:00 AM – 9:00 PM</p>
          <p className="text-sm text-slate-700">Home Collection: 6:30 AM – 8:00 PM</p>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Send us a message</h2>
          <form className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-slate-800">Name</label>
              <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none" placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800">Email</label>
              <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800">Message</label>
              <textarea rows={4} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none" placeholder="How can we help?" />
            </div>
            <button
              type="button"
              className="px-5 py-3 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold shadow"
            >
              Submit
            </button>
            <p className="text-xs text-slate-500">This form is a placeholder. In next phase, hook to backend.</p>
          </form>
        </div>
        <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
          <iframe
            title="Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.990799438722!2d75.7872707752354!3d26.83730257668995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db7c8bcbacdbd%3A0x9f9f0b5a1c8f8f7f!2sJaipur!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "320px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
