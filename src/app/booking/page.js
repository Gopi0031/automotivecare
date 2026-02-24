"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./booking.css";

export default function BookingPage() {
  const [generalServices, setGeneralServices] = useState([]);   // from /api/detailed-services
  const [specialServices, setSpecialServices] = useState([]);   // from /api/special-services
  const [vehicleBrands, setVehicleBrands] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [selectionMode, setSelectionMode] = useState("single"); // "single" or "multiple"

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    primaryService: "",       // { slug, name, type } for single mode
    additionalServices: [],   // [{ slug, name, type }] for multiple mode
    vehicleBrand: "",
    vehicleModel: "",
    bookingDate: "",
    bookingTime: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const countryCodes = [
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+1", country: "USA", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+86", country: "China", flag: "🇨🇳" },
  ];

  useEffect(() => {
    fetchData();
    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedService = urlParams.get("service");
    const preSelectedType = urlParams.get("type") || "general";
    if (preSelectedService) {
      setFormData(prev => ({
        ...prev,
        primaryService: { slug: preSelectedService, type: preSelectedType }
      }));
    }
  }, []);

  // ── Fetch both General + Special services ─────────────────────────────────
  const fetchData = async () => {
    try {
      const [generalRes, specialRes, brandsRes] = await Promise.all([
        fetch("/api/detailed-services"),
        fetch("/api/special-services"),
        fetch("/api/vehicle-brands"),
      ]);

      const generalData = generalRes.ok ? await generalRes.json() : {};
      const specialData = specialRes.ok ? await specialRes.json() : {};
      const brandsData = brandsRes.ok ? await brandsRes.json() : {};

      setGeneralServices(
        (generalData.services || []).map(s => ({ ...s, type: "general" }))
      );
      setSpecialServices(
        (specialData.services || []).map(s => ({ ...s, type: "special" }))
      );
      setVehicleBrands(brandsData.brands || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // ── All services combined ─────────────────────────────────────────────────
  const allServices = [
    ...generalServices.map(s => ({ ...s, type: "general" })),
    ...specialServices.map(s => ({ ...s, type: "special" })),
  ];

  const totalServices = allServices.length;

  // ── Brand change ──────────────────────────────────────────────────────────
  const handleBrandChange = (e) => {
    const selectedBrandSlug = e.target.value;
    setFormData({ ...formData, vehicleBrand: selectedBrandSlug, vehicleModel: "" });
    const selectedBrand = vehicleBrands.find(b => b.slug === selectedBrandSlug);
    setAvailableModels(selectedBrand?.models || []);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── Service toggle ────────────────────────────────────────────────────────
  const handleServiceToggle = (service) => {
    // service = { _id, slug, name, type }
    if (selectionMode === "single") {
      setFormData(prev => ({
        ...prev,
        primaryService: service,
        additionalServices: [],
      }));
    } else {
      setFormData(prev => {
        const exists = prev.additionalServices.find(s => s.slug === service.slug);
        return {
          ...prev,
          additionalServices: exists
            ? prev.additionalServices.filter(s => s.slug !== service.slug)
            : [...prev.additionalServices, service],
        };
      });
    }
  };

  // ── Phone ─────────────────────────────────────────────────────────────────
  const handlePhoneChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData({ ...formData, phone: numericValue });
    setPhoneError(
      numericValue.length > 0 && numericValue.length < 10
        ? "Phone number must be 10 digits"
        : ""
    );
  };

  // ── Get service page URL ──────────────────────────────────────────────────
  const getServiceUrl = (service) => {
    if (!service) return "#";
    if (service.type === "special") {
      return `/special-services?service=${service.slug}`;
    }
    return `/service?service=${service.slug}`;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }

    if (selectionMode === "single" && !formData.primaryService?.slug) {
      setMessage("Please select a service");
      return;
    }

    if (selectionMode === "multiple" && formData.additionalServices.length === 0) {
      setMessage("Please select at least one service");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const selectedBrand = vehicleBrands.find(b => b.slug === formData.vehicleBrand);

      let bookingData = {
        name: formData.name,
        email: formData.email,
        phone: `${formData.countryCode} ${formData.phone}`,
        vehicleBrand: selectedBrand?.name || formData.vehicleBrand,
        vehicleModel: formData.vehicleModel,
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        notes: formData.notes,
      };

      if (selectionMode === "single") {
        bookingData.service = formData.primaryService.slug;
        bookingData.serviceName = formData.primaryService.name;
        bookingData.serviceType = formData.primaryService.type; // ✅ Save type
        bookingData.additionalServices = [];
      } else {
        const [first, ...rest] = formData.additionalServices;
        bookingData.service = first?.slug || "";
        bookingData.serviceName = first?.name || "";
        bookingData.serviceType = first?.type || "general";
        bookingData.additionalServices = rest.map(s => ({
          slug: s.slug,
          name: s.name,
          type: s.type,
        }));
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        setMessage("Server error: Invalid response.");
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(data.message || "Booking submitted successfully!");
        setFormData({
          name: "",
          email: "",
          countryCode: "+91",
          phone: "",
          primaryService: "",
          additionalServices: [],
          vehicleBrand: "",
          vehicleModel: "",
          bookingDate: "",
          bookingTime: "",
          notes: "",
        });
        setPhoneError("");
        setAvailableModels([]);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setMessage(data.error || "Failed to submit booking.");
      }
    } catch (error) {
      setMessage("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const isServiceSelected = (service) => {
    if (selectionMode === "single") {
      return formData.primaryService?.slug === service.slug;
    }
    return formData.additionalServices.some(s => s.slug === service.slug);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg"><div className="hero-gradient"></div></div>
        <div className="hero-content">
          <p className="hero-subtitle">Reserve Your Spot</p>
          <h1 className="hero-title">Book Your <em>Service</em></h1>
          <div className="hero-divider"></div>
          <p className="hero-description">Schedule your appointment in just a few clicks</p>
        </div>
      </section>

      {/* Form */}
      <section className="form-section">
        <div className="form-container">

          {/* Message */}
          {message && (
            <div className={`message-box ${
              message.toLowerCase().includes("success") || message.includes("email")
                ? "message-success"
                : "message-error"
            }`}>
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <div className="message-icon" style={{
                  color: message.toLowerCase().includes("success") ? "#16a34a" : "#dc2626"
                }}>
                  {message.toLowerCase().includes("success") ? (
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p style={{ marginLeft: "1rem" }}>{message}</p>
              </div>
            </div>
          )}

          <div className="form-card">
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

              {/* Personal Information */}
              <div>
                <h3 className="form-section-title">Personal Information</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" placeholder="Your Name" />
                  </div>
                  <div>
                    <label className="form-label">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" placeholder="yourmail@gmail.com" />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="form-label">Phone Number *</label>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <select name="countryCode" value={formData.countryCode} onChange={handleChange} className="form-select" style={{ width: "9rem" }}>
                        {countryCodes.map(c => (
                          <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                        ))}
                      </select>
                      <div style={{ flex: 1 }}>
                        <input
                          type="tel" name="phone" value={formData.phone}
                          onChange={handlePhoneChange} required maxLength="10"
                          className={`form-input ${phoneError ? "phone-input-error" : ""}`}
                          placeholder="1234567890"
                        />
                        {phoneError && (
                          <p className="error-text">
                            <svg style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {phoneError}
                          </p>
                        )}
                        {formData.phone.length === 10 && !phoneError && (
                          <p className="success-text">
                            <svg style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Valid phone number
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="helper-text">Enter 10-digit mobile number</p>
                  </div>
                </div>
              </div>

              {/* ── Service Selection ──────────────────────────────────── */}
              <div>
                <h3 className="form-section-title">Service Selection</h3>

                {/* Toggle */}
                <div className="service-mode-toggle">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectionMode("single");
                      setFormData(prev => ({ ...prev, additionalServices: [] }));
                    }}
                    className={`toggle-button ${selectionMode === "single" ? "toggle-button-active" : ""}`}
                  >
                    🔘 Single Service
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectionMode("multiple");
                      setFormData(prev => ({ ...prev, primaryService: "" }));
                    }}
                    className={`toggle-button ${selectionMode === "multiple" ? "toggle-button-active" : ""}`}
                  >
                    ☑️ Multiple Services
                  </button>
                </div>

                {/* ── General Services Section ── */}
                {generalServices.length > 0 && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h4 style={{
                      fontSize: "1rem", fontWeight: "600",
                      color: "#15803d", marginBottom: "0.75rem",
                      paddingBottom: "0.5rem",
                      borderBottom: "2px solid #bbf7d0",
                      display: "flex", alignItems: "center", gap: "0.5rem"
                    }}>
                      ⚙️ General Services
                    </h4>

                    {selectionMode === "single" ? (
                      /* Single mode - dropdown for general */
                      <div>
                        <label className="form-label">Choose a General Service</label>
                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                          <select
                            value={formData.primaryService?.type === "general" ? formData.primaryService.slug : ""}
                            onChange={e => {
                              const slug = e.target.value;
                              if (!slug) {
                                setFormData(prev => ({ ...prev, primaryService: "" }));
                                return;
                              }
                              const svc = generalServices.find(s => s.slug === slug);
                              setFormData(prev => ({
                                ...prev,
                                primaryService: { slug: svc.slug, name: svc.name, type: "general" }
                              }));
                            }}
                            className="form-select"
                            style={{ flex: 1 }}
                          >
                            <option value="">Select a general service</option>
                            {generalServices.map(s => (
                              <option key={s._id} value={s.slug}>{s.name}</option>
                            ))}
                          </select>

                          {/* Arrow to /service page */}
                          {formData.primaryService?.type === "general" && (
                            <Link
                              href={`/service?service=${formData.primaryService.slug}`}
                              title={`View ${formData.primaryService.name}`}
                              style={{
                                display: "inline-flex", alignItems: "center",
                                justifyContent: "center", padding: "0.75rem 1rem",
                                backgroundColor: "rgb(22,163,74)", color: "white",
                                borderRadius: "0.5rem", textDecoration: "none",
                                marginTop: "0.25rem", whiteSpace: "nowrap",
                                boxShadow: "0 4px 12px rgba(22,163,74,0.4)",
                                transition: "all 0.3s ease",
                              }}
                            >
                              <svg style={{ width: "1.25rem", height: "1.25rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </Link>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Multiple mode - checkboxes for general */
                      <div className="checkbox-grid">
                        {generalServices.map(service => (
                          <div key={service._id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <label className="checkbox-label" style={{ flex: 1 }}>
                              <input
                                type="checkbox"
                                checked={isServiceSelected(service)}
                                onChange={() => handleServiceToggle({
                                  _id: service._id,
                                  slug: service.slug,
                                  name: service.name,
                                  type: "general"
                                })}
                                className="checkbox-input"
                              />
                              <div className="checkbox-text">{service.name}</div>
                            </label>
                            {/* Arrow to /service page */}
                            <Link
                              href={`/service?service=${service.slug}`}
                              title={`View ${service.name}`}
                              style={{
                                display: "inline-flex", alignItems: "center",
                                justifyContent: "center", padding: "0.5rem",
                                backgroundColor: "rgb(22,163,74)", color: "white",
                                borderRadius: "0.375rem", textDecoration: "none",
                                boxShadow: "0 2px 8px rgba(22,163,74,0.3)",
                                transition: "all 0.3s ease", flexShrink: 0,
                              }}
                            >
                              <svg style={{ width: "1rem", height: "1rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Special Services Section ── */}
                {specialServices.length > 0 && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h4 style={{
                      fontSize: "1rem", fontWeight: "600",
                      color: "#dc2626", marginBottom: "0.75rem",
                      paddingBottom: "0.5rem",
                      borderBottom: "2px solid #fecaca",
                      display: "flex", alignItems: "center", gap: "0.5rem"
                    }}>
                      ⭐ Special Services
                    </h4>

                    {selectionMode === "single" ? (
                      /* Single mode - dropdown for special */
                      <div>
                        <label className="form-label">Choose a Special Service</label>
                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                          <select
                            value={formData.primaryService?.type === "special" ? formData.primaryService.slug : ""}
                            onChange={e => {
                              const slug = e.target.value;
                              if (!slug) {
                                setFormData(prev => ({ ...prev, primaryService: "" }));
                                return;
                              }
                              const svc = specialServices.find(s => s.slug === slug);
                              setFormData(prev => ({
                                ...prev,
                                primaryService: { slug: svc.slug, name: svc.name, type: "special" }
                              }));
                            }}
                            className="form-select"
                            style={{ flex: 1 }}
                          >
                            <option value="">Select a special service</option>
                            {specialServices.map(s => (
                              <option key={s._id} value={s.slug}>{s.name}</option>
                            ))}
                          </select>

                          {/* Arrow to /special-services page */}
                          {formData.primaryService?.type === "special" && (
                            <Link
                              href={`/special-services?service=${formData.primaryService.slug}`}
                              title={`View ${formData.primaryService.name}`}
                              style={{
                                display: "inline-flex", alignItems: "center",
                                justifyContent: "center", padding: "0.75rem 1rem",
                                backgroundColor: "rgb(220,38,38)", color: "white",
                                borderRadius: "0.5rem", textDecoration: "none",
                                marginTop: "0.25rem", whiteSpace: "nowrap",
                                boxShadow: "0 4px 12px rgba(220,38,38,0.4)",
                                transition: "all 0.3s ease",
                              }}
                            >
                              <svg style={{ width: "1.25rem", height: "1.25rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </Link>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Multiple mode - checkboxes for special */
                      <div className="checkbox-grid">
                        {specialServices.map(service => (
                          <div key={service._id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <label className="checkbox-label" style={{ flex: 1 }}>
                              <input
                                type="checkbox"
                                checked={isServiceSelected(service)}
                                onChange={() => handleServiceToggle({
                                  _id: service._id,
                                  slug: service.slug,
                                  name: service.name,
                                  type: "special"
                                })}
                                className="checkbox-input"
                              />
                              <div className="checkbox-text">{service.name}</div>
                            </label>
                            {/* Arrow to /special-services page */}
                            <Link
                              href={`/special-services?service=${service.slug}`}
                              title={`View ${service.name}`}
                              style={{
                                display: "inline-flex", alignItems: "center",
                                justifyContent: "center", padding: "0.5rem",
                                backgroundColor: "rgb(220,38,38)", color: "white",
                                borderRadius: "0.375rem", textDecoration: "none",
                                boxShadow: "0 2px 8px rgba(220,38,38,0.3)",
                                transition: "all 0.3s ease", flexShrink: 0,
                              }}
                            >
                              <svg style={{ width: "1rem", height: "1rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Selected summary for multiple mode */}
                {selectionMode === "multiple" && formData.additionalServices.length > 0 && (
                  <div style={{
                    marginTop: "1rem", padding: "0.75rem 1rem",
                    background: "#f0fdf4", borderRadius: "0.5rem",
                    border: "1px solid #bbf7d0"
                  }}>
                    <p className="success-text" style={{ marginBottom: "0.5rem" }}>
                      <svg style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {formData.additionalServices.length} service{formData.additionalServices.length > 1 ? "s" : ""} selected
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {formData.additionalServices.map((s, i) => (
                        <span key={i} style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "9999px",
                          fontSize: "0.8rem", fontWeight: "500",
                          backgroundColor: s.type === "special" ? "#fef2f2" : "#f0fdf4",
                          color: s.type === "special" ? "#dc2626" : "#15803d",
                          border: `1px solid ${s.type === "special" ? "#fecaca" : "#bbf7d0"}`,
                        }}>
                          {s.type === "special" ? "⭐" : "⚙️"} {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* No services warning */}
                {totalServices === 0 && (
                  <p className="error-text">
                    ⚠️ No services available. Admin must add services first.
                  </p>
                )}
              </div>

              {/* Vehicle Details */}
              <div>
                <h3 className="form-section-title">Vehicle Details</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
                  <div>
                    <label className="form-label">Vehicle Brand *</label>
                    <select name="vehicleBrand" value={formData.vehicleBrand} onChange={handleBrandChange} required className="form-select">
                      <option value="">Select brand</option>
                      {vehicleBrands.map(b => (
                        <option key={b._id} value={b.slug}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Vehicle Model *</label>
                    <select
                      name="vehicleModel" value={formData.vehicleModel}
                      onChange={handleChange} required
                      disabled={!formData.vehicleBrand || availableModels.length === 0}
                      className="form-select"
                    >
                      <option value="">{!formData.vehicleBrand ? "Select brand first" : "Select model"}</option>
                      {availableModels.map((m, i) => (
                        <option key={i} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Appointment Schedule */}
              <div>
                <h3 className="form-section-title">Appointment Schedule</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
                  <div>
                    <label className="form-label">Preferred Date *</label>
                    <input type="date" name="bookingDate" value={formData.bookingDate} onChange={handleChange} required min={new Date().toISOString().split("T")[0]} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Preferred Time *</label>
                    <select name="bookingTime" value={formData.bookingTime} onChange={handleChange} required className="form-select">
                      <option value="">Select time slot</option>
                      {["07:00 AM","08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM","07:00 PM"].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="form-label">About Your Issue</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={5} className="form-textarea" placeholder="Any specific requirements or concerns..." />
              </div>

              {/* Submit */}
              <div style={{ paddingTop: "1.5rem" }}>
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !!phoneError ||
                    formData.phone.length !== 10 ||
                    totalServices === 0 ||
                    vehicleBrands.length === 0
                  }
                  className="submit-button"
                >
                  <span className="submit-button-bg"></span>
                  <span className="submit-button-content">
                    {loading ? (
                      <>
                        <svg style={{ width: "1.25rem", height: "1.25rem" }} className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting Your Booking...
                      </>
                    ) : (
                      <>
                        📅 Book Appointment Now
                        <svg style={{ width: "1.25rem", height: "1.25rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Info Cards */}
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">⏰</div>
              <div className="info-number">24/7</div>
              <div className="info-label">Service Available</div>
            </div>
            <div className="info-card">
              <div className="info-icon">⚡</div>
              <div className="info-number">30 Min</div>
              <div className="info-label">Quick Service</div>
            </div>
            <div className="info-card">
              <div className="info-icon">✅</div>
              <div className="info-number">100%</div>
              <div className="info-label">Satisfaction Guaranteed</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}