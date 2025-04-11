
import { Link } from 'react-router-dom';
import { Car, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Car className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-xl text-white">DriveAway</span>
            </Link>
            <p className="text-sm text-gray-400">
              The premier marketplace for connecting car buyers with trusted sellers. Find your perfect ride today.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-white text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/cars" className="text-gray-400 hover:text-white transition-colors">Browse Cars</Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-400 hover:text-white transition-colors">Become a Member</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* For Buyers */}
          <div className="col-span-1">
            <h3 className="font-semibold text-white text-lg mb-4">For Buyers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cars" className="text-gray-400 hover:text-white transition-colors">Find a Car</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/finance-options" className="text-gray-400 hover:text-white transition-colors">Finance Options</Link>
              </li>
              <li>
                <Link to="/buyer-faqs" className="text-gray-400 hover:text-white transition-colors">Buyer FAQs</Link>
              </li>
            </ul>
          </div>

          {/* For Sellers */}
          <div className="col-span-1">
            <h3 className="font-semibold text-white text-lg mb-4">For Sellers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/list-your-car" className="text-gray-400 hover:text-white transition-colors">List Your Car</Link>
              </li>
              <li>
                <Link to="/seller-tips" className="text-gray-400 hover:text-white transition-colors">Seller Tips</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
              </li>
              <li>
                <Link to="/seller-faqs" className="text-gray-400 hover:text-white transition-colors">Seller FAQs</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} DriveAway Marketplace. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
