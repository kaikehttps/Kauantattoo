import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { studioInfo } from '../data/mock';
import { Menu, X } from 'lucide-react';

const Header = ({ isDarkMode, onToggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="header">
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <div className="header-container">
        <motion.div 
          className="header-logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <a href="#" onClick={() => scrollToSection('home')}>
            {studioInfo.name}
          </a>
        </motion.div>

        <motion.nav 
          className={`header-nav ${isMenuOpen ? 'active' : ''}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.button 
            onClick={() => scrollToSection('sobre')} 
            className="nav-link"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            Sobre
          </motion.button>
          <motion.button 
            onClick={() => scrollToSection('portfolio')} 
            className="nav-link"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            Portfolio
          </motion.button>
          <motion.button 
            onClick={() => scrollToSection('contato')} 
            className="nav-link"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            Contato
          </motion.button>
          {/* dark theme only - toggle removed */}
        </motion.nav>

        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      </motion.div>
    </header>
  );
};

export default Header;
