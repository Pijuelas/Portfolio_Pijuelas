// scripts/imagen.js

// Cargar datos desde el archivo JSON (ruta absoluta para GitHub Pages)
fetch('/Portfolio_Pijuelas/json/galeria_miniaturas.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    mostrarImagen(data);
    cargarMiniaturas(data);
  })
  .catch(error => {
    document.getElementById('imagen-detalle').innerHTML = `<p class="loading">Error al cargar los datos: ${error.message}</p>`;
    console.error('Error:', error);
  });

// Obtener el ID desde la URL
function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id'));
}

// Mostrar la imagen principal y su información
function mostrarImagen(imagenes) {
  const id = getIdFromURL();
  const imagen = imagenes.find(img => img.id === id);
  const contenedor = document.getElementById('imagen-detalle');

  if (!imagen) {
    contenedor.innerHTML = '<p class="loading">Imagen no encontrada.</p>';
    return;
  }

  const { titulo, imageUrl, category, variantes, tags } = imagen;

  const descripcion = 'Esta obra representa un estudio detallado que explora técnicas visuales y conceptos artísticos contemporáneos. La pieza invita a la reflexión sobre temas universales desde una perspectiva única.';

  contenedor.innerHTML = `
    <div class="main-image-container">
      <img src="${imageUrl}" alt="${titulo || 'Imagen'}" loading="lazy">
    </div>
    
    <div class="thumbnails-container">
      <div class="thumbnails" id="thumbnails">
        <!-- Miniaturas serán cargadas dinámicamente -->
      </div>
    </div>
    
    <div class="image-info">
      <h1>${titulo || 'Sin título'}</h1>
      <p class="subtitle">${category || 'Arte digital'}</p>
      <p class="description">${descripcion}</p>
      
      <div class="info">
        ${category ? `<span class="info-item">Categoría: ${category}</span>` : ''}
        ${variantes ? `<span class="info-item">${variantes} Variante(s)</span>` : ''}
      </div>
      
      <div class="tags">
        ${tags.filter(Boolean).map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
      
      <div class="navigation">
        <a href="gallery.html" class="back-button">← Volver a la galería</a>
      </div>
    </div>
  `;
}

// Cargar variantes como miniaturas (y permitir intercambiar con la principal)
function cargarMiniaturas(imagenes) {
  const currentId = getIdFromURL();
  const contenedor = document.getElementById('imagen-detalle');
  const mainImage = document.querySelector('.main-image-container img');

  const imagen = imagenes.find(img => img.id === currentId);
  if (!imagen || !Array.isArray(imagen.variantesUrl) || imagen.variantesUrl.length === 0) return;

  // Crear contenedor de miniaturas dinámicamente
  const thumbnailsContainer = document.createElement('div');
  thumbnailsContainer.className = 'thumbnails-container';

  const thumbnails = document.createElement('div');
  thumbnails.className = 'thumbnails';
  thumbnails.id = 'thumbnails';

  imagen.variantesUrl.forEach((url, index) => {
    const thumbElement = document.createElement('div');
    thumbElement.className = 'thumbnail';

    const thumbImg = document.createElement('img');
    thumbImg.src = url;
    thumbImg.alt = `Variante ${index + 1}`;
    thumbImg.loading = 'lazy';

    // Intercambio cíclico
    thumbElement.addEventListener('click', () => {
      const temp = mainImage.src;
      mainImage.src = thumbImg.src;
      thumbImg.src = temp;
    });

    thumbElement.appendChild(thumbImg);
    thumbnails.appendChild(thumbElement);
  });

  thumbnailsContainer.appendChild(thumbnails);
  contenedor.insertBefore(thumbnailsContainer, document.querySelector('.image-info'));
}
