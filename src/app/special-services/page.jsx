"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const DEFAULT_HERO = "/services/special/hero.jpg";

export default function SpecialServicesPage() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [specialServices, setSpecialServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams(); // ✅ Read URL params

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/special-services");
        if (res.ok) {
          const data = await res.json();
          const sorted = (data.services || []).sort((a, b) => a.order - b.order);
          setSpecialServices(sorted);

          // ✅ Auto-select service from URL param
          const serviceSlug = searchParams.get("service");
          if (serviceSlug) {
            const idx = sorted.findIndex(s => s.slug === serviceSlug);
            setActiveIndex(idx >= 0 ? idx : 0);
          } else if (sorted.length > 0) {
            setActiveIndex(0);
          }
        }
      } catch (error) {
        console.error("Failed to fetch special services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [searchParams]);

  const activeService = activeIndex !== null ? specialServices[activeIndex] : null;

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading Special Services...</div>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900">
      {/* FULL HERO */}
      <section
        className="h-150 flex items-center bg-gray-900 text-white justify-center relative transition-all duration-700"
        style={{
          backgroundImage: `url(${activeService ? activeService.heroImage : DEFAULT_HERO})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center max-w-5xl px-6 animate-fade-in-up">
          <p className="text-sm tracking-[1.35em] uppercase text-red-400 mb-6">
            AutoMotive-Car-Care
          </p>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            {activeService ? activeService.name : "Special Services"}
          </h1>
          {activeService && (
            <>
              <p className="text-xl md:text-2xl text-white/90 mb-4">{activeService.tagline}</p>
              <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">{activeService.description}</p>
            </>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-8xl mx-auto px-9 py-28 grid lg:grid-cols-5 gap-15">
        {/* LEFT MENU */}
        <aside className="lg:col-span-2 top-28 h-fit">
          <h2 className="text-3xl text-red-900 text-center mb-6 font-bold tracking-wide">
            Special Services
          </h2>
          {specialServices.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No special services available.</p>
          ) : (
            <ul className="border-none shadow-sm">
              {specialServices.map((item, i) => (
                <li key={item._id || i}>
                  <button
                    onClick={() => { setActiveIndex(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`w-full bg-gray-900 px-6 py-8 text-xl rounded-3xl text-left text-white border-b-3 transition-all duration-300 ${
                      activeIndex === i
                        ? "bg-green-600 text-red-900 font-bold text-lg"
                        : "hover:bg-gray-900 hover:pl-8"
                    }`}
                  >
                    ★ {item.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* RIGHT CONTENT */}
        {activeService && (
          <div key={activeIndex} className="lg:col-span-3 animate-fade-in-up">
            <img src={activeService.contentImage} alt={activeService.name}
              className="w-full mb-10 rounded-xl shadow-2xl transition-transform duration-700 hover:scale-105" />
            <h2 className="text-4xl font-light mb-8 text-red-600">{activeService.name}</h2>
            <p className="text-lg md:text-xl leading-relaxed text-gray-700 animate-fade-in-up">
              {activeService.content}
            </p>
          </div>
        )}
      </div>

      <div className="bg-gray-900 border-b-20 text-white text-center py-9 text-md font-semi tracking-wide">
        ALL TYPES OF VEHICLE RELATED WORKS
      </div>
    </div>
  );
}