"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

const servicesData = {
  commonServices: [
    { name: "Basic Wash", desc: "Exterior wash with premium soap" },
    { name: "Interior Vacuum", desc: "Deep vacuum cleaning of seats and carpet"},
    { name: "Tire Shine", desc: "Professional tire cleaning and shine" }
  ],
  specialServices: [
    { name: "Premium Detailing", desc: "Complete interior and exterior restoration"},
    { name: "Ceramic Coating", desc: "Long-lasting paint protection"},
    { name: "Paint Protection", desc: "Advanced paint protection film" }
  ],
};

export default function ModelServicesPage() {
  const router = useRouter();
  const params = useParams();
  const [isVisible, setIsVisible] = useState(false);

  const brandSlug = params.brand;
  const modelSlug = params.model;
  
  const brandName = brandSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const modelName = modelSlug.charAt(0).toUpperCase() + modelSlug.slice(1);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const totalServices = servicesData.commonServices.length + servicesData.specialServices.length;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
        {/* Header - Mobile Optimized */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl z-20 border-b-2 sm:border-b-4 border-amber-400">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 lg:py-6">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <button 
                onClick={() => router.back()} 
                className="bg-amber-500 hover:bg-amber-600 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5 sm:gap-2 shadow-lg font-bold text-sm sm:text-base touch-manipulation"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden xs:inline sm:inline">Back</span>
              </button>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold truncate">
                  {brandName} {modelName}
                </h1>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-300 mt-0.5 sm:mt-1 truncate">
                  {totalServices} service{totalServices !== 1 ? 's' : ''} available
                </p>
              </div>
              
              <button 
                onClick={() => router.push('/')} 
                className="bg-red-500 hover:bg-red-600 p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-95 shadow-lg touch-manipulation"
                aria-label="Close"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative py-6 sm:py-8 md:py-12 lg:py-16 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.3),transparent_70%)]"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase text-gray-500 mb-3 sm:mb-4 font-light animate-slide-down">
                Professional Services
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-3 sm:mb-4 animate-fade-in-up delay-100" style={{ fontFamily: 'Georgia, serif' }}>
                Available <em className="text-amber-600">Services</em>
              </h2>
              <div className="w-12 sm:w-16 md:w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-3 sm:mb-4 animate-scale-in delay-200"></div>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 font-light leading-relaxed animate-fade-in-up delay-300 px-4">
                Professional car care services for your {brandName} {modelName}
              </p>
            </div>
          </div>
        </div>

        {/* Services Content */}
        <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* Model Header Card */}
            <div className={`bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{modelName}</h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-300">{brandName}</p>
                </div>
              </div>
            </div>

            {/* Common Services */}
            <div className={`bg-blue-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-blue-100 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900">Common Services</h4>
                  <p className="text-[10px] sm:text-xs text-blue-700 mt-0.5">Essential car care</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {servicesData.commonServices.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-start sm:items-center gap-3 bg-white p-3 sm:p-4 rounded-xl border-2 border-blue-100"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-sm sm:text-base font-semibold text-gray-900 block mb-1">{service.name}</span>
                      <p className="text-[10px] sm:text-xs text-gray-600">{service.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Services */}
            <div className={`bg-amber-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-amber-100 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-900">Special Services</h4>
                  <p className="text-[10px] sm:text-xs text-amber-700 mt-0.5">Premium car care</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {servicesData.specialServices.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-start sm:items-center gap-3 bg-white p-3 sm:p-4 rounded-xl border-2 border-amber-100"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-amber-100">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-sm sm:text-base font-semibold text-gray-900 block mb-1">{service.name}</span>
                      <p className="text-[10px] sm:text-xs text-gray-600">{service.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Book Now Button */}
            <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-gray-100 via-gray-100 to-transparent pt-4 pb-4 sm:pb-0 sm:relative sm:bg-none">
              <button 
                onClick={() => router.push('/booking')} 
                className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-amber-400 hover:to-amber-500 text-white hover:text-gray-900 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg md:text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 group touch-manipulation"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Book Service Now</span>
                <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Why Choose Section */}
        <section className="py-8 sm:py-12 md:py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <p className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase text-gray-400 mb-2 sm:mb-3 font-light">
                Why Choose Us
              </p>
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Quality <em className="text-amber-400">Guaranteed</em>
              </h3>
              <div className="w-12 sm:w-16 md:w-20 h-px bg-gray-700 mx-auto"></div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[
                { icon: '⚡', title: 'Quick Service', desc: 'Fast & efficient' },
                { icon: '💯', title: 'Quality Work', desc: 'Satisfaction guaranteed' },
                { icon: '👨‍🔧', title: 'Expert Team', desc: 'Certified professionals' },
                { icon: '💰', title: 'Best Price', desc: 'Competitive rates' },
              ].map((item, index) => (
                <div key={index} className="text-center p-3 sm:p-4 md:p-6 bg-gray-800 rounded-xl sm:rounded-2xl hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 md:mb-4">
                    {item.icon}
                  </div>
                  <h4 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold mb-1 sm:mb-2">
                    {item.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-light">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scaleX(0); }
          to { opacity: 1; transform: scaleX(1); }
        }
        .animate-slide-down { animation: slide-down 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-scale-in { animation: scale-in 0.8s ease-out; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        @media (min-width: 475px) {
          .xs\:inline { display: inline; }
        }
      `}</style>
    </>
  );
}
