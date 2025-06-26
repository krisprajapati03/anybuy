import React from "react";

import { Facebook, Instagram, Twitter } from "lucide-react";



const Footer = () => {

  return (

    <footer className="w-full bg-gray-900 text-white py-10">

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Column 1 - Logo & About */}

        <div>

          <h2 className="text-2xl font-bold">AnyBuy</h2>

          <p className="text-gray-400 mt-2">

            Best electronics at unbeatable prices. Shop with confidence!

          </p>

        </div>



        {/* Column 2 - Quick Links */}

        <div>

          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>

          <ul className="space-y-2">

            <li><a href="/" className="text-gray-400 hover:text-white transition">Home</a></li>

            <li><a href="/about" className="text-gray-400 hover:text-white transition">About Us</a></li>

            <li><a href="/shop" className="text-gray-400 hover:text-white transition">Shop</a></li>

            <li><a href="/contact" className="text-gray-400 hover:text-white transition">Contact</a></li>

          </ul>

        </div>



        {/* Column 3 - Customer Service */}

        <div>

          <h3 className="text-lg font-semibold mb-3">Customer Service</h3>

          <ul className="space-y-2">

            <li><a href="/faq" className="text-gray-400 hover:text-white transition">FAQ</a></li>

            <li><a href="/returns" className="text-gray-400 hover:text-white transition">Returns</a></li>

            <li><a href="/shipping" className="text-gray-400 hover:text-white transition">Shipping Info</a></li>

            <li><a href="/support" className="text-gray-400 hover:text-white transition">Support</a></li>

          </ul>

        </div>



        {/* Column 4 - Social Media */}

        <div>

          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>

          <div className="flex space-x-4">

            <a href="#" className="text-gray-400 hover:text-white transition">

              <Facebook size={24} />

            </a>

            <a href="#" className="text-gray-400 hover:text-white transition">

              <Instagram size={24} />

            </a>

            <a href="#" className="text-gray-400 hover:text-white transition">

              <Twitter size={24} />

            </a>

          </div>

        </div>

      </div>



      {/* Bottom Bar */}

      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">

        &copy; {new Date().getFullYear()} YourStore. All Rights Reserved.

      </div>

    </footer>

  );

};



export default Footer;