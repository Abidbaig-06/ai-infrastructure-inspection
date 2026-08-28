import React from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { CapabilitySection } from '../components/CapabilitySection';
import { Footer } from '../components/Footer';

export const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-obsidian-rock text-zinc-100 selection:bg-white selection:text-black">
      {/* 1. Header with dynamic online/offline officer status */}
      <Header />

      {/* 2. Hero Section with 2-column layout, primary CTA & Inspector Login */}
      <main className="flex-1">
        <HeroSection />
      </main>

      {/* 4. Professional multi-column civic infrastructure footer */}
      <Footer />
    </div>
  );
};
