import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/tests", label: "Tests" },
  { to: "/packages", label: "Packages" },
  { to: "/home-collection", label: "Home Collection" },
  { to: "/book", label: "Book Test" },
  { to: "/contact", label: "Contact" },
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-sm">
              SS
            </div>
            <div>
              <p className="font-semibold text-slate-900 leading-tight">Shree Shyam Healthcare</p>
              <p className="text-xs text-slate-500 leading-tight">Diagnostic Laboratory</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400 focus-visible:ring-offset-white ${
                      isActive
                        ? "bg-sky-100 text-sky-700"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <Link
              to="/book"
              className="hidden md:inline-flex btn-primary"
            >
              Book Test
            </Link>
            <button
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 text-slate-700 text-xl font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400 focus-visible:ring-offset-white"
              onClick={() => setOpen((p) => !p)}
              aria-label="Toggle navigation"
            >
              {open ? "×" : "≡"}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2 shadow-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400 focus-visible:ring-offset-white ${
                    isActive || location.pathname === item.to
                      ? "bg-sky-100 text-sky-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="block text-center btn-primary"
            >
              Book Test
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-10 bg-slate-900 text-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">
          <div>
            <h4 className="font-semibold text-lg mb-2">Shree Shyam Healthcare</h4>
            <p className="text-sm text-slate-300">
              Accurate diagnostics, hygienic practices, and fast reports you can trust.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2">Contact</h4>
            <p className="text-sm text-slate-300">Phone: +91 98765 43210</p>
            <p className="text-sm text-slate-300">WhatsApp: +91 98765 43210</p>
            <p className="text-sm text-slate-300">Email: care@shreeshyamhealth.com</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2">Visit</h4>
            <p className="text-sm text-slate-300">21 Lab Street, Jaipur, Rajasthan</p>
            <p className="text-sm text-slate-300">Timings: 7:00 AM - 9:00 PM</p>
          </div>
        </div>
        <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Shree Shyam Healthcare. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
