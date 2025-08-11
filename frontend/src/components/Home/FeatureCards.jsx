import React from "react";
import chatImg from "../../assets/feature-1.png";
import understandImg from "../../assets/feature-3.png";
import privateImg from "../../assets/feature-2.png";
import automationImg from "../../assets/feature-4.png";

const features = [
  {
    title: "Command with Chat",
    desc: "Control your browser with simple text like “Book 2 train tickets for next Friday.”",
    img: chatImg,
  },
  {
    title: "Understands Any Page",
    desc: "Uses LLMs + scraping to read, summarize, and reason through open tabs.",
    img: understandImg,
  },
  {
    title: "Private & Local",
    desc: "All data stays on your machine. No external servers, no compromise.",
    img: privateImg,
  },
  {
    title: "Automates Your Workflow",
    desc: "Fills forms, clicks buttons, and performs tasks — just like a human.",
    img: automationImg,
  },
];

const FeatureCards = () => {
  return (
    <section className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-8">
      {features.map((feature, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-br from-[#1f1f3a] to-[#2b2b45] rounded-2xl p-6 text-white border border-gray-700 hover:border-orange-400 shadow-lg hover:shadow-orange-500/30 transition-transform hover:scale-105 duration-300 flex flex-col items-center text-center"
        >
          <div className="w-24 h-24 mb-4">
            <img
              src={feature.img}
              alt={feature.title}
              loading="lazy"
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {feature.title}
          </h3>
          <p className="text-gray-300 text-sm">{feature.desc}</p>
        </div>
      ))}
    </section>
  );
};

export default FeatureCards;
