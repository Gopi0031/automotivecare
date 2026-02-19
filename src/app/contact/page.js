"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address (e.g., name@example.com)";
    }

    // Phone validation (10 digits only)
    if (formData.phone) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Phone number must be exactly 10 digits";
      }
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validate form before submitting
    if (!validateForm()) {
      setMessage("Please fix the errors below");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", phone: "", message: "" });
        setErrors({});
      } else {
        setMessage(data.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,191,36,0.3),transparent_50%)] animate-pulse"></div> */}
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-6 font-light">
            Get In Touch
          </p>
          <h1 className="text-5xl md:text-8xl font-light mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Contact <em className="text-amber-400">Us</em>
          </h1>
          <div className="w-20 h-px bg-gray-600 mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-light">
            Have questions? We're here to help
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="order-2 lg:order-1">
              <div className="bg-gray-900 p-10 md:p-12">
                <h2 className="text-3xl md:text-4xl font-light text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-light text-white mb-3 tracking-wide uppercase">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 border-2 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } focus:border-amber-400 bg-white text-black transition-all duration-300 font-light focus:outline-none`}
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-light text-white mb-3 tracking-wide uppercase">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 border-2 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:border-amber-400 bg-white text-black transition-all duration-300 font-light focus:outline-none`}
                      placeholder="name@example.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-light text-white mb-3 tracking-wide uppercase">
                      Phone (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-light">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength="10"
                        className={`w-full pl-16 pr-5 py-4 border-2 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        } focus:border-amber-400 bg-white text-black transition-all duration-300 font-light focus:outline-none`}
                        placeholder="9876543210"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.phone}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-400 font-light">
                      Enter 10-digit mobile number without country code
                    </p>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-sm font-light text-white mb-3 tracking-wide uppercase">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full px-5 py-4 border-2 ${
                        errors.message ? 'border-red-500' : 'border-gray-300'
                      } focus:border-amber-400 bg-white text-black transition-all duration-300 resize-none font-light focus:outline-none`}
                      placeholder="How can we help you?"
                    />
                    {errors.message && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Success/Error Message */}
                  {message && (
                    <div
                      className={`p-5 border-l-4 ${
                        message.includes("success")
                          ? "bg-green-900/30 border-green-500 text-green-300"
                          : "bg-red-900/30 border-red-500 text-red-300"
                      }`}
                    >
                      <div className="flex items-center">
                        {message.includes("success") ? (
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                        {message}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full py-5 border-2 border-white bg-transparent text-white text-center text-sm tracking-[0.2em] uppercase font-light overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-gray-900 transition-all duration-300"
                  >
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="order-1 lg:order-2">
              <div className="sticky top-8">
                <div className="bg-gray-900 p-10 md:p-12 mb-8">
                  <h2 className="text-3xl md:text-4xl font-light text-white mb-10" style={{ fontFamily: 'Georgia, serif' }}>
                    Get in Touch
                  </h2>
                  <div className="space-y-8">
                    <div className="flex items-start group">
                      <div className="w-14 h-14 bg-white/10 flex items-center justify-center mr-5 flex-shrink-0 group-hover:bg-amber-400 transition-colors duration-300">
                        <svg className="w-6 h-6 text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-light text-gray-400 mb-2 tracking-wide uppercase">Address</h3>
                        <p className="text-white font-light text-lg">Guntur, Andhra Pradesh<br/>India</p>
                      </div>
                    </div>

                    <div className="flex items-start group">
                      <div className="w-14 h-14 bg-white/10 flex items-center justify-center mr-5 flex-shrink-0 group-hover:bg-amber-400 transition-colors duration-300">
                        <svg className="w-6 h-6 text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-light text-gray-400 mb-2 tracking-wide uppercase">Phone</h3>
                        <a href="tel:+91 93927 92067" className="text-white font-light text-lg hover:text-amber-400 transition-colors">
                          +91 93927 92067
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start group">
                      <div className="w-14 h-14 bg-white/10 flex items-center justify-center mr-5 flex-shrink-0 group-hover:bg-amber-400 transition-colors duration-300">
                        <svg className="w-6 h-6 text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-light text-gray-400 mb-2 tracking-wide uppercase">Email</h3>
                        <a href="mailto:vwautomotiveservices@gmail.com" className="text-white font-light text-lg hover:text-amber-400 transition-colors break-all">
                          	vwautomotiveservices@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start group">
                      {/* <div className="w-14 h-14 bg-white/10 flex items-center justify-center mr-5 flex-shrink-0 group-hover:bg-amber-400 transition-colors duration-300">
                        <svg className="w-6 h-6 text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-light text-gray-400 mb-2 tracking-wide uppercase">Hours</h3>
                        <p className="text-white font-light text-lg">Open in Flexble Time</p>
                      </div> */}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
