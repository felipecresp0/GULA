document.addEventListener('DOMContentLoaded', () => {
  console.log("🔥 GULA: The 7 Deadly Sins of Flavor - Menu v2.0");

  // Global variables
  const token = localStorage.getItem('token') || null;
  const searchIcon = document.querySelector('.search-icon');
  const searchOverlay = document.querySelector('.search-overlay');
  const closeSearch = document.querySelector('.close-search');
  const searchInput = document.querySelector('.search-input-overlay');
  const menuToggle = document.querySelector('.menu-toggle');
  const btnCarrito = document.querySelector('.cart-icon');
  const contadorCarrito = document.querySelector('.cart-count');
  
  // Initialize components
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

  // Initialization of effects
  function initAnimations() {
    // Entry animations
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    // Elements to animate on scroll
    document.querySelectorAll('.featured-section, .menu-intro, .categories-section, .newsletter').forEach(el => {
      el.classList.add('animate-ready');
      observer.observe(el);
    });

    // Simulate loading for gradual entry of elements
    document.body.classList.add('page-loaded');
    
    // Animate hero flames
    animateHeroFlames();
    
    // Glitch effect
    setupGlitchEffect();
  }

  // Setup of parallax effects
  function setupParallaxEffects() {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      
      // Parallax on hero
      const hero = document.querySelector('.menu-hero');
      if (hero) {
        hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
      
      // Parallax on flame elements
      const flames = document.querySelectorAll('.flame');
      flames.forEach((flame, index) => {
        const speed = 0.2 + (index * 0.1);
        flame.style.transform = `translateY(${scrollPosition * speed}px)`;
      });

      // Parallax on floating elements
      const embers = document.querySelectorAll('.floating-ember');
      embers.forEach((ember, index) => {
        const speed = 0.1 + (index * 0.05);
        ember.style.transform = `translateY(${-scrollPosition * speed}px)`;
      });
      
      // Rotate card elements on scroll
      document.querySelectorAll('.sin-card').forEach((card, index) => {
        const rotateAmount = (scrollPosition * 0.01) % 5;
        const direction = index % 2 === 0 ? 1 : -1;
        card.style.transform = `perspective(1000px) rotateY(${rotateAmount * direction}deg)`;
      });
    });
  }

  // Animations for hero flames
  function animateHeroFlames() {
    const flames = document.querySelectorAll('.flame');
    
    flames.forEach((flame, index) => {
      // Random horizontal position
      const randomX = Math.floor(Math.random() * 80) + 10; // Between 10% and 90%
      flame.style.left = `${randomX}%`;
      
      // Random size
      const randomSize = Math.floor(Math.random() * 100) + 150; // Between 150px and 250px
      flame.style.width = `${randomSize}px`;
      flame.style.height = `${randomSize * 1.5}px`;
      
      // Random animation delay
      const randomDelay = Math.random() * 3;
      flame.style.animationDelay = `${randomDelay}s`;
      
      // Random animation duration
      const randomDuration = Math.random() * 2 + 3; // Between 3s and 5s
      flame.style.animationDuration = `${randomDuration}s`;
    });
  }

  // Setup of glitch effect
  function setupGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    glitchElements.forEach(element => {
      // Setup interval to activate the effect occasionally
      setInterval(() => {
        element.classList.add('active-glitch');
        setTimeout(() => {
          element.classList.remove('active-glitch');
        }, 1000);
      }, Math.random() * 5000 + 5000); // Between 5s and 10s
    });
  }

  // Search overlay configuration
  function setupSearchOverlay() {
    if (!searchIcon || !searchOverlay || !closeSearch) return;

    // Open search with effect
    searchIcon.addEventListener('click', () => {
      document.body.classList.add('overlay-open');
      searchOverlay.classList.add('active');
      setTimeout(() => {
        searchInput.focus();
      }, 300);
    });

    // Close search with effect
    closeSearch.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
      setTimeout(() => {
        document.body.classList.remove('overlay-open');
      }, 300);
    });

    // Close search with ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
        setTimeout(() => {
          document.body.classList.remove('overlay-open');
        }, 300);
      }
    });

    // Placeholder animation
    const placeholders = [
      "Looking for a burger?",
      "Want to try The Lust?",
      "Dare to try The Wrath?",
      "Hungry to sin?",
      "Which sin tempts you today?",
      "Looking for sides?",
      "Something to drink?"
    ];
    
    let placeholderIndex = 0;
    setInterval(() => {
      searchInput.setAttribute('placeholder', placeholders[placeholderIndex]);
      placeholderIndex = (placeholderIndex + 1) % placeholders.length;
    }, 3000);

    // Submit search
    searchOverlay.querySelector('.search-box').addEventListener('submit', e => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        // Search animation
        searchInput.style.transition = 'all 0.3s ease';
        searchInput.style.transform = 'scale(1.05)';
        searchInput.style.boxShadow = '0 0 30px var(--primary-color)';
        
        setTimeout(() => {
          searchInput.style.transform = '';
          searchInput.style.boxShadow = '';
          
          // Close overlay and show notification
          searchOverlay.classList.remove('active');
          setTimeout(() => {
            document.body.classList.remove('overlay-open');
            showNotification(`Searching: "${query}"`, 'info');
            // Here you would implement redirection to search results
          }, 300);
        }, 500);
      }
    });
  }

  // Mobile menu configuration
  function setupMobileMenu() {
    if (!menuToggle) return;

    // Create mobile menu if it doesn't exist
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
            <a href="menu.html" class="active">Menu</a>
            <a href="foodtruck.html">FoodTruck</a>
            <a href="restaurantes.html">Restaurants</a>
          </nav>
          <div class="mobile-actions">
            <button class="sign-in-btn" onclick="location.href='acceso.html'">SIGN IN</button>
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

    // Toggle mobile menu with animation
    menuToggle.addEventListener('click', () => {
      document.body.classList.add('menu-open');
      mobileMenu.classList.add('active');
      
      // Animate entry of elements
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

    // Close mobile menu
    mobileMenu.querySelector('.close-menu').addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      setTimeout(() => {
        document.body.classList.remove('menu-open');
      }, 300);
    });

    // Close mobile menu when clicking outside
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

  // Setup of the 7 Sins carousel
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
          
          // Customize pagination
          setTimeout(() => {
            document.querySelectorAll('.sin-bullet').forEach((bullet, index) => {
              const sinNumber = index + 1;
              bullet.innerHTML = `<span>${sinNumber}</span>`;
              
              // Add icon based on sin
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

    // Function to animate the active slide
    function animateActiveSlide(swiper) {
      // Remove previous classes
      document.querySelectorAll('.swiper-slide').forEach(slide => {
        slide.classList.remove('animate-slide');
      });

      // Apply effects to active slide
      setTimeout(() => {
        const activeSlide = swiper.slides[swiper.activeIndex];
        if (activeSlide) {
          activeSlide.classList.add('animate-slide');
          
          // Animate elements inside the slide
          const sinCard = activeSlide.querySelector('.sin-card');
          const badge = activeSlide.querySelector('.sin-badge');
          const title = activeSlide.querySelector('.sin-title');
          const price = activeSlide.querySelector('.sin-price');
          
          if (sinCard) {
            // Glow effect
            sinCard.style.animation = 'none';
            sinCard.offsetHeight; // Reflow
            sinCard.style.animation = 'glow-pulse 3s infinite';
          }
          
          if (badge) {
            // Badge effect
            badge.style.animation = 'none';
            badge.offsetHeight;
            badge.style.animation = 'badge-pulse 2s infinite';
          }
          
          if (title) {
            // Title effect
            title.style.animation = 'none';
            title.offsetHeight;
            title.style.animation = 'text-glow 2s infinite alternate';
          }
          
          if (price) {
            // Price effect
            price.style.animation = 'none';
            price.offsetHeight;
            price.style.animation = 'price-pop 2s infinite alternate';
          }
          
          // Show details
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

    // Effects when interacting with arrows
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

  // Setup of category cards
  function setupCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
      // Add 3D hover effect
      card.addEventListener('mousemove', e => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Calculate distance from center
        const distanceX = mouseX - cardCenterX;
        const distanceY = mouseY - cardCenterY;
        
        // Calculate rotation (limited to 10 degrees)
        const rotateY = Math.min(Math.max((distanceX / cardRect.width) * 20, -10), 10);
        const rotateX = Math.min(Math.max(-(distanceY / cardRect.height) * 20, -10), 10);
        
        // Apply transformation
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      });
      
      // Reset when leaving
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      });
      
      // Click effect
      card.addEventListener('click', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(0.95)';
        setTimeout(() => {
          card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        }, 200);
      });
    });
  }

  // Setup add to cart buttons
  function setupAddToCartButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        
        // Get product information
        const sinCard = btn.closest('.sin-card');
        const sinTitle = sinCard.querySelector('.sin-title')?.textContent;
        const sinPrice = sinCard.querySelector('.sin-price')?.textContent;
        const sinType = sinCard.getAttribute('data-sin');
        
        // Tactile vibration (on devices that support it)
        if (window.navigator.vibrate) {
          window.navigator.vibrate(100);
        }
        
        // Visual effects
        btn.classList.add('btn-pulse');
        sinCard.classList.add('card-added');
        
        // "Flight" animation to the cart
        const flyingElement = document.createElement('div');
        flyingElement.className = 'flying-item';
        flyingElement.innerHTML = `<i class="fas fa-hamburger"></i>`;
        document.body.appendChild(flyingElement);
        
        // Position flying element
        const btnRect = btn.getBoundingClientRect();
        const cartIconRect = document.querySelector('.cart-icon').getBoundingClientRect();
        
        flyingElement.style.top = `${btnRect.top}px`;
        flyingElement.style.left = `${btnRect.left}px`;
        
        // Style flying element
        Object.assign(flyingElement.style, {
          position: 'fixed',
          zIndex: '9999',
          color: 'var(--primary-color)',
          fontSize: '1.5rem',
          transition: 'all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          filter: 'drop-shadow(0 0 8px rgba(255, 0, 102, 0.8))'
        });
        
        // Animate flight
        setTimeout(() => {
          flyingElement.style.top = `${cartIconRect.top}px`;
          flyingElement.style.left = `${cartIconRect.left}px`;
          flyingElement.style.opacity = '0';
          flyingElement.style.transform = 'scale(0.2)';
        }, 10);
        
        setTimeout(() => {
          flyingElement.remove();
          
          // Reset button
          btn.classList.remove('btn-pulse');
          sinCard.classList.remove('card-added');
          
          // Update counter and show notification
          updateCartCounter(1);
          showNotification(`${sinTitle} added to cart`, 'success');
        }, 700);
      });
    });
  }

  // Cart functionality
  function setupCartFunctionality() {
    const cartDropdown = document.getElementById('carrito-desplegable');
    
    if (!btnCarrito || !cartDropdown) return;
    
    // Open/close cart
    btnCarrito.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      
      toggleCart();
      
      if (cartDropdown.classList.contains('mostrar')) {
        loadCartSummary();
      }
    });
    
    // Close cart with button
    const closeCartButton = cartDropdown.querySelector('.carrito-close');
    if (closeCartButton) {
      closeCartButton.addEventListener('click', () => {
        cartDropdown.classList.remove('mostrar');
      });
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', e => {
      if (cartDropdown.classList.contains('mostrar') && 
          !cartDropdown.contains(e.target) && 
          e.target !== btnCarrito &&
          !btnCarrito.contains(e.target)) {
        cartDropdown.classList.remove('mostrar');
      }
    });
    
    // Empty cart
    const btnEmpty = cartDropdown.querySelector('.btn-vaciar');
    if (btnEmpty) {
      btnEmpty.addEventListener('click', e => {
        e.preventDefault();
        
        // Add confirmation
        if (!confirm('Are you sure you want to empty your cart?')) return;
        
        // Empty animation
        const items = cartDropdown.querySelectorAll('.carrito-item');
        
        // If there are items, animate them out
        if (items.length > 0) {
          items.forEach((item, index) => {
            setTimeout(() => {
              item.style.transform = 'translateX(100%)';
              item.style.opacity = '0';
            }, index * 100);
          });
          
          // Wait for animation to end
          setTimeout(() => {
            document.getElementById('lista-carrito').innerHTML = 
              '<li class="carrito-empty">Your cart is empty</li>';
            document.getElementById('carrito-total').textContent = '0.00';
            contadorCarrito.textContent = '0';
            contadorCarrito.style.display = 'none';
            showNotification('Cart successfully emptied', 'success');
          }, items.length * 100 + 300);
        }
      });
    }
    
    // Initialize counter
    updateCartCounter();
  }

  // Function to toggle cart visibility
  function toggleCart() {
    const cartDropdown = document.getElementById('carrito-desplegable');
    
    if (cartDropdown) {
      // If already open, close with animation
      if (cartDropdown.classList.contains('mostrar')) {
        cartDropdown.style.transform = 'translateY(0)';
        cartDropdown.style.opacity = '1';
        
        setTimeout(() => {
          cartDropdown.style.transform = 'translateY(-20px)';
          cartDropdown.style.opacity = '0';
          
          setTimeout(() => {
            cartDropdown.classList.remove('mostrar');
            cartDropdown.style.transform = '';
            cartDropdown.style.opacity = '';
          }, 300);
        }, 10);
      } 
      // If closed, open with animation
      else {
        cartDropdown.classList.add('mostrar');
        cartDropdown.style.transform = 'translateY(-20px)';
        cartDropdown.style.opacity = '0';
        
        setTimeout(() => {
          cartDropdown.style.transform = 'translateY(0)';
          cartDropdown.style.opacity = '1';
        }, 10);
      }
    }
  }

  // Load cart summary
  function loadCartSummary() {
    const cartList = document.getElementById('lista-carrito');
    const cartTotal = document.getElementById('carrito-total');
    
    // Check if user is authenticated
    if (!token) {
      cartList.innerHTML = '<li class="carrito-empty">Sign in to see your cart</li>';
      if (cartTotal) cartTotal.textContent = '0.00';
      return;
    }
    
    // Show loading animation
    cartList.innerHTML = `
      <li class="carrito-loading">
        <div class="loader-container">
          <div class="loader-flame"></div>
          <span>Loading cart...</span>
        </div>
      </li>`;
    
    // Simulate cart loading (in a real project, this would call your API)
    setTimeout(() => {
      // Example data - The 7 sins
      const cartItems = [
        { id: 1, nombre: 'THE GLUTTONY', cantidad: 1, precio: 13.95, imagen: 'la-gula.jpg' },
        { id: 2, nombre: 'THE LUST', cantidad: 1, precio: 14.95, imagen: 'la-lujuria.jpg' },
        { id: 3, nombre: 'THE WRATH', cantidad: 1, precio: 13.50, imagen: 'la-ira.jpg' }
      ];
      
      if (!cartItems.length) {
        cartList.innerHTML = '<li class="carrito-empty">Your cart is empty</li>';
        if (cartTotal) cartTotal.textContent = '0.00';
        return;
      }
      
      cartList.innerHTML = '';
      let total = 0;
      
      // Add items with sequential animation
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
          removeFromCart(item.id);
        });
        
        cartList.appendChild(li);
        
        // Sequential entry animation
        setTimeout(() => {
          li.style.opacity = '1';
          li.style.transform = 'translateX(0)';
        }, index * 100);
      });
      
      // Update total with animation
      if (cartTotal) {
        const currentTotal = parseFloat(cartTotal.textContent || '0');
        
        // Total animation
        if (currentTotal !== total) {
          animateValue(cartTotal, currentTotal, total, 500);
        } else {
          cartTotal.textContent = total.toFixed(2);
        }
      }
    }, 800);
  }

  // Animation for numeric values
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

  // Remove product from cart
  function removeFromCart(id) {
    const cartList = document.getElementById('lista-carrito');
    const items = cartList.querySelectorAll('.carrito-item');
    
    // Simulate removal (in a real project, this would call your API)
    items.forEach(item => {
      const btnRemove = item.querySelector('.btn-eliminar');
      if (btnRemove && btnRemove.dataset.id == id) {
        // Removal animation
        item.style.height = `${item.offsetHeight}px`;
        item.style.overflow = 'hidden';
        
        // First phase: rotate and disappear
        item.style.transform = 'translateX(20px) rotateY(30deg)';
        item.style.opacity = '0';
        
        setTimeout(() => {
          // Second phase: collapse
          item.style.height = '0';
          item.style.padding = '0';
          item.style.margin = '0';
          
          setTimeout(() => {
            item.remove();
            updateCartTotal();
            updateCartCounter(-1);
            showNotification('Product removed from cart', 'success');
            
            // If cart is empty
            if (cartList.children.length === 0) {
              cartList.innerHTML = '<li class="carrito-empty">Your cart is empty</li>';
              document.getElementById('carrito-total').textContent = '0.00';
            }
          }, 300);
        }, 300);
      }
    });
  }

  // Update cart total
  function updateCartTotal() {
    const items = document.querySelectorAll('.carrito-item');
    let total = 0;
    
    items.forEach(item => {
      const priceEl = item.querySelector('.item-precio');
      const quantityEl = item.querySelector('.item-cantidad');
      
      if (priceEl && quantityEl) {
        const price = parseFloat(priceEl.textContent);
        const quantity = parseInt(quantityEl.textContent.replace('x', ''));
        total += price * quantity;
      }
    });
    
    const totalEl = document.getElementById('carrito-total');
    if (totalEl) {
      animateValue(totalEl, parseFloat(totalEl.textContent || '0'), total, 300);
    }
  }

  // Update cart counter
  function updateCartCounter(change = 0) {
    if (!contadorCarrito) return;
    
    // If a change is provided, update the counter
    if (change !== 0) {
      let current = parseInt(contadorCarrito.textContent) || 0;
      current += change;
      
      // Change animation
      contadorCarrito.classList.add('contador-pulse');
      
      setTimeout(() => {
        contadorCarrito.textContent = current;
        contadorCarrito.style.display = current > 0 ? 'flex' : 'none';
        
        setTimeout(() => {
          contadorCarrito.classList.remove('contador-pulse');
        }, 300);
      }, 100);
      
      return;
    }
    
    // Simulate counter retrieval (in a real project, would call your API)
    setTimeout(() => {
      const quantity = 3; // Example number
      contadorCarrito.textContent = quantity;
      contadorCarrito.style.display = quantity > 0 ? 'flex' : 'none';
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
        showNotification('Please enter a valid email', 'error');
        
        // Shake effect on field
        const emailInput = form.querySelector('input[type="email"]');
        emailInput.classList.add('shake-error');
        setTimeout(() => {
          emailInput.classList.remove('shake-error');
        }, 500);
        
        return;
      }

      // Button animation
      const btnSubmit = form.querySelector('button[type="submit"]');
      const originalText = btnSubmit.textContent;
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      // Simulate sending
      setTimeout(() => {
        // Animate transition
        form.classList.add('form-success');
        btnSubmit.innerHTML = '<i class="fas fa-check"></i> Sent!';
        
        setTimeout(() => {
          // Reset form with animation
          form.classList.remove('form-success');
          btnSubmit.disabled = false;
          btnSubmit.textContent = originalText;
          form.reset();
          
          // Show success notification
          showNotification('You have successfully subscribed!', 'success');
          
          // Confetti effect
          createConfetti();
        }, 1500);
      }, 1500);
    });
  }

  // Email validation
  function validateEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
  }

  // Confetti effect
  function createConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);
    
    // Create 50 confetti pieces
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      
      // Random color
      const colors = ['#ff0066', '#00ffcc', '#ffcc00', '#ff33cc', '#ff3300', '#3366ff'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.backgroundColor = color;
      
      // Random position and size
      confetti.style.left = `${Math.random() * 100}%`;
      const size = Math.random() * 8 + 5; // Between 5px and 13px
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      
      // Random delay
      confetti.style.animationDelay = `${Math.random() * 2}s`;
      
      // Random speed
      const duration = Math.random() * 3 + 2; // Between 2s and 5s
      confetti.style.animationDuration = `${duration}s`;
      
      container.appendChild(confetti);
    }
    
    // Remove confetti after animation
    setTimeout(() => {
      container.remove();
    }, 5000);
  }

  // Setup of floating embers
  function setupFloatingEmbers() {
    const embersContainer = document.querySelector('.floating-embers');
    if (!embersContainer) return;
    
    // Clear existing embers
    embersContainer.innerHTML = '';
    
    // Create embers with random properties
    for (let i = 0; i < 30; i++) {
      const ember = document.createElement('div');
      ember.className = 'floating-ember';
      
      // Random size
      const size = Math.random() * 6 + 4; // Between 4px and 10px
      ember.style.width = `${size}px`;
      ember.style.height = `${size}px`;
      
      // Random position
      ember.style.left = `${Math.random() * 100}%`;
      ember.style.bottom = `-${size}px`;
      
      // Random delay
      ember.style.animationDelay = `${Math.random() * 10}s`;
      
      // Random duration
      const duration = Math.random() * 8 + 7; // Between 7s and 15s
      ember.style.animationDuration = `${duration}s`;
      
      // Random color
      const colors = [
        'rgba(255, 51, 0, 0.8)',    // Orange red
        'rgba(255, 102, 0, 0.8)',   // Orange
        'rgba(255, 153, 0, 0.8)',   // Amber
        'rgba(255, 0, 102, 0.7)',   // Neon pink
        'rgba(255, 204, 0, 0.8)'    // Yellow
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      ember.style.backgroundColor = color;
      ember.style.boxShadow = `0 0 ${size * 2}px ${color}`;
      
      embersContainer.appendChild(ember);
      
      // Restart animation when it ends
      ember.addEventListener('animationend', () => {
        // Reposition at the bottom
        ember.style.left = `${Math.random() * 100}%`;
        
        // New delays and durations
        ember.style.animationDelay = '0s';
        const newDuration = Math.random() * 8 + 7;
        ember.style.animationDuration = `${newDuration}s`;
        
        // Restart animation
        ember.style.animation = 'none';
        ember.offsetHeight; // Force reflow
        ember.style.animation = `float-up ${newDuration}s ease-out`;
      });
    }
  }

  // Notifications
  function showNotification(message, type = 'info') {
    let notification = document.querySelector('.notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'notification';
      document.body.appendChild(notification);
    }

    // Define icon based on type
    let iconClass = 'info-circle';
    if (type === 'success') iconClass = 'check-circle';
    else if (type === 'error') iconClass = 'exclamation-circle';
    else if (type === 'warning') iconClass = 'exclamation-triangle';

    // Update content
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-icon">
        <i class="fas fa-${iconClass}"></i>
      </div>
      <span class="notification-message">${message}</span>
      <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

    // Add close event
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });

    // Show with animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto-hide after a while
    const timeout = setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);

    // Pause timeout on hover
    notification.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
    });

    // Restart timeout on mouse out
    notification.addEventListener('mouseleave', () => {
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 2000);
    });
  }
});

// Page transitions
function goToCategory(page) {
  // Create transition effect
  const transitionOverlay = document.createElement('div');
  transitionOverlay.className = 'page-transition-overlay';
  document.body.appendChild(transitionOverlay);
  
  // Animate entry
  setTimeout(() => {
    transitionOverlay.classList.add('active');
    
    // Navigate after animation
    setTimeout(() => {
      window.location.href = page;
    }, 600);
  }, 50);
}