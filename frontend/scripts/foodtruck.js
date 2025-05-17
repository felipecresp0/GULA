document.addEventListener("DOMContentLoaded", () => {
  console.log("🔥 Página FoodTruck cargada correctamente - Modo Infernal activado");
  
  // Referencias a elementos DOM
  const searchToggle = document.getElementById("search-toggle");
  const searchOverlay = document.querySelector(".search-overlay");
  const closeSearch = document.querySelector(".close-search");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  
  // Datos de próximas paradas del foodtruck - con info más detallada
  const paradasFoodtruck = [
    {
      ciudad: "Madrid",
      fecha: "12 de mayo",
      img: "../imagenes/madrid.webp",
      ubicacion: "Mercado de San Miguel",
      horario: "18:00 - 00:00"
    },
    {
      ciudad: "Valencia",
      fecha: "20 de mayo",
      img: "../imagenes/valencia.jpg",
      ubicacion: "Plaza de la Reina",
      horario: "19:00 - 01:00"
    },
    {
      ciudad: "Sevilla",
      fecha: "5 de junio",
      img: "../imagenes/sevilla.jpg",
      ubicacion: "Parque de María Luisa",
      horario: "18:30 - 23:30"
    },
    {
      ciudad: "Barcelona",
      fecha: "15 de junio",
      img: "../imagenes/barcelona.webp",
      ubicacion: "Playa de la Barceloneta",
      horario: "19:00 - 02:00"
    },
    {
      ciudad: "Zaragoza",
      fecha: "30 de junio",
      img: "../imagenes/zaragoza.jpg",
      ubicacion: "Plaza del Pilar",
      horario: "18:00 - 23:00"
    }
  ];
  
  // Funcionalidad Search Overlay
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
  }
  
  // Funcionalidad del menú móvil
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
  
  // Carrusel mejorado con selección clara y automática
  initImprovedCarousel();
  
  // Animaciones al scroll
  const elementos = document.querySelectorAll('.foodtruck-showcase, .foodtruck-info, .upcoming-stops, .book-foodtruck');
  
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
  
  elementos.forEach(elemento => {
    elemento.classList.add('animate-on-scroll');
    observer.observe(elemento);
  });
  
  // Inicializar contadores de carrito
  const cartCountElement = document.querySelector('.cart-count');
  if (cartCountElement) {
    updateCartCount();
  }
  
  // Añadir efectos hover a la navegación
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
  
  // Crear efecto de partículas de fuego
  crearEfectoFuego();
  
  // Efecto neón aleatorio en elementos del header
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

// Función para el carrusel mejorado
function initImprovedCarousel() {
  const track = document.getElementById('paradas-foodtruck');
  if (!track) return;
  
  const paradasFoodtruck = [
    {
      ciudad: "Madrid",
      fecha: "12 de mayo",
      img: "../imagenes/madrid.webp",
      ubicacion: "Mercado de San Miguel",
      horario: "18:00 - 00:00"
    },
    {
      ciudad: "Valencia",
      fecha: "20 de mayo",
      img: "../imagenes/valencia.jpg",
      ubicacion: "Plaza de la Reina",
      horario: "19:00 - 01:00"
    },
    {
      ciudad: "Sevilla",
      fecha: "5 de junio",
      img: "../imagenes/sevilla.jpg",
      ubicacion: "Parque de María Luisa",
      horario: "18:30 - 23:30"
    },
    {
      ciudad: "Barcelona",
      fecha: "15 de junio",
      img: "../imagenes/barcelona.webp",
      ubicacion: "Playa de la Barceloneta",
      horario: "19:00 - 02:00"
    },
    {
      ciudad: "Zaragoza",
      fecha: "30 de junio",
      img: "../imagenes/zaragoza.jpg",
      ubicacion: "Plaza del Pilar",
      horario: "18:00 - 23:00"
    }
  ];
  
  // Crear items del carrusel
  paradasFoodtruck.forEach((parada, index) => {
    const card = document.createElement("div");
    card.className = "carousel-item";
    card.dataset.index = index;
    
    card.innerHTML = `
      <img src="${parada.img}" alt="${parada.ciudad}" class="item-image" />
      <h3 class="item-title">${parada.ciudad}</h3>
      <p class="item-price">${parada.fecha}</p>
      <p class="item-location"><i class="fas fa-map-marker-alt"></i> ${parada.ubicacion}</p>
      <p class="item-location"><i class="fas fa-clock"></i> ${parada.horario}</p>
      <button class="order-btn" data-ciudad="${parada.ciudad}" data-fecha="${parada.fecha}">RESERVAR</button>
    `;
    
    track.appendChild(card);
  });
  
  // Agregar listeners a botones de reserva
  const reservarBtns = track.querySelectorAll('.order-btn');
  reservarBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const ciudad = this.getAttribute('data-ciudad');
      const fecha = this.getAttribute('data-fecha');
      reservarParada(ciudad, fecha);
    });
  });
  
  // Variables del carrusel
  const items = track.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const itemWidth = 320; // Ancho + margen del item
  const totalItems = items.length;
  let currentIndex = 0;
  let isTransitioning = false;
  let autoplayInterval;
  
  // Función para actualizar la posición del carrusel
  function updateCarousel(withAnimation = true) {
    if (isTransitioning) return;
    
    // Calcular desplazamiento para centrar el elemento actual
    const trackWidth = track.offsetWidth;
    const centerOffset = (trackWidth - itemWidth) / 2;
    const newPosition = (currentIndex * -itemWidth) + centerOffset;
    
    // Aplicar transición o no según el parámetro
    if (withAnimation) {
      isTransitioning = true;
      track.style.transition = 'transform 0.5s ease-out';
    } else {
      track.style.transition = 'none';
    }
    
    track.style.transform = `translateX(${newPosition}px)`;
    
    // Actualizar clases activas
    items.forEach((item, i) => {
      if (i === currentIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    
    // Restablecer la transición después
    if (!withAnimation) {
      setTimeout(() => {
        track.style.transition = 'transform 0.5s ease-out';
      }, 50);
    }
  }
  
  // Event listener para finalizar transición
  track.addEventListener('transitionend', () => {
    isTransitioning = false;
  });
  
  // Inicializar el carrusel
  updateCarousel(false);
  
  // Avanzar al siguiente elemento automáticamente
  function startAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    
    autoplayInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalItems;
      updateCarousel();
    }, 3000); // Cambiar cada 3 segundos
  }
  
  // Pausar autoplay cuando el ratón está sobre el carrusel
  const carouselContainer = track.closest('.carousel-container');
  carouselContainer.addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
  });
  
  carouselContainer.addEventListener('mouseleave', () => {
    startAutoplay();
  });
  
  // Botones de navegación
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
  
  // Iniciar autoplay
  startAutoplay();
}

// Función para crear el efecto de partículas de fuego
function crearEfectoFuego() {
  setInterval(() => {
    // Crear partícula
    const particle = document.createElement('div');
    particle.className = 'fire-particle';
    
    // Posición random en la parte inferior de la pantalla
    const posX = Math.random() * window.innerWidth;
    particle.style.left = `${posX}px`;
    particle.style.bottom = '0';
    
    // Color random entre rojo y naranja
    const hue = Math.floor(Math.random() * 30);
    const saturation = 90 + Math.floor(Math.random() * 10);
    const lightness = 50 + Math.floor(Math.random() * 10);
    particle.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    // Tamaño random
    const size = 5 + Math.random() * 10;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Añadir al DOM
    document.body.appendChild(particle);
    
    // Eliminar después de la animación
    setTimeout(() => {
      particle.remove();
    }, 3000);
  }, 300);
}

// Función para reservar parada de foodtruck - ahora redirige a reservar.html
function reservarParada(ciudad, fecha) {
  // Guardar información de reserva en sessionStorage
  sessionStorage.setItem('ciudad_reserva', ciudad);
  sessionStorage.setItem('fecha_reserva', fecha);
  
  // Redireccionar a la página de reserva
  window.location.href = 'reservar.html';
}

// Actualizar contador del carrito
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCountElement = document.querySelector('.cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cart.length;
    
    // Agregar clase de resaltado si hay elementos
    if (cart.length > 0) {
      cartCountElement.classList.add('highlighted');
    } else {
      cartCountElement.classList.remove('highlighted');
    }
  }
}