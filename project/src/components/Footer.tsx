import React from 'react';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <img
    src="https://ik.imagekit.io/8vvkoi3dt/ChatGPT_Image_Jul_12__2025__01_28_03_AM-removebg-preview.png?updatedAt=1752263937896"
    alt="Logo"
    width={90}
    height={90}
    className="object-contain"
  />
  <span className="text-lg font-bold text-gray-1500 md:text-3xl uppercase tracking-wider font-['Oswald'] hidden sm:inline-block">
    सहचारी
  </span>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Connecting travelers with authentic village experiences through local guides. 
              Discover real culture, support local communities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">For Travelers</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Find Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Book Experiences
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Travel Safety
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Village Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Cultural Etiquette
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">For Guides</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Become a Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Guide Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Community Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Earnings
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Trust & Safety
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 VillageStay. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center text-gray-400 text-sm">
                <Mail className="h-4 w-4 mr-2" />
                hello@villagestay.com
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Phone className="h-4 w-4 mr-2" />
                +91 98765 43210
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;