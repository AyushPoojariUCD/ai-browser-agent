// src/components/Home/HeroCTA.jsx
import React from "react";

const HeroSectionCustomerReview = () => (
  <section className="text-center bg-gradient-to-br from-[#1a1a2e] via-[#11111f] to-[#0e0e1b] px-6 py-20 rounded-2xl shadow-lg mt-12">
    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
      There’s nothing you can’t automate with our AI Browser Agent.
    </h2>
    <p className="text-lg text-gray-300 mb-6">
      Our user’s words, not ours. Skeptical?{" "}
      <span className="text-orange-400 font-semibold">Try it out</span>, and see
      for yourself.
    </p>
    <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition">
      Start building
    </button>
  </section>
);

export default HeroSectionCustomerReview;
