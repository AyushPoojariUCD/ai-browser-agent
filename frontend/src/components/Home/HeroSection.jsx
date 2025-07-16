// src/components/HeroSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import LightningCanvas from "../Animation/LightningCanvas";

const HeroSection = () => {
  return (
    <section className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
          Flexible AI browser automation <br />
          <span className="bg-gradient-to-r from-orange-500 to-purple-500 text-transparent bg-clip-text">
            for smart users
          </span>
        </h2>
        <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-xl mx-auto lg:mx-0">
          Run secure, multi-step AI tasks like ticket booking, form filling, and
          web automation directly from your device — powered by LLMs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
          <Link
            to="/signup"
            className="bg-orange-500 px-6 py-3 rounded-xl text-white font-semibold hover:bg-orange-600"
          >
            Get started for free
          </Link>
        </div>
      </div>

      {/* Lightning animation canvas */}
      <div className="w-full lg:w-1/2 h-[300px] sm:h-[400px] md:h-[500px]">
        <LightningCanvas />
      </div>
    </section>
  );
};

export default HeroSection;
