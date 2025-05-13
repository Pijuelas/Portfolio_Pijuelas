import React from 'react';
import '../styles/footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>Portfolio</h3>
            <p>A showcase of creative works and projects.</p>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/gallery">Gallery</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-social">
            <h4>Connect</h4>
            <div className="social-icons">
              <a href="#" aria-label="GitHub"><span>GitHub</span></a>
              <a href="#" aria-label="Twitter"><span>Twitter</span></a>
              <a href="#" aria-label="LinkedIn"><span>LinkedIn</span></a>
              <a href="#" aria-label="Instagram"><span>Instagram</span></a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;