import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";

function Footer() {
  return (
    <footer className="py-10 bg-gray-400 border-t-2 border-black">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between">
        <div className="mb-4 w-full lg:w-1/3">
          <Logo width="80px" />
          <p className="text-sm text-gray-600 mt-2">
            &copy; 2023 DevUI. All rights reserved.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <h3 className="text-xs font-semibold uppercase text-gray-500">
            Company
          </h3>
          <ul className="mt-2 space-y-1">
            <li>
              <Link to="/" className="text-gray-900 hover:text-gray-700">
                Features
              </Link>
            </li>
            <li>
              <Link to="/" className="text-gray-900 hover:text-gray-700">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/" className="text-gray-900 hover:text-gray-700">
                Affiliate
              </Link>
            </li>
          </ul>
        </div>

        <div className="w-full sm:w-auto">
          <h3 className="text-xs font-semibold uppercase text-gray-500">
            Support
          </h3>
          <ul className="mt-2 space-y-1">
            <li>
              <Link to="/" className="text-gray-900 hover:text-gray-700">
                Account
              </Link>
            </li>
            <li>
              <Link to="/" className="text-gray-900 hover:text-gray-700">
                Help
              </Link>
            </li>
            <li>
              <Link to="/" className="text-gray-900 hover:text-gray-700">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="w-full sm:w-auto">
          <h3 className="text-xs font-semibold uppercase text-gray-500">
            Legals
          </h3>
          <ul className="mt-2 space-y-1">
            <li>
              <Link to="/" className="text-gray-900 hover:text-gray-700">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/" className="text-gray-900 hover:text-gray-700">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
