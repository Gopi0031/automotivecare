"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./services.css";

const SERVICES = [
  {
    name: "Mechanical Works",
    tagline: "Precision. Power. Performance.",
    description: "Complete mechanical solutions for engines, transmission systems, suspension, and braking — ensuring peak performance and reliability.",
    hero: "/services/mechanicalworks.png",
    link: "/service?category=mechanical"
  },
  {
    name: "Electrical Works",
    tagline: "Advanced Auto Electronics",
    description: "Expert diagnosis and repair of modern automotive electrical and electronic systems using advanced tools.",
    hero: "/services/elctric.png",
    link: "/service?category=electrical"
  },
  {
    name: "Maintenance Services",
    tagline: "Care That Extends Vehicle Life",
    description: "Scheduled maintenance services designed to prevent breakdowns and extend the life of your vehicle.",
    hero: "/services/maintenance-hero.png",
    link: "/service?category=maintenance"
  },
  {
    name: "Car A/C Works",
    tagline: "Comfort in Every Drive",
    description: "Professional A/C diagnostics and repairs to ensure efficient cooling even in extreme conditions.",
    hero: "/services/ac-hero.png",
    link: "/service?category=ac"
  },
  {
    name: "General Check Up",
    tagline: "Know Your Car's Health",
    description: "Complete vehicle health check using modern diagnostic scanners and road tests.",
    hero: "/services/general-check-hero.png",
    link: "/service?category=general-check"
  },
  {
    name: "General Services",
    tagline: "Everyday Essential Care",
    description: "Reliable general services that keep your vehicle safe, smooth, and road-ready.",
    hero: "/services/general-hero.png",
    link: "/service?category=general"
  },
];

