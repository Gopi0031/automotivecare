"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./services.css";

export default function ServicesPage() {
  const [generalServices, setGeneralServices] = useState([]);
  const [specialServices, setSpecialServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState({});
  const [hoveredService, setHoveredService] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchAllServices();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [generalServices, specialServices, loading]);

  const fetchAllServices = async () => {
    try {
      const [genRes, specRes] = await Promise.all([
        fetch("/api/detailed-services").then((r) => r.json()),
        fetch("/api/special-services").then((r) => r.json()),
      ]);
      setGeneralServices(
        (genRes.services || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      );
      setSpecialServices(
        (specRes.services || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      );
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ── Combine both lists with a normalised shape ── */
  const allServices = [
    ...generalServices.map((s) => ({
      _id: s._id,
      type: "general",
      name: s.name,
      tagline: s.tagline,
      description: s.description,
      features: s.features,
      image: s.image, // hero image
      slug: s.slug,
      order: s.order ?? 0,
      detailLink: `/service/${s.slug}`,
    })),
    ...specialServices.map((s) => ({
      _id: s._id,
      type: "special",
      name: s.name,
      tagline: s.tagline,
      description: s.description,
      features: null,
      image: s.heroImage, // hero image
      slug: s.slug,
      order: s.order ?? 0,
      detailLink: `/special-services/${s.slug}`,
    })),
  ];

  const filteredServices =
    activeFilter === "all"
      ? allServices
      : allServices.filter((s) => s.type === activeFilter);

  const totalGeneral = generalServices.length;
  const totalSpecial = specialServices.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900 mb-4"></div>
          <p className="text-gray-900 text-xl font-light animate-pulse">
            Loading services...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative bg-gray-900 text-white py-16 md:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-4 md:mb-6 font-light animate-slide-down">
              Premium Services
            </p>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase font-light mb-6 md:mb-8 leading-tight animate-fade-in-up delay-100"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Automotive Car Care
              <br />
              <em className="text-amber-400">Services</em>
            </h1>
            <div className="w-16 md:w-20 h-px bg-gray-600 mx-auto mb-6 md:mb-10 animate-scale-in delay-200"></div>
            <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up delay-300">
              Professional automotive care solutions tailored to keep your
              vehicle in perfect condition
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════ COMBINED SERVICES ═══════════════════ */}
      {allServices.length > 0 && (
        <section className="py-16 md:py-32 lg:py-40 bg-gradient-to-b from-gray-50 via-white to-white">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div
              className="max-w-4xl mx-auto text-center mb-10 md:mb-16 lg:mb-20"
              data-animate
              id="all-services-header"
            >
              <div className="inline-block mb-4 md:mb-6">
                <span className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase">
                  ✨ All Services
                </span>
              </div>
              <h2
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-4 md:mb-6 leading-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Our <em className="text-green-600 not-italic font-semibold">Services</em>
              </h2>
              <div className="flex items-center justify-center gap-4 mb-6 md:mb-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
              </div>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 font-light leading-relaxed">
                Experience exceptional automotive care with our comprehensive
                service offerings
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-10 md:mb-16">
              {[
                { key: "all", label: "All Services", count: allServices.length },
                { key: "general", label: "General", count: totalGeneral },
                { key: "special", label: "Special", count: totalSpecial },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold tracking-wider uppercase transition-all duration-300 border-2 ${
                    activeFilter === f.key
                      ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-500/25"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600"
                  }`}
                >
                  {f.label}
                  <span
                    className={`ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                      activeFilter === f.key
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {filteredServices.map((service, index) => (
                <div
                  key={service._id}
                  data-animate
                  id={`svc-${index}`}
                  className="group h-full"
                  onMouseEnter={() => setHoveredService(service._id)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <div className="h-full bg-white rounded-3xl overflow-hidden border-2 border-gray-100 hover:border-green-400 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 flex flex-col">
                    {/* Image */}
                    <div className="relative w-full h-64 sm:h-72 md:h-80 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900"></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/50 transition-all duration-700"></div>

                      {/* Type Badge */}
                      <div className="absolute top-4 left-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            service.type === "special"
                              ? "bg-red-500/90 text-white"
                              : "bg-green-500/90 text-white"
                          }`}
                        >
                          {service.type === "special" ? "⭐ Special" : "⚙️ General"}
                        </span>
                      </div>

                      {/* Name overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform group-hover:translate-y-0 translate-y-2 transition-transform duration-700">
                        <h3
                          className="text-2xl md:text-3xl font-semibold"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          {service.name}
                        </h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-7 md:p-8 flex flex-col flex-grow">
                      <div className="mb-4 md:mb-5">
                        <p
                          className={`text-sm md:text-base font-bold uppercase tracking-wider ${
                            service.type === "special"
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {service.tagline}
                        </p>
                      </div>

                      <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-5 md:mb-6 flex-grow">
                        {service.description}
                      </p>

                      {/* Features (general services only) */}
                      {service.features && (
                        <div className="mb-6 md:mb-8">
                          <p className="text-xs font-bold text-gray-900 mb-3 tracking-widest uppercase">
                            What's Included
                          </p>
                          <ul className="space-y-2">
                            {service.features
                              .split(",")
                              .slice(0, 3)
                              .map((feature, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300"
                                >
                                  <svg
                                    className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="font-medium">{feature.trim()}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="space-y-3 mt-auto">
                        <Link
                          href={`/booking?service=${service.slug}`}
                          className={`relative inline-flex items-center justify-center w-full px-6 py-3.5 md:py-4 text-white font-semibold text-sm tracking-widest uppercase rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl active:scale-95 transition-all duration-300 group/btn ${
                            service.type === "special"
                              ? "bg-gradient-to-r from-red-500 to-red-600 hover:shadow-red-500/30"
                              : "bg-gradient-to-r from-green-500 to-green-600 hover:shadow-green-500/30"
                          }`}
                        >
                          <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
                          <span className="relative inline-flex items-center gap-2">
                            📅 BOOK APPOINTMENT
                            <svg
                              className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </span>
                        </Link>

                        <Link
                          href={service.detailLink}
                          className="inline-flex items-center justify-center w-full px-6 py-3 text-gray-700 font-semibold text-sm tracking-widest uppercase rounded-2xl border-2 border-gray-200 hover:border-green-400 hover:text-green-600 transition-all duration-300 group/link"
                        >
                          <span className="relative inline-flex items-center gap-2">
                            Learn More
                            <svg
                              className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state when filter returns nothing */}
            {filteredServices.length === 0 && (
              <div className="text-center py-20">
                <p className="text-2xl text-gray-400 font-light">
                  No services found for this filter.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════ NO SERVICES FALLBACK ═══════════════════ */}
      {allServices.length === 0 && !loading && (
        <section className="py-32 text-center">
          <p className="text-3xl text-gray-400 font-light mb-4">
            No services available yet
          </p>
          <p className="text-lg text-gray-500">
            Check back soon — we're adding services daily.
          </p>
        </section>
      )}

      {/* ═══════════════════ WHY CHOOSE US ═══════════════════ */}
      <section
        className="py-12 md:py-28 bg-gradient-to-b from-gray-50 to-white"
        data-animate
        id="why-choose"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-24">
            <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-gray-500 mb-4 md:mb-6 font-light animate-slide-down">
              Why Choose Us
            </p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 mb-6 md:mb-8 animate-fade-in-up delay-100"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Why Automotive Car Care?
            </h2>
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-gray-400 to-gray-300 mx-auto mb-8 md:mb-12 animate-scale-in delay-200"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: "👨‍🔧",
                title: "Certified Experts",
                desc: "Factory-trained technicians with specialized certifications",
                delay: "100",
              },
              {
                icon: "⚡",
                title: "Fast Turnaround",
                desc: "Most services completed within 24-48 hours",
                delay: "200",
              },
              {
                icon: "🔧",
                title: "OEM Quality Parts",
                desc: "Genuine components with lifetime warranty",
                delay: "300",
              },
              {
                icon: "💰",
                title: "Transparent Pricing",
                desc: "No hidden fees - detailed quotes upfront",
                delay: "400",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-6 sm:p-8 md:p-10 bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-700 transform hover:-translate-y-4 group rounded-lg sm:rounded-2xl border border-gray-100/50 animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${item.delay}ms`, opacity: 0 }}
              >
                <div className="text-4xl sm:text-5xl md:text-6xl mb-4 md:mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-lg sm:rounded-2xl flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4 group-hover:text-green-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base md:text-lg">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="py-12 md:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900/95 to-black/90 backdrop-blur-xl p-6 sm:p-12 md:p-16 lg:p-24 text-center relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.15),transparent_50%)] animate-pulse"></div>
            <div className="relative z-10">
              <p className="text-xs sm:text-sm tracking-[0.4em] uppercase text-green-400 mb-6 md:mb-8 font-light animate-slide-down">
                Ready For Perfect Service?
              </p>
              <h2
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8 md:mb-12 animate-fade-in-up delay-100"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Book Your Service Today
              </h2>
              <div className="w-20 md:w-28 h-px bg-gradient-to-r from-green-400 to-green-500 mx-auto mb-8 md:mb-12 animate-scale-in delay-200"></div>
              <p className="text-lg sm:text-2xl md:text-3xl text-gray-300 mb-8 md:mb-16 font-light max-w-3xl mx-auto animate-fade-in-up delay-300">
                Professional automotive care with guaranteed results
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center flex-wrap">
                <Link
                  href="/booking"
                  className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 sm:px-12 py-3 sm:py-6 text-sm sm:text-lg tracking-[0.15em] uppercase font-light rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl hover:shadow-green-500/25 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 active:scale-95 w-full sm:w-auto"
                >
                  <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    📅 Book Appointment
                  </span>
                </Link>
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 px-6 sm:px-12 py-3 sm:py-6 text-sm sm:text-lg tracking-[0.15em] uppercase font-light rounded-lg sm:rounded-2xl overflow-hidden hover:border-green-400 hover:bg-green-500/10 transition-all duration-500 transform hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
                >
                  <span className="absolute inset-0 bg-green-500/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-700 -skew-x-12"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    💬 Get Quote
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}