import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Company Info */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-xl md:text-2xl font-light mb-6 text-white" style={{ fontFamily: 'Georgia, serif' }}>
              Automotive<br />Car Care
            </h3>
            <div className="w-12 h-px bg-gray-600 mb-6"></div>
            <p className="text-gray-400 leading-relaxed font-light text-sm">
              Your trusted partner for premium automotive care services in Guntur, Andhra Pradesh.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-6 font-light">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm font-light group inline-flex items-center gap-2">
                  Services
                  <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm font-light group inline-flex items-center gap-2">
                  Booking
                  <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm font-light group inline-flex items-center gap-2">
                  Contact
                  <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-6 font-light">
              Our Services
            </h4>

            <ul className="space-y-3 text-gray-400 text-sm font-light">
              <li>Mechanical Works</li>
              <li>Electrical Works</li>
              <li>Maintenance Services</li>
              <li>Car A/C Works</li>
              <li>General Check Up</li>
              <li>General Services</li>
              <li>
    <Link href="/special-services" className="text-amber-400 hover:text-red-300">
      Special Services
    </Link>
  </li>
            </ul>
          </div>


          {/* Contact Info */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-6 font-light">Contact Us</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-light">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>Guntur, Andhra Pradesh</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <a href="tel:+91 93927 92067" className="hover:text-white transition-colors duration-300">
                  +91 93927 92067
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <a href="mailto:vwautomotiveservices@gmail.com" className="hover:text-white transition-colors duration-300">
                  vwautomotiveservices@gmail.com
                </a>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-4">
                  <a
                    href="https://youtube.com/@automotivecarcareguntur?si=HkgjxMlgs1YwiCC9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                    aria-label="YouTube"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.01 3.01 0 0 0-2.12-2.13C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.378.556a3.01 3.01 0 0 0-2.12 2.13A31.1 31.1 0 0 0 0 12a31.1 31.1 0 0 0 .502 5.814 3.01 3.01 0 0 0 2.12 2.13C4.495 20.5 12 20.5 12 20.5s7.505 0 9.378-.556a3.01 3.01 0 0 0 2.12-2.13A31.1 31.1 0 0 0 24 12a31.1 31.1 0 0 0-.502-5.814ZM9.75 15.5v-7l6 3.5-6 3.5Z" />
                    </svg>
                  </a>

                  <a href="https://www.instagram.com/guntur_automotive_cars?igsh=Z2c3djF0cHIwM2o4" className="text-gray-400 hover:text-white transition-colors duration-300" aria-label="Instagram">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs font-light">
              &copy; {new Date().getFullYear()} Automotive Car care. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 text-xs font-light">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 text-xs font-light">
                Terms of Service
              </a>
            </div>

          </div>
        </div>
      </div>
               <div className="text-center" >  <a href="https://www.ramakalpasolutions.in/" className="text-red-500 hover:text-white transition-colors uppercase duration-300 text-xs font-light">
                Designed By Ramakalpa solutions
              </a></div> 
    </footer>
    
  );
}
