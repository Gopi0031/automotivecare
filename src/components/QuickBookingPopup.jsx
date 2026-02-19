"use client";

import { useState, useEffect } from "react";

export default function QuickBookingPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    description: "",
  });
  const [focusedField, setFocusedField] = useState(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => setIsVisible(true), 10);
    } else {
      document.body.style.overflow = "unset";
      setIsVisible(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = `*New Booking Request*%0A%0AName: ${encodeURIComponent(
      formData.name
    )}%0APhone: ${encodeURIComponent(
      formData.number
    )}%0ADescription: ${encodeURIComponent(formData.description)}`;

    const whatsappNumber = CONTACT_PHONE || "+91 93927 92067";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(whatsappURL, "_blank");

    setFormData({ name: "", number: "", description: "" });
    setIsOpen(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <>
      {/* Floating Button - Enhanced with ripple effect */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Quick Booking"
      >
        {/* Pulse Ring Animation */}
        <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-75"></span>
        
        {/* Main Button */}
        <div className="relative bg-gradient-to-br from-amber-400 to-amber-500 hover:from-gray-900 hover:to-gray-800 text-gray-900 hover:text-white p-4 sm:p-5 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 hover:rotate-12 active:scale-95">
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:rotate-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Tooltip */}
        <span className="hidden sm:block absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl">
          Quick Booking
          <span className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-gray-900"></span>
        </span>
      </button>

      {/* Modal Overlay with Animation */}
      {isOpen && (
        <div
          className={`fixed inset-0 bg-black z-50 flex items-end sm:items-center justify-center transition-all duration-300 ${
            isVisible ? "bg-opacity-60 backdrop-blur-sm" : "bg-opacity-0"
          }`}
          onClick={closeModal}
        >
          {/* Modal Content - Slide up on mobile, scale on desktop */}
          <div
            className={`bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg sm:mx-4 relative transform transition-all duration-500 ease-out max-h-[90vh] overflow-y-auto ${
              isVisible
                ? "translate-y-0 sm:scale-100 opacity-100"
                : "translate-y-full sm:translate-y-0 sm:scale-90 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle (Mobile) */}
            <div className="sm:hidden flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-900 transition-all duration-300 hover:rotate-90 p-2 rounded-full hover:bg-gray-100 z-10"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Content */}
            <div className="p-6 sm:p-8 pb-8">
              {/* Header with animated underline */}
              <div className="mb-8 sm:mb-10">
                <h3
                  className="text-3xl sm:text-4xl font-light text-gray-900 mb-3"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Quick Booking
                </h3>
                <div className="relative h-px bg-gray-200 w-full">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-1000"
                    style={{ width: isVisible ? "80px" : "0px" }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Fill the form below and we'll contact you via WhatsApp
                </p>
              </div>

              {/* Form with enhanced interactions */}
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Name Field */}
                <div className="relative">
                  <label
                    htmlFor="name"
                    className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      focusedField === "name"
                        ? "text-amber-500"
                        : "text-gray-700"
                    }`}
                  >
                    Name *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 text-gray-900 placeholder-gray-400"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="relative">
                  <label
                    htmlFor="number"
                    className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      focusedField === "number"
                        ? "text-amber-500"
                        : "text-gray-700"
                    }`}
                  >
                    Phone Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </span>
                    <input
                      type="tel"
                      id="number"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("number")}
                      onBlur={() => setFocusedField(null)}
                      required
                      pattern="[0-9]{10}"
                      className="w-full pl-12 pr-4 py-3.5 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 text-gray-900 placeholder-gray-400"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>

                {/* Description Field */}
                <div className="relative">
                  <label
                    htmlFor="description"
                    className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      focusedField === "description"
                        ? "text-amber-500"
                        : "text-gray-700"
                    }`}
                  >
                    Service Description *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </span>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("description")}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={4}
                      className="w-full pl-12 pr-4 py-3.5 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 resize-none text-gray-900 placeholder-gray-400"
                      placeholder="Describe your service requirements (e.g., Car wash, detailing, etc.)"
                    />
                  </div>
                </div>

                {/* Submit Button with WhatsApp Icon */}
                <button
                  type="submit"
                  className="group w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 sm:py-5 rounded-xl font-semibold tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  <svg
                    className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Send via WhatsApp</span>
                </button>

                {/* Privacy Note */}
                <p className="text-xs text-center text-gray-500 mt-4">
                  🔒 Use for booking purposes only
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
