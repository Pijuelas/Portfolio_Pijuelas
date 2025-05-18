        // Gallery data
        const galleryItems = [
            {
                id: 1,
                titulo: '',
                variantes: '',
                category: '',
                tags: ['', '', ''],
                imageUrl: 'https://pbs.twimg.com/media/GqHP1W7WMAAYZVg?format=jpg&name=large'
            },
            {
                id: 2,
                titulo: '',
                variantes: '',
                category: '',
                tags: ['', '', ''],
                imageUrl: 'https://pbs.twimg.com/media/GqHOAW6XcAAX7pu?format=jpg&name=large'
            },
            {
                id: 3,
                titulo: '',
                variantes: '',
                category: '',
                tags: ['', '', ''],
                imageUrl: 'https://pbs.twimg.com/media/GqHKGPlX0AIMNfz?format=jpg&name=large'
            },
            {
                id: 4,
                titulo: '',
                variantes: '',
                category: '',
                tags: ['', '', ''],
                imageUrl: 'https://pbs.twimg.com/media/GrQVoxXXIAAjgfp?format=jpg&name=large'
            },
            {
                id: 5,
                titulo: '',
                variantes: '',
                category: '',
                tags: ['', '', ''],
                imageUrl: 'https://pbs.twimg.com/media/GrQUtQ3XoAABOm3?format=jpg&name=large'
            },
            {
                id: 6,
                titulo: '',
                variantes: '',
                category: '',
                tags: ['', '', ''],
                imageUrl: 'https://pbs.twimg.com/media/GrQUt1GW4AA5eDO?format=jpg&name=large'
            },
            {
                id: 7,
                titulo: '',
                variantes: '',
                category: '',
                tags: ['', '', ''],
                imageUrl: 'https://pbs.twimg.com/media/GrQUftNX0AE9RR3?format=jpg&name=large'
            },
            {
                id: 8,
                titulo: '',
                variantes: '',
                category: '',
                tags: ['', '', ''],
                imageUrl: 'https://pbs.twimg.com/media/GrQUOLbWwAApdIp?format=jpg&name=large'
            },
            {
                id: 9,
                titulo: '',
                variantes: '',
                category: '',
                tags: ['', '', ''],
                imageUrl: 'https://pbs.twimg.com/media/GqHP1UbWAAEnm11?format=jpg&name=large'
            },            
            {
                id: 10,
                titulo: '',
                variantes: '',
                category: '',
                tags: ['', '', ''],
                imageUrl: 'https://pbs.twimg.com/media/GqHP1WfXoAEvOE4?format=jpg&name=large'
            },        
            {
                id: 11,
                titulo: '',
                variantes: '',
                category: '',
                tags: ['', '', ''],
                imageUrl: 'https://pbs.twimg.com/media/GqHP1X5XsAEjPGp?format=jpg&name=large'
            },
            {
                id: 12,
                titulo: '',
                variantes: '',
                category: '',
                tags: ['', '', ''],
                imageUrl: 'Miniaturas/Video opera.png'
            },
            {
                id: 13,
                titulo: '',
                variantes: '',
                category: '',
                tags: ['', '', ''],
                imageUrl: 'Miniaturas/Spinner 1.png'
            }
        ];

        let currentCategory = null;
        let selectedTags = [];
        let searchTerm = '';

        // Initialize gallery
        function initGallery() {
            renderGallery(galleryItems);
            document.getElementById('current-year').textContent = new Date().getFullYear();

            // Mobile menu toggle
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });

            // Navigation scroll effect
            window.addEventListener('scroll', () => {
                const nav = document.querySelector('.navigation');
                if (window.scrollY > 20) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            });
        }

        // Render gallery items
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
                                    <span class="Variantes">${item.variantes} Variantes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                grid.innerHTML += itemHtml;
            });

            document.getElementById('gallery-count').textContent = `${items.length} ${items.length === 1 ? 'item' : 'items'} found`;
        }

        // Filter gallery
        function filterGallery() {
            let filtered = galleryItems;

            // Category filter
            if (currentCategory) {
                filtered = filtered.filter(item => item.category === currentCategory);
            }

            // Tags filter
            if (selectedTags.length > 0) {
                filtered = filtered.filter(item =>
                    selectedTags.some(tag => item.tags.includes(tag))
                );
            }

            // Search filter
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                filtered = filtered.filter(item =>
                    item.titulo.toLowerCase().includes(term) ||
                    item.tags.some(tag => tag.toLowerCase().includes(term))
                );
            }

            renderGallery(filtered);
        }

        // Category filter
        function filterByCategory(category, element) {
            currentCategory = category;
            document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
            element.classList.add('active');
            filterGallery();
        }

        // Tag toggle
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

        // Search functionality
        const searchInput = document.getElementById('search-input');
        const clearSearchBtn = document.querySelector('.clear-search');

        searchInput.addEventListener('input', function() {
            searchTerm = this.value;
            clearSearchBtn.style.display = searchTerm ? 'flex' : 'none';
            filterGallery();
        });

        function clearSearch() {
            searchInput.value = '';
            searchTerm = '';
            clearSearchBtn.style.display = 'none';
            filterGallery();
        }

        // Clear all filters
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

        // Toggle sections
        function toggleSection(sectionId) {
            const section = document.getElementById(sectionId);
            const header = section.previousElementSibling;
            const chevron = header.querySelector('.chevron');
            
            section.style.display = section.style.display === 'none' ? 'flex' : 'none';
            chevron.style.transform = section.style.display === 'none' ? 'rotate(0deg)' : 'rotate(180deg)';
        }

        // Initialize gallery when DOM is loaded
        document.addEventListener('DOMContentLoaded', initGallery);