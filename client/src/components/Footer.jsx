import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative mt-32 px-6">
      {/* subtle top divider */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-7xl mx-auto py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand */}
          <div>
            <h3 className="text-white text-lg font-semibold">NexAI</h3>
            <p className="mt-4 text-sm text-gray-400 max-w-xs">
              Powerful AI tools to help creators write, design, and build faster
              than ever.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/ai" className="hover:text-white transition">AI Tools</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link to="/features" className="hover:text-white transition">Features</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} NexAI. All rights reserved.
          </p>

          <div className="flex gap-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-white transition">Twitter</a>
            <a href="#" className="hover:text-white transition">GitHub</a>
            <a href="#" className="hover:text-white transition">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
