import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackgroundVariant = ({ type = "default" }) => {
  const variants = {
    default: (
      <>
        {/* Hexagon Grid */}
        <motion.div
          className="absolute inset-0 opacity-[0.02]"
          animate={{ 
            backgroundPosition: ['0px 0px', '50px 50px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundImage: `
              linear-gradient(30deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000),
              linear-gradient(150deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000),
              linear-gradient(30deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000),
              linear-gradient(150deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000),
              linear-gradient(60deg, #000 25%, transparent 25.5%, transparent 75%, #000 75%, #000),
              linear-gradient(60deg, #000 25%, transparent 25.5%, transparent 75%, #000 75%, #000)
            `,
            backgroundSize: '50px 87px',
            backgroundPosition: '0 0, 0 0, 25px 50px, 25px 50px, 0 0, 25px 50px'
          }}
        />

        {/* Moving Bars */}
        <motion.div
          className="absolute top-0 left-0 w-1 h-full bg-gray-300 opacity-10"
          animate={{ x: ['0%', '100vw'] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute top-0 right-0 w-1 h-full bg-gray-300 opacity-10"
          animate={{ x: ['0%', '-100vw'] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 5
          }}
        />
      </>
    ),
    minimal: (
      <>
        {/* Simple Moving Lines */}
        <motion.div
          className="absolute inset-0 opacity-[0.02]"
          animate={{ 
            backgroundPosition: ['0 0', '100px 100px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundImage: `linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '50px 100%'
          }}
        />
      </>
    ),
    tech: (
      <>
        {/* Binary Code Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-gray-400 opacity-10 font-mono text-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ y: ['0%', '100%'] }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5
              }}
            >
              0101{Math.random() > 0.5 ? '0' : '1'}0101
            </motion.div>
          ))}
        </div>

        {/* Circuit Lines */}
        <motion.div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 24px, #000 25px, transparent 26px),
              linear-gradient(0deg, transparent 24px, #000 25px, transparent 26px)
            `,
            backgroundSize: '50px 50px'
          }}
          animate={{ opacity: [0.015, 0.025, 0.015] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </>
    )
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {variants[type] || variants.default}
    </div>
  );
};

export default AnimatedBackgroundVariant;