// components/Logo.jsx
import React from 'react';

// Konsep 1: Minimalist & Modern (Kotak dalam kotak)
export const Logo1 = ({ className = "w-8 h-8" }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 bg-black rounded-lg flex items-center justify-center">
      <div className="w-3/4 h-3/4 border-2 border-white rounded-sm flex items-center justify-center">
        <div className="w-1/2 h-1/2 bg-white rounded-sm"></div>
      </div>
    </div>
  </div>
);

export const LogoWithText1 = ({ className = "w-32" }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <Logo1 />
    <span className="text-xl font-bold text-gray-900">CashierPro</span>
  </div>
);

// Konsep 2: Receipt Inspired (Garis-garis seperti struk)
export const Logo2 = ({ className = "w-8 h-8" }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 bg-black rounded-lg flex items-center justify-center">
      <div className="w-4/5 h-4/5 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
        <div className="absolute top-2 left-0 w-3/4 h-1 bg-white"></div>
        <div className="absolute top-4 left-0 w-1/2 h-1 bg-white"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-2 border-white"></div>
      </div>
    </div>
  </div>
);

export const LogoWithText2 = ({ className = "w-32" }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <Logo2 />
    <span className="text-xl font-bold text-gray-900">CashierPro</span>
  </div>
);

// Konsep 3: Shopping Cart Modern (Keranjang belanja sederhana)
export const Logo3 = ({ className = "w-8 h-8" }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 bg-black rounded-full flex items-center justify-center">
      <div className="w-3/4 h-3/4 relative">
        <div className="absolute bottom-0 w-full h-3/4 border-2 border-white rounded-full"></div>
        <div className="absolute top-0 left-1/4 w-1/2 h-2 bg-white"></div>
        <div className="absolute top-2 left-1/3 w-1/3 h-1 bg-white"></div>
      </div>
    </div>
  </div>
);

export const LogoWithText3 = ({ className = "w-32" }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <Logo3 />
    <span className="text-xl font-bold text-gray-900">CashierPro</span>
  </div>
);

// Konsep 4: Speed & Efficiency (Panah diagonal)
export const Logo4 = ({ className = "w-8 h-8" }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 bg-linear-to-br from-gray-900 to-black rounded-lg flex items-center justify-center">
      <div className="w-3/4 h-3/4 relative">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 border-t-2 border-l-2 border-white"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 border-b-2 border-r-2 border-white"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-3 bg-white transform rotate-45"></div>
        </div>
      </div>
    </div>
  </div>
);

export const LogoWithText4 = ({ className = "w-32" }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <Logo4 />
    <span className="text-xl font-bold text-gray-900">CashierPro</span>
  </div>
);

// Konsep 5: Digital & Modern (Pixel perfect)
export const Logo5 = ({ className = "w-8 h-8" }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 bg-black rounded-lg flex items-center justify-center">
      <div className="w-3/4 h-3/4 grid grid-cols-2 gap-1">
        <div className="bg-white rounded-sm"></div>
        <div className="bg-white rounded-sm"></div>
        <div className="bg-white rounded-sm"></div>
        <div className="bg-white rounded-sm"></div>
      </div>
    </div>
  </div>
);

export const LogoWithText5 = ({ className = "w-32" }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <Logo5 />
    <span className="text-xl font-bold text-gray-900">CashierPro</span>
  </div>
);

// Export default (Pilih yang paling Anda suka)
export default LogoWithText3;