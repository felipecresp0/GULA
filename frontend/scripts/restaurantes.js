document.addEventListener('DOMContentLoaded', () => {
  console.log("🔥 Restaurants Page Successfully Loaded - Infernal Mode Activated");
  
  // DOM element references
  const searchToggle = document.getElementById("search-toggle");
  const searchOverlay = document.querySelector(".search-overlay");
  const closeSearch = document.querySelector(".close-search");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const form = document.getElementById('busqueda-form');
  const restaurantOverlay = document.getElementById('restaurant-details-overlay');
  const restaurantContent = document.getElementById('restaurant-details-content');
  
  // Restaurant data (simulated)
  const restaurantesData = [
    {
      id: "madrid",
      nombre: "GULA GRAN VÍA",
      direccion: "Gran Vía 41, Madrid",
      cp: "28013",
      telefono: "+34 912 555 666",
      horario: "13:00 - 00:00",
      latitud: 40.4200,
      longitud: -3.7021,
      imagen: "../imagenes/restaurantemadrid.png",
      caracteristicas: ["Parking", "WiFi", "Bar", "Terraza"],
      descripcion: "Nuestro templo del pecado en pleno corazón de Madrid. Tres plantas de hedonismo gastronómico donde cada bocado es una tentación irresistible. La planta baja acoge nuestra barra de pecados, mientras que las plantas superiores albergan mesas donde caer en la tentación sin remordimientos.",
      destacados: [
        { nombre: "LA TENTACIÓN", descripcion: "Doble carne, cheddar derretido, bacon crujiente y salsa secreta", precio: "12.95€" },
        { nombre: "LA LUJURIA", descripcion: "Carne madurada, queso brie fundido, cebolla caramelizada", precio: "13.95€" },
        { nombre: "LA IRA", descripcion: "Carne de res, jalapeños, salsa picante casera, guacamole", precio: "13.50€" }
      ]
    },
    {
      id: "barcelona",
      nombre: "GULA DIAGONAL",
      direccion: "Avinguda Diagonal 520, Barcelona",
      cp: "08006",
      telefono: "+34 933 444 555",
      horario: "12:00 - 01:00",
      latitud: 41.3954,
      longitud: 2.1570,
      imagen: "../imagenes/restaurantebarcelona.png",
      caracteristicas: ["Parking", "WiFi", "Bar", "Climatizado"],
      descripcion: "Con vistas a la emblemática Diagonal, este espacioso local de dos plantas te invita a pecar sin moderación. Decoración industrial con toques infernales y una terraza para disfrutar del pecado al aire libre. Los fines de semana la zona de bar se convierte en un punto de encuentro obligado.",
      destacados: [
        { nombre: "LA AVARICIA", descripcion: "Triple carne, triple queso, triple bacon y salsa bourbon BBQ", precio: "16.95€" },
        { nombre: "LA TENTACIÓN", descripcion: "Doble carne, cheddar derretido, bacon crujiente y salsa secreta", precio: "12.95€" },
        { nombre: "LA SOBERBIA", descripcion: "Carne Black Angus, queso de cabra, rúcula, cebolla caramelizada", precio: "15.50€" }
      ]
    },
    {
      id: "valencia",
      nombre: "GULA CIUTAT VELLA",
      direccion: "Carrer de Quart 35, Valencia",
      cp: "46001",
      telefono: "+34 961 222 333",
      horario: "13:30 - 23:30",
      latitud: 39.4758,
      longitud: -0.3822,
      imagen: "../imagenes/restaurantevalencia.png",
      caracteristicas: ["Terraza", "WiFi", "Aire acondicionado"],
      descripcion: "Situado en un edificio histórico restaurado, este local combina la tradición valenciana con nuestra estética infernal. Ladrillo visto, hierro forjado y grandes ventanales hacen de este espacio un lugar único donde sucumbir a nuestras hamburguesas. La terraza interior es perfecta para las noches de verano.",
      destacados: [
        { nombre: "LA GULA", descripcion: "Doble smash burger, queso ahumado, cebolla frita, bacon y salsa BBQ", precio: "13.95€" },
        { nombre: "LA PEREZA", descripcion: "Pulled pork 12h, coleslaw, salsa bourbon y pepinillos caseros", precio: "12.50€" },
        { nombre: "LA LUJURIA", descripcion: "Carne madurada, queso brie fundido, cebolla caramelizada", precio: "13.95€" }
      ]
    },
    {
      id: "sevilla",
      nombre: "GULA ALAMEDA",
      direccion: "Alameda de Hércules 58, Sevilla",
      cp: "41002",
      telefono: "+34 954 111 222",
      horario: "13:30 - 00:30",
      latitud: 37.3991,
      longitud: -5.9980,
      imagen: "../imagenes/restaurantesevilla.png",
      caracteristicas: ["Terraza", "Música en vivo", "Cócteles"],
      descripcion: "Nuestro rincón andaluz del pecado, ubicado en la vibrante Alameda. Decoración con toques flamencohell que combina tradición sevillana y estética infernal. Disfruta de nuestras hamburguesas mientras te deleitas con actuaciones en directo los jueves y viernes por la noche.",
      destacados: [
        { nombre: "LA ENVIDIA", descripcion: "Pollo crujiente, aguacate, bacon, queso gouda y salsa siracha-mayo", precio: "11.95€" },
        { nombre: "LA IRA", descripcion: "Carne de res, jalapeños, salsa picante casera, guacamole", precio: "13.50€" },
        { nombre: "LA TENTACIÓN", descripcion: "Doble carne, cheddar derretido, bacon crujiente y salsa secreta", precio: "12.95€" }
      ]
    },
    {
      id: "zaragoza",
      nombre: "GULA ARAGÓN",
      direccion: "Plaza San Francisco 17, Zaragoza",
      cp: "50006",
      telefono: "+34 976 333 444",
      horario: "13:00 - 23:30",
      latitud: 41.6457,
      longitud: -0.8878,
      imagen: "../imagenes/restaurantezaragoza.png",
      caracteristicas: ["Parking", "WiFi", "Zona infantil"],
      descripcion: "Local de diseño vanguardista con grandes espacios y una zona para los más pequeños. Nuestra carta incluye exclusivas para este local con hamburguesas inspiradas en los sabores aragoneses, donde la materia prima local se fusiona con nuestro espíritu transgresor.",
      destacados: [
        { nombre: "LA ARAGONESA", descripcion: "Carne de ternera del Pirineo, queso de Radiquero, jamón de Teruel", precio: "14.50€" },
        { nombre: "LA TENTACIÓN", descripcion: "Doble carne, cheddar derretido, bacon crujiente y salsa secreta", precio: "12.95€" },
        { nombre: "LA GULA", descripcion: "Doble smash burger, queso ahumado, cebolla frita, bacon y salsa BBQ", precio: "13.95€" }
      ]
    }
  ];
  
  // Initialize map with custom style
  const mapa = L.map('restaurantes-mapa').setView([40.4168, -3.7038], 5); // Centered on Spain
  
  // Custom style for the map
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(mapa);
  
  // Create custom icon for markers
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-icon"><i class="fas fa-fire"></i></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });
  
  // Add restaurant markers to the map
  restaurantesData.forEach(restaurant => {
    const marker = L.marker([restaurant.latitud, restaurant.longitud], { icon: customIcon }).addTo(mapa);
    
    // Create custom content for popup
    const popupContent = `
      <div class="restaurant-popup">
        <h3>${restaurant.nombre}</h3>
        <p>${restaurant.direccion}</p>
        <p>Horario: ${restaurant.horario}</p>
        <button class="popup-reserve-btn" data-id="${restaurant.id}">Ver detalles</button>
      </div>
    `;
    
    marker.bindPopup(popupContent);
    
    // Add event to popup
    marker.on('popupopen', function() {
      document.querySelector('.popup-reserve-btn').addEventListener('click', function() {
        const restaurantId = this.getAttribute('data-id');
        mostrarDetallesRestaurante(restaurantId);
      });
    });
  });
  
  // Visual effect when loading the page
  setTimeout(() => {
    const pulseRings = document.querySelector('.pulse-rings');
    if (pulseRings) {
      pulseRings.style.display = 'block';
    }
  }, 1000);
  
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
  
  // Handle postal code search
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const cp = document.getElementById('codigo-postal').value;
      
      try {
        // In a real environment, this would make an API call
        // For now we filter the simulated data
        const restaurantesCercanos = restaurantesData.filter(r => {
          return r.cp.startsWith(cp.substring(0, 2)); // Simple simulation
        });
        
        if (restaurantesCercanos.length === 0) {
          // Create custom notification
          mostrarNotificacion("No restaurants found in your area. Try a different postal code.", "error");
          return;
        }
        
        // Clear previous markers
        mapa.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            mapa.removeLayer(layer);
          }
        });
        
        // Add new markers
        restaurantesCercanos.forEach(restaurant => {
          const marker = L.marker([restaurant.latitud, restaurant.longitud], { icon: customIcon }).addTo(mapa);
          
          const popupContent = `
            <div class="restaurant-popup">
              <h3>${restaurant.nombre}</h3>
              <p>${restaurant.direccion}</p>
              <p>Horario: ${restaurant.horario}</p>
              <button class="popup-reserve-btn" data-id="${restaurant.id}">Ver detalles</button>
            </div>
          `;
          
          marker.bindPopup(popupContent);
          
          marker.on('popupopen', function() {
            document.querySelector('.popup-reserve-btn').addEventListener('click', function() {
              const restaurantId = this.getAttribute('data-id');
              mostrarDetallesRestaurante(restaurantId);
            });
          });
        });
        
        // Zoom to first restaurant found
        if (restaurantesCercanos.length > 0) {
          mapa.setView([restaurantesCercanos[0].latitud, restaurantesCercanos[0].longitud], 13);
          
          // Show success notification
          mostrarNotificacion(`Found ${restaurantesCercanos.length} restaurants in your area.`, "success");
        }
        
      } catch (error) {
        console.error('Error searching restaurants:', error);
        mostrarNotificacion('There was an error searching for restaurants.', "error");
      }
    });
  }
  
  // Events for featured restaurants
  const reserveBtns = document.querySelectorAll('.reserve-btn');
  reserveBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const restaurantId = this.getAttribute('data-restaurant');
      window.location.href = `reservas.html?restaurante=${restaurantId}`;
    });
  });
  
  // Handle restaurant details overlay
  function mostrarDetallesRestaurante(restaurantId) {
    const restaurant = restaurantesData.find(r => r.id === restaurantId);
    
    if (!restaurant) return;
    
    // Build overlay content
    const caracteristicasHTML = restaurant.caracteristicas
      .map(c => `<span><i class="fas fa-check"></i> ${c}</span>`)
      .join('');
    
    const destacadosHTML = restaurant.destacados
      .map(item => `
        <div class="menu-item">
          <h4>${item.nombre}</h4>
          <p>${item.descripcion}</p>
          <p class="menu-item-price">${item.precio}</p>
        </div>
      `)
      .join('');
    
    restaurantContent.innerHTML = `
      <div class="restaurant-detail-header">
        <img src="${restaurant.imagen}" alt="${restaurant.nombre}" class="detail-image">
        <div class="detail-header-info">
          <h2>${restaurant.nombre}</h2>
          <p><i class="fas fa-map-marker-alt"></i> ${restaurant.direccion}</p>
          <p><i class="fas fa-phone"></i> ${restaurant.telefono}</p>
          <p><i class="fas fa-clock"></i> ${restaurant.horario}</p>
          <div class="restaurant-features">
            ${caracteristicasHTML}
          </div>
        </div>
      </div>
      
      <div class="detail-info-grid">
        <div class="detail-info-block">
          <h3><i class="fas fa-info-circle"></i> Sobre el local</h3>
          <p>${restaurant.descripcion}</p>
        </div>
      </div>
      
      <div class="detail-menu-preview">
        <h3><i class="fas fa-utensils"></i> Destacados del menú</h3>
        <div class="menu-items">
          ${destacadosHTML}
        </div>
      </div>
      
      <a href="reservas.html?restaurante=${restaurant.id}" class="detail-reserve-btn">RESERVAR MESA AHORA</a>
    `;
    
    // Show overlay
    restaurantOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Setup overlay close
    document.querySelector('.close-overlay').addEventListener('click', function() {
      restaurantOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // Show custom notifications
  function mostrarNotificacion(mensaje, tipo) {
    // Remove existing notifications
    const notificacionesExistentes = document.querySelectorAll('.notificacion');
    notificacionesExistentes.forEach(n => n.remove());
    
    // Create notification element
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    
    let iconoHTML = tipo === 'success' 
      ? '<i class="fas fa-check-circle"></i>' 
      : '<i class="fas fa-exclamation-circle"></i>';
    
    notificacion.innerHTML = `
      <div class="notificacion-contenido">
        ${iconoHTML}
        <p>${mensaje}</p>
      </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notificacion);
    
    // Show with animation
    setTimeout(() => {
      notificacion.classList.add('show');
    }, 10);
    
    // Hide after 4 seconds
    setTimeout(() => {
      notificacion.classList.remove('show');
      setTimeout(() => {
        notificacion.remove();
      }, 300);
    }, 4000);
  }
  
  // Create fire particle effect
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
  
  // Initialize scroll animations
  const elements = document.querySelectorAll('.intro-section, .featured-restaurants, .restaurant-info-section');
  
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
  
  // Start fire effect
  createFireEffect();
  
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
  
  // Add CSS styles for notifications
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .notificacion {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #333;
      color: white;
      padding: 15px;
      border-radius: 4px;
      z-index: 2001;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    }
    
    .notificacion.show {
      opacity: 1;
      transform: translateY(0);
    }
    
    .notificacion-contenido {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .notificacion-contenido i {
      font-size: 1.5rem;
    }
    
    .notificacion.success {
      border-left: 4px solid var(--secondary-color);
    }
    
    .notificacion.success i {
      color: var(--secondary-color);
    }
    
    .notificacion.error {
      border-left: 4px solid var(--primary-color);
    }
    
    .notificacion.error i {
      color: var(--primary-color);
    }
    
    .fire-particle {
      position: fixed;
      pointer-events: none;
      width: 10px;
      height: 10px;
      background-color: var(--primary-color);
      border-radius: 50%;
      opacity: 0;
      z-index: 1;
      animation: float-up 3s ease-out;
    }
    
    @keyframes float-up {
      0% {
        transform: translateY(0) scale(1);
        opacity: 0.8;
      }
      100% {
        transform: translateY(-100px) scale(0);
        opacity: 0;
      }
    }
    
    /* Mobile navigation styles */
    @media (max-width: 767px) {
      .nav-links {
        position: fixed;
        top: 0;
        left: -100%;
        width: 280px;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.95);
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        transition: left 0.3s ease;
        z-index: 2000;
        border-right: 2px solid var(--primary-color);
        box-shadow: 0 0 30px rgba(255, 0, 102, 0.5);
      }
      
      .nav-links.active {
        left: 0;
      }
      
      .nav-links a {
        font-size: 1.5rem;
        padding: 1rem;
        width: 100%;
        text-align: center;
        border-bottom: 1px solid rgba(255, 0, 102, 0.3);
      }
      
      .close-menu {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: var(--primary-color);
        font-size: 1.5rem;
        cursor: pointer;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
});

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