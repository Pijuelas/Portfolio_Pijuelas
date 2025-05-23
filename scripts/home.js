// Text rotation animation
    class TextRotator {
        constructor(el, toRotate, period) {
            this.toRotate = toRotate;
            this.el = el;
            this.loopNum = 0;
            this.period = period || 1750;
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

            let delta;

            if (this.loopNum === 0 && !this.isDeleting) {
                // Fase de aceleración inicial para la primera palabra
                const progress = this.txt.length / this.toRotate[0].length; // de 0 a 1
                const eased = 225 - progress * 100; // Empieza lento (300ms), baja hasta 100ms
                delta = eased;
            } else {
                // Velocidad normal
                delta = 200 - Math.random() * 100;
            }

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

    // Initialize everything after DOM content loaded
    document.addEventListener('DOMContentLoaded', () => {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        const maxScroll = 200;
    // Text rotator initialization
    const textElement = document.querySelector('.tagline');
    setTimeout(() => {
        new TextRotator(textElement, ['Thumbnail Designer', 'Visual Creator', 'Content Artist'], 2000);
    }, 25); // Espera 25ms antes de iniciar la animación

    // Add animation class to logo content
    setTimeout(() => {
        document.querySelector('.logo-content').classList.add('animate');
    }, 300);

    // Update current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Después de 6 segundos, aparece con opacidad 1
    setTimeout(() => {
        scrollIndicator.style.opacity = 1;
    }, 6000);
    
    window.addEventListener('scroll', () => {
    // Cuánto has scrolleado en píxeles verticalmente
    const scrollY = window.scrollY;

    if (parseFloat(scrollIndicator.style.opacity) > 0) {
        let opacity = 1 - scrollY / maxScroll;
        opacity = Math.min(Math.max(opacity, 0), 1);
        scrollIndicator.style.opacity = opacity;
    }

    });
});