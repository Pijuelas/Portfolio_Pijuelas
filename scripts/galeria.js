let galleryItems = [];
let currentCategory = null;
let selectedTags = [];
let searchTerm = '';

// Inicializar galería
async function initGallery() {
    try {
        // Cargar galería
        const response = await fetch('scripts/galeria_miniaturas.json');
        if (!response.ok) throw new Error('Failed to load gallery data');
        galleryItems = await response.json();
        renderGallery(galleryItems);
    } catch (error) {
        console.error('Error loading gallery data:', error);
        document.getElementById('gallery-grid').innerHTML = '<p>Error loading gallery.</p>';
    }

    // Cargar tags dinámicamente desde JSON
    await loadTags();

    document.getElementById('current-year').textContent = new Date().getFullYear();

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    navToggle.addEventListener('click', () => navMenu.classList.toggle('active'));

    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navigation');
        nav.classList.toggle('scrolled', window.scrollY > 20);
    });

    // Search input
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.querySelector('.clear-search');
    searchInput.addEventListener('input', function () {
        searchTerm = this.value;
        clearSearchBtn.style.display = searchTerm ? 'flex' : 'none';
        filterGallery();
    });
}

// Cargar tags desde archivo JSON
async function loadTags() {
    try {
        const response = await fetch('scripts/tags-data.json');
        if (!response.ok) throw new Error('Failed to load tags');

        const tags = await response.json();
        const tagsContainer = document.getElementById('tags');
        tagsContainer.innerHTML = ''; // Limpiar contenido anterior

        tags.forEach(tag => {
            const tagDiv = document.createElement('div');
            tagDiv.className = 'tag-item';
            tagDiv.textContent = tag;
            tagDiv.onclick = function () {
                toggleTag(this);
            };
            tagsContainer.appendChild(tagDiv);
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
                <div class="gallery-image">
                    <img src="${item.imageUrl}" alt="${item.titulo}">
                    <div class="gallery-overlay">
                        <div class="overlay-content">                                    
                            <div class="item-tags">
                                ${item.tags.map(tag => `<span class="item-tag">${tag}</span>`).join('')}
                            </div>
                            ${item.variantes && Number(item.variantes) > 0 ? `<span class="Variantes">${item.variantes} Variantes</span>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += itemHtml;
    });

    document.getElementById('gallery-count').textContent = `${items.length} ${items.length === 1 ? 'item' : 'items'} found`;
}

// Filtrar galería
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

    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(item =>
            item.titulo.toLowerCase().includes(term) ||
            item.tags.some(tag => tag.toLowerCase().includes(term))
        );
    }

    renderGallery(filtered);
}

// Filtrar por categoría
function filterByCategory(category, element) {
    currentCategory = category;
    document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    filterGallery();
}

// Activar/desactivar tag
function toggleTag(element) {
    const tag = element.textContent;
    element.classList.toggle('active');

    if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(t => t !== tag);
    } else {
        selectedTags.push(tag);
    }

    filterGallery();
}

// Búsqueda
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.querySelector('.clear-search');

searchInput.addEventListener('input', function () {
    searchTerm = this.value;
    clearSearchBtn.style.display = searchTerm ? 'flex' : 'none';
    filterGallery();
});

// Limpiar búsqueda
function clearSearch() {
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

    searchInput.value = '';
    clearSearchBtn.style.display = 'none';

    filterGallery();
}

// Mostrar/ocultar secciones
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const header = section.previousElementSibling;
    const chevron = header.querySelector('.chevron');

    section.style.display = section.style.display === 'none' ? 'flex' : 'none';
    chevron.style.transform = section.style.display === 'none' ? 'rotate(0deg)' : 'rotate(180deg)';
}

// Iniciar
document.addEventListener('DOMContentLoaded', initGallery);
