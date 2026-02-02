import React from 'react';
import { 
  BarChart3, 
  Smartphone, 
  Shield, 
  Zap, 
  Users, 
  FileText 
} from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';

const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Analisis Real-time",
      description: "Pantau performa bisnis dengan dashboard analitik yang update real-time",
      color: "blue"
    },
    {
      icon: Smartphone,
      title: "Multi-Device",
      description: "Akses dari smartphone, tablet, atau komputer dengan sync otomatis",
      color: "green"
    },
    {
      icon: Shield,
      title: "Keamanan Data",
      description: "Data bisnis Anda terlindungi dengan enkripsi tingkat enterprise",
      color: "purple"
    },
    {
      icon: Zap,
      title: "Transaksi Cepat",
      description: "Proses penjualan dalam hitungan detik dengan interface yang intuitif",
      color: "orange"
    },
    {
      icon: Users,
      title: "Manajemen Staff",
      description: "Kelola akses staff dengan role-based permissions yang fleksibel",
      color: "red"
    },
    {
      icon: FileText,
      title: "Laporan Lengkap",
      description: "Generate laporan keuangan dan penjualan dengan berbagai format",
      color: "indigo"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
      red: 'bg-red-50 text-red-600',
      indigo: 'bg-indigo-50 text-indigo-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <section id="features" className="py-20 bg-white relative overflow-hidden">
      {/* Animated Background */}
      
      
      {/* Content dengan z-index lebih tinggi */}
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Fitur yang Membuat
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
              Bisnis Tumbuh
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Semua yang Anda butuhkan untuk mengelola bisnis retail dengan efisien
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover-lift bg-white relative z-20"
            >
              <div className={`w-14 h-14 rounded-xl ${getColorClasses(feature.color)} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 relative z-20">
          <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Siap Transformasi Bisnis Anda?
            </h3>
            <p className="text-gray-600 mb-6">
              Bergabung dengan ribuan bisnis yang sudah menggunakan CashierPro
            </p>
            <button className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
              Mulai Sekarang - Gratis 7 Hari
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;