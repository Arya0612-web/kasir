import React, { useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignIn = () => {
    // arahkan ke frontend kasir kamu
    window.location.href = "http://localhost:5173/login"; 
    // ubah port sesuai port kasir-frontend kamu (misal 5174 atau 3000)
  };

  // Fungsi untuk smooth scroll
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsOpen(false); // Tutup mobile menu setelah klik
  };

  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 group cursor-pointer"
            onClick={() => scrollToSection('hero')}
          >
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-gray-800">
              <ShoppingCart className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="text-xl font-bold text-gray-900 transition-all duration-300 group-hover:text-gray-700">
              CashierPro
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Fitur
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Harga
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Kontak
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={handleSignIn}
              className="bg-black text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-gray-800 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Sign in
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:scale-110 active:scale-95"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 transition-transform duration-300 hover:rotate-90" />
            ) : (
              <Menu className="w-6 h-6 transition-transform duration-300 hover:rotate-180" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 hover:translate-x-2 hover:bg-gray-50 py-2 px-4 rounded-lg text-left"
              >
                Fitur
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 hover:translate-x-2 hover:bg-gray-50 py-2 px-4 rounded-lg text-left"
              >
                Harga
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 hover:translate-x-2 hover:bg-gray-50 py-2 px-4 rounded-lg text-left"
              >
                Kontak
              </button>
              <button
                onClick={handleSignIn}
                className="bg-black text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-gray-800 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Sign in
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;