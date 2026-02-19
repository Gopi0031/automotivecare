import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";

export default function Home() {
  return (
    <div className="bg-white">
      <HeroSlider />

      {/* Featured Services Grid - Mubashir Style */}
      <section className="py-16 md:py-20 bg-white">
        <div className="w-full px-6 lg:px-16 xl:px-24 px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Card 1 - Body Repair */}
            <div className="group relative overflow-hidden bg-gray-900 aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500"></div>
              <div className="relative h-full flex flex-col justify-center items-center text-center p-8 text-white">
                <p className="text-xs tracking-[0.3em] uppercase mb-4 text-gray-400">MAINTENANCE</p>
                <h3 className="text-3xl md:text-4xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  Body Repair
                </h3>
                <div className="w-12 h-px bg-amber-400 mb-6"></div>
                <p className="text-sm text-gray-300 font-light leading-relaxed mb-8 max-w-xs">
                  Our state-of-the-art facility for painting and body repair backed by our expert team
                </p>
                <Link href="/services" className="text-sm text-amber-400 hover:text-amber-300 tracking-wide uppercase font-light transition-colors">
                  Know More →
                </Link>
              </div>
            </div>

            {/* Service Card 2 - Mechanical Repair */}
            <div className="group relative overflow-hidden bg-gray-900 aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500"></div>
              <div className="relative h-full flex flex-col justify-center items-center text-center p-8 text-white">
                <p className="text-xs tracking-[0.3em] uppercase mb-4 text-gray-400">ENGINE CARE</p>
                <h3 className="text-3xl md:text-4xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  Mechanical Repair
                </h3>
                <div className="w-12 h-px bg-amber-400 mb-6"></div>
                <p className="text-sm text-gray-300 font-light leading-relaxed mb-8 max-w-xs">
                  Our services are held to the same standards as the main dealerships
                </p>
                <Link href="/services" className="text-sm text-amber-400 hover:text-amber-300 tracking-wide uppercase font-light transition-colors">
                  Know More →
                </Link>
              </div>
            </div>

            {/* Service Card 3 - Auto Electrical */}
            <div className="group relative overflow-hidden bg-gray-900 aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500"></div>
              <div className="relative h-full flex flex-col justify-center items-center text-center p-8 text-white">
                <p className="text-xs tracking-[0.3em] uppercase mb-4 text-gray-400">MAINTENANCE</p>
                <h3 className="text-3xl md:text-4xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  Auto Electrical Repair
                </h3>
                <div className="w-12 h-px bg-amber-400 mb-6"></div>
                <p className="text-sm text-gray-300 font-light leading-relaxed mb-8 max-w-xs">
                  The electrical system of your car is a complex network of electrical wiring
                </p>
                <Link href="/services" className="text-sm text-amber-400 hover:text-amber-300 tracking-wide uppercase font-light transition-colors">
                  Know More →
                </Link>
              </div>
            </div>

            {/* Service Card 4 - A/C Services */}
            <div className="group relative overflow-hidden bg-gray-900 aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500"></div>
              <div className="relative h-full flex flex-col justify-center items-center text-center p-8 text-white">
                <p className="text-xs tracking-[0.3em] uppercase mb-4 text-gray-400">MAINTENANCE</p>
                <h3 className="text-3xl md:text-4xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  A/C Services
                </h3>
                <div className="w-12 h-px bg-amber-400 mb-6"></div>
                <p className="text-sm text-gray-300 font-light leading-relaxed mb-8 max-w-xs">
                  It's the best practice to get the air conditioning system checked regularly
                </p>
                <Link href="/services" className="text-sm text-amber-400 hover:text-amber-300 tracking-wide uppercase font-light transition-colors">
                  Know More →
                </Link>
              </div>
            </div>

            {/* Service Card 5 - Retrofits */}
            <div className="group relative overflow-hidden bg-gray-900 aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500"></div>
              <div className="relative h-full flex flex-col justify-center items-center text-center p-8 text-white">
                <p className="text-xs tracking-[0.3em] uppercase mb-4 text-gray-400">CAR MODIFICATION</p>
                <h3 className="text-3xl md:text-4xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  Retrofits
                </h3>
                <div className="w-12 h-px bg-amber-400 mb-6"></div>
                <p className="text-sm text-gray-300 font-light leading-relaxed mb-8 max-w-xs">
                  Stuck with hesitation to switch to a new car? We upgrade your existing vehicle
                </p>
                <Link href="/services" className="text-sm text-amber-400 hover:text-amber-300 tracking-wide uppercase font-light transition-colors">
                  Know More →
                </Link>
              </div>
            </div>

            {/* Service Card 6 - Diagnosis */}
            <div className="group relative overflow-hidden bg-gray-900 aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500"></div>
              <div className="relative h-full flex flex-col justify-center items-center text-center p-8 text-white">
                <p className="text-xs tracking-[0.3em] uppercase mb-4 text-gray-400">MAINTENANCE</p>
                <h3 className="text-3xl md:text-4xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  Diagnosis & Programming
                </h3>
                <div className="w-12 h-px bg-amber-400 mb-6"></div>
                <p className="text-sm text-gray-300 font-light leading-relaxed mb-8 max-w-xs">
                  From manual to automatic transmission repair, we have experts to fix any problem
                </p>
                <Link href="/services" className="text-sm text-amber-400 hover:text-amber-300 tracking-wide uppercase font-light transition-colors">
                  Know More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Car Care Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="w-full px-6 lg:px-16 xl:px-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-6 font-light">
              EXPERT CAR CARE
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              WE OFFER EFFECTIVE SOLUTIONS
            </h2>
            <h3 className="text-3xl md:text-4xl font-light text-amber-400" style={{ fontFamily: 'Georgia, serif' }}>
              FOR ALL YOUR NEEDS
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Refurbishing", desc: "We cover everything from basic oil change to complex engine repair." },
              { title: "Service and Maintenance", desc: "We cover everything from basic oil change to complex engine repair." },
              { title: "Mechanical Repair", desc: "Our services are held to the same standards as the main dealerships." },
              { title: "Auto Electrical Repair", desc: "The electrical system of your car is a complex network of electrical wiring." },
              { title: "A/C Services", desc: "It's the best practice to get the air conditioning system checked." },
              { title: "Body Repair", desc: "Our state-of-the-art facility for painting and body repair backed our team." },
              { title: "Diagnosis and Programming", desc: "From manual to automatic transmission repair, we have experts to fix any problem." },
            ].map((service, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm p-8 border border-white/10 hover:border-amber-400 hover:bg-white/10 transition-all duration-300 group">
                <h3 className="text-xl md:text-2xl font-light text-white mb-4 group-hover:text-amber-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-300 font-light leading-relaxed mb-6 text-sm">
                  {service.desc}
                </p>
                <Link href="/services" className="text-sm text-amber-400 hover:text-amber-300 tracking-wide uppercase font-light transition-colors">
                  Know More..
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instant Diagnostic Section */}
      <section className="py-20 md:py-28 bg-amber-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                Get Best Service
                <br />
                and 
              </h2>
              <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-medium">
                You can now visit us anytime in our working hours to get instant consultation for your car. Get expert advice and know the estimated cost beforehand.
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm tracking-[0.2em] uppercase text-gray-800 mb-4 font-light">
                Call Us Any Time
              </p>
              <a href="tel:+971556062224" className="text-4xl md:text-5xl font-light text-gray-900 hover:text-white transition-colors block mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                +91 93927 92067
              </a>
              <Link href="/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white text-sm tracking-[0.2em] uppercase font-light hover:bg-gray-800 transition-all duration-300">
                Know More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Working Process Section */}
      <section className="py-20 bg-white">
        <div className="w-full px-6 lg:px-16 xl:px-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-6 font-light">
              Know More
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              OUR WORKING PROCESS
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white font-light">1</span>
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-4">BOOK AN APPOINTMENT</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Schedule your service appointment online or call us directly
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-gray-900 font-light">2</span>
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-4">GET DETAILS</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Receive instant diagnostic and cost estimate for your vehicle
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white font-light">3</span>
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-4">GET YOUR CAR READY FOR DRIVE</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Your vehicle serviced to perfection and ready to hit the road
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <p className="text-lg md:text-xl text-gray-700 font-light max-w-3xl mx-auto">
              Your convenience and comfort is our priority, so we have made it easy for you to drop off your{' '}
              <span className="italic font-medium">vehicle 24/7.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Best Car Services Badge */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block border-4 border-amber-400 p-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Best Car Services<br /> in Guntur
            </h2>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-12" style={{ fontFamily: 'Georgia, serif' }}>
            Ready to Experience Premium Car Care?
          </h2>
          <Link href="/booking">
            <button className="inline-flex items-center gap-4 px-12 py-5 bg-amber-400 text-gray-900 text-sm tracking-[0.2em] uppercase font-medium hover:bg-amber-300 transition-all duration-300 shadow-lg">
              Book Appointment Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
