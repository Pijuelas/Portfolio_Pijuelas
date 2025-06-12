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
            const progress = this.txt.length / this.toRotate[0].length;
            const eased = 225 - progress * 100;
            delta = eased;
        } else {
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

// Esperar al DOM
document.addEventListener('DOMContentLoaded', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const maxScroll = 200;

    // Text rotator
    const textElement = document.querySelector('.tagline');
    setTimeout(() => {
        if (textElement) {
            new TextRotator(textElement, ['Thumbnail Designer', 'Visual Creator', 'Content Artist'], 2000);
        }
    }, 25);

    // Logo animación
    setTimeout(() => {
        const logo = document.querySelector('.logo-content');
        if (logo) logo.classList.add('animate');
    }, 300);

    // Año en el footer
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Menú móvil
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Scroll indicator delay
    if (scrollIndicator) {
        setTimeout(() => {
            scrollIndicator.style.opacity = 1;
        }, 6000);

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (parseFloat(scrollIndicator.style.opacity) > 0) {
                let opacity = 1 - scrollY / maxScroll;
                opacity = Math.min(Math.max(opacity, 0), 1);
                scrollIndicator.style.opacity = opacity;
            }
        });
    }

    // Cargar videos destacados
    loadFeaturedVideos();
});

// Cargar 3 videos desde videos-index.json
async function loadFeaturedVideos() {
    try {
        const response = await fetch('json/videos-index.json');
        if (!response.ok) throw new Error('No se pudo cargar la galería de videos');

        let items = await response.json();
        items = items.slice(0, 3); // Solo los primeros 3

        const featuredGrid = document.querySelector('.featured-grid');
        if (!featuredGrid) return;

        featuredGrid.innerHTML = '';

        items.forEach(item => {
            const itemHtml = `
                <div class="gallery-item">
                    <div class="gallery-image">
                        <img src="${item.imageUrl}" alt="${item.titulo}">
                        <div class="gallery-overlay">
                            <div class="overlay-content">
                                <span class="category">${item.category}</span>
                                <div class="item-tags">
                                    ${item.tags.map(tag => `<span class="item-tag">${tag}</span>`).join('')}
                                </div>
                                <a href="imagen.html?id=${item.id}">
                                    <button class="view-btn" >View Details</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            featuredGrid.innerHTML += itemHtml;
        });
    } catch (error) {
        console.error('Error cargando los videos destacados:', error);
        const featuredGrid = document.querySelector('.featured-grid');
        if (featuredGrid) {
            featuredGrid.innerHTML = '<p>Error al cargar los videos destacados.</p>';
        }
    }
}