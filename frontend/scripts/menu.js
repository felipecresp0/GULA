document.addEventListener('DOMContentLoaded', () => {
  console.log("🔥 GULA: Los 7 Pecados Capitales del Sabor - Menú v2.0");

  // Variables globales
  const token = localStorage.getItem('token') || null;
  const searchIcon = document.querySelector('.search-icon');
  const searchOverlay = document.querySelector('.search-overlay');
  const closeSearch = document.querySelector('.close-search');
  const searchInput = document.querySelector('.search-input-overlay');
  const menuToggle = document.querySelector('.menu-toggle');
  const btnCarrito = document.querySelector('.cart-icon');
  const contadorCarrito = document.querySelector('.cart-count');
  
  // Inicializar componentes
  initAnimations();
  setupSearchOverlay();
  setupMobileMenu();
  setupSinsCarousel();
  setupCategoryCards();
  setupAddToCartButtons();
  setupNewsletter();
  setupFloatingEmbers();
  setupParallaxEffects();
  setupCartFunctionality();

  // Inicialización de efectos
  function initAnimations() {
    // Animaciones de entrada
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    // Elementos a animar en scroll
    document.querySelectorAll('.featured-section, .menu-intro, .categories-section, .newsletter, .menu-cta').forEach(el => {
      el.classList.add('animate-ready');
      observer.observe(el);
    });

    // Simular carga para entrada gradual de elementos
    document.body.classList.add('page-loaded');
    
    // Animar flamas del hero
    animateHeroFlames();
    
    // Letrero efecto glitch
    setupGlitchEffect();
  }

  // Configuración de efectos parallax
  function setupParallaxEffects() {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      
      // Parallax en hero
      const hero = document.querySelector('.menu-hero');
      if (hero) {
        hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
      
      // Parallax en elementos de flama
      const flames = document.querySelectorAll('.flame');
      flames.forEach((flame, index) => {
        const speed = 0.2 + (index * 0.1);
        flame.style.transform = `translateY(${scrollPosition * speed}px)`;
      });

      // Parallax en elementos flotantes
      const embers = document.querySelectorAll('.floating-ember');
      embers.forEach((ember, index) => {
        const speed = 0.1 + (index * 0.05);
        ember.style.transform = `translateY(${-scrollPosition * speed}px)`;
      });
      
      // Rotar elementos de tarjetas al hacer scroll
      document.querySelectorAll('.sin-card').forEach((card, index) => {
        const rotateAmount = (scrollPosition * 0.01) % 5;
        const direction = index % 2 === 0 ? 1 : -1;
        card.style.transform = `perspective(1000px) rotateY(${rotateAmount * direction}deg)`;
      });
    });
  }

  // Animaciones para las flamas del hero
  function animateHeroFlames() {
    const flames = document.querySelectorAll('.flame');
    
    flames.forEach((flame, index) => {
      // Posición aleatoria horizontal
      const randomX = Math.floor(Math.random() * 80) + 10; // Entre 10% y 90%
      flame.style.left = `${randomX}%`;
      
      // Tamaño aleatorio
      const randomSize = Math.floor(Math.random() * 100) + 150; // Entre 150px y 250px
      flame.style.width = `${randomSize}px`;
      flame.style.height = `${randomSize * 1.5}px`;
      
      // Demora aleatoria en la animación
      const randomDelay = Math.random() * 3;
      flame.style.animationDelay = `${randomDelay}s`;
      
      // Duración aleatoria de la animación
      const randomDuration = Math.random() * 2 + 3; // Entre 3s y 5s
      flame.style.animationDuration = `${randomDuration}s`;
    });
  }

  // Configuración del efecto glitch
  function setupGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    glitchElements.forEach(element => {
      // Configurar intervalo para activar el efecto ocasionalmente
      setInterval(() => {
        element.classList.add('active-glitch');
        setTimeout(() => {
          element.classList.remove('active-glitch');
        }, 1000);
      }, Math.random() * 5000 + 5000); // Entre 5s y 10s
    });
  }

  // Configuración del buscador
  function setupSearchOverlay() {
    if (!searchIcon || !searchOverlay || !closeSearch) return;

    // Abrir búsqueda con efecto
    searchIcon.addEventListener('click', () => {
      document.body.classList.add('overlay-open');
      searchOverlay.classList.add('active');
      setTimeout(() => {
        searchInput.focus();
      }, 300);
    });

    // Cerrar búsqueda con efecto
    closeSearch.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
      setTimeout(() => {
        document.body.classList.remove('overlay-open');
      }, 300);
    });

    // Cerrar búsqueda con ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
        setTimeout(() => {
          document.body.classList.remove('overlay-open');
        }, 300);
      }
    });

    // Animación del placeholder
    const placeholders = [
      "¿Buscas una hamburguesa?",
      "¿Quieres probar La Lujuria?",
      "¿Te atreves con La Ira?",
      "¿Hambre de pecar?",
      "¿Qué pecado te tienta hoy?",
      "¿Buscas acompañamientos?",
      "¿Algo para beber?"
    ];
    
    let placeholderIndex = 0;
    setInterval(() => {
      searchInput.setAttribute('placeholder', placeholders[placeholderIndex]);
      placeholderIndex = (placeholderIndex + 1) % placeholders.length;
    }, 3000);

    // Enviar búsqueda
    searchOverlay.querySelector('.search-box').addEventListener('submit', e => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        // Animación de búsqueda
        searchInput.style.transition = 'all 0.3s ease';
        searchInput.style.transform = 'scale(1.05)';
        searchInput.style.boxShadow = '0 0 30px var(--primary-color)';
        
        setTimeout(() => {
          searchInput.style.transform = '';
          searchInput.style.boxShadow = '';
          
          // Cerrar overlay y mostrar notificación
          searchOverlay.classList.remove('active');
          setTimeout(() => {
            document.body.classList.remove('overlay-open');
            mostrarNotificacion(`Buscando: "${query}"`, 'info');
            // Aquí implementarías la redirección a resultados de búsqueda
          }, 300);
        }, 500);
      }
    });
  }

  // Configuración del menú móvil
  function setupMobileMenu() {
    if (!menuToggle) return;

    // Crear menú móvil si no existe
    let mobileMenu = document.querySelector('.mobile-menu');
    if (!mobileMenu) {
      mobileMenu = document.createElement('div');
      mobileMenu.className = 'mobile-menu';
      mobileMenu.innerHTML = `
        <div class="mobile-menu-inner">
          <button class="close-menu"><i class="fas fa-times"></i></button>
          <div class="mobile-logo">
            <img src="imagenes/logo.png" alt="Logo Gula" />
          </div>
          <nav class="mobile-nav">
            <a href="index.html">Home</a>
            <a href="menu.html" class="active">Burgers</a>
            <a href="foodtruck.html">FoodTruck</a>
            <a href="restaurantes.html">Restaurantes</a>
          </nav>
          <div class="mobile-actions">
            <button class="sign-in-btn" onclick="location.href='acceso.html'">INICIA SESIÓN</button>
          </div>
          <div class="mobile-social">
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
          </div>
        </div>
      `;
      document.body.appendChild(mobileMenu);
    }

    // Toggle del menú móvil con animación
    menuToggle.addEventListener('click', () => {
      document.body.classList.add('menu-open');
      mobileMenu.classList.add('active');
      
      // Animar entrada de elementos
      const items = mobileMenu.querySelectorAll('.mobile-nav a, .mobile-actions button, .mobile-social a');
      items.forEach((item, index) => {
        item.style.transitionDelay = `${0.1 + (index * 0.05)}s`;
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 100);
      });
    });

    // Cerrar menú móvil
    mobileMenu.querySelector('.close-menu').addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      setTimeout(() => {
        document.body.classList.remove('menu-open');
      }, 300);
    });

    // Cerrar menú móvil al hacer clic fuera
    document.addEventListener('click', e => {
      if (mobileMenu.classList.contains('active') && 
          !mobileMenu.contains(e.target) && 
          e.target !== menuToggle &&
          !menuToggle.contains(e.target)) {
        mobileMenu.classList.remove('active');
        setTimeout(() => {
          document.body.classList.remove('menu-open');
        }, 300);
      }
    });
  }

  // Configuración del carrusel de los 7 Pecados
  function setupSinsCarousel() {
    const sinsCarousel = new Swiper('.sins-carousel', {
      slidesPerView: 1,
      spaceBetween: 30,
      grabCursor: true,
      centeredSlides: true,
      loop: true,
      speed: 800,
      effect: 'coverflow',
      coverflowEffect: {
        rotate: 10,
        stretch: 0,
        depth: 200,
        modifier: 1,
        slideShadows: false,
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.sins-pagination',
        clickable: true,
        dynamicBullets: true,
        renderBullet: function (index, className) {
          return `<span class="${className} sin-bullet" data-index="${index}"></span>`;
        }
      },
      navigation: {
        nextEl: '.sins-button-next',
        prevEl: '.sins-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 1.5,
        },
        992: {
          slidesPerView: 2.5,
        },
        1200: {
          slidesPerView: 3,
        }
      },
      on: {
        slideChange: function() {
          animateActiveSlide(this);
        },
        init: function() {
          animateActiveSlide(this);
          
          // Personalizar paginación
          setTimeout(() => {
            document.querySelectorAll('.sin-bullet').forEach((bullet, index) => {
              const sinNumber = index + 1;
              bullet.innerHTML = `<span>${sinNumber}</span>`;
              
              // Agregar icono según el pecado
              const icons = ['utensils', 'heart', 'fire', 'crown', 'moon', 'leaf', 'coins'];
              if (index < icons.length) {
                const icon = document.createElement('i');
                icon.className = `fas fa-${icons[index]}`;
                bullet.appendChild(icon);
              }
            });
          }, 100);
        }
      }
    });

    // Función para animar el slide activo
    function animateActiveSlide(swiper) {
      // Eliminar clases previas
      document.querySelectorAll('.swiper-slide').forEach(slide => {
        slide.classList.remove('animate-slide');
      });

      // Aplicar efectos al slide activo
      setTimeout(() => {
        const activeSlide = swiper.slides[swiper.activeIndex];
        if (activeSlide) {
          activeSlide.classList.add('animate-slide');
          
          // Animar elementos dentro del slide
          const sinCard = activeSlide.querySelector('.sin-card');
          const badge = activeSlide.querySelector('.sin-badge');
          const title = activeSlide.querySelector('.sin-title');
          const price = activeSlide.querySelector('.sin-price');
          
          if (sinCard) {
            // Efecto de resplandor
            sinCard.style.animation = 'none';
            sinCard.offsetHeight; // Reflow
            sinCard.style.animation = 'glow-pulse 3s infinite';
          }
          
          if (badge) {
            // Efecto de badge
            badge.style.animation = 'none';
            badge.offsetHeight;
            badge.style.animation = 'badge-pulse 2s infinite';
          }
          
          if (title) {
            // Efecto del título
            title.style.animation = 'none';
            title.offsetHeight;
            title.style.animation = 'text-glow 2s infinite alternate';
          }
          
          if (price) {
            // Efecto del precio
            price.style.animation = 'none';
            price.offsetHeight;
            price.style.animation = 'price-pop 2s infinite alternate';
          }
          
          // Mostrar detalles
          const detailsContainer = activeSlide.querySelector('.hover-details');
          if (detailsContainer) {
            const details = detailsContainer.querySelectorAll('.ingredient');
            details.forEach((detail, index) => {
              detail.style.animation = 'none';
              detail.offsetHeight;
              detail.style.animation = `fade-in-right 0.5s ${index * 0.1}s forwards`;
            });
          }
        }
      }, 100);
    }

    // Efectos al interactuar con las flechas
    document.querySelectorAll('.sins-button-next, .sins-button-prev').forEach(button => {
      button.addEventListener('mouseenter', () => {
        const arrow = button.querySelector('.neon-arrow');
        if (arrow) {
          arrow.classList.add('glow-intense');
        }
      });
      
      button.addEventListener('mouseleave', () => {
        const arrow = button.querySelector('.neon-arrow');
        if (arrow) {
          arrow.classList.remove('glow-intense');
        }
      });
      
      button.addEventListener('click', () => {
        const arrow = button.querySelector('.neon-arrow');
        if (arrow) {
          arrow.classList.add('pulse');
          setTimeout(() => arrow.classList.remove('pulse'), 500);
        }
      });
    });
  }

  // Configuración de las tarjetas de categorías
  function setupCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
      // Añadir efecto de hover 3D
      card.addEventListener('mousemove', e => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Calcular distancia desde el centro
        const distanceX = mouseX - cardCenterX;
        const distanceY = mouseY - cardCenterY;
        
        // Calcular rotación (limitada a 10 grados)
        const rotateY = Math.min(Math.max((distanceX / cardRect.width) * 20, -10), 10);
        const rotateX = Math.min(Math.max(-(distanceY / cardRect.height) * 20, -10), 10);
        
        // Aplicar transformación
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      });
      
      // Restablecer al salir
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      });
      
      // Efecto de clic
      card.addEventListener('click', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(0.95)';
        setTimeout(() => {
          card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        }, 200);
      });
    });
  }

  // Configuración botones de añadir al carrito
  function setupAddToCartButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        
        // Obtener información del producto
        const sinCard = btn.closest('.sin-card');
        const sinTitle = sinCard.querySelector('.sin-title')?.textContent;
        const sinPrice = sinCard.querySelector('.sin-price')?.textContent;
        const sinType = sinCard.getAttribute('data-sin');
        
        // Vibración táctil (en dispositivos que lo soporten)
        if (window.navigator.vibrate) {
          window.navigator.vibrate(100);
        }
        
        // Efectos visuales
        btn.classList.add('btn-pulse');
        sinCard.classList.add('card-added');
        
        // Animación de "vuelo" hacia el carrito
        const flyingElement = document.createElement('div');
        flyingElement.className = 'flying-item';
        flyingElement.innerHTML = `<i class="fas fa-hamburger"></i>`;
        document.body.appendChild(flyingElement);
        
        // Posicionar elemento volador
        const btnRect = btn.getBoundingClientRect();
        const cartIconRect = document.querySelector('.cart-icon').getBoundingClientRect();
        
        flyingElement.style.top = `${btnRect.top}px`;
        flyingElement.style.left = `${btnRect.left}px`;
        
        // Animar vuelo
        setTimeout(() => {
          flyingElement.style.top = `${cartIconRect.top}px`;
          flyingElement.style.left = `${cartIconRect.left}px`;
          flyingElement.style.opacity = '0';
          flyingElement.style.transform = 'scale(0.2)';
        }, 10);
        
        setTimeout(() => {
          flyingElement.remove();
          
          // Resetear botón
          btn.classList.remove('btn-pulse');
          sinCard.classList.remove('card-added');
          
          // Actualizar contador y mostrar notificación
          actualizarContadorCarrito(1);
          mostrarNotificacion(`${sinTitle} añadido al carrito`, 'success');
        }, 700);
      });
    });
  }

  // Configuración del carrito
  function setupCartFunctionality() {
    const btnCart = document.querySelector('.cart-icon');
    const cartDropdown = document.getElementById('carrito-desplegable');
    
    if (!btnCart || !cartDropdown) return;
    
    // Abrir/cerrar carrito
    btnCart.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      
      toggleCarrito();
      
      if (cartDropdown.classList.contains('mostrar')) {
        cargarResumenCarrito();
      }
    });
    
    // Cerrar carrito con botón
    const closeCartButton = cartDropdown.querySelector('.carrito-close');
    if (closeCartButton) {
      closeCartButton.addEventListener('click', () => {
        cartDropdown.classList.remove('mostrar');
      });
    }
    
    // Cerrar carrito al hacer clic fuera
    document.addEventListener('click', e => {
      if (cartDropdown.classList.contains('mostrar') && 
          !cartDropdown.contains(e.target) && 
          e.target !== btnCart &&
          !btnCart.contains(e.target)) {
        cartDropdown.classList.remove('mostrar');
      }
    });
    
    // Vaciar carrito
    const btnVaciar = cartDropdown.querySelector('.btn-vaciar');
    if (btnVaciar) {
      btnVaciar.addEventListener('click', e => {
        e.preventDefault();
        
        // Añadir confirmación
        if (!confirm('¿Estás seguro de vaciar tu carrito?')) return;
        
        // Animación de vaciado
        const items = cartDropdown.querySelectorAll('.carrito-item');
        
        // Si hay items, animarlos saliendo
        if (items.length > 0) {
          items.forEach((item, index) => {
            setTimeout(() => {
              item.style.transform = 'translateX(100%)';
              item.style.opacity = '0';
            }, index * 100);
          });
          
          // Esperar a que termine la animación
          setTimeout(() => {
            document.getElementById('lista-carrito').innerHTML = 
              '<li class="carrito-empty">Tu carrito está vacío</li>';
            document.getElementById('carrito-total').textContent = '0.00';
            contadorCarrito.textContent = '0';
            contadorCarrito.style.display = 'none';
            mostrarNotificacion('Carrito vaciado correctamente', 'success');
          }, items.length * 100 + 300);
        }
      });
    }
    
    // Inicializar contador
    actualizarContadorCarrito();
  }

  // Función para alternar visibilidad del carrito
  function toggleCarrito() {
    const carritoDesp = document.getElementById('carrito-desplegable');
    
    if (carritoDesp) {
      // Si ya está abierto, cerrarlo con animación
      if (carritoDesp.classList.contains('mostrar')) {
        carritoDesp.style.transform = 'translateY(0)';
        carritoDesp.style.opacity = '1';
        
        setTimeout(() => {
          carritoDesp.style.transform = 'translateY(-20px)';
          carritoDesp.style.opacity = '0';
          
          setTimeout(() => {
            carritoDesp.classList.remove('mostrar');
            carritoDesp.style.transform = '';
            carritoDesp.style.opacity = '';
          }, 300);
        }, 10);
      } 
      // Si está cerrado, abrirlo con animación
      else {
        carritoDesp.classList.add('mostrar');
        carritoDesp.style.transform = 'translateY(-20px)';
        carritoDesp.style.opacity = '0';
        
        setTimeout(() => {
          carritoDesp.style.transform = 'translateY(0)';
          carritoDesp.style.opacity = '1';
        }, 10);
      }
    }
  }

  // Cargar resumen del carrito
  function cargarResumenCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('carrito-total');
    
    // Comprobar si el usuario está autenticado
    if (!token) {
      listaCarrito.innerHTML = '<li class="carrito-empty">Inicia sesión para ver tu carrito</li>';
      if (totalCarrito) totalCarrito.textContent = '0.00';
      return;
    }
    
    // Mostrar animación de carga
    listaCarrito.innerHTML = `
      <li class="carrito-loading">
        <div class="loader-container">
          <div class="loader-flame"></div>
          <span>Cargando carrito...</span>
        </div>
      </li>`;
    
    // Simulamos una carga de carrito (en un proyecto real, esto llamaría a tu API)
    setTimeout(() => {
      // Datos de ejemplo - Los 7 pecados
      const cartItems = [
        { id: 1, nombre: 'LA GULA', cantidad: 1, precio: 13.95, imagen: 'la-gula.jpg' },
        { id: 2, nombre: 'LA LUJURIA', cantidad: 1, precio: 14.95, imagen: 'la-lujuria.jpg' },
        { id: 3, nombre: 'LA IRA', cantidad: 1, precio: 13.50, imagen: 'la-ira.jpg' }
      ];
      
      if (!cartItems.length) {
        listaCarrito.innerHTML = '<li class="carrito-empty">Tu carrito está vacío</li>';
        if (totalCarrito) totalCarrito.textContent = '0.00';
        return;
      }
      
      listaCarrito.innerHTML = '';
      let total = 0;
      
      // Añadir items con animación secuencial
      cartItems.forEach((item, index) => {
        const precio = parseFloat(item.precio);
        total += precio * item.cantidad;
        
        const li = document.createElement('li');
        li.className = 'carrito-item';
        li.style.opacity = '0';
        li.style.transform = 'translateX(20px)';
        li.innerHTML = `
          <div class="item-img">
            <img src="imagenes/${item.imagen}" alt="${item.nombre}">
          </div>
          <div class="item-info">
            <span class="item-nombre">${item.nombre}</span>
            <span class="item-cantidad">x${item.cantidad}</span>
          </div>
          <span class="item-precio">${precio.toFixed(2)} €</span>
          <button class="btn-eliminar" data-id="${item.id}"><i class="fas fa-times"></i></button>
        `;
        
        li.querySelector('.btn-eliminar')?.addEventListener('click', e => {
          e.preventDefault();
          eliminarDelCarrito(item.id);
        });
        
        listaCarrito.appendChild(li);
        
        // Animación secuencial de entrada
        setTimeout(() => {
          li.style.opacity = '1';
          li.style.transform = 'translateX(0)';
        }, index * 100);
      });
      
      // Actualizar total con animación
      if (totalCarrito) {
        const currentTotal = parseFloat(totalCarrito.textContent || '0');
        
        // Animación del total
        if (currentTotal !== total) {
          animateValue(totalCarrito, currentTotal, total, 500);
        } else {
          totalCarrito.textContent = total.toFixed(2);
        }
      }
    }, 800);
  }

  // Animación para valores numéricos
  function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = start + progress * (end - start);
      element.textContent = value.toFixed(2);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Eliminar producto del carrito
  function eliminarDelCarrito(id) {
    const listaCarrito = document.getElementById('lista-carrito');
    const items = listaCarrito.querySelectorAll('.carrito-item');
    
    // Simulamos la eliminación (en un proyecto real, esto llamaría a tu API)
    items.forEach(item => {
      const btnEliminar = item.querySelector('.btn-eliminar');
      if (btnEliminar && btnEliminar.dataset.id == id) {
        // Animación de eliminación
        item.style.height = `${item.offsetHeight}px`;
        item.style.overflow = 'hidden';
        
        // Primera fase: rotar y desaparecer
        item.style.transform = 'translateX(20px) rotateY(30deg)';
        item.style.opacity = '0';
        
        setTimeout(() => {
          // Segunda fase: colapsar
          item.style.height = '0';
          item.style.padding = '0';
          item.style.margin = '0';
          
          setTimeout(() => {
            item.remove();
            actualizarTotalCarrito();
            actualizarContadorCarrito(-1);
            mostrarNotificacion('Producto eliminado del carrito', 'success');
            
            // Si el carrito está vacío
            if (listaCarrito.children.length === 0) {
              listaCarrito.innerHTML = '<li class="carrito-empty">Tu carrito está vacío</li>';
              document.getElementById('carrito-total').textContent = '0.00';
            }
          }, 300);
        }, 300);
      }
    });
  }

  // Actualizar el total del carrito
  function actualizarTotalCarrito() {
    const items = document.querySelectorAll('.carrito-item');
    let total = 0;
    
    items.forEach(item => {
      const precioEl = item.querySelector('.item-precio');
      const cantidadEl = item.querySelector('.item-cantidad');
      
      if (precioEl && cantidadEl) {
        const precio = parseFloat(precioEl.textContent);
        const cantidad = parseInt(cantidadEl.textContent.replace('x', ''));
        total += precio * cantidad;
      }
    });
    
    const totalEl = document.getElementById('carrito-total');
    if (totalEl) {
      animateValue(totalEl, parseFloat(totalEl.textContent || '0'), total, 300);
    }
  }

  // Actualizar contador del carrito
  function actualizarContadorCarrito(change = 0) {
    if (!contadorCarrito) return;
    
    // Si se proporciona un cambio, actualizar el contador
    if (change !== 0) {
      let actual = parseInt(contadorCarrito.textContent) || 0;
      actual += change;
      
      // Animación de cambio
      contadorCarrito.classList.add('contador-pulse');
      
      setTimeout(() => {
        contadorCarrito.textContent = actual;
        contadorCarrito.style.display = actual > 0 ? 'flex' : 'none';
        
        setTimeout(() => {
          contadorCarrito.classList.remove('contador-pulse');
        }, 300);
      }, 100);
      
      return;
    }
    
    // Simulamos la obtención del contador (en proyecto real, llamaría a tu API)
    setTimeout(() => {
      const cantidad = 3; // Número de ejemplo
      contadorCarrito.textContent = cantidad;
      contadorCarrito.style.display = cantidad > 0 ? 'flex' : 'none';
    }, 500);
  }

  // Newsletter
  function setupNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      if (!email || !validateEmail(email)) {
        mostrarNotificacion('Por favor, introduce un email válido', 'error');
        
        // Efecto de sacudida en el campo
        const emailInput = form.querySelector('input[type="email"]');
        emailInput.classList.add('shake-error');
        setTimeout(() => {
          emailInput.classList.remove('shake-error');
        }, 500);
        
        return;
      }

      // Animación del botón
      const btnSubmit = form.querySelector('button[type="submit"]');
      const originalText = btnSubmit.textContent;
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      
      // Simular envío
      setTimeout(() => {
        // Animar transición
        form.classList.add('form-success');
        btnSubmit.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
        
        setTimeout(() => {
          // Resetear formulario con animación
          form.classList.remove('form-success');
          btnSubmit.disabled = false;
          btnSubmit.textContent = originalText;
          form.reset();
          
          // Mostrar notificación de éxito
          mostrarNotificacion('¡Te has suscrito correctamente!', 'success');
          
          // Efecto de confeti
          createConfetti();
        }, 1500);
      }, 1500);
    });
  }

  // Validación de email
  function validateEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
  }

  // Efecto de confeti
  function createConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);
    
    // Crear 50 piezas de confeti
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      
      // Color aleatorio
      const colors = ['#ff0066', '#00ffcc', '#ffcc00', '#ff33cc', '#ff3300', '#3366ff'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.backgroundColor = color;
      
      // Posición y tamaño aleatorios
      confetti.style.left = `${Math.random() * 100}%`;
      const size = Math.random() * 8 + 5; // Entre 5px y 13px
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      
      // Retraso aleatorio
      confetti.style.animationDelay = `${Math.random() * 2}s`;
      
      // Velocidad aleatoria
      const duration = Math.random() * 3 + 2; // Entre 2s y 5s
      confetti.style.animationDuration = `${duration}s`;
      
      container.appendChild(confetti);
    }
    
    // Eliminar confeti después de la animación
    setTimeout(() => {
      container.remove();
    }, 5000);
  }

  // Configuración de brasas flotantes
  function setupFloatingEmbers() {
    const embersContainer = document.querySelector('.floating-embers');
    if (!embersContainer) return;
    
    // Limpiar brasas existentes
    embersContainer.innerHTML = '';
    
    // Crear brasas con propiedades aleatorias
    for (let i = 0; i < 30; i++) {
      const ember = document.createElement('div');
      ember.className = 'floating-ember';
      
      // Tamaño aleatorio
      const size = Math.random() * 6 + 4; // Entre 4px y 10px
      ember.style.width = `${size}px`;
      ember.style.height = `${size}px`;
      
      // Posición aleatoria
      ember.style.left = `${Math.random() * 100}%`;
      ember.style.bottom = `-${size}px`;
      
      // Retraso aleatorio
      ember.style.animationDelay = `${Math.random() * 10}s`;
      
      // Duración aleatoria
      const duration = Math.random() * 8 + 7; // Entre 7s y 15s
      ember.style.animationDuration = `${duration}s`;
      
      // Color aleatorio
      const colors = [
        'rgba(255, 51, 0, 0.8)',    // Rojo anaranjado
        'rgba(255, 102, 0, 0.8)',   // Naranja
        'rgba(255, 153, 0, 0.8)',   // Ámbar
        'rgba(255, 0, 102, 0.7)',   // Rosa neón
        'rgba(255, 204, 0, 0.8)'    // Amarillo
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      ember.style.backgroundColor = color;
      ember.style.boxShadow = `0 0 ${size * 2}px ${color}`;
      
      embersContainer.appendChild(ember);
      
      // Reiniciar animación cuando termine
      ember.addEventListener('animationend', () => {
        // Reposicionar en la parte inferior
        ember.style.left = `${Math.random() * 100}%`;
        
        // Nuevos retrasos y duraciones
        ember.style.animationDelay = '0s';
        const newDuration = Math.random() * 8 + 7;
        ember.style.animationDuration = `${newDuration}s`;
        
        // Reiniciar animación
        ember.style.animation = 'none';
        ember.offsetHeight; // Forzar reflow
        ember.style.animation = `float-up ${newDuration}s ease-out`;
      });
    }
  }

  // Notificaciones
  function mostrarNotificacion(mensaje, tipo = 'info') {
    let notificacion = document.querySelector('.notification');
    if (!notificacion) {
      notificacion = document.createElement('div');
      notificacion.className = 'notification';
      document.body.appendChild(notificacion);
    }

    // Definir icono según tipo
    let iconClass = 'info-circle';
    if (tipo === 'success') iconClass = 'check-circle';
    else if (tipo === 'error') iconClass = 'exclamation-circle';
    else if (tipo === 'warning') iconClass = 'exclamation-triangle';

    // Actualizar contenido
    notificacion.className = `notification ${tipo}`;
    notificacion.innerHTML = `
      <div class="notification-icon">
        <i class="fas fa-${iconClass}"></i>
      </div>
      <span class="notification-message">${mensaje}</span>
      <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

    // Añadir evento de cierre
    notificacion.querySelector('.notification-close').addEventListener('click', () => {
      notificacion.classList.remove('show');
      setTimeout(() => notificacion.remove(), 300);
    });

    // Mostrar con animación
    setTimeout(() => notificacion.classList.add('show'), 10);
    
    // Auto-ocultar después de un tiempo
    const timeout = setTimeout(() => {
      notificacion.classList.remove('show');
      setTimeout(() => notificacion.remove(), 300);
    }, 4000);

    // Pausar el timeout al pasar el ratón
    notificacion.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
    });

    // Reiniciar el timeout al salir
    notificacion.addEventListener('mouseleave', () => {
      setTimeout(() => {
        notificacion.classList.remove('show');
        setTimeout(() => notificacion.remove(), 300);
      }, 2000);
    });
  }
});

// Transición entre páginas
function irACategoria(pagina) {
  // Crear efecto de transición
  const transitionOverlay = document.createElement('div');
  transitionOverlay.className = 'page-transition-overlay';
  document.body.appendChild(transitionOverlay);
  
  // Animar entrada
  setTimeout(() => {
    transitionOverlay.classList.add('active');
    
    // Navegar después de la animación
    setTimeout(() => {
      window.location.href = pagina;
    }, 600);
  }, 50);
}
// Función para configurar el comportamiento de las tarjetas de categoría
function setupCategoryCards() {
  const categoryCards = document.querySelectorAll('.category-card');
  
  categoryCards.forEach(card => {
    // Efecto de hover 3D (efecto extra opcional)
    card.addEventListener('mousemove', e => {
      if (window.innerWidth > 992) { // Solo en escritorio
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Calcular rotación (limitada a 5 grados)
        const rotateY = Math.min(Math.max((mouseX - cardCenterX) / 20, -5), 5);
        const rotateX = Math.min(Math.max(-(mouseY - cardCenterY) / 20, -5), 5);
        
        card.querySelector('.card-front').style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      }
    });
    
    // Resetear transformación al salir
    card.addEventListener('mouseleave', () => {
      const cardFront = card.querySelector('.card-front');
      cardFront.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
    
    // Efecto de clic
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
    
    // Efecto de resplandor en hover para el icono
    const cardIcon = card.querySelector('.card-icon');
    if (cardIcon) {
      card.addEventListener('mouseenter', () => {
        cardIcon.style.transform = 'scale(1.2) rotate(10deg)';
      });
      
      card.addEventListener('mouseleave', () => {
        cardIcon.style.transform = '';
      });
    }
  });
}

// Asegurar que la función se ejecute cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Código existente...
  
  // Llamar a la función de configuración de tarjetas
  setupCategoryCards();
  
  // Resto del código...
});