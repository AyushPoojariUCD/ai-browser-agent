import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0f0f1b] text-gray-400 text-sm mt-24 pt-10 pb-6 px-4 sm:px-10">
      {/* Grid Sections */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-10">
        
        <div className="break-words max-w-xs">
          <h3 className="text-white font-bold text-lg mb-3">Popular integrations</h3>
          <ul className="space-y-1 text-sm leading-relaxed">
            <li>Google Sheets</li>
            <li>Telegram</li>
            <li>MySQL</li>
            <li>Slack</li>
            <li>Discord</li>
            <li>Postgres</li>
          </ul>
        </div>

        <div className="break-words max-w-xs">
          <h3 className="text-white font-bold text-lg mb-3">Trending combinations</h3>
          <ul className="space-y-1 text-sm leading-relaxed">
            <li>HubSpot and Salesforce</li>
            <li>Twilio and WhatsApp</li>
            <li>GitHub and Jira</li>
            <li>Asana and Slack</li>
            <li>Jira and Slack</li>
          </ul>
        </div>

        <div className="break-words max-w-xs">
          <h3 className="text-white font-bold text-lg mb-3">Integration Categories</h3>
          <ul className="space-y-1 text-sm leading-relaxed">
            <li>Communication</li>
            <li>Development</li>
            <li>Cybersecurity</li>
            <li>Data & Storage</li>
            <li>Marketing</li>
          </ul>
        </div>

        <div className="break-words max-w-xs">
          <h3 className="text-white font-bold text-lg mb-3">Top Guides</h3>
          <ul className="space-y-1 text-sm leading-relaxed">
            <li>Telegram bots</li>
            <li>Open-source chatbot</li>
            <li>Open-source LLM</li>
            <li>Zapier alternatives</li>
            <li>Make vs Zapier</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between pt-6">
        <p className="text-xs">© 2025 AI-Browser-Agent. All rights reserved.</p>
        <div className="text-xs space-x-4 mt-2 sm:mt-0">
          <a href="#" className="hover:underline">Impressum</a>
          <a href="#" className="hover:underline">Legal</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Report a vulnerability</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
