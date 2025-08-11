import React from "react";
import { Link } from "react-router-dom";

const BackButton = ({ to = "/", label = "Back to Home" }) => (
  <div className="mt-6 text-center">
    <Link
      to={to}
      className="inline-block px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700 transition"
    >
      {label}
    </Link>
  </div>
);

export default BackButton;
