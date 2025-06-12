// Estado global para filtros y datos
let galleryItems = [];
let filteredItems = [];

let selectedTags = [];
let currentCategory = null;
let selectedRating = []; // Por ahora no usado porque está desactivado en HTML
let searchTerm = '';

// Función para cargar los datos JSON de miniaturas
async function loadGalleryItems() {
  try {
    const response = await fetch('scripts/galeria_miniaturas.json');
    if (!response.ok) throw new Error('Error cargando galería');
    galleryItems = await response.json();
    filteredItems = [...galleryItems];
  } catch (e) {
    console.error(e);
  }
}

// Función para cargar tags desde JSON y ponerlos en el div #tags
async function loadTags() {
  try {
    const response = await fetch('scripts/tags-data.json');
    if (!response.ok) throw new Error('Error cargando tags');
    const tags = await response.json();

    const container = document.getElementById('tags');
    container.innerHTML = ''; // limpia contenido previo

    tags.forEach(rawTag => {
      const div = document.createElement('div');
      div.className = 'tag-item';
      div.textContent = getDisplayTagForFilter(rawTag);
      div.dataset.rawTag = rawTag.trim();

      div.style.cursor = 'pointer';
      div.style.display = 'inline-block';
      div.style.margin = '3px';
      div.style.padding = '5px 10px';
      div.style.border = '1px solid #ccc';
      div.style.borderRadius = '5px';

      div.onclick = () => toggleTag(div);

      container.appendChild(div);
    });
  } catch (e) {
    console.error(e);
  }
}

// Función para mostrar la galería filtrada en el div #gallery-grid
function renderGallery() {
  const container = document.getElementById('gallery-grid');
  container.innerHTML = '';

  if (filteredItems.length === 0) {
    container.innerHTML = '<p>No items found.</p>';
    updateGalleryCount(0);
    return;
  }

  filteredItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'gallery-item';

    div.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.title}" loading="lazy">
      <h4>${item.title}</h4>
      <p>${item.description || ''}</p>
    `;

    container.appendChild(div);
  });

  updateGalleryCount(filteredItems.length);
}

// Actualiza el texto que indica cuántos items hay
function updateGalleryCount(count) {
  const p = document.getElementById('gallery-count');
  p.textContent = `${count} item${count !== 1 ? 's' : ''} found`;
}

// Lógica para filtrar la galería según filtros aplicados
function filterGallery() {
  filteredItems = galleryItems.filter(item => {
    // Filtrar por categoría si existe
    if (currentCategory && item.category !== currentCategory) return false;

    // Filtrar por tags (todas las tags seleccionadas deben estar en item.tags)
    if (selectedTags.length > 0) {
      if (!item.tags || !selectedTags.every(tag => item.tags.includes(tag))) {
        return false;
      }
    }

    // Filtrar por búsqueda (en título o descripción)
    if (searchTerm) {
      const text = (item.title + ' ' + (item.description || '')).toLowerCase();
      if (!text.includes(searchTerm.toLowerCase())) return false;
    }

    // Aquí podrías agregar filtro por rating cuando esté implementado

    return true;
  });

  renderGallery();
}

// Función que limpia todos los filtros y recarga la galería
function clearFilters() {
  selectedTags = [];
  currentCategory = null;
  selectedRating = [];
  searchTerm = '';
  document.getElementById('search-input').value = '';

  // Quitar selección visual de tags
  document.querySelectorAll('.tag-item.selected').forEach(div => {
    div.classList.remove('selected');
  });

  filterGallery();
  // Ocultar botón limpiar búsqueda
  const clearBtn = document.querySelector('.clear-search');
  if (clearBtn) clearBtn.style.display = 'none';
}

// Función para limpiar búsqueda únicamente
function clearSearch() {
  searchTerm = '';
  document.getElementById('search-input').value = '';
  filterGallery();

  const clearBtn = document.querySelector('.clear-search');
  if (clearBtn) clearBtn.style.display = 'none';
}

// Toggle visual y lógico de tag cuando se hace click
function toggleTag(div) {
  const tag = div.dataset.rawTag;

  if (selectedTags.includes(tag)) {
    selectedTags = selectedTags.filter(t => t !== tag);
    div.classList.remove('selected');
  } else {
    selectedTags.push(tag);
    div.classList.add('selected');
  }

  filterGallery();
}

// Helper para que los tags se vean más "limpios"
function getDisplayTagForFilter(rawTag) {
  return rawTag.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
}

// Toggle para mostrar u ocultar secciones del sidebar
function toggleSection(id) {
  const section = document.getElementById(id);
  if (!section) return;

  if (section.style.display === 'none' || section.style.display === '') {
    section.style.display = 'block';
  } else {
    section.style.display = 'none';
  }
}

// Inicializa eventos y carga todo
async function initGallery() {
  await loadGalleryItems();
  await loadTags();

  renderGallery();

  // Eventos para búsqueda
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.querySelector('.clear-search');

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchTerm = e.target.value.trim();
      filterGallery();

      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchTerm ? 'inline-block' : 'none';
      }
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.style.display = 'none';
    clearSearchBtn.addEventListener('click', clearSearch);
  }

  // Por defecto mostrar categorías y tags abiertas (opcional)
  toggleSection('categories');
  toggleSection('tags');
}

// Llamar initGallery al cargar el script (por eso defer es perfecto)
initGallery();

// Exporta funciones que se usan desde HTML
window.clearFilters = clearFilters;
window.clearSearch = clearSearch;
window.toggleSection = toggleSection;
