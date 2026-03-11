import React from 'react';
import { studioInfo } from '../data/mock';
import { Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3 className="footer-title">{studioInfo.name}</h3>
            <p className="footer-description">
              Arte que marca sua história. Tatuagens exclusivas com qualidade e segurança.
            </p>
          </div>



          <div className="footer-section">
            <h4 className="footer-subtitle">Redes Sociais</h4>
            <div className="social-links">
              <a href={studioInfo.instagram} className="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {studioInfo.name}. Kaike Alves -Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
