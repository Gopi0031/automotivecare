"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./booking.css";

export default function BookingPage() {
  const [services, setServices] = useState([]);
  const [vehicleBrands, setVehicleBrands] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [selectionMode, setSelectionMode] = useState("single"); // "single" or "multiple"
  
  const [formData, setFormData] = useState({
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
    const preSelectedService = urlParams.get('service');
    if (preSelectedService) {
      setFormData(prev => ({ ...prev, primaryService: preSelectedService }));
    }
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, brandsRes] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/vehicle-brands"),
      ]);

      if (!servicesRes.ok || !brandsRes.ok) {
        console.error("API failed");
        return;
      }

      const servicesData = await servicesRes.json();
      const brandsData = await brandsRes.json();

      setServices(servicesData.services || []);
      setVehicleBrands(brandsData.brands || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBrandChange = (e) => {
    const selectedBrandSlug = e.target.value;
    setFormData({ 
      ...formData, 
      vehicleBrand: selectedBrandSlug,
      vehicleModel: ""
    });
    
    const selectedBrand = vehicleBrands.find(b => b.slug === selectedBrandSlug);
    if (selectedBrand) {
      setAvailableModels(selectedBrand.models || []);
    } else {
      setAvailableModels([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceToggle = (serviceSlug) => {
    if (selectionMode === "single") {
      setFormData(prev => ({
        ...prev,
        primaryService: serviceSlug,
        additionalServices: []
      }));
    } else {
      setFormData(prev => {
        const isSelected = prev.additionalServices.includes(serviceSlug);
        return {
          ...prev,
          additionalServices: isSelected
            ? prev.additionalServices.filter(s => s !== serviceSlug)
            : [...prev.additionalServices, serviceSlug]
        };
      });
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, "");
    const limitedValue = numericValue.slice(0, 10);
    
    setFormData({ ...formData, phone: limitedValue });
    
    if (limitedValue.length > 0 && limitedValue.length < 10) {
      setPhoneError("Phone number must be 10 digits");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }

    // Validate service selection
    if (selectionMode === "single" && !formData.primaryService) {
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
        const selectedService = services.find(s => s.slug === formData.primaryService);
        bookingData.service = formData.primaryService;
        bookingData.serviceName = selectedService?.name || formData.primaryService;
        bookingData.additionalServices = [];
      } else {
        const selectedServices = formData.additionalServices.map(slug => {
          const service = services.find(s => s.slug === slug);
          return {
            slug: slug,
            name: service?.name || slug
          };
        });
        bookingData.service = selectedServices[0]?.slug || "";
        bookingData.serviceName = selectedServices[0]?.name || "";
        bookingData.additionalServices = selectedServices.slice(1);
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Expected JSON but got:", text.substring(0, 200));
        setMessage("Server error: API route not found or returned invalid response.");
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(data.message || "Booking submitted successfully! Check your email for confirmation.");
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setMessage(data.error || "Failed to submit booking. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setMessage("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✨ NEW: Get selected service name for single mode
  const getSelectedServiceName = () => {
    if (selectionMode === "single" && formData.primaryService) {
      return services.find(s => s.slug === formData.primaryService)?.name || "";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
        </div>
        <div className="hero-content">
          <p className="hero-subtitle">Reserve Your Spot</p>
          <h1 className="hero-title">
            Book Your <em>Service</em>
          </h1>
          <div className="hero-divider"></div>
          <p className="hero-description">
            Schedule your appointment in just a few clicks
          </p>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="form-section">
        <div className="form-container">
          
          {/* Success/Error Message */}
          {message && (
            <div className={`message-box ${message.includes("success") || message.includes("email") ? "message-success" : "message-error"}`}>
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <div className="message-icon" style={{ color: message.includes("success") ? "#16a34a" : "#dc2626" }}>
                  {message.includes("success") ? (
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div style={{ marginLeft: "1rem", flex: 1 }}>
                  <p className={`message-text ${message.includes("success") ? "text-green-800" : "text-red-800"}`}>{message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Booking Form Card */}
          <div className="form-card">
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              
              {/* Personal Information */}
              <div>
                <h3 className="form-section-title">Personal Information</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Your Name"
                    />
                  </div>

                  <div>
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="yourmail@gmail.com"
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="form-label">Phone Number *</label>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className="form-select"
                        style={{ width: "9rem" }}
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.code}
                          </option>
                        ))}
                      </select>
                      <div style={{ flex: 1 }}>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          required
                          maxLength="10"
                          pattern="\d{10}"
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
                        {formData.phone && !phoneError && formData.phone.length === 10 && (
                          <p className="success-text">
                            <svg style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Valid phone number
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="helper-text">Enter 10-digit mobile number (numbers only)</p>
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <h3 className="form-section-title">Service Selection</h3>
                
                {/* Toggle Between Single/Multiple */}
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

                {/* Single Service Selection */}
                {selectionMode === "single" && (
                  <div>
                    <label className="form-label">Choose Your Service *</label>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <select
                          name="primaryService"
                          value={formData.primaryService}
                          onChange={handleChange}
                          required
                          className="form-select"
                        >
                          <option value="">Select a service</option>
                          {services.map((service) => (
                            <option key={service._id} value={service.slug}>
                              {service.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* ✨ NEW: Arrow button to view service details */}
                      {formData.primaryService && getSelectedServiceName() && (
                        <Link
                          href={`/service?category=${formData.primaryService}`}
                          title={`View details for ${getSelectedServiceName()}`}
                          className="service-nav-button"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.75rem 1rem",
                            backgroundColor: "rgb(22, 163, 74)",
                            color: "white",
                            borderRadius: "0.5rem",
                            textDecoration: "none",
                            transition: "all 0.3s ease",
                            marginTop: "0.25rem",
                            cursor: "pointer",
                            border: "none",
                            fontWeight: "600",
                            boxShadow: "0 4px 12px rgba(22, 163, 74, 0.4)",
                            whiteSpace: "nowrap",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "rgb(21, 128, 61)";
                            e.target.style.boxShadow = "0 6px 18px rgba(22, 163, 74, 0.6)";
                            e.target.style.transform = "translateY(-2px)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "rgb(22, 163, 74)";
                            e.target.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.4)";
                            e.target.style.transform = "translateY(0)";
                          }}
                        >
                          <svg
                            style={{ width: "1.25rem", height: "1.25rem" }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Multiple Service Selection */}
                {selectionMode === "multiple" && (
                  <div>
                    <label className="form-label">Select Services * (Choose one or more)</label>
                    <p className="helper-text" style={{ marginBottom: "1rem" }}>
                      Select all services you need
                    </p>
                    <div className="checkbox-grid">
                      {services.map((service) => (
                        <div key={service._id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <label className="checkbox-label" style={{ flex: 1 }}>
                            <input
                              type="checkbox"
                              checked={formData.additionalServices.includes(service.slug)}
                              onChange={() => handleServiceToggle(service.slug)}
                              className="checkbox-input"
                            />
                            <div className="checkbox-text">{service.name}</div>
                          </label>
                          
                          {/* ✨ NEW: Arrow button for each service in multiple mode */}
                          <Link
                            href={`/service?category=${service.slug}`}
                            title={`View details for ${service.name}`}
                            className="service-nav-button-small"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "0.5rem",
                              backgroundColor: "rgb(59, 130, 246)",
                              color: "white",
                              borderRadius: "0.375rem",
                              textDecoration: "none",
                              transition: "all 0.3s ease",
                              cursor: "pointer",
                              border: "none",
                              boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "rgb(37, 99, 235)";
                              e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.5)";
                              e.target.style.transform = "scale(1.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "rgb(59, 130, 246)";
                              e.target.style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.3)";
                              e.target.style.transform = "scale(1)";
                            }}
                          >
                            <svg
                              style={{ width: "1rem", height: "1rem" }}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </Link>
                        </div>
                      ))}
                    </div>
                    {formData.additionalServices.length > 0 && (
                      <p className="success-text" style={{ marginTop: "1rem" }}>
                        <svg style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {formData.additionalServices.length} service{formData.additionalServices.length > 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>
                )}

                {services.length === 0 && (
                  <p className="error-text">
                    <svg style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
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
                    <select
                      name="vehicleBrand"
                      value={formData.vehicleBrand}
                      onChange={handleBrandChange}
                      required
                      className="form-select"
                    >
                      <option value="">Select brand</option>
                      {vehicleBrands.map((brand) => (
                        <option key={brand._id} value={brand.slug}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Vehicle Model *</label>
                    <select
                      name="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={handleChange}
                      required
                      disabled={!formData.vehicleBrand || availableModels.length === 0}
                      className="form-select"
                    >
                      <option value="">
                        {!formData.vehicleBrand ? "Select brand first" : "Select model"}
                      </option>
                      {availableModels.map((model, index) => (
                        <option key={index} value={model}>
                          {model}
                        </option>
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
                    <input
                      type="date"
                      name="bookingDate"
                      value={formData.bookingDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Preferred Time *</label>
                    <select
                      name="bookingTime"
                      value={formData.bookingTime}
                      onChange={handleChange}
                      required
                      className="form-select"
                    >
                      <option value="">Select time slot</option>
                      <option value="07:00 AM">07:00 AM</option>
                      <option value="08:00 AM">08:00 AM</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                      <option value="07:00 PM">07:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="form-label">About Your Issue</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={5}
                  className="form-textarea"
                  placeholder="Any specific requirements or concerns..."
                />
              </div>

              {/* Submit Button */}
              <div style={{ paddingTop: "1.5rem" }}>
                <button
                  type="submit"
                  disabled={loading || phoneError || formData.phone.length !== 10 || services.length === 0 || vehicleBrands.length === 0}
                  className="submit-button"
                >
                  <span className="submit-button-bg"></span>
                  <span className="submit-button-content">
                    {loading ? (
                      <>
                        <svg style={{ width: "1.25rem", height: "1.25rem" }} className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

          {/* Quick Info Cards */}
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