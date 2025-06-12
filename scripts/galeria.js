// Lista de tags que deben llevar el sufijo "Composition"
const tagsWithCompositionLabel = [
  "Pyramid",
  "Symmetrical",
  "Asymmetrical",
  "Radial"
];

// Función para formatear visualmente las etiquetas
function getDisplayTag(tag) {
  if (typeof tag !== 'string') return '';
  const trimmedTag = tag.trim();
  if (!trimmedTag) return '';

  if (trimmedTag === "Text") {
    return "Text as Main Element";
  }

  return tagsWithCompositionLabel.includes(trimmedTag) ? `${trimmedTag} Composition` : trimmedTag;
}

// Función para renderizar la galería
function renderGallery(items) {
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '';

  items.forEach(item => {
    const tagsArray = Array.isArray(item.tags) ? item.tags : [];
    const safeTags = tagsArray
      .map(tag => typeof tag === 'string' ? tag.trim() : '')
      .filter(tag => tag) // elimina vacíos
      .slice(0, 3); // máximo 3 tags

    const itemHtml = `
      <div class="gallery-item">
        <a href="imagen.html?id=${item.id}">
          <div class="gallery-image">
            <img src="${item.imageUrl}" alt="${item.titulo}">
            <div class="gallery-overlay">
              <div class="overlay-content">
                ${item.variantesUrl && item.variantesUrl.length > 0
                  ? `<span class="Variantes">${item.variantesUrl.length} Variante${item.variantesUrl.length > 1 ? 's' : ''}</span>`
                  : ''
                }
                <div class="item-tags">
                  ${safeTags.map(tag => `<span class="item-tag">${getDisplayTag(tag)}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    `;
    grid.innerHTML += itemHtml;
  });

  const countText = `${items.length} ${items.length === 1 ? 'item' : 'items'} found`;
  document.getElementById('gallery-count').textContent = countText;
}

// Cargar los datos desde galeria_miniaturas.json
fetch('galeria_miniaturas.json')
  .then(response => response.json())
  .then(data => {
    // Filtrar elementos vacíos o sin imagen
    const validItems = data.filter(item => item.imageUrl && item.titulo);
    renderGallery(validItems);
  })
  .catch(error => {
    console.error('Error al cargar galeria_miniaturas.json:', error);
    document.getElementById('gallery-grid').innerHTML = '<p>Error al cargar la galería.</p>';
  });
