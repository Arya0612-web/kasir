import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Grid Pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 2 }}
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                             linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </motion.div>

      {/* Moving Lines */}
      <motion.div
        className="absolute top-0 left-0 w-full h-0.5 bg-gray-300 opacity-20"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div
        className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 opacity-20"
        initial={{ x: '100%' }}
        animate={{ x: '-100%' }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
          delay: 2
        }}
      />

      {/* Diagonal Lines */}
      {/* <motion.div
        className="absolute inset-0 opacity-[0.02]"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(45deg, transparent 49%, #000 50%, transparent 51%)`,
            backgroundSize: '60px 60px',
          }}
        />
      </motion.div> */}

      {/* Subtle Dots Pattern */}
      {/* <motion.div
        className="absolute inset-0 opacity-[0.015]"
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
      </motion.div> */}

      {/* Floating Rectangles */}
      <motion.div
        className="absolute top-1/4 left-10 w-4 h-4 bg-gray-400 opacity-10"
        initial={{ y: 0, x: 0 }}
        animate={{ 
          y: [0, -20, 0],
          x: [0, 10, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-1/3 right-20 w-6 h-6 bg-gray-400 opacity-10"
        initial={{ y: 0, x: 0 }}
        animate={{ 
          y: [0, 15, 0],
          x: [0, -15, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <motion.div
        className="absolute top-10 right-1/4 w-3 h-3 bg-gray-500 opacity-15"
        initial={{ y: 0 }}
        animate={{ 
          y: [0, -15, 0, 10, 0]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Scan Line Effect */}
      <motion.div
        className="absolute left-0 w-full h-20 bg-gradient-to-b from-transparent via-gray-200/5 to-transparent"
        initial={{ y: '-100%' }}
        animate={{ y: '100vh' }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 3
        }}
      />
    </div>
  );
};

export default AnimatedBackground;