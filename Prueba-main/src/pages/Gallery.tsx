import React, { useState, useEffect } from 'react';
import GallerySidebar from '../components/GallerySidebar';
import GalleryItem from '../components/GalleryItem';
import '../styles/gallery.css';

interface GalleryImage {
  id: number;
  title: string;
  category: string;
  tags: string[];
  imageUrl: string;
}

const galleryItems: GalleryImage[] = [
  {
    id: 1,
    title: 'Abstract Composition',
    category: 'Design',
    tags: ['Abstract', 'Colorful', 'Modern'],
    imageUrl: 'https://images.pexels.com/photos/2693212/pexels-photo-2693212.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 2,
    title: 'Architectural Wonder',
    category: 'Photography',
    tags: ['Architecture', 'Building', 'Modern'],
    imageUrl: 'https://images.pexels.com/photos/256150/pexels-photo-256150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 3,
    title: 'Digital Landscape',
    category: 'Digital',
    tags: ['Landscape', 'Digital Art', 'Colorful'],
    imageUrl: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 4,
    title: 'Portrait Study',
    category: 'Photography',
    tags: ['Portrait', 'People', 'Black and White'],
    imageUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 5,
    title: 'Product Showcase',
    category: 'Design',
    tags: ['Product', 'Minimal', 'Clean'],
    imageUrl: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 6,
    title: 'Nature Exploration',
    category: 'Photography',
    tags: ['Nature', 'Landscape', 'Outdoors'],
    imageUrl: 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 7,
    title: 'UI Design',
    category: 'Design',
    tags: ['UI', 'Interface', 'Modern'],
    imageUrl: 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 8,
    title: 'Urban Scene',
    category: 'Photography',
    tags: ['Urban', 'City', 'Street'],
    imageUrl: 'https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

const Gallery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryImage[]>(galleryItems);
  
  // Extract all categories and tags for the sidebar
  const categories = Array.from(new Set(galleryItems.map(item => item.category)));
  const allTags = Array.from(new Set(galleryItems.flatMap(item => item.tags)));
  
  useEffect(() => {
    // Filter gallery items based on search, category, and tags
    let results = galleryItems;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    if (selectedCategory) {
      results = results.filter(item => item.category === selectedCategory);
    }
    
    if (selectedTags.length > 0) {
      results = results.filter(item => 
        selectedTags.some(tag => item.tags.includes(tag))
      );
    }
    
    setFilteredItems(results);
  }, [searchTerm, selectedCategory, selectedTags]);
  
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedTags([]);
  };
  
  return (
    <div className="gallery-page">
      <div className="gallery-container">
        <GallerySidebar 
          categories={categories}
          tags={allTags}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          selectedTags={selectedTags}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onTagToggle={handleTagToggle}
          onClearFilters={clearFilters}
        />
        
        <div className="gallery-content">
          <div className="gallery-header">
            <h1>Gallery</h1>
            <p>
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
              {selectedCategory && ` in ${selectedCategory}`}
              {selectedTags.length > 0 && ` with tags: ${selectedTags.join(', ')}`}
            </p>
          </div>
          
          {filteredItems.length > 0 ? (
            <div className="gallery-grid">
              {filteredItems.map(item => (
                <GalleryItem key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No items found matching your criteria.</p>
              <button className="btn" onClick={clearFilters}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;