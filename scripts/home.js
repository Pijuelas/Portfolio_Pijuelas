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
    loadFeaturedGallery();
});

async function loadFeaturedGallery() {
    try {
        const response = await fetch('json/galeria_miniaturas.json');
        if (!response.ok) throw new Error('No se pudo cargar la galería destacada');
        let items = await response.json();

        // Ordenar por ID ascendente
        items.sort((a, b) => a.id - b.id);

        const featuredGrid = document.querySelector('.featured-grid');
        featuredGrid.innerHTML = '';

        items.forEach(item => {
            const itemHtml = `
                <div class="gallery-item">
                    <div class="gallery-image">
                        <img src="${item.imageUrl}" alt="${item.titulo}">
                        <div class="gallery-overlay">
                            <div class="overlay-content">
                                <span class="category">${item.category}</span>
                                <h3>${item.titulo}</h3>
                                <div class="item-tags">
                                    ${item.tags.map(tag => `<span class="item-tag">${tag}</span>`).join('')}
                                </div>
                                <a href="imagen.html?id=${item.id}">
                                    <button class="view-btn">View Details</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            featuredGrid.innerHTML += itemHtml;
        });

    } catch (error) {
        console.error('Error cargando la galería destacada:', error);
        const featuredGrid = document.querySelector('.featured-grid');
        featuredGrid.innerHTML = '<p>Error al cargar la galería destacada.</p>';
    }
}
