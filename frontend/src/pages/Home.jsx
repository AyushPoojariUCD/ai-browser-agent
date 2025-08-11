// src/pages/Home.jsx
import React from "react";
import Navbar from "../components/Home/Navbar";
import HeroSection from "../components/Home/HeroSection";
import FeatureCards from "../components/Home/FeatureCards";
import HeroSectionCustomerReview from "../components/Home/HeroSectionCustomerReview";
import Footer from "../components/Footer";
import DemoPreview from "../components/Home/DemoPreview";
import IntegrationGrid from "../components/Home/IntegrationGrid";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f0f1b] via-[#131321] to-[#1a1a2e] text-white px-4 sm:px-8 md:px-20 py-12 md:py-16">
      <Navbar />
      <HeroSection />
      <FeatureCards /> {/* Reflects AI Browser Agent features */}
      <HeroSectionCustomerReview /> {/*Reflects Customer Review*/}
      <IntegrationGrid /> {/*Reflects Integration*/}
      <DemoPreview />
      <Footer />
    </div>
  );
};

export default Home;
