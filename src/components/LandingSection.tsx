import React, { useEffect, useState, useRef } from 'react';
import { Mail, Youtube, Twitter } from 'lucide-react';
import '../styles/landing.css';

class TextRotator {
  toRotate: string[];
  el: HTMLElement;
  loopNum: number;
  period: number;
  txt: string;
  isDeleting: boolean;
  
  constructor(el: HTMLElement, toRotate: string[], period: number) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = period || 2000;
    this.txt = '';
    this.isDeleting = false;
    this.tick();
  }
  
  tick() {
    const i = this.loopNum % this.toRotate.length;
    const fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    let delta = 200 - Math.random() * 100;

    if (this.isDeleting) {
      delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    setTimeout(() => this.tick(), delta);
  }
}

const LandingSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 300);

    if (textRef.current) {
      new TextRotator(
        textRef.current,
        ['Thumbnail Designer', 'Visual Creator', 'Content Artist'],
        2000
      );
    }
  }, []);

  return (
    <section className="landing-section">
      <div className="landing-logo">
        <div className={`logo-content ${isVisible ? 'animate' : ''}`}>
          <h1>
            <em>Pijuelas</em>
          </h1>
          <p ref={textRef} className="tagline"></p>
          
          <div className="social-links">
            <a href="mailto:example@email.com" className="social-link" aria-label="Email">
              <div className="social-circle">
                <Mail size={24} />
              </div>
              <span className="social-label">Email</span>
            </a>
            
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
              <div className="social-circle">
                <Youtube size={24} />
              </div>
              <span className="social-label">YouTube</span>
            </a>
            
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
              <div className="social-circle">
                <Twitter size={24} />
              </div>
              <span className="social-label">Twitter</span>
            </a>
          </div>
        </div>
        
        <div className="circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
      </div>
      
      <div className="scroll-indicator">
        <div className="scroll-arrow"></div>
        <p>Scroll Down</p>
      </div>
    </section>
  );
};

export default LandingSection;