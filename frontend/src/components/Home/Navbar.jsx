import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Quickstart", href: "/" },
];

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-screen text-white transition-all duration-300 ${
        isSticky
        ? "bg-[#1a132bcc] backdrop-blur-md shadow-md"
        : "bg-[#1a132b]"
          }`}
        >

        <div className="max-w-7xl mx-auto px-4 py-4 md:py-5 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center text-white font-bold text-4xl">
            <span className="text-[#FFD700] animate-pulse drop-shadow-[0_0_8px_#FFD700]">⌬</span>
            <span className="ml-2 tracking-tight">AI Browser Agent</span>
          </a>

          {/* Desktop Nav */}
          <nav
            role="navigation"
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-8"
          >
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-white transition font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <Link
                to="/signup"
                className="ml-6 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 hover:brightness-110 transition px-5 py-2 text-sm font-semibold shadow-lg"
            >
              Try Demo
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white text-2xl focus:outline-none"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-3 px-4 pb-4 animate-slide-down">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/80 hover:text-white transition font-medium"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/demo"
              className="rounded-full bg-gradient-to-r from-orange-500 to-pink-500 hover:brightness-110 transition px-5 py-2 text-sm font-semibold shadow-md mt-2"
            >
              Try Demo
            </a>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
