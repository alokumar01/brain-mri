"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import TestimonialsSection from "../components/TestimonialsSection";
import WhyUsSection from "../components/WhyUsSection"; // New section
import CTASection from "../components/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <HeroSection id="hero" />
        <FeaturesSection id="features" />
        <HowItWorksSection id="how-it-works" />
        <TestimonialsSection id="testimonials" />
        <WhyUsSection id="why-us" />
        <CTASection id="cta" />
      </main>
      <Footer />
    </div>
  );
}