const SPECIAL_SERVICES = [
  "Automatic Gear Box Repairing",
  "ECM / ECU Repairing",
  "Key Programming & Making", 
  "ABS & Airbag Systems",
  "Central Locking Systems",
  "Advanced Diagnostics & Coding",
];

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState({});
  const [hoveredService, setHoveredService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchServices();
    checkMobileView();
    window.addEventListener("resize", checkMobileView);
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [services]);

  const checkMobileView = () => {
    setIsMobile(window.innerWidth < 768);
  };

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900 mb-4"></div>
          <p className="text-gray-900 text-xl font-light animate-pulse">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-16 md:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-4 md:mb-6 font-light animate-slide-down">
              Premium Services
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase font-light mb-6 md:mb-8 leading-tight animate-fade-in-up delay-100" style={{ fontFamily: 'Georgia, serif' }}>
              Automotive Car Care
              <br />
              <em className="text-amber-400">Services</em>
            </h1>
            <div className="w-16 md:w-20 h-px bg-gray-600 mx-auto mb-6 md:mb-10 animate-scale-in delay-200"></div>
            <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up delay-300">
              Professional automotive care solutions tailored to keep your vehicle in perfect condition
            </p>
          </div>
        </div>
      </section>

      {/* ✨ IMPRESSIVE FEATURED SERVICES SECTION - WITH IMAGES ✨ */}
      {services.length > 0 && (
        <section className="py-16 md:py-32 lg:py-40 bg-gradient-to-b from-gray-50 via-white to-white">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Premium Section Header */}
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16 lg:mb-24" data-animate id="featured-header">
              <div className="inline-block mb-4 md:mb-6">
                <span className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase">
                  ✨ Featured Services
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-4 md:mb-6 leading-tight animate-fade-in-up delay-100" style={{ fontFamily: 'Georgia, serif' }}>
                Our Premium <em className="text-green-600 not-italic font-semibold">Services</em>
              </h2>
              <div className="flex items-center justify-center gap-4 mb-6 md:mb-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
              </div>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 font-light leading-relaxed animate-fade-in-up delay-200">
                Experience exceptional automotive care with our comprehensive service offerings
              </p>
            </div>

            {/* Responsive Grid - Premium Card Design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {services.map((service, index) => (
                <div
                  key={service._id}
                  data-animate
                  id={`service-${index}`}
                  className="group h-full"
                  onMouseEnter={() => setHoveredService(service._id)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  {/* Premium Card Container */}
                  <div className="h-full bg-white rounded-3xl overflow-hidden border-2 border-gray-100 hover:border-green-400 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 flex flex-col">
                    
                    {/* Image Container with Gradient Overlay */}
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
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/50 transition-all duration-700"></div>
                      
                      {/* Service Name in Image */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform group-hover:translate-y-0 translate-y-2 transition-transform duration-700">
                        <h3 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
                          {service.name}
                        </h3>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 sm:p-7 md:p-8 flex flex-col flex-grow">
                      {/* Tagline - Highlighted */}
                      <div className="mb-4 md:mb-5">
                        <p className="text-sm md:text-base font-bold text-green-600 uppercase tracking-wider">
                          {service.tagline}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-5 md:mb-6 flex-grow">
                        {service.description}
                      </p>

                      {/* Features List */}
                      {service.features && (
                        <div className="mb-6 md:mb-8">
                          <p className="text-xs font-bold text-gray-900 mb-3 tracking-widest uppercase">
                            What's Included
                          </p>
                          <ul className="space-y-2">
                            {service.features.split(',').slice(0, 3).map((feature, idx) => (
                              <li
                                key={idx}
                                className="flex items-start text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300"
                              >
                                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">{feature.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* CTA Button - Premium Style */}
                      <Link
                        href={`/booking?service=${service.slug}`}
                        className="relative inline-flex items-center justify-center w-full px-6 py-3.5 md:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-sm tracking-widest uppercase rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-green-500/30 active:scale-95 transition-all duration-300 group/btn"
                      >
                        <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
                        <span className="relative inline-flex items-center gap-2">
                          📅 BOOK APPOINTMENT
                          <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                          </svg>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          
          </div>
        </section>
      )}

      {/* Main Services Section - RESPONSIVE STATIC SERVICES */}
      <section className="py-12 md:py-28 bg-white" data-animate id="services-main">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-24">
          {/* Header */}
          <div className="text-center mb-12 md:mb-20 animate-fade-in-up">
            <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-gray-500 mb-4 md:mb-6 font-light">
              Complete Service Range
            </p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-6 md:mb-8"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Our <em className="text-gray-700">Services</em>
            </h2>
            <div className="w-16 md:w-24 h-px bg-gray-400 mx-auto mb-6 md:mb-8"></div>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 font-light max-w-4xl mx-auto">
              Explore our comprehensive range of automotive services
            </p>
          </div>

          {/* Services Grid - Responsive columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
            {SERVICES.map((service, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 md:p-10 border border-gray-200/50 hover:border-green-400 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 transform hover:-translate-y-3 rounded-lg sm:rounded-2xl flex flex-col h-full"
              >
                {/* Hero Image */}
                <div 
                  className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-6 md:mb-8 rounded-lg sm:rounded-2xl overflow-hidden shadow-lg group-hover:scale-110 transition-all duration-500 flex-shrink-0"
                  style={{
                    backgroundImage: `url(${service.hero})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  aria-label={`${service.name} icon`}
                />
                
                {/* Title */}
                <h3
                  className="text-xl sm:text-2xl md:text-3xl font-light mb-3 md:mb-4 text-center group-hover:text-green-600 transition-all duration-300"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {service.name}
                </h3>
                
                {/* Content */}
                <div className="text-center mb-6 md:mb-8 flex-grow">
                  <p className="text-green-600 font-semibold text-base sm:text-lg mb-2 md:mb-3">
                    {service.tagline}
                  </p>
                  <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base md:text-lg">
                    {service.description}
                  </p>
                </div>

                {/* Button */}
                <Link
                  href={service.link}
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white text-xs sm:text-sm tracking-[0.2em] uppercase font-light rounded-full hover:bg-green-600 hover:shadow-lg active:scale-95 transition-all duration-300 group/service w-full"
                >
                  Explore Service
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover/service:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Services Section - RESPONSIVE */}
      <section className="py-12 md:py-28 bg-gradient-to-b from-gray-900 to-black text-white" data-animate id="special-services">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-24">
          {/* Header */}
          <div className="text-center mb-12 md:mb-20 animate-fade-in-up">
            <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-red-400 mb-4 md:mb-6 font-light">
              Advanced Expertise
            </p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-6 md:mb-8"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Special <em className="text-red-500">Services</em>
            </h2>
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-red-500 to-red-600 mx-auto mb-6 md:mb-8"></div>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-light max-w-4xl mx-auto">
              Cutting-edge solutions for complex automotive challenges
            </p>
          </div>

          {/* Special Services Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {SPECIAL_SERVICES.map((service, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-xl p-6 sm:p-8 md:p-10 border border-white/20 hover:border-red-500 hover:bg-white/15 rounded-lg sm:rounded-2xl transition-all duration-500 hover:-translate-y-4 shadow-xl hover:shadow-2xl cursor-pointer"
              >
                <div className="text-3xl sm:text-4xl mb-4 md:mb-6 opacity-75 group-hover:opacity-100 transition-opacity">⚡</div>
                <h3 className="text-lg sm:text-2xl md:text-3xl font-light mb-4 md:mb-6 group-hover:text-red-400 transition-all duration-300 leading-tight">
                  {service}
                </h3>
                <p className="text-gray-300 font-light leading-relaxed mb-6 md:mb-8 opacity-90 text-sm sm:text-base md:text-lg">
                  Expert-level precision for your vehicle's most complex systems.
                </p>
                <Link
                  href="/special-services"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm tracking-[0.25em] uppercase text-red-400 hover:text-red-300 border border-red-400/50 px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-sm hover:bg-red-500/10 active:scale-95 transition-all duration-300"
                >
                  Learn More
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - RESPONSIVE */}
      <section className="py-12 md:py-28 bg-gradient-to-b from-gray-50 to-white" data-animate id="why-choose">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-24">
            <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-gray-500 mb-4 md:mb-6 font-light animate-slide-down">
              Why Choose Us
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 mb-6 md:mb-8 animate-fade-in-up delay-100" style={{ fontFamily: 'Georgia, serif' }}>
              Why Automotive Car Care?
            </h2>
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-gray-400 to-gray-300 mx-auto mb-8 md:mb-12 animate-scale-in delay-200"></div>
          </div>

          {/* Features Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { icon: '👨‍🔧', title: 'Certified Experts', desc: 'Factory-trained technicians with specialized certifications', delay: '100' },
              { icon: '⚡', title: 'Fast Turnaround', desc: 'Most services completed within 24-48 hours', delay: '200' },
              { icon: '🔧', title: 'OEM Quality Parts', desc: 'Genuine components with lifetime warranty', delay: '300' },
              { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden fees - detailed quotes upfront', delay: '400' },
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

      {/* CTA Section - RESPONSIVE */}
      <section className="py-12 md:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900/95 to-black/90 backdrop-blur-xl p-6 sm:p-12 md:p-16 lg:p-24 text-center relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.15),transparent_50%)] animate-pulse"></div>
            <div className="relative z-10">
              <p className="text-xs sm:text-sm tracking-[0.4em] uppercase text-green-400 mb-6 md:mb-8 font-light animate-slide-down">
                Ready For Perfect Service?
              </p>
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8 md:mb-12 animate-fade-in-up delay-100" style={{ fontFamily: 'Georgia, serif' }}>
                Book Your Service Today
              </h2>
              <div className="w-20 md:w-28 h-px bg-gradient-to-r from-green-400 to-green-500 mx-auto mb-8 md:mb-12 animate-scale-in delay-200"></div>
              <p className="text-lg sm:text-2xl md:text-3xl text-gray-300 mb-8 md:mb-16 font-light max-w-3xl mx-auto animate-fade-in-up delay-300">
                Professional automotive care with guaranteed results
              </p>
              
              {/* Responsive CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center flex-wrap">
                <Link
                  href="/booking"
                  className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 sm:px-12 py-3 sm:py-6 text-sm sm:text-lg tracking-[0.15em] uppercase font-light rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl hover:shadow-green-500/25 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 active:scale-95 w-full sm:w-auto"
                >
                  <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <span className="relative z-10 flex items-center gap-2">📅 Book Appointment</span>
                </Link>
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 px-6 sm:px-12 py-3 sm:py-6 text-sm sm:text-lg tracking-[0.15em] uppercase font-light rounded-lg sm:rounded-2xl overflow-hidden hover:border-green-400 hover:bg-green-500/10 transition-all duration-500 transform hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
                >
                  <span className="absolute inset-0 bg-green-500/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-700 -skew-x-12"></span>
                  <span className="relative z-10 flex items-center gap-2">💬 Get Quote</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}