document.addEventListener("DOMContentLoaded", () => {
  console.log("🔥 FoodTruck Page Successfully Loaded - Infernal Mode Activated");
  
  // DOM element references
  const searchToggle = document.getElementById("search-toggle");
  const searchOverlay = document.querySelector(".search-overlay");
  const closeSearch = document.querySelector(".close-search");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  
  // Foodtruck upcoming stops data - with more detailed info
  const upcomingStops = [
    {
      city: "Madrid",
      date: "May 12",
      img: "../imagenes/madrid.webp",
      location: "San Miguel Market",
      hours: "6:00 PM - 12:00 AM"
    },
    {
      city: "Valencia",
      date: "May 20",
      img: "../imagenes/valencia.jpg",
      location: "Plaza de la Reina",
      hours: "7:00 PM - 1:00 AM"
    },
    {
      city: "Seville",
      date: "June 5",
      img: "../imagenes/sevilla.jpg",
      location: "María Luisa Park",
      hours: "6:30 PM - 11:30 PM"
    },
    {
      city: "Barcelona",
      date: "June 15",
      img: "../imagenes/barcelona.webp",
      location: "Barceloneta Beach",
      hours: "7:00 PM - 2:00 AM"
    },
    {
      city: "Zaragoza",
      date: "June 30",
      img: "../imagenes/zaragoza.jpg",
      location: "Plaza del Pilar",
      hours: "6:00 PM - 11:00 PM"
    }
  ];
  
  // Search Overlay Functionality
  if (searchToggle && searchOverlay && closeSearch) {
    searchToggle.addEventListener("click", () => {
      searchOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        document.querySelector(".search-input-overlay").focus();
      }, 100);
    });
    
    closeSearch.addEventListener("click", () => {
      searchOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
    
    // Close search with ESC key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = "";
      }
    });
  }
  
  // Mobile menu functionality
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      
      // Add close button if it doesn't exist
      if (!navLinks.querySelector('.close-menu')) {
        const closeButton = document.createElement('button');
        closeButton.className = 'close-menu';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        navLinks.prepend(closeButton);
        
        // Event to close
        closeButton.addEventListener('click', () => {
          navLinks.classList.remove('active');
        });
      }
    });
  }
  
  // Initialize improved carousel
  initImprovedCarousel();
  
  // Scroll animations
  const elements = document.querySelectorAll('.foodtruck-showcase, .foodtruck-info, .upcoming-stops, .book-foodtruck');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  
  elements.forEach(element => {
    element.classList.add('animate-on-scroll');
    observer.observe(element);
  });
  
  // Initialize cart counter
  const cartCountElement = document.querySelector('.cart-count');
  if (cartCountElement) {
    updateCartCount();
  }
  
  // Add hover effects to navigation
  const navItems = document.querySelectorAll('.nav-links a');
  navItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (!item.classList.contains('active')) {
        item.style.color = '#ff0066';
        item.style.textShadow = '0 0 10px rgba(255, 0, 102, 0.7), 0 0 20px rgba(255, 0, 102, 0.5)';
      }
    });
    item.addEventListener('mouseleave', () => {
      if (!item.classList.contains('active')) {
        item.style.color = '';
        item.style.textShadow = '';
      }
    });
  });
  
  // Create fire particle effect
  createFireEffect();
  
  // Floating devil appearance
  setTimeout(() => {
    const floatingDevil = document.getElementById('floating-devil');
    if (floatingDevil) {
      floatingDevil.classList.remove('hidden');
      
      floatingDevil.addEventListener('click', () => {
        showDiscountModal();
      });
    }
  }, 5000);
  
  // Random neon effect in header elements
  setInterval(() => {
    const randomElement = document.querySelectorAll('.nav-links a, .header-right i')[Math.floor(Math.random() * 5)];
    if (randomElement) {
      randomElement.style.textShadow = '0 0 15px rgba(255, 0, 102, 1), 0 0 30px rgba(255, 0, 102, 0.8)';
      
      setTimeout(() => {
        randomElement.style.textShadow = '';
      }, 500);
    }
  }, 2000);
});

// Function for improved carousel
function initImprovedCarousel() {
  const track = document.getElementById('paradas-foodtruck');
  if (!track) return;
  
  const upcomingStops = [
    {
      city: "Madrid",
      date: "May 12",
      img: "../imagenes/madrid.webp",
      location: "San Miguel Market",
      hours: "6:00 PM - 12:00 AM"
    },
    {
      city: "Valencia",
      date: "May 20",
      img: "../imagenes/valencia.jpg",
      location: "Plaza de la Reina",
      hours: "7:00 PM - 1:00 AM"
    },
    {
      city: "Seville",
      date: "June 5",
      img: "../imagenes/sevilla.jpg",
      location: "María Luisa Park",
      hours: "6:30 PM - 11:30 PM"
    },
    {
      city: "Barcelona",
      date: "June 15",
      img: "../imagenes/barcelona.webp",
      location: "Barceloneta Beach",
      hours: "7:00 PM - 2:00 AM"
    },
    {
      city: "Zaragoza",
      date: "June 30",
      img: "../imagenes/zaragoza.jpg",
      location: "Plaza del Pilar",
      hours: "6:00 PM - 11:00 PM"
    }
  ];
  
  // Create carousel items
  upcomingStops.forEach((stop, index) => {
    const card = document.createElement("div");
    card.className = "carousel-item";
    card.dataset.index = index;
    
    card.innerHTML = `
      <img src="${stop.img}" alt="${stop.city}" class="item-image" />
      <h3 class="item-title">${stop.city}</h3>
      <p class="item-price">${stop.date}</p>
      <p class="item-location"><i class="fas fa-map-marker-alt"></i> ${stop.location}</p>
      <p class="item-location"><i class="fas fa-clock"></i> ${stop.hours}</p>
      <button class="order-btn" data-city="${stop.city}" data-date="${stop.date}">BOOK</button>
    `;
    
    track.appendChild(card);
  });
  
  // Add listeners to booking buttons
  const bookButtons = track.querySelectorAll('.order-btn');
  bookButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const city = this.getAttribute('data-city');
      const date = this.getAttribute('data-date');
      bookStop(city, date);
    });
  });
  
  // Carousel variables
  const items = track.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const itemWidth = 320; // Width + margin of item
  const totalItems = items.length;
  let currentIndex = 0;
  let isTransitioning = false;
  let autoplayInterval;
  
  // Function to update carousel position
  function updateCarousel(withAnimation = true) {
    if (isTransitioning) return;
    
    // Calculate offset to center current element
    const trackWidth = track.parentElement.offsetWidth;
    const centerOffset = (trackWidth - itemWidth) / 2;
    const newPosition = (currentIndex * -itemWidth) + centerOffset;
    
    // Apply transition based on parameter
    if (withAnimation) {
      isTransitioning = true;
      track.style.transition = 'transform 0.5s ease-out';
    } else {
      track.style.transition = 'none';
    }
    
    track.style.transform = `translateX(${newPosition}px)`;
    
    // Update active classes
    items.forEach((item, i) => {
      if (i === currentIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    
    // Reset transition after
    if (!withAnimation) {
      setTimeout(() => {
        track.style.transition = 'transform 0.5s ease-out';
      }, 50);
    }
  }
  
  // Event listener for transition end
  track.addEventListener('transitionend', () => {
    isTransitioning = false;
  });
  
  // Initialize carousel
  updateCarousel(false);
  
  // Automatically advance to next element
  function startAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    
    autoplayInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalItems;
      updateCarousel();
    }, 3000); // Change every 3 seconds
  }
  
  // Pause autoplay when mouse is over carousel
  const carouselContainer = track.closest('.carousel-container');
  carouselContainer.addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
  });
  
  carouselContainer.addEventListener('mouseleave', () => {
    startAutoplay();
  });
  
  // Navigation buttons
  prevBtn.addEventListener('click', () => {
    clearInterval(autoplayInterval);
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
    startAutoplay();
  });
  
  nextBtn.addEventListener('click', () => {
    clearInterval(autoplayInterval);
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
    startAutoplay();
  });
  
  // Start autoplay
  startAutoplay();
}

// Function to create fire particle effect
function createFireEffect() {
  setInterval(() => {
    // Create particle
    const particle = document.createElement('div');
    particle.className = 'fire-particle';
    
    // Random position at bottom of screen
    const posX = Math.random() * window.innerWidth;
    particle.style.left = `${posX}px`;
    particle.style.bottom = '0';
    
    // Random color between red and orange
    const hue = Math.floor(Math.random() * 30);
    const saturation = 90 + Math.floor(Math.random() * 10);
    const lightness = 50 + Math.floor(Math.random() * 10);
    particle.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    // Random size
    const size = 5 + Math.random() * 10;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Add to DOM
    document.body.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => {
      particle.remove();
    }, 3000);
  }, 300);
}

// Function to book foodtruck stop - redirects to booking page
function bookStop(city, date) {
  // Save booking information in sessionStorage
  sessionStorage.setItem('booking_city', city);
  sessionStorage.setItem('booking_date', date);
  
  // Redirect to booking page
  window.location.href = 'book.html';
}

// Update cart counter
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCountElement = document.querySelector('.cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cart.length;
    
    // Add highlight class if there are items
    if (cart.length > 0) {
      cartCountElement.classList.add('highlighted');
    } else {
      cartCountElement.classList.remove('highlighted');
    }
  }
}

// Show discount modal when clicking the devil
function showDiscountModal() {
  // Create modal if it doesn't exist
  if (!document.getElementById('discount-modal')) {
    const modal = document.createElement('div');
    modal.id = 'discount-modal';
    modal.className = 'discount-modal';
    
    modal.innerHTML = `
      <div class="discount-modal-content">
        <span class="discount-close">&times;</span>
        <div class="discount-header">
          <i class="fas fa-fire"></i>
          <h2>YOU'VE CAUGHT THE DEVIL!</h2>
          <i class="fas fa-fire"></i>
        </div>
        <div class="discount-body">
          <p>Congratulations! You've earned a special discount of</p>
          <div class="discount-amount">25% OFF</div>
          <p>Use this code on your next purchase:</p>
          <div class="discount-code">
            <span id="discount-code-text">DIABLOGULA25</span>
            <button id="copy-code-btn"><i class="fas fa-copy"></i></button>
          </div>
          <p class="discount-valid">Valid until 06/30/2025</p>
        </div>
        <button class="discount-btn">Use it now!</button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners to modal
    const closeBtn = modal.querySelector('.discount-close');
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    const copyBtn = modal.querySelector('#copy-code-btn');
    copyBtn.addEventListener('click', () => {
      const codeText = document.getElementById('discount-code-text').textContent;
      navigator.clipboard.writeText(codeText).then(() => {
        alert('Discount code copied to clipboard!');
      });
    });
    
    const useBtn = modal.querySelector('.discount-btn');
    useBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      window.location.href = 'menu.html';
    });
  }
  
  // Show the modal
  document.getElementById('discount-modal').style.display = 'block';
}