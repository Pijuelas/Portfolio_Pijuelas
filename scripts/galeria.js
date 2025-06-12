let galleryItems = [];
let currentCategory = null;
let selectedRating = [];
let selectedTags = [];
let searchTerm = '';

// Añadimos "Text" con etiqueta especial también
const tagsWithCompositionLabel = ["Pyramid", "Symmetrical", "Asymmetrical", "Radial", "Text"];

// Esta función devuelve el nombre visual que se mostrará en el sidebar
function getDisplayTag(tag) {
    const trimmedTag = tag.trim();
    if (trimmedTag === "Text") {
        return "Text as Main Element";  // 🔁 CAMBIO: texto especial para "Text"
    }
    return tagsWithCompositionLabel.includes(trimmedTag) ? ${trimmedTag} Composition : trimmedTag;
}

// Inicializa la galería
async function initGallery() {
    try {
        const response = await fetch('json/galeria_miniaturas.json');
        if (!response.ok) throw new Error('Failed to load gallery data');
        galleryItems = await response.json();
        renderGallery(galleryItems);
    } catch (error) {
        console.error('Error loading gallery data:', error);
        document.getElementById('gallery-grid').innerHTML = '<p>Error loading gallery.</p>';
    }

    await loadTags();
    await loadCategories();
    //await loadRating();   NO MOSTRAR DE MOMENTO HASTA HABER TERMINADO

    document.getElementById('current-year').textContent = new Date().getFullYear();

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    navToggle.addEventListener('click', () => navMenu.classList.toggle('active'));

    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navigation');
        nav.classList.toggle('scrolled', window.scrollY > 20);
    });

    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.querySelector('.clear-search');
    searchInput.addEventListener('input', function () {
        searchTerm = this.value;
        clearSearchBtn.style.display = searchTerm ? 'flex' : 'none';
        filterGallery();
    });
}

// Cargar categorías desde JSON
async function loadCategories() {
    try {
        const response = await fetch('json/categories-data.json');
        if (!response.ok) throw new Error('Failed to load categories JSON');

        const categories = await response.json();
        const container = document.getElementById('categories');

        categories.forEach((category, index) => {
            const div = document.createElement('div');
            div.className = 'category-item';
            div.textContent = category;
            div.onclick = () => filterByCategory(category === 'All' ? null : category, div);
            if (index === 0) div.classList.add('active');
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Cargar tags desde JSON
async function loadTags() {
    try {
        const response = await fetch('json/tags-data.json');
        if (!response.ok) throw new Error('Failed to load tags JSON');

        const tags = await response.json();
        const container = document.getElementById('tags');

        tags.forEach(tag => {
            const div = document.createElement('div');
            div.className = 'tag-item';

            // Mostrar versión visual, guardar versión original para filtro
            div.textContent = getDisplayTag(tag);
            div.dataset.rawTag = tag.trim();  // 🔁 CAMBIO: valor original para filtro

            div.onclick = () => toggleTag(div);
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading tags:', error);
    }
}

// Renderiza los ítems de la galería con enlace a imagen.html?id={id}
function renderGallery(items) {
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = '';

    items.forEach(item => {
        const itemHtml = 
            <div class="gallery-item">
                <a href="imagen.html?id=${item.id}">
                    <div class="gallery-image">
                        <img src="${item.imageUrl}" alt="${item.titulo}">
                        <div class="gallery-overlay">
                            <div class="overlay-content">
                                ${item.variantesUrl && item.variantesUrl.length > 0 ? <span class="Variantes">${item.variantesUrl.length} Variante${item.variantesUrl.length > 1 ? 's' : ''}</span> : ''}
                                <div class="item-tags">
                                    ${item.tags.map(tag => <span class="item-tag">${tag.trim()}</span>).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        ;
        grid.innerHTML += itemHtml;
    });

    document.getElementById('gallery-count').textContent = ${items.length} ${items.length === 1 ? 'item' : 'items'} found;
}

// Filtra la galería
function filterGallery() {
    let filtered = galleryItems;

    if (currentCategory) {
        filtered = filtered.filter(item => item.category === currentCategory);
    }

    if (selectedTags.length > 0) {
        filtered = filtered.filter(item =>
            selectedTags.some(tag => item.tags.includes(tag))
        );
    }

    if (selectedRating.length > 0) {
        filtered = filtered.filter(item =>
            selectedRating.includes(item.rating)
        );
    }

    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(item =>
            item.titulo.toLowerCase().includes(term) ||
            item.tags.some(tag => tag.toLowerCase().includes(term))
        );
    }

    renderGallery(filtered);
}

// Filtra por categoría
function filterByCategory(category, element) {
    currentCategory = category;
    document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    filterGallery();
}

// Activa/desactiva tags
function toggleTag(element) {
    // 🔁 CAMBIO: Usar valor original, no el mostrado
    const tag = element.dataset.rawTag || element.textContent;
    element.classList.toggle('active');

    if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(t => t !== tag);
    } else {
        selectedTags.push(tag);
    }

    filterGallery();
}

// Activa/desactiva rating
function toggleRating(element) {
    const rating = element.textContent;
    element.classList.toggle('active');

    if (selectedRating.includes(rating)) {
        selectedRating = selectedRating.filter(r => r !== rating);
    } else {
        selectedRating.push(rating);
    }

    filterGallery();
}

// Limpia el campo de búsqueda
function clearSearch() {
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.querySelector('.clear-search');

    searchInput.value = '';
    searchTerm = '';
    clearSearchBtn.style.display = 'none';
    filterGallery();
}

// Limpia todos los filtros
function clearFilters() {
    currentCategory = null;
    selectedTags = [];
    searchTerm = '';

    document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.category-item').classList.add('active');

    document.querySelectorAll('.tag-item').forEach(item => item.classList.remove('active'));

    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.querySelector('.clear-search');

    searchInput.value = '';
    clearSearchBtn.style.display = 'none';

    selectedRating = [];
    document.querySelectorAll('.rating-item').forEach(item => item.classList.remove('active'));

    filterGallery();
}

// Alterna secciones del sidebar
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const header = section.previousElementSibling;
    const chevron = header.querySelector('.chevron');

    section.style.display = section.style.display === 'none' ? 'flex' : 'none';
    chevron.style.transform = section.style.display === 'none' ? 'rotate(0deg)' : 'rotate(180deg)';
}

// Cuando el DOM esté listo, iniciar galería
document.addEventListener('DOMContentLoaded', initGallery);
