import React, { useState, useRef, memo, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { tattooCategories as defaultCategories } from '../data/mock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import useOtimizacaoScroll from '../hooks/useScrollOptimization';
import { X, ChevronLeft, ChevronRight, Image } from 'lucide-react';

// Lightbox Component
const Lightbox = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  if (!images || images.length === 0) return null;
  
  const currentImage = images[currentIndex];
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="lightbox-overlay"
      onClick={onClose}
    >
      <button className="lightbox-close" onClick={onClose}>
        <X size={32} />
      </button>
      
      <button 
        className="lightbox-nav lightbox-prev" 
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        disabled={images.length <= 1}
      >
        <ChevronLeft size={40} />
      </button>
      
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <motion.img 
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
          src={currentImage.image} 
          alt={currentImage.alt}
          className="lightbox-image"
        />
        <div className="lightbox-info">
          <span className="lightbox-category">{currentImage.category}</span>
          <div className="lightbox-counter">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>
      
      <button 
        className="lightbox-nav lightbox-next" 
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        disabled={images.length <= 1}
      >
        <ChevronRight size={40} />
      </button>
    </motion.div>
  );
};

const PortfolioCard = memo(({ tattoo, isScrolling, onImageClick, index }) => {
  return (
    <motion.div 
      className="portfolio-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ duration: isScrolling ? 0.2 : 0.5, delay: index * 0.05 }}
      whileHover={!isScrolling ? { y: -12, transition: { duration: 0.3 } } : {}}
      onClick={() => onImageClick(index)}
    >
      <div className="portfolio-card-inner">
        {tattoo.image ? (
          <img 
            src={tattoo.image} 
            alt={tattoo.alt}
            className="portfolio-image"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="portfolio-placeholder">
            <Image size={48} className="placeholder-icon" />
            <span>Sua tattoo aqui</span>
          </div>
        )}
        <div className="portfolio-card-overlay">
        </div>
        {tattoo.price && (
          <div className="portfolio-price-hover">
            <span className="price-value">{tattoo.price}</span>
          </div>
        )}
      </div>
      <div className="portfolio-card-glow"></div>
    </motion.div>
  );
});

PortfolioCard.displayName = 'PortfolioCard';

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('realismo');
  const [tattooCategories, setTattooCategories] = useState(defaultCategories);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isScrolling = useOtimizacaoScroll();

  const loadImages = () => {
    const categories = {
      realismo: [],
      arteSacra: [],
      blackwork: [],
      outros: []
    };

    try {
      const customImages = localStorage.getItem('portfolioImages');
      const customList = customImages ? JSON.parse(customImages) : [];
      
      const grouped = {
        realismo: [],
        arteSacra: [],
        blackwork: [],
        outros: []
      };
      
      customList.forEach(img => {
        if (grouped[img.category]) {
          grouped[img.category].push(img);
        }
      });
      
      const merged = {
        realismo: [...grouped.realismo, ...categories.realismo],
        arteSacra: [...grouped.arteSacra, ...categories.arteSacra],
        blackwork: [...grouped.blackwork, ...categories.blackwork],
        outros: [...grouped.outros, ...categories.outros]
      };
      
      setTattooCategories(merged);
    } catch (e) {
      console.error('Error loading custom images:', e);
      setTattooCategories(categories);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadImages();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      loadImages();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('portfolioUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('portfolioUpdated', handleStorageChange);
    };
  }, []);

  const handleImageClick = (index) => {
    const currentCategoryImages = tattooCategories[activeCategory] || [];
    if (currentCategoryImages.length > 0) {
      setLightboxImages(currentCategoryImages);
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  const handlePrevImage = () => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : lightboxImages.length - 1));
  };

  const handleNextImage = () => {
    setLightboxIndex((prev) => (prev < lightboxImages.length - 1 ? prev + 1 : 0));
  };

  const getAllImages = () => {
    return [
      ...tattooCategories.realismo,
      ...tattooCategories.arteSacra,
      ...tattooCategories.blackwork,
      ...tattooCategories.outros
    ];
  };

  const allImages = getAllImages();

  const tabs = [
    { id: 'realismo', label: 'Realismo', icon: '◉' },
    { id: 'arteSacra', label: 'Arte Sacra', icon: '✦' },
    { id: 'blackwork', label: 'Blackwork', icon: '▪' },
    { id: 'outros', label: 'Outros', icon: '✧' }
  ];

  return (
    <section id="portfolio" className="portfolio-section" ref={ref}>
      <div className="portfolio-bg-effects">
        <div className="portfolio-gradient-1"></div>
        <div className="portfolio-gradient-2"></div>
      </div>
      
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading portfolio-heading">
            Meus Trabalhos
          </h2>
          <p className="section-subtitle">
            Cada tatuagem é uma história única marcada na pele
          </p>
        </motion.div>
        
        <Tabs defaultValue="realismo" className="portfolio-tabs" onValueChange={setActiveCategory}>
          <motion.div
            className="tabs-container"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TabsList className="tabs-list-custom">
              {tabs.map((tab, idx) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="tab-trigger-custom"
                  style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <motion.div 
                className="portfolio-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {tattooCategories[tab.id]?.length > 0 ? (
                  tattooCategories[tab.id].map((tattoo, idx) => (
                    <PortfolioCard 
                      key={tattoo.id} 
                      tattoo={tattoo} 
                      isScrolling={isScrolling} 
                      onImageClick={handleImageClick}
                      index={idx}
                    />
                  ))
                ) : (
                  <motion.div 
                    className="portfolio-empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="empty-icon">
                      <Image size={64} />
                    </div>
                    <p>Em breve, novas tattoos!</p>
                    <span>Esta categoria está sendo preparada com dedicação</span>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox 
            images={lightboxImages}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
            onPrev={handlePrevImage}
            onNext={handleNextImage}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default memo(Portfolio);

