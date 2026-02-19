"use client";

import { useRouter } from "next/navigation";

export default function ViewCarTypeSidebar() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/car-brands')}
      className="fixed top-[7.5rem] xs:top-24 left-3 xs:left-4 sm:left-6 z-50 group touch-manipulation [-webkit-tap-highlight-color:transparent]"
      aria-label="View Car Brands"
    >
      {/* Pulse Effect */}
      <span className="absolute inset-0 rounded-full bg-gray-900 animate-ping opacity-20"></span>
      
      {/* Main Button */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 hover:from-amber-400 hover:to-amber-500 text-white hover:text-gray-900 p-3 xs:p-4 sm:p-5 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 hover:rotate-[-12deg] active:scale-95">
        <svg className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>

      {/* Tooltip - Desktop Only */}
      <span className="hidden lg:block absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl">
        View Car Brands
        <span className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900"></span>
      </span>
    </button>
  );
}
