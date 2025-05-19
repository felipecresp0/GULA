/**
 * GULA Hamburguesas - JavaScript Principal
 * Este script maneja todas las funcionalidades básicas de la web y se conecta con el script del diablo
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log("🔥 GULA: Los 7 Pecados Capitales del Sabor - v1.0");

  // Inicializar AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: false
    });
  }

  // Variables globales
  const searchIcon = document.querySelector('.search-icon');
  const searchOverlay = document.querySelector('.search-overlay');
  const closeSearch = document.querySelector('.close-search');
  const searchInput = document.querySelector('.search-input-overlay');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const btnCarrito = document.querySelector('.cart-icon');
  const contadorCarrito = document.querySelector('.cart-count');
  const testimonialDots = document.querySelectorAll('.dot');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  
  // Inicializar componentes
  initAnimations();
  setupSearchOverlay();
  setupMobileMenu();
  setupAddToCartButtons();
  setupNewsletter();
  setupFloatingEmbers();
  setupParallaxEffects();
  setupCartFunctionality();
  setupTestimonials();

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
    document.querySelectorAll('.featured-section, .intro-section, .about-section, .foodtruck-section, .testimonials-section, .locations-section, .cta-section').forEach(el => {
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
      const hero = document.querySelector('.hero-section');
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
    let mobileNav = document.querySelector('.nav-links');
    
    // Toggle del menú móvil con animación
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.add('active');
      
      // Añadir botón de cierre si no existe
      if (!mobileNav.querySelector('.close-menu')) {
        const closeButton = document.createElement('button');
        closeButton.className = 'close-menu';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        mobileNav.prepend(closeButton);
        
        // Evento para cerrar
        closeButton.addEventListener('click', closeMobileMenu);
      }
      
      // Animar entrada de elementos
      const items = mobileNav.querySelectorAll('a');
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

    // Función para cerrar el menú móvil
    function closeMobileMenu() {
      mobileNav.classList.remove('active');
    }

    // Cerrar menú móvil al hacer clic en un enlace
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Cerrar menú móvil al hacer clic fuera
    document.addEventListener('click', e => {
      if (mobileNav.classList.contains('active') && 
          !mobileNav.contains(e.target) && 
          e.target !== menuToggle &&
          !menuToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  // Configurar testimoniales
  function setupTestimonials() {
    if (testimonialDots.length && testimonialCards.length) {
      // Cambiar testimonial al hacer clic en los dots
      testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          // Remover active de todos
          testimonialDots.forEach(d => d.classList.remove('active'));
          testimonialCards.forEach(card => card.classList.remove('active'));
          
          // Añadir active al seleccionado
          dot.classList.add('active');
          testimonialCards[index].classList.add('active');
        });
      });
      
      // Rotación automática de testimoniales
      let currentIndex = 0;
      
      setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonialCards.length;
        
        // Remover active de todos
        testimonialDots.forEach(d => d.classList.remove('active'));
        testimonialCards.forEach(card => card.classList.remove('active'));
        
        // Añadir active al siguiente
        testimonialDots[currentIndex].classList.add('active');
        testimonialCards[currentIndex].classList.add('active');
      }, 5000);
    }
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
        
        // Estilizar elemento volador
        Object.assign(flyingElement.style, {
          position: 'fixed',
          zIndex: '9999',
          color: 'var(--primary-color)',
          fontSize: '1.5rem',
          transition: 'all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          filter: 'drop-shadow(0 0 8px rgba(255, 0, 102, 0.8))'
        });
        
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
    const carritoDesp = document.getElementById('carrito-desplegable');
    
    if (!btnCarrito || !carritoDesp) return;
    
    // Abrir/cerrar carrito
    btnCarrito.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      
      toggleCarrito();
      
      if (carritoDesp.classList.contains('mostrar')) {
        cargarResumenCarrito();
      }
    });
    
    // Cerrar carrito con botón
    const closeCartButton = carritoDesp.querySelector('.carrito-close');
    if (closeCartButton) {
      closeCartButton.addEventListener('click', () => {
        carritoDesp.classList.remove('mostrar');
      });
    }
    
    // Cerrar carrito al hacer clic fuera
    document.addEventListener('click', e => {
      if (carritoDesp.classList.contains('mostrar') && 
          !carritoDesp.contains(e.target) && 
          e.target !== btnCarrito &&
          !btnCarrito.contains(e.target)) {
        carritoDesp.classList.remove('mostrar');
      }
    });
    
    // Vaciar carrito
    const btnVaciar = carritoDesp.querySelector('.btn-vaciar');
    if (btnVaciar) {
      btnVaciar.addEventListener('click', e => {
        e.preventDefault();
        
        // Añadir confirmación
        if (!confirm('¿Estás seguro de vaciar tu carrito?')) return;
        
        // Animación de vaciado
        const items = carritoDesp.querySelectorAll('.carrito-item');
        
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
    const isAuthenticated = localStorage.getItem('token') !== null;
    
    if (!isAuthenticated) {
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
        { id: 1, nombre: 'LA GULA', cantidad: 1, precio: 13.95, imagen: 'gula.jpg' },
        { id: 2, nombre: 'LA LUJURIA', cantidad: 1, precio: 14.95, imagen: 'lujuria.jpg' },
        { id: 3, nombre: 'LA IRA', cantidad: 1, precio: 13.50, imagen: 'ira.jpg' }
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
    Object.assign(container.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 9999
    });
    document.body.appendChild(container);
    
    // Crear 50 piezas de confeti
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      
      // Estilizar confeti
      Object.assign(confetti.style, {
        position: 'absolute',
        bottom: '0',
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 8 + 5}px`,
        height: `${Math.random() * 8 + 5}px`,
        backgroundColor: ['#ff0066', '#00ffcc', '#ffcc00', '#ff33cc', '#ff3300', '#3366ff'][Math.floor(Math.random() * 6)],
        borderRadius: '50%',
        animation: `confetti-fall ${Math.random() * 3 + 2}s ease-out forwards`,
        animationDelay: `${Math.random() * 2}s`
      });
      
      container.appendChild(confetti);
    }
    
    // Eliminar confeti después de la animación
    setTimeout(() => {
      container.remove();
    }, 5000);
    
    // Añadir estilos de la animación si no existen
    if (!document.getElementById('confetti-styles')) {
      const style = document.createElement('style');
      style.id = 'confetti-styles';
      style.textContent = `
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
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

  // Transición entre páginas
  window.irACategoria = function(pagina) {
    // Crear efecto de transición
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition-overlay';
    Object.assign(transitionOverlay.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      zIndex: 9999,
      opacity: 0,
      transition: 'opacity 0.6s ease'
    });
    document.body.appendChild(transitionOverlay);
    
    // Animar entrada
    setTimeout(() => {
      transitionOverlay.style.opacity = '1';
      
      // Navegar después de la animación
      setTimeout(() => {
        window.location.href = pagina;
      }, 600);
    }, 50);
  };
});