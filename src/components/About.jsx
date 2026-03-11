import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { artistInfo } from '../data/mock';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="sobre" className="about-section" ref={ref}>
      <div className="container">
        <div className="about-grid">
          <motion.div 
            className="about-image-container"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.6 }}
          >
            {artistInfo.photo ? (
              <img 
                src={artistInfo.photo} 
                alt={artistInfo.name}
                className="about-image"
                loading="lazy"
              />
            ) : (
              <div className="about-image-placeholder">
                <span>{artistInfo.name}</span>
              </div>
            )}
          </motion.div>
          <motion.div 
            className="about-content"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="section-heading"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5 }}
            >
              Sobre Mim
            </motion.h2>
            <motion.h3 
              className="about-name"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {artistInfo.name}
            </motion.h3>
            <motion.p 
              className="about-bio"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {artistInfo.bio}
            </motion.p>
            <motion.div 
              className="about-stats"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="stat-item">
                <span className="stat-number">{artistInfo.experience}</span>
                <span className="stat-label">de experiência</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

