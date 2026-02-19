"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsServicesDropdownOpen(false);
  };

  const toggleServicesDropdown = () =>
    setIsServicesDropdownOpen(!isServicesDropdownOpen);

  // Listen for external close events (e.g. TopBanner booking modal opens)
  useEffect(() => {
    const handleCloseMenu = () => {
      setIsMenuOpen(false);
      setIsServicesDropdownOpen(false);
    };
    window.addEventListener("closeHeaderMenu", handleCloseMenu);
    return () => window.removeEventListener("closeHeaderMenu", handleCloseMenu);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMenuOpen]);

  const serviceCategories = [
    { name: "General Services", href: "/service" },
    { name: "Special Services", href: "/special-services" },
  ];

  return (
    <>
      {/* ── STICKY HEADER ───────────────────────────────────────────── */}
      <header
        className="bg-gray-900 text-white backdrop-blur-md border-b border-white/10 sticky top-0 shadow-lg"
        style={{ zIndex: 9999 }}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 lg:h-24">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group flex-shrink-0"
              onClick={closeMenu}
              style={{ position: "relative", zIndex: 50 }}
            >
              <div className="relative w-80 h-80 sm:w-80 sm:h-80 lg:w-70 lg:h-90 xl:w-100 xl:h-100">
                <Image
                  src="/logo_.png"
                  alt="logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-10">
              <Link
                href="/"
                className="text-xl tracking-[0.15em] uppercase text-white/90 hover:text-white transition-colors duration-300 font-light relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300"></span>
              </Link>

              {/* Services Dropdown */}
              <div className="relative group">
                <button className="text-xl tracking-[0.15em] uppercase text-white/90 hover:text-white transition-colors duration-300 font-light relative flex items-center gap-2 group">
                  Services
                  <svg className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0l-7 7m7-7v12" />
                  </svg>
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300"></span>
                </button>
                <div className="absolute left-0 mt-0 w-64 bg-gray-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top group-hover:translate-y-2">
                  <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-500"></div>
                  <div className="py-2">
                    {serviceCategories.map((service, idx) => (
                      <Link key={idx} href={service.href} className="block px-6 py-3 text-lg text-white/90 hover:text-amber-400 hover:bg-gray-700 transition-all duration-300 font-light border-l-2 border-l-transparent hover:border-l-amber-400 hover:pl-5">
                        {service.name}
                      </Link>
                    ))}
                    <Link href="/services" className="block px-6 py-3 text-lg font-medium text-amber-400 hover:text-amber-300 bg-gray-700 hover:bg-gray-600 transition-all duration-300 border-t border-gray-600 flex items-center justify-between">
                      <span>View All Services</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                href="/contact"
                className="text-xl tracking-[0.15em] uppercase text-white/90 hover:text-white transition-colors duration-300 font-light relative group"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link
                href="/booking"
                className="group relative inline-flex items-center gap-3 px-8 py-3 border border-white/30 text-white text-md tracking-[0.25em] uppercase font-light overflow-hidden transition-all duration-500 hover:border-amber-400 bg-red-600 hover:bg-red-700"
              >
                <span className="relative z-10">Book An Appointment</span>
                <svg className="relative z-10 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </nav>

            {/* Mobile Hamburger */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-white hover:text-amber-400 transition-colors duration-300 hover:bg-white/10 rounded-lg flex-shrink-0"
              aria-label="Toggle menu"
              style={{ position: "relative", zIndex: 50 }}
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU ─────────────────────────────────────────────── */}
      {isMenuOpen && (
        <>
          {/* Backdrop — FIXED, below the booking modal (z 10000) but above page content */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500 lg:hidden"
            style={{ zIndex: 10000 }}
            onClick={closeMenu}
          />

          {/* Slide-in panel — FIXED */}
          <nav
            className="fixed top-0 right-0 w-[85vw] sm:w-[400px] h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl overflow-y-auto lg:hidden transform transition-transform duration-700 ease-out translate-x-0"
            style={{ zIndex: 10001 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-amber-400/5 via-transparent to-transparent pointer-events-none"></div>

            <div className="relative flex flex-col min-h-full">
              {/* Mobile Header */}
              <div className="flex-shrink-0 px-6 py-8 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="relative w-40 h-30">
                      <Image src="/logo_.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <div className="text-lg font-light text-white" style={{ fontFamily: "Georgia, serif" }}>
                      <span className="block font-bold text-xl text-amber-200 tracking-[0.5em] uppercase ml-9 mb-1">Menu</span>
                    </div>
                  </div>
                  <button
                    onClick={closeMenu}
                    className="p-2 text-white/70 hover:text-amber-400 hover:rotate-90 transition-all duration-300 hover:bg-white/10 rounded-full"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Nav Links */}
              <div className="flex-1 px-6 py-10 space-y-3">
                <Link href="/" onClick={closeMenu} className="group flex items-center justify-between py-5 text-white/90 hover:text-amber-400 transition-all duration-300 border-b border-white/5 hover:border-amber-400/30">
                  <span className="text-2xl font-light tracking-wide" style={{ fontFamily: "Georgia, serif" }}>Home</span>
                  <svg className="w-6 h-6 opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>

                {/* Services Dropdown */}
                <div className="border-b border-white/5">
                  <button onClick={toggleServicesDropdown} className="group flex items-center justify-between w-full py-5 text-white/90 hover:text-amber-400 transition-all duration-300">
                    <span className="text-2xl font-light tracking-wide" style={{ fontFamily: "Georgia, serif" }}>Services</span>
                    <svg className={`w-6 h-6 opacity-40 group-hover:opacity-100 transition-all duration-300 transform ${isServicesDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7-7m0 0l-7 7m7-7v12" />
                    </svg>
                  </button>
                  {isServicesDropdownOpen && (
                    <div className="bg-gray-800/50 border-l-4 border-l-amber-400 ml-4 pl-4 py-2 space-y-2">
                      {serviceCategories.map((service, idx) => (
                        <Link key={idx} href={service.href} onClick={closeMenu} className="block py-2 text-sm text-white/80 hover:text-amber-400 transition-colors duration-300 font-light">
                          {service.name}
                        </Link>
                      ))}
                      <Link href="/services" onClick={closeMenu} className="block py-2 text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors duration-300 border-t border-gray-700 pt-3 mt-2">
                        View All Services →
                      </Link>
                    </div>
                  )}
                </div>

                <Link href="/contact" onClick={closeMenu} className="group flex items-center justify-between py-5 text-white/90 hover:text-amber-400 transition-all duration-300 border-b border-white/5 hover:border-amber-400/30">
                  <span className="text-2xl font-light tracking-wide" style={{ fontFamily: "Georgia, serif" }}>Contact</span>
                  <svg className="w-6 h-6 opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* CTA */}
              <div className="flex-shrink-0 px-6 py-6 border-t border-white/10">
                <Link href="/booking" onClick={closeMenu} className="group relative flex items-center justify-center gap-3 w-full py-5 bg-red-600 hover:bg-red-700 text-white text-sm tracking-[0.2em] uppercase font-bold overflow-hidden transition-all duration-300 shadow-lg">
                  <span className="relative z-10">Book Appointment</span>
                  <svg className="relative z-10 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* Contact Info */}
              <div className="flex-shrink-0 px-6 py-8 space-y-6 bg-black/40 backdrop-blur-sm text-center border-t border-white/10">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs tracking-[0.25em] uppercase text-amber-400/80 mb-2 font-light">Location</p>
                    <p className="text-base text-white/90 font-light">Guntur, Andhra Pradesh</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.25em] uppercase text-amber-400/80 mb-2 font-light">Phone</p>
                    <a href="tel:+919392792067" className="text-base text-white/90 font-light hover:text-amber-400 transition-colors">
                      +91 93927 92067
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
  <p className="text-xs tracking-[0.25em] uppercase text-amber-400/80 mb-4 font-light">
    Connect
  </p>

  <div className="flex justify-center gap-6">

    {/* YouTube */}
    <a
      href="https://youtube.com/@automotivecarcareguntur?si=HkgjxMlgs1YwiCC9"
      target="_blank"
      rel="noopener noreferrer"
      className="group w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-amber-400 border border-white/10 hover:border-amber-400 text-white hover:text-gray-900 transition-all duration-300"
      aria-label="YouTube"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.01 3.01 0 0 0-2.12-2.13C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.378.556a3.01 3.01 0 0 0-2.12 2.13A31.1 31.1 0 0 0 0 12a31.1 31.1 0 0 0 .502 5.814 3.01 3.01 0 0 0 2.12 2.13C4.495 20.5 12 20.5 12 20.5s7.505 0 9.378-.556a3.01 3.01 0 0 0 2.12-2.13A31.1 31.1 0 0 0 24 12a31.1 31.1 0 0 0-.502-5.814ZM9.75 15.5v-7l6 3.5-6 3.5Z"/>
      </svg>
    </a>

    {/* Instagram */}
    <a
      href="https://www.instagram.com/guntur_automotive_cars?igsh=Z2c3djF0cHIwM2o4"
      target="_blank"
      rel="noopener noreferrer"
      className="group w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-amber-400 border border-white/10 hover:border-amber-400 text-white hover:text-gray-900 transition-all duration-300"
      aria-label="Instagram"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07..."/>
      </svg>
    </a>

  </div>
</div>

              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
}