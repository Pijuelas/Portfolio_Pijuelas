let galleryItems = [];
let currentCategory = null;
let selectedRating = [];
let selectedTags = [];
let searchTerm = '';

// Etiquetas especiales con sufijo "Composition"
const tagsWithCompositionLabel = ["Pyramid", "Symmetrical", "Asymmetrical", "Radial", "Text"];

// Traduce visualmente una etiqueta para mostrarla
function getDisplayTag(tag) {
    const trimmedTag = tag.trim();
    if (trimmedTag === "Text") {
        return "Text as Main Element";
    }
    return tagsWithCompositionLabel.includes(trimmedTag) ? `${trimmedTag} Composition` : trimmedTag;
}

// Inicia la galería
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

// Cargar categorías
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

            const rawTag = tag.trim();
            const displayName = getDisplayTag(rawTag);

            div.textContent = displayName;
            div.dataset.rawTag = rawTag;

            div.onclick = () => toggleTag(div);
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading tags:', error);
    }
}

// Renderizar galería
function renderGallery(items) {
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = '';

    items.forEach(item => {
        const itemHtml = `
            <div class="gallery-item">
                <a href="imagen.html?id=${item.id}">
                    <div class="gallery-image">
                        <img src="${item.imageUrl}" alt="${item.titulo}">
                        <div class="gallery-overlay">
                            <div class="overlay-content">
                                ${item.variantesUrl && item.variantesUrl.length > 0 ? `<span class="Variantes">${item.variantesUrl.length} Variante${item.variantesUrl.length > 1 ? 's' : ''}</span>` : ''}
                                <div class="item-tags">
                                    ${item.tags.slice(0, 3).map(tag => `<span class="item-tag">${getDisplayTag(tag.trim())}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
        grid.innerHTML += itemHtml;
    });

    document.getElementById('gallery-count').textContent = `${items.length} ${items.length === 1 ? 'item' : 'items'} found`;
}

// Filtrado general
function filterGallery() {
    let filtered = galleryItems;

    if (currentCategory) {
        filtered = filtered.filter(item => item.category === currentCategory);
    }

    if (selectedTags.length > 0) {
        filtered = filtered.filter(item =>
            selectedTags.some(tag => item.tags.map(t => t.trim()).includes(tag))
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

// Cambia categoría
function filterByCategory(category, element) {
    currentCategory = category;
    document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    filterGallery();
}

// Activa/desactiva tag
function toggleTag(element) {
    const tag = element.dataset.rawTag || element.textContent.trim();
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

// Limpiar búsqueda
function clearSearch() {
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.querySelector('.clear-search');

    searchInput.value = '';
    searchTerm = '';
    clearSearchBtn.style.display = 'none';
    filterGallery();
}

// Limpiar filtros
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

// Alternar secciones
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const header = section.previousElementSibling;
    const chevron = header.querySelector('.chevron');

    section.style.display = section.style.display === 'none' ? 'flex' : 'none';
    chevron.style.transform = section.style.display === 'none' ? 'rotate(0deg)' : 'rotate(180deg)';
}

// Inicia cuando el DOM está listo
document.addEventListener('DOMContentLoaded', initGallery);
