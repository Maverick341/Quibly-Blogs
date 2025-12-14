import React from "react";
import { Link } from "react-router-dom";
import quiblyLogo from "@/assets/logo+title.png";

function Footer() {
  return (
    <footer className="bg-[#2a2d31] border-t border-[#3f4347]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="mb-6 flex justify-start">
              <Link
                to="/all-posts"
              >
                <img
                  src={quiblyLogo}
                  alt="Quibly"
                  className="h-20 w-auto object-contain cursor-pointer"
                />
              </Link>
            </div>
            <p className="text-sm text-[#c5c3bf] leading-relaxed max-w-xs">
              A calm, minimal space for writers and readers who care about ideas
              more than noise.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-[#e8e6e3] mb-4 uppercase tracking-wide">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-[#c5c3bf] hover:text-[#a8956b] transition-colors duration-150"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-[#c5c3bf] hover:text-[#a8956b] transition-colors duration-150"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-[#c5c3bf] hover:text-[#a8956b] transition-colors duration-150"
                >
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-[#c5c3bf] hover:text-[#a8956b] transition-colors duration-150"
                >
                  Press Kit
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-[#e8e6e3] mb-4 uppercase tracking-wide">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-[#c5c3bf] hover:text-[#a8956b] transition-colors duration-150"
                >
                  Account
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-[#c5c3bf] hover:text-[#a8956b] transition-colors duration-150"
                >
                  Help
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-[#c5c3bf] hover:text-[#a8956b] transition-colors duration-150"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-[#c5c3bf] hover:text-[#a8956b] transition-colors duration-150"
                >
                  Customer Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legals Links */}
          <div>
            <h3 className="text-sm font-semibold text-[#e8e6e3] mb-4 uppercase tracking-wide">
              Legals
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-[#c5c3bf] hover:text-[#a8956b] transition-colors duration-150"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-[#c5c3bf] hover:text-[#a8956b] transition-colors duration-150"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-[#c5c3bf] hover:text-[#a8956b] transition-colors duration-150"
                >
                  Licensing
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Full Width */}
      <div className="bg-[#23262a] border-t border-[#3f4347]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-sm text-[#c5c3bf] text-center">
            &copy; {new Date().getFullYear()} Quibly. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
