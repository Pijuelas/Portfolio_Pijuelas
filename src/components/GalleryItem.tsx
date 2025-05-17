import React from 'react';
import '../styles/gallery-item.css';

interface GalleryImage {
  id: number;
  title: string;
  category: string;
  tags: string[];
  imageUrl: string;
}

interface GalleryItemProps {
  item: GalleryImage;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ item }) => {
  return (
    <div className="gallery-item">
      <div className="gallery-image">
        <img src={item.imageUrl} alt={item.title} />
        <div className="gallery-overlay">
          <div className="overlay-content">
            <span className="category">{item.category}</span>
            <h3>{item.title}</h3>
            <div className="item-tags">
              {item.tags.map((tag, index) => (
                <span key={index} className="item-tag">{tag}</span>
              ))}
            </div>
            <button className="view-btn">View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryItem;