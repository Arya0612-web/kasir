import React from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      description: "Cocok untuk bisnis kecil",
      price: "20.000",
      period: "30 hari",
      icon: Star,
      popular: false,
      features: [
        "Hingga 100 transaksi/hari",
        "Manajemen produk dasar",
        "Laporan penjualan harian",
        "Support email",
        "1 user account",
        "Backup data manual"
      ]
    },
    {
      name: "Pro",
      description: "Untuk bisnis yang sedang berkembang",
      price: "50.000",
      period: "90 hari",
      icon: Zap,
      popular: true,
      features: [
        "Hingga 500 transaksi/hari",
        "Manajemen produk lengkap",
        "Laporan analitik lengkap",
        "Priority support",
        "Hingga 5 user accounts",
        "Multi-outlet support",
        "Backup data otomatis",
        "Integrasi API"
      ]
    },
    {
      name: "Premium",
      description: "Solusi enterprise lengkap",
      price: "90.000",
      period: "180 hari",
      icon: Crown,
      popular: false,
      features: [
        "Transaksi unlimited",
        "Fitur manajemen lengkap",
        "Analitik prediktif",
        "24/7 dedicated support",
        "Unlimited user accounts",
        "Multi-outlet advanced",
        "Backup real-time",
        "Custom integration",
        "Training & onboarding",
        "Custom reporting"
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50 relative overflow-hidden">

      <AnimatedBackground />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Harga yang Terjangkau
          </h2>
          <p className="text-xl text-gray-600">
            Pilih paket yang sesuai dengan kebutuhan bisnis Anda
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 transition-all duration-300 hover-lift flex flex-col ${
                plan.popular
                  ? 'bg-white border-2 border-blue-500 shadow-2xl scale-105'
                  : 'bg-white border border-gray-200 shadow-lg'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
                    <Zap className="w-3 h-3" />
                    <span>POPULAR</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                 plan.popular
                  ? 'bg-black text-white border-black hover:bg-gray-800 hover:border-gray-800'
                  : 'bg-black text-white border-black hover:bg-gray-800 hover:border-gray-800'
                }`}>
                  {plan.name === "Basic" && <Star className="w-8 h-8" />}
                  {plan.name === "Pro" && <Zap className="w-8 h-8" />}
                  {plan.name === "Premium" && <Crown className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold text-gray-900 mb-1">
                    Rp {plan.price}
                  </span>
                  <span className="text-gray-600 text-lg">/{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="flex-grow mb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button - Diperbaiki agar semua tombol sejajar */}
              <div className="mt-auto">
                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 border-2 ${
                    plan.popular
                      ? 'bg-black text-white border-black hover:bg-gray-800 hover:border-gray-800'
                      : 'bg-black text-white border-black hover:bg-gray-800 hover:border-gray-800'
                  } hover:scale-105 active:scale-95`}
                >
                  Pilih {plan.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Semua paket termasuk update fitur gratis dan support 24/7
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;