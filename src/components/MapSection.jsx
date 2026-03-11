import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { studioInfo } from '../data/mock';

const MapSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="map-section" ref={ref}>
      <div className="container">
        <motion.h2 
          className="section-heading text-center mb-8"
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.5 }}
        >
          Onde Estamos
        </motion.h2>
        <motion.div 
          className="map-container"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.98 }}
          transition={{ duration: 0.6 }}
        >
          <iframe
            src={studioInfo.mapsEmbedUrl}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização do estúdio"
            className="map-iframe"
          ></iframe>
        </motion.div>
        <motion.div 
          className="map-address"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p>{studioInfo.address}</p>
        </motion.div>
      </div>
    </section>
  );
};

export default MapSection;
