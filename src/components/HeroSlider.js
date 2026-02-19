"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HeroSlider() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    fetchHeroImages();
  }, []);

  useEffect(() => {
    if (images.length > 0 && isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images, isAutoPlaying]);

  const fetchHeroImages = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch("/api/cloudinary-images", {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.images && data.images.length > 0) {
          setImages(data.images);
          setLoading(false);
          return;
        }
      }
      
      throw new Error("No images from API");
      
    } catch (error) {
      setImages([]);
      setLoading(false);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (loading) {
    return (
      <section className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-black flex items-center justify-center">
        <div className="text-center px-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-white mb-4"></div>
          <p className="text-white text-lg sm:text-xl">Loading Premium Experience...</p>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="relative bg-gradient-to-br from-blue-100 via-blue-100 to-blue-100 text-white py-16 sm:py-20 min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in">
            Premium Car Care Services
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-2xl mx-auto px-4">
            Professional automotive care for your vehicle
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[500px] sm:h-[550px] md:h-[600px] lg:h-[700px] overflow-hidden bg-black">
      {/* Background Images - Mobile: static fit, Desktop/Tablet: animated */}
      {images.map((image, index) => (
        <div
          key={image.public_id || index}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === currentIndex 
              ? "opacity-100 scale-110 md:scale-110" 
              : "opacity-0 scale-100 md:scale-100"
          } ${index !== currentIndex ? 'hidden md:block' : ''}`} // Hide non-active on mobile
        >
          <img
            src={image.secure_url}
            alt={`Premium Car Service ${index + 1}`}
            className="w-full h-full object-fit md:object-cover" // Mobile: contain, Desktop+: cover
            style={{
              // Mobile: perfect fit without distortion
              objectPosition: index === currentIndex ? 'center' : 'center',
              height: '100%',
              width: '100%'
            }}
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent sm:from-black/70 sm:via-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent sm:from-black/70" />
        </div>
      ))}

      {/* Main Content - Animations only on tablet+ */}
      <div className="relative z-[5] h-full flex items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            {/* Main Heading - No animation on mobile */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight overflow-hidden md:[animation-play-state:running]">
              <span className="block md:animate-slide-left-r2l md:[--delay:0.2s] bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                Automotive Car Care
              </span>
              <span className="block md:animate-slide-right-l2r md:[--delay:0.3s] bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                Services
              </span>
            </h1>

            {/* Subheading - No animation on mobile */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-4 sm:mb-6 md:mb-8 leading-relaxed overflow-hidden md:animate-wave-slow">
              Professional automotive care with cutting-edge technology and expert technicians delivering unmatched quality
            </p>

            {/* Feature Tags - No animation on mobile */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
              {['Expert Technicians', 'Quick Service', 'Reasonable Price'].map((tag, i) => (
                <span
                  key={i}
                  className="md:animate-slide-up-r2l md:[--delay:0.4s] md:[--stagger:0.1s] bg-white/10 backdrop-blur-md text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-white/20 text-xs sm:text-sm font-medium hover:bg-white/20 hover:animate-pulse-slow md:hover:animate-pulse-slow transition-all duration-500 group-hover:scale-105"
                  style={{ animationDelay: `calc(var(--stagger) * ${i})` }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA Buttons - No floating animation on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:animate-float-group">
              <Link href="/booking">
                <button className="group md:animate-float-item-1 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base sm:text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 flex items-center justify-center space-x-2 overflow-hidden relative">
                  <span>Book Service Now</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform origin-left duration-500 rounded-xl" />
                </button>
              </Link>
              
              <Link href="/services">
                <button className="md:animate-float-item-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-xl font-bold text-base sm:text-lg border-2 border-white/30 hover:border-white/50 transition-all duration-500 transform hover:scale-105 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 absolute inset-0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  View Services
                </button>
              </Link>
            </div>

            {/* Contact Info - No animation on mobile */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4 md:gap-6 text-white/80 md:animate-typewriter">
              <div className="flex items-center space-x-2 md:animate-slide-left-r2l md:[--delay:0.6s]">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:animate-spin-slow" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="font-medium text-sm sm:text-base">+91 93927 92067</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots - Hide on mobile */}
      {images.length > 1 && (
        <div className="hidden md:block absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-[8]">
          <div className="bg-black/30 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center space-x-2 sm:space-x-3 border border-white/20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full animate-pulse-slow ${
                  index === currentIndex 
                    ? "bg-blue-500 w-8 sm:w-10 h-2.5 sm:h-3 shadow-lg shadow-blue-500/50" 
                    : "bg-white/50 hover:bg-white/75 w-2.5 sm:w-3 h-2.5 sm:h-3"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Arrow Navigation - Hide on mobile */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden md:block absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-[8] group bg-black/30 hover:bg-black/50 backdrop-blur-md text-white p-2 sm:p-3 md:p-4 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-110 animate-float-nav"
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="hidden md:block absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-[8] group bg-black/30 hover:bg-black/50 backdrop-blur-md text-white p-2 sm:p-3 md:p-4 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-110 animate-float-nav"
            aria-label="Next slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Scroll Indicator - Hide on mobile */}
      <div className="hidden md:block absolute bottom-20 sm:bottom-24 left-1/2 transform -translate-x-1/2 z-[5] animate-bounce-slow">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/60 animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
