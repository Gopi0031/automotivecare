"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TopBanner() {
  const router = useRouter();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    description: "",
  });

  const handleBookingClick = () => {
    // Close the header mobile menu when booking modal opens
    window.dispatchEvent(new CustomEvent("closeHeaderMenu"));
    setIsBookingOpen(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!formData.name || !formData.number || !formData.description) {
      alert("Please fill all fields");
      return;
    }

    if (formData.number.length !== 10) {
      alert("Please enter valid 10-digit phone number");
      return;
    }

    const message = `*New Booking Request*%0A%0AName: ${encodeURIComponent(
      formData.name
    )}%0APhone: ${encodeURIComponent(
      formData.number
    )}%0ADescription: ${encodeURIComponent(formData.description)}`;

    const whatsappNumber = "919392792067";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

    const whatsappWindow = window.open(
      whatsappURL,
      "_blank",
      "noopener,noreferrer"
    );

    if (whatsappWindow) {
      setFormData({ name: "", number: "", description: "" });
      setIsBookingOpen(false);
    } else {
      alert("Please allow popups for WhatsApp");
    }
  };

  return (
    <>
      {/* ── TOP BANNER ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 sm:py-4 md:py-5 gap-3 lg:gap-0">

            {/* Left — Car Brands */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-1">
              <div className="flex items-center gap-2 flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
                <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold tracking-wide">
                  VIEW CAR BRANDS
                </span>
              </div>
              <button
                onClick={() => router.push("/car-brands")}
                className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 bg-white text-red-600 text-xs sm:text-sm font-bold rounded-lg hover:bg-red-50 hover:text-red-700 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex-shrink-0"
              >
                CLICK HERE
              </button>
            </div>

            {/* Mobile Divider */}
            <div className="w-full h-px bg-white/20 lg:hidden"></div>

            {/* Center — Contact Info */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 md:gap-6 flex-wrap order-3 lg:order-2">
              <div className="flex items-center gap-1.5 sm:gap-2 order-1 w-full sm:w-auto">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
                <span className="text-xs sm:text-sm md:text-base font-semibold text-center sm:text-left">
                  📞 +91 93927 92067
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 order-2 w-full sm:w-auto">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
                </svg>
                <span className="text-xs sm:text-sm md:text-base font-semibold text-center sm:text-left">
                  📍 GUNTUR, AP
                </span>
              </div>
            </div>

            {/* Right — Quick Booking */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 flex-1 justify-end order-2 lg:order-3">
              <div className="flex items-center gap-2 flex-shrink-0 order-1">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.3-1.54c-.2-.24-.58-.24-.77 0-.19.23-.19.62 0 .85l1.9 2.23c.2.24.59.24.77 0l3.34-4.27c.19-.23.19-.62 0-.85-.19-.23-.57-.24-.77-.01z" />
                </svg>
                <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold tracking-wide text-right sm:text-left">
                  QUICK BOOKING
                </span>
              </div>
              <button
                onClick={handleBookingClick}
                className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs sm:text-sm font-bold rounded-lg hover:shadow-lg active:shadow-md active:scale-95 transition-all duration-300 flex-shrink-0"
              >
                BOOK NOW
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── QUICK BOOKING MODAL ─────────────────────────────────────── */}
      {isBookingOpen && (
        <>
          {/* Backdrop — above everything including header (z-index 9999) */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 20000 }}
            onClick={() => setIsBookingOpen(false)}
          />

          {/* Modal panel */}
          <div
            className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 pointer-events-none"
            style={{ zIndex: 20001 }}
          >
            <div
              className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-sm w-full mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white/50 rounded-t-2xl">
                <div>
                  <h3
                    className="text-xl sm:text-2xl font-light text-gray-900 tracking-tight"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Quick Booking
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Connect instantly via WhatsApp
                  </p>
                </div>
                <button
                  onClick={() => setIsBookingOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:scale-110"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-sm sm:text-base placeholder-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    maxLength="10"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-sm sm:text-base placeholder-gray-400"
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                    Service Required *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 resize-vertical transition-all duration-300 text-sm sm:text-base placeholder-gray-400 min-h-[100px]"
                    placeholder="Describe your car service requirements (car model, service type, etc.)"
                  />
                </div>

                <button
                  type="submit"
                  className="group w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 sm:py-5 rounded-xl font-semibold tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Send via WhatsApp</span>
                </button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  🔒 Use for booking purposes only
                </p>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}