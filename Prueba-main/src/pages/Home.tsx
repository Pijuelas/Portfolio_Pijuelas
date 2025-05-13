import React, { useEffect } from 'react';
import LandingSection from '../components/LandingSection';
import GalleryItem from '../components/GalleryItem';
import '../styles/home.css';

const featuredImages = [
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
  }
];

const Home: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-page">
      <LandingSection />
      
      <section className="featured-section">
        <div className="container">
          <div className="featured-grid">
            {featuredImages.map(item => (
              <GalleryItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;