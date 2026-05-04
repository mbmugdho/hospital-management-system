import Navbar    from "@/components/landing/Navbar";
import Hero      from "@/components/landing/Hero";
import Stats     from "@/components/landing/Stats";
import Features  from "@/components/landing/Features";
import Pricing   from "@/components/landing/Pricing";
import CtaBanner from "@/components/landing/CtaBanner";
import Footer    from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <Pricing />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}