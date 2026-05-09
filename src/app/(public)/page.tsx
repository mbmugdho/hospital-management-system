import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Stats from '@/components/landing/Stats'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import Testimonials from '@/components/landing/Testimonials'
import Pricing from '@/components/landing/Pricing'
import FAQ from '@/components/landing/FAQ'
import CtaBanner from '@/components/landing/CtaBanner'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full relative bg-black">
      {/* Global indigo cosmos background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #000000',
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <Stats />
          <Features />
          <HowItWorks />
          <Testimonials />
          <Pricing />
          <FAQ />
          <CtaBanner />
        </main>
        <Footer />
      </div>
    </div>
  )
}
