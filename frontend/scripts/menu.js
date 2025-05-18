document.addEventListener('DOMContentLoaded', () => {
  console.log("🍔 Página de menú cargada - GULA: Los 7 Pecados Capitales del Sabor");

  // Variables globales
  const token = localStorage.getItem('token');
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
  setupSwiper();
  if (btnCarrito) setupCarrito();
  setupAddToCartButtons();
  setupNewsletter();
  setupFloatingEmbers();

  // Efecto parallax en el hero
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.menu-hero');
    if (hero) hero.style.backgroundPositionY = `${window.scrollY * 0.5}px`;
  });

  // Funciones de inicialización
  function initAnimations() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.featured-section, .menu-intro, .newsletter, .menu-cta').forEach(el => {
      el.classList.add('animate-ready');
      observer.observe(el);
    });
  }

  function setupSearchOverlay() {
    if (!searchIcon || !searchOverlay || !closeSearch) return;

    // Abrir búsqueda
    searchIcon.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      setTimeout(() => {
        searchInput.focus();
      }, 300);
    });

    // Cerrar búsqueda
    closeSearch.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
    });

    // Cerrar búsqueda con ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
      }
    });

    // Enviar búsqueda
    searchOverlay.querySelector('.search-box').addEventListener('submit', e => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        // Simular búsqueda
        searchOverlay.classList.remove('active');
        mostrarNotificacion(`Buscando: "${query}"`, 'info');
        // Aquí implementarías la redirección a resultados de búsqueda
      }
    });
  }

  function setupMobileMenu() {
    if (!menuToggle) return;

    // Crear menú móvil si no existe
    let mobileMenu = document.querySelector('.mobile-menu');
    if (!mobileMenu) {
      mobileMenu = document.createElement('div');
      mobileMenu.className = 'mobile-menu';
      mobileMenu.innerHTML = `
        <button class="close-menu"><i class="fas fa-times"></i></button>
        <nav class="mobile-nav">
          <a href="index.html">Home</a>
          <a href="menu.html" class="active">Burgers</a>
          <a href="foodtruck.html">FoodTruck</a>
          <a href="restaurantes.html">Restaurantes</a>
        </nav>
        <div class="mobile-actions">
          <button class="sign-in-btn" onclick="location.href='acceso.html'">INICIA SESIÓN</button>
        </div>
      `;
      document.body.appendChild(mobileMenu);
    }

    // Toggle del menú móvil
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
    });

    // Cerrar menú móvil
    mobileMenu.querySelector('.close-menu').addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });

    // Cerrar menú móvil al hacer clic fuera
    document.addEventListener('click', e => {
      if (mobileMenu.classList.contains('active') && 
          !mobileMenu.contains(e.target) && 
          e.target !== menuToggle &&
          !menuToggle.contains(e.target)) {
        mobileMenu.classList.remove('active');
      }
    });
  }

  function setupSwiper() {
    // Inicializar slider de categorías
    const categoriesSlider = new Swiper('.categories-slider', {
      slidesPerView: 1,
      spaceBetween: 0, // Sin espacio entre slides
      loop: true,
      loopAdditionalSlides: 4, // Para asegurar transición suave
      centeredSlides: true,
      speed: 1000, // Velocidad de transición más rápida
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      effect: 'coverflow',
      coverflowEffect: {
        rotate: 5,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false,
      },
      grabCursor: true, // Cursor de agarre
      pagination: {
        el: '.categories-pagination',
        clickable: true,
        dynamicBullets: true
      },
      navigation: {
        nextEl: '.categories-button-next',
        prevEl: '.categories-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        },
        1200: {
          slidesPerView: 4,
        }
      },
      on: {
        init: function() {
          setTimeout(() => {
            // Aplicar efecto hover automático a las tarjetas en el slider
            const activeSlide = this.slides[this.activeIndex];
            if (activeSlide) {
              const card = activeSlide.querySelector('.category-card');
              if (card) {
                card.classList.add('hover-effect');
                
                // Animar el icono
                const icon = card.querySelector('.card-icon');
                if (icon) {
                  icon.classList.add('pulse');
                  setTimeout(() => icon.classList.remove('pulse'), 500);
                }
              }
            }
          }, 500);
        },
        slideChange: function() {
          // Eliminar efectos hover de todas las tarjetas
          document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('hover-effect');
          });
          
          // Aplicar efecto hover a la tarjeta activa
          setTimeout(() => {
            const activeSlide = this.slides[this.activeIndex];
            if (activeSlide) {
              const card = activeSlide.querySelector('.category-card');
              if (card) {
                card.classList.add('hover-effect');
                
                // Animar el icono
                const icon = card.querySelector('.card-icon');
                if (icon) {
                  icon.classList.add('pulse');
                  setTimeout(() => icon.classList.remove('pulse'), 500);
                }
              }
            }
          }, 100);
        }
      }
    });

    // Inicializar slider de productos destacados
    const featuredSlider = new Swiper('.featured-slider', {
      slidesPerView: 1,
      spaceBetween: 0, // Sin espacio entre slides
      loop: true,
      loopAdditionalSlides: 7, // Para asegurar transición suave con los 7 pecados
      centeredSlides: true,
      speed: 800,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      effect: 'slide',
      grabCursor: true, // Cursor de agarre
      pagination: {
        el: '.featured-pagination',
        clickable: true,
        dynamicBullets: true
      },
      navigation: {
        nextEl: '.featured-button-next',
        prevEl: '.featured-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          centeredSlides: false,
        },
        992: {
          slidesPerView: 3,
        },
        1200: {
          slidesPerView: 4,
        }
      },
      on: {
        init: function() {
          // Aplicar efecto de animación inicial
          animateSlides(this);
        },
        slideChange: function() {
          // Aplicar efecto de animación al cambiar slide
          animateSlides(this);
        }
      }
    });

    // Animar slides de productos destacados
    function animateSlides(slider) {
      setTimeout(() => {
        const activeSlides = [];
        const visibleSlides = slider.slides.filter(slide => 
          slide.classList.contains('swiper-slide-visible')
        );
        
        visibleSlides.forEach((slide, index) => {
          const item = slide.querySelector('.featured-item');
          if (item) {
            // Reset animation
            item.style.animation = 'none';
            item.offsetHeight; // Trigger reflow
            
            // Apply new animation with staggered delay
            item.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
          }
        });
      }, 100);
    }

    // Agregamos eventos click para los botones de navegación
    document.querySelectorAll('.swiper-button-next, .swiper-button-prev').forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.classList.add('hover-glow');
      });
      
      button.addEventListener('mouseleave', () => {
        button.classList.remove('hover-glow');
      });
      
      button.addEventListener('click', () => {
        button.classList.add('pulse');
        setTimeout(() => button.classList.remove('pulse'), 500);
      });
    });
  }

  function setupCarrito() {
    // Si el desplegable no existe, no hacer nada
    let desplegable = document.getElementById('carrito-desplegable');
    if (!desplegable) return;

    btnCarrito.addEventListener('click', e => {
      e.stopPropagation();
      toggleCarrito();
      if (desplegable.classList.contains('mostrar')) {
        cargarResumenCarrito();
      }
    });

    // Cerrar desplegable al hacer clic fuera
    document.addEventListener('click', e => {
      if (desplegable.classList.contains('mostrar') && 
          !desplegable.contains(e.target) && 
          e.target !== btnCarrito) {
        desplegable.classList.remove('mostrar');
      }
    });

    desplegable.addEventListener('click', e => e.stopPropagation());
    
    // Vaciar carrito
    desplegable.querySelector('.btn-vaciar').addEventListener('click', e => {
      e.preventDefault();
      
      // Simulación - en un proyecto real, esto se conectaría a tu backend
      setTimeout(() => {
        document.getElementById('lista-carrito').innerHTML = 
          '<li class="carrito-empty">Tu carrito está vacío</li>';
        document.getElementById('carrito-total').textContent = '0.00';
        contadorCarrito.textContent = '0';
        contadorCarrito.style.display = 'none';
        mostrarNotificacion('Carrito vaciado correctamente', 'success');
        desplegable.classList.remove('mostrar');
      }, 300);
    });

    actualizarContadorCarrito();
  }

  function toggleCarrito() {
    const desplegable = document.getElementById('carrito-desplegable');
    desplegable.classList.toggle('mostrar');
  }

  function cargarResumenCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('carrito-total');
    
    if (!token) {
      listaCarrito.innerHTML = '<li class="carrito-empty">Inicia sesión para ver tu carrito</li>';
      if (totalCarrito) totalCarrito.textContent = '0.00';
      return;
    }

    listaCarrito.innerHTML = '<li class="carrito-loading"><i class="fas fa-spinner fa-spin"></i> Cargando...</li>';

    // Simulamos una carga de carrito (en un proyecto real, esto llamaría a tu API)
    setTimeout(() => {
      // Datos de ejemplo - Agregar todos los 7 Pecados
      const cartItems = [
        { id: 1, nombre: 'LA GULA', cantidad: 1, precio: 13.95 },
        { id: 2, nombre: 'LA LUJURIA', cantidad: 1, precio: 14.95 },
        { id: 3, nombre: 'LA IRA', cantidad: 1, precio: 13.50 }
      ];
      
      if (!cartItems.length) {
        listaCarrito.innerHTML = '<li class="carrito-empty">Tu carrito está vacío</li>';
        if (totalCarrito) totalCarrito.textContent = '0.00';
        return;
      }

      listaCarrito.innerHTML = '';
      let total = 0;

      cartItems.forEach(item => {
        const precio = parseFloat(item.precio);
        total += precio * item.cantidad;

        const li = document.createElement('li');
        li.className = 'carrito-item';
        li.innerHTML = `
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
      });

      if (totalCarrito) totalCarrito.textContent = total.toFixed(2);
    }, 800);
  }

  function eliminarDelCarrito(id) {
    const listaCarrito = document.getElementById('lista-carrito');
    const items = listaCarrito.querySelectorAll('.carrito-item');
    
    // Simulamos la eliminación (en un proyecto real, esto llamaría a tu API)
    items.forEach(item => {
      if (item.querySelector('.btn-eliminar').dataset.id == id) {
        item.classList.add('fadeOut');
        setTimeout(() => {
          item.remove();
          actualizarTotalCarrito();
          actualizarContadorCarrito();
          mostrarNotificacion('Producto eliminado del carrito', 'success');
          
          // Si el carrito está vacío
          if (listaCarrito.children.length === 0) {
            listaCarrito.innerHTML = '<li class="carrito-empty">Tu carrito está vacío</li>';
            document.getElementById('carrito-total').textContent = '0.00';
          }
        }, 300);
      }
    });
  }

  function actualizarTotalCarrito() {
    const items = document.querySelectorAll('.carrito-item');
    let total = 0;
    
    items.forEach(item => {
      const precio = parseFloat(item.querySelector('.item-precio').textContent);
      const cantidad = parseInt(item.querySelector('.item-cantidad').textContent.replace('x', ''));
      total += precio * cantidad;
    });
    
    document.getElementById('carrito-total').textContent = total.toFixed(2);
  }

  function actualizarContadorCarrito() {
    if (!contadorCarrito) return;
    
    // Simulamos la obtención del contador (en proyecto real, llamaría a tu API)
    setTimeout(() => {
      const cantidad = 3; // Número de ejemplo
      contadorCarrito.textContent = cantidad;
      contadorCarrito.style.display = cantidad > 0 ? 'flex' : 'none';
    }, 500);
  }

  function setupAddToCartButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        
        // Obtener información del producto
        const item = btn.closest('.featured-item');
        const nombre = item.querySelector('h3').textContent;
        const precio = item.querySelector('.price').textContent;
        
        // Efecto visual
        btn.classList.add('pulse');
        setTimeout(() => btn.classList.remove('pulse'), 500);
        
        // Simular añadir al carrito (en un proyecto real, esto llamaría a tu API)
        setTimeout(() => {
          mostrarNotificacion(`${nombre} añadido al carrito`, 'success');
          
          // Actualizar contador
          const contador = document.querySelector('.cart-count');
          if (contador) {
            const actual = parseInt(contador.textContent) || 0;
            contador.textContent = actual + 1;
            contador.style.display = 'flex';
          }
        }, 300);
      });
    });
  }

  function setupNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      if (!email || !validateEmail(email)) {
        mostrarNotificacion('Por favor, introduce un email válido', 'error');
        return;
      }

      const btnSubmit = form.querySelector('button[type="submit"]');
      const originalText = btnSubmit.textContent;
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

      setTimeout(() => {
        btnSubmit.disabled = false;
        btnSubmit.textContent = originalText;
        form.reset();
        mostrarNotificacion('¡Te has suscrito correctamente!', 'success');
      }, 1500);
    });
  }

  function setupFloatingEmbers() {
    const embers = document.querySelectorAll('.floating-ember');
    
    function animateEmber(ember) {
      const randomSize = Math.floor(Math.random() * 6) + 4; // 4-10px
      const randomLeft = Math.floor(Math.random() * 100); // 0-100%
      const randomDelay = Math.floor(Math.random() * 5); // 0-5s
      const randomDuration = Math.floor(Math.random() * 7) + 8; // 8-15s
      
      ember.style.width = `${randomSize}px`;
      ember.style.height = `${randomSize}px`;
      ember.style.left = `${randomLeft}%`;
      ember.style.animationDelay = `${randomDelay}s`;
      ember.style.animationDuration = `${randomDuration}s`;
      
      ember.addEventListener('animationend', () => {
        animateEmber(ember);
      });
    }
    
    embers.forEach(animateEmber);

    // Añadir más brasas dinámicamente
    const embersContainer = document.querySelector('.floating-embers');
    if (embersContainer) {
      for (let i = 0; i < 15; i++) {
        const ember = document.createElement('div');
        ember.className = 'floating-ember';
        embersContainer.appendChild(ember);
        animateEmber(ember);
      }
    }
  }

  function validateEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
  }

  function mostrarNotificacion(mensaje, tipo = 'info') {
    let notificacion = document.querySelector('.notification');
    if (!notificacion) {
      notificacion = document.createElement('div');
      notificacion.className = 'notification';
      document.body.appendChild(notificacion);
    }

    const icon = tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle';
    notificacion.className = `notification ${tipo}`;
    notificacion.innerHTML = `<i class="fas fa-${icon} notification-icon"></i> <span class="notification-message">${mensaje}</span>`;

    setTimeout(() => notificacion.classList.add('show'), 100);
    setTimeout(() => {
      notificacion.classList.remove('show');
      setTimeout(() => notificacion.remove(), 500);
    }, 3000);
  }
});

function irACategoria(pagina) {
  document.body.classList.add('page-transition');
  setTimeout(() => {
    window.location.href = pagina;
  }, 300);
}