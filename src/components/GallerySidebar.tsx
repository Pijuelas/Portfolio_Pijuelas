import React, { useState } from 'react';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import '../styles/gallery-sidebar.css';

interface GallerySidebarProps {
  categories: string[];
  tags: string[];
  searchTerm: string;
  selectedCategories: string[];
  selectedTags: string[];
  onSearchChange: (term: string) => void;
  onCategoryToggle: (category: string) => void;
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
}

const GallerySidebar: React.FC<GallerySidebarProps> = ({
  categories,
  tags,
  searchTerm,
  selectedCategories,
  selectedTags,
  onSearchChange,
  onCategoryToggle,
  onTagToggle,
  onClearFilters
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };
  
  const clearSearch = () => {
    onSearchChange('');
  };
  
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };
  
  return (
    <>
      <div className="mobile-sidebar-toggle" onClick={toggleMobileSidebar}>
        <button className="btn toggle-btn">
          {isMobileOpen ? 'Close Filters' : 'Show Filters'}
        </button>
      </div>
      
      <aside className={`gallery-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Filters</h2>
          <button className="clear-btn" onClick={onClearFilters}>Clear All</button>
        </div>
        
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search gallery..."
              value={searchTerm}
              onChange={handleSearchInput}
            />
            {searchTerm && (
              <button className="clear-search" onClick={clearSearch}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        
        <div className="sidebar-section">
          <div 
            className="section-header" 
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <h3>Categories</h3>
            <div className={`chevron ${isCategoryOpen ? 'open' : ''}`}>
              {isCategoryOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
          
          <div className={`section-content ${isCategoryOpen ? 'open' : ''}`}>
            {categories.map(category => (
              <div 
                key={category}
                className={`category-item ${selectedCategories.includes(category) ? 'active' : ''}`}
                onClick={() => onCategoryToggle(category)}
              >
                {category}
              </div>
            ))}
          </div>
        </div>
        
        <div className="sidebar-section">
          <div 
            className="section-header"
            onClick={() => setIsTagsOpen(!isTagsOpen)}
          >
            <h3>Tags</h3>
            <div className={`chevron ${isTagsOpen ? 'open' : ''}`}>
              {isTagsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
          
          <div className={`tags-container ${isTagsOpen ? 'open' : ''}`}>
            {tags.map(tag => (
              <div 
                key={tag}
                className={`tag-item ${selectedTags.includes(tag) ? 'active' : ''}`}
                onClick={() => onTagToggle(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mobile-close-btn" onClick={toggleMobileSidebar}>
          <X size={24} />
        </div>
      </aside>
    </>
  );
};

export default GallerySidebar;