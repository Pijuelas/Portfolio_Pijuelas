import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import '../styles/navigation.css';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`navigation ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">
            <h1>Portfolio</h1>
          </Link>
        </div>

        <div className="nav-toggle" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/gallery" 
              className={location.pathname === '/gallery' ? 'active' : ''}
            >
              Gallery
            </Link>
          </li>
          <li className="nav-item">
            <a href="#about">About</a>
          </li>
          <li className="nav-item">
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;