import React, { useEffect, useState } from 'react';
import { ArrowRight, Play, Star } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="hero" className="pt-20 pb-16 bg-linear-to-br from-gray-50 to-white overflow-hidden relative">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge dengan animasi fade-in */}
          <div 
            className={`inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Star className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-700">
              Sistem Kasir No. 1 di Indonesia
            </span>
          </div>

          {/* Main Heading dengan animasi bertahap */}
          <h1 
            className={`text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Kelola Bisnis Anda
            <span 
              className={`block text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 transition-all duration-1000 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Dengan Mudah
            </span>
          </h1>

          {/* Description dengan animasi */}
          <p 
            className={`text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Sistem kasir modern berbasis cloud yang membantu Anda mengelola transaksi, 
            inventaris, dan laporan keuangan dengan lebih efisien.
          </p>

          {/* CTA Buttons dengan animasi */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 transition-all duration-1000 delay-800 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <button className="bg-black text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 flex items-center space-x-2 group relative overflow-hidden">
              <span className="relative z-10">Coba Gratis 7 Hari</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold hover:border-gray-400 transition-all duration-300 hover:scale-105 flex items-center space-x-2 group bg-white/50 backdrop-blur-sm">
              <Play className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span>Tonton Demo</span>
            </button>
          </div>

          {/* Stats dengan animasi */}
          <div 
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto transition-all duration-1000 delay-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center group p-4 rounded-lg hover:bg-white/50 transition-all duration-300">
              <div className="text-2xl font-bold text-gray-900 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-600">10K+</div>
              <div className="text-gray-600 transition-all duration-300 group-hover:text-gray-800">Pengguna Aktif</div>
            </div>
            <div className="text-center group p-4 rounded-lg hover:bg-white/50 transition-all duration-300">
              <div className="text-2xl font-bold text-gray-900 transition-all duration-300 group-hover:scale-110 group-hover:text-green-600">99.9%</div>
              <div className="text-gray-600 transition-all duration-300 group-hover:text-gray-800">Uptime</div>
            </div>
            <div className="text-center group p-4 rounded-lg hover:bg-white/50 transition-all duration-300">
              <div className="text-2xl font-bold text-gray-900 transition-all duration-300 group-hover:scale-110 group-hover:text-purple-600">24/7</div>
              <div className="text-gray-600 transition-all duration-300 group-hover:text-gray-800">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;