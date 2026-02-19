"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function BrandModelsPage() {
  const router = useRouter();
  const params = useParams();
  const brandSlug = params.brand;
  const [isVisible, setIsVisible] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  const brandName = brandSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  useEffect(() => {
    fetchModels();
    setTimeout(() => setIsVisible(true), 100);
  }, [brandSlug]);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/car-models?brand=${brandSlug}`);
      const data = await response.json();
      if (data.success) {
        setModels(data.models);
      }
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModelClick = (model) => {
    router.push(`/car-brands/${brandSlug}/${model.slug}`);
  };

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading models...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
        {/* Header - Mobile Optimized */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl z-20 border-b-2 sm:border-b-4 border-amber-400">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 lg:py-6">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              {/* Back Button */}
              <button 
                onClick={() => router.back()} 
                className="bg-amber-500 hover:bg-amber-600 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5 sm:gap-2 shadow-lg font-bold text-sm sm:text-base touch-manipulation"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden xs:inline">Back</span>
              </button>
              
              {/* Title Section */}
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold truncate">
                  {brandName} Models
                </h1>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-300 mt-0.5 sm:mt-1 truncate">
                  {models.length} model{models.length !== 1 ? 's' : ''} available
                </p>
              </div>
              
              {/* Close Button */}
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
        <div className="relative py-8 sm:py-12 md:py-16 lg:py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.3),transparent_70%)]"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase text-gray-500 mb-3 sm:mb-4 md:mb-6 font-light animate-slide-down">
                Premium Selection
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 mb-3 sm:mb-4 md:mb-6 animate-fade-in-up delay-100" style={{ fontFamily: 'Georgia, serif' }}>
                Select Your <em className="text-amber-600">{brandName}</em> Model
              </h2>
              <div className="w-12 sm:w-16 md:w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-3 sm:mb-4 md:mb-6 animate-scale-in delay-200"></div>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 font-light leading-relaxed animate-fade-in-up delay-300 px-4">
                Choose your vehicle model to view available services
              </p>
            </div>
          </div>
        </div>

        {/* Models Grid with Images */}
        <div className="max-w-8xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {models.map((model, index) => (
              <button
                key={model._id}
                onClick={() => handleModelClick(model)}
                className={`group bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-amber-400 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 active:scale-95 touch-manipulation ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Model Image Container */}
                <div className="relative h-40 xs:h-44 sm:h-48 md:h-52 lg:h-56 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <pattern id={`pattern-${index}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="currentColor" />
                      </pattern>
                      <rect x="0" y="0" width="100" height="100" fill={`url(#pattern-${index})`} />
                    </svg>
                  </div>
                  
                  {/* Car Image or Fallback Icon */}
                  {!imageErrors[index] && model.image ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={model.image}
                        alt={`${model.name} car`}
                        fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                        onError={() => handleImageError(index)}
                        sizes="(max-width: 475px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 text-gray-300 group-hover:text-gray-400 transition-all duration-500 transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      View Services →
                    </span>
                  </div>
                  
                  {/* Service Count Badge */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-amber-400 text-gray-900 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg transform group-hover:scale-110 transition-all duration-300">
                    {model.serviceCount} Services
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 md:p-6">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 group-hover:text-amber-500 transition-colors duration-300 mb-2">
                    {model.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                    Professional care available
                  </p>
                  
                  {/* View Button */}
                  <div className="flex items-center justify-center gap-2 text-gray-600 group-hover:text-amber-600 transition-colors duration-300">
                    <span className="text-xs sm:text-sm font-medium tracking-wide uppercase">View Details</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* No Models Message */}
          {models.length === 0 && (
            <div className="text-center py-12 sm:py-16 md:py-20">
              <div className="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-6 opacity-50">🚗</div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-900 mb-3 sm:mb-4">No Models Available</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">We couldn't find any models for this brand.</p>
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-amber-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 font-medium text-sm sm:text-base touch-manipulation"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Go Back
              </button>
            </div>
          )}
        </div>
      </div>

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
          .xs\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .xs\\:inline { display: inline; }
          .xs\\:w-20 { width: 5rem; }
          .xs\\:h-20 { height: 5rem; }
          .xs\\:h-44 { height: 11rem; }
        }
      `}</style>
    </>
  );
}
