// src/components/Home/IntegrationGrid.jsx
import React from "react";
import Marquee from "react-fast-marquee";
import {
  SiAirtable,
  SiNotion,
  SiDiscord,
  SiSlack,
  SiGithub,
  SiMailchimp,
  SiPostgresql,
  SiGooglesheets,
  SiGooglecalendar,
  SiAsana,
} from "react-icons/si";

const integrations = [
  {
    name: "Google Sheets",
    icon: <SiGooglesheets className="text-green-400" />,
  },
  { name: "Airtable", icon: <SiAirtable className="text-yellow-400" /> },
  { name: "Notion", icon: <SiNotion /> },
  { name: "Discord", icon: <SiDiscord className="text-indigo-400" /> },
  { name: "Slack", icon: <SiSlack className="text-pink-500" /> },
  { name: "GitHub", icon: <SiGithub /> },
  { name: "Mailchimp", icon: <SiMailchimp className="text-yellow-500" /> },
  { name: "PostgreSQL", icon: <SiPostgresql className="text-blue-500" /> },
  {
    name: "Google Calendar",
    icon: <SiGooglecalendar className="text-red-500" />,
  },
  { name: "Asana", icon: <SiAsana className="text-pink-400" /> },
];

const IntegrationGrid = () => {
  return (
    <section className="mt-20 text-center">
      <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
        Plug AI into your data &{" "}
        <span className="text-orange-400">over 500 integrations</span>
      </h3>
      <p className="text-gray-300 mb-8 text-lg">
        The fast way to actually get AI working in your business
      </p>

      <Marquee speed={40} pauseOnHover gradient={false}>
        {integrations.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center bg-[#2b2b45] text-white rounded-xl shadow-md mx-6 p-4 w-32 h-32 hover:scale-110 transition"
          >
            <div className="text-3xl mb-2">{item.icon}</div>
            <p className="text-sm">{item.name}</p>
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default IntegrationGrid;
