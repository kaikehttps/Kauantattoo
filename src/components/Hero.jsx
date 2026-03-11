import React from 'react';
import { motion } from 'framer-motion';
import { studioInfo } from '../data/mock';

const Hero = () => {
  const handleScheduleClick = (e) => {
    e.preventDefault();
    
    const contactSection = document.getElementById('contato');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hero-section">
      <video 
        className="hero-video" 
        autoPlay 
        muted 
        loop 
        playsInline
      >
        <source src="/PinDown.io_@NKUB_8114449_1771615286.mp4" type="video/mp4" />
      </video>
      <div className="hero-content">
        <motion.div 
          className="logo-container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="brand-display"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {studioInfo.name}
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Arte que marca sua história
          </motion.p>
        </motion.div>
        <motion.div 
          className="hero-cta"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <motion.button 
            onClick={handleScheduleClick}
            className="cta-button large"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.15 }}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            Agende sua tattoo
          </motion.button>
        </motion.div>
      </div>
      <div className="hero-overlay"></div>
    </section>
  );
};

export default Hero;
