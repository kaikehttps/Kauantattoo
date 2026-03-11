import React from 'react';
import { studioInfo } from '../data/mock';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {studioInfo.name}. Kaike Alves -Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
