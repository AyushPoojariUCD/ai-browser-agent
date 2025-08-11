import React from "react";
import { Link } from "react-router-dom";

const DemoPreview = () => {
  return (
    <section className="mt-24 text-white text-center px-4 sm:px-10 md:px-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        See the AI Agent in Action
      </h2>
      <p className="text-gray-400 max-w-2xl mx-auto mb-8">
        Watch how the AI Browser Agent navigates, analyzes, and completes real
        web tasks locally using LLM intelligence.
      </p>

      {/* Gradient Border Wrapper */}
      <div className="relative rounded-2xl p-1 bg-gradient-to-r from-orange-500 via-purple-600 to-pink-500 shadow-2xl mb-8">
        <div className="rounded-2xl overflow-hidden bg-[#0f0f1b]">
          <iframe
            src="https://www.youtube.com/embed/evqEABDed5U"
            title="AI Agent Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-[400px] sm:h-[500px] md:h-[600px]"
          ></iframe>
        </div>
      </div>

      {/* CTA Button */}
      <Link
        to="/signup"
        className="inline-block bg-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-orange-600 transition"
      >
        Try It Now
      </Link>
    </section>
  );
};

export default DemoPreview;
