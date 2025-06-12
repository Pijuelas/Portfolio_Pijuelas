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
    if (tagsWithCompositionLabel.includes(trimmedTag)) {
        return `${trimmedTag} Composition`;
    }
    return trimmedTag;
}

let selectedTags = [];

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
    // await loadRating();

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

// Cargar tags
// Cargar tags desde JSON
async function loadTags() {
    try {
        const response = await fetch('json/tags-data.json');
        if (!response.ok) throw new Error('Failed to load tags JSON');

        const tags = await response.json();
        const container = document.getElementById('tags');

        tags.forEach(tag => {
            const rawTag = tag.trim();
            const div = document.createElement('div');
            div.className = 'tag-item';
            div.textContent = getDisplayTag(rawTag);   // ← nombre visual
            div.dataset.rawTag = rawTag;               // ← valor real
            div.onclick = () => toggleTag(div);
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading tags:', error);
    }
}


// Renderizar galería
function renderGallery(items) {
    const container = document.getElementById('gallery');
    container.innerHTML = '';

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.dataset.tags = item.tags.join(',');  // ← mantiene los tags reales

        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}" />
            <h3>${item.title}</h3>
            <div class="tags">
                ${item.tags.map(tag => `<span class="item-tag">${tag.trim()}</span>`).join('')}
            </div>
        `;
        container.appendChild(div);
    });
}

// Filtrado general
function filterGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        const itemTags = item.dataset.tags.split(',').map(tag => tag.trim());
        const matches = selectedTags.every(tag => itemTags.includes(tag));
        item.style.display = matches ? 'block' : 'none';
    });
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
    const tag = element.dataset.rawTag;  // ← siempre usa el valor real
    element.classList.toggle('active');

    if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(t => t !== tag);
    } else {
        selectedTags.push(tag);
    }

    filterGallery();  // ← asegúrate que esta función filtra usando item.tags vs selectedTags
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
