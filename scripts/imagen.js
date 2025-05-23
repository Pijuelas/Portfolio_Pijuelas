// scripts/imagen.js

// Cargar datos desde el archivo JSON
fetch('../json/galeria_miniaturas.json')
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

function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id'));
}

// Cargar los datos y muestra la imagen correspondiente
function mostrarImagen(imagenes) {
  const id = getIdFromURL();
  const imagen = imagenes.find(img => img.id === id);
  
  const contenedor = document.getElementById('imagen-detalle');
  
  if (!imagen) {
    contenedor.innerHTML = '<p class="loading">Imagen no encontrada.</p>';
    return;
  }

  const { titulo, imageUrl, category, variantes, tags } = imagen;

  // Crear descripción de demostración
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
        <a href="index.html" class="back-button">← Volver a la galería</a>
      </div>
    </div>
  `;
}

// Cargar miniaturas relacionadas
function cargarMiniaturas(imagenes) {
  const currentId = getIdFromURL();
  const thumbnailsContainer = document.getElementById('thumbnails');
  
  if (!thumbnailsContainer) return;
  
  // Filtrar para obtener hasta 5 imágenes (la actual y 4 más)
  const relatedImages = imagenes
    .filter(img => img.imageUrl && img.imageUrl.startsWith('http')) // Solo imágenes con URL válidas
    .slice(0, 5);
  
  relatedImages.forEach(img => {
    const thumbElement = document.createElement('div');
    thumbElement.className = `thumbnail ${img.id === currentId ? 'active' : ''}`;
    thumbElement.innerHTML = `<img src="${img.imageUrl}" alt="${img.titulo || 'Miniatura'}" loading="lazy">`;
    
    // Agregar evento de clic para cambiar a esa imagen
    if (img.id !== currentId) {
      thumbElement.addEventListener('click', () => {
        window.location.href = `imagen.html?id=${img.id}`;
      });
    }
    
    thumbnailsContainer.appendChild(thumbElement);
  });
}