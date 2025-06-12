let galleryItems = [];
let currentCategory = null;
let selectedRating = [];
let selectedTags = [];
let searchTerm = '';

// Etiquetas con sufijo "Composition" para filtro visual
const tagsWithCompositionLabel = ["Pyramid", "Symmetrical", "Asymmetrical", "Radial", "Text"];

// Traduce visualmente una etiqueta para mostrar en filtros (tags que se muestran en filtros)
function getDisplayTagForFilter(tag) {
  const trimmedTag = tag.trim();
  if (trimmedTag === "Text") return "Text as Main Element";
  if (tagsWithCompositionLabel.includes(trimmedTag)) return `${trimmedTag} Composition`;
  return trimmedTag;
}

// En la galería se muestran las etiquetas tal cual están (sin modificar)
function getDisplayTagForGallery(tag) {
  return tag.trim();
}

// Inicializa galería
async function initGallery() {
  try {
    const response = await fetch('galeria_miniaturas.json');
    if (!response.ok) throw new Error('Failed to load gallery data');
    galleryItems = await response.json();

    renderGallery(galleryItems);
  } catch (e) {
    console.error('Error cargando galería:', e);
    document.getElementById('gallery-grid').innerHTML = '<p>Error loading gallery.</p>';
  }

  await loadTags();
  // Aquí puedes cargar categorías, ratings, etc. si los tienes
  document.getElementById('gallery-count').textContent = `${galleryItems.length} items found`;
}

// Carga tags para filtros desde tags-data.json
async function loadTags() {
  try {
    const response = await fetch('tags-data.json');
    if (!response.ok) throw new Error('Failed to load tags data');
    const tags = await response.json();

    const container = document.createElement('div');
    container.id = 'tags';

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

    // Añadimos el contenedor de tags antes de la galería
    document.querySelector('.gallery-content').insertBefore(container, document.getElementById('gallery-grid'));
  } catch (e) {
    console.error('Error cargando tags:', e);
  }
}

// Renderiza galería con las etiquetas originales (sin modificar)
function renderGallery(items) {
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '';

  items.forEach(item => {
    const tagsHtml = item.tags
      .filter(t => t.trim() !== "")
      .slice(0, 3)
      .map(t => `<span class="item-tag">${getDisplayTagForGallery(t)}</span>`)
      .join('');

    const variantesHtml = item.variantesUrl && item.variantesUrl.length > 0
      ? `<span class="Variantes">${item.variantesUrl.length} Variante${item.variantesUrl.length > 1 ? 's' : ''}</span>`
      : '';

    const itemHtml = `
      <div class="gallery-item">
        <a href="imagen.html?id=${item.id}">
          <div class="gallery-image">
            <img src="${item.imageUrl}" alt="${item.titulo}">
            <div class="gallery-overlay">
              <div class="overlay-content">
                ${variantesHtml}
                <div class="item-tags">${tagsHtml}</div>
              </div>
            </div>
          </div>
        </a>
      </div>
    `;

    grid.innerHTML += itemHtml;
  });

  document.getElementById('gallery-count').textContent = `${items.length} item${items.length !== 1 ? 's' : ''} found`;
}

// Función para filtrar la galería
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
    filtered = filtered.filter(item => selectedRating.includes(item.rating));
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

// Maneja selección/desselección de tags para filtro
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

// Inicializa al cargar DOM
document.addEventListener('DOMContentLoaded', initGallery);
