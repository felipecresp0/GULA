/**
 * GULA Burgers - Main JavaScript
 * This script handles all the basic functionality of the website and connects with the devil script
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log("🔥 GULA: The 7 Deadly Sins of Flavor - v1.0");

  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: false
    });
  }

  // Global Variables
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
  
  // Initialize components
  initAnimations();
  setupSearchOverlay();
  setupMobileMenu();
  setupAddToCartButtons();
  setupNewsletter();
  setupFloatingEmbers();
  setupParallaxEffects();
  setupCartFunctionality();
  setupTestimonials();
  setupBurgerCounter();

  // Initialize burger counter (NEW)
  function setupBurgerCounter() {
    const counterElement = document.getElementById('burger-counter');
    if (!counterElement) return;
    
    // Set the target value - The number of burgers sold this year
    const targetValue = 247635; // Example value
    
    // Start from 0 and animate to the target
    let currentValue = 0;
    const duration = 3000; // Animation duration in ms
    const interval = 20; // Update interval in ms
    const increment = Math.ceil(targetValue / (duration / interval));
    
    const counterInterval = setInterval(() => {
      currentValue += increment;
      
      if (currentValue >= targetValue) {
        currentValue = targetValue;
        clearInterval(counterInterval);
      }
      
      // Format the number with commas
      counterElement.textContent = currentValue.toLocaleString();
      
      // Add pulse effect when counter hits milestone values
      if (currentValue % 50000 === 0 || currentValue === targetValue) {
        counterElement.classList.add('pulse-element');
        setTimeout(() => {
          counterElement.classList.remove('pulse-element');
        }, 1000);
      }
    }, interval);
  }

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
    document.querySelectorAll('.featured-section, .intro-section, .about-section, .testimonials-section, .game-section').forEach(el => {
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
      const hero = document.querySelector('.hero-section');
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
    let mobileNav = document.querySelector('.nav-links');
    
    // Toggle mobile menu with animation
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.add('active');
      
      // Add close button if it doesn't exist
      if (!mobileNav.querySelector('.close-menu')) {
        const closeButton = document.createElement('button');
        closeButton.className = 'close-menu';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        mobileNav.prepend(closeButton);
        
        // Event to close
        closeButton.addEventListener('click', closeMobileMenu);
      }
      
      // Animate entry of elements
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

    // Function to close mobile menu
    function closeMobileMenu() {
      mobileNav.classList.remove('active');
    }

    // Close mobile menu when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', e => {
      if (mobileNav.classList.contains('active') && 
          !mobileNav.contains(e.target) && 
          e.target !== menuToggle &&
          !menuToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  // Setup testimonials
  function setupTestimonials() {
    if (testimonialDots.length && testimonialCards.length) {
      // Change testimonial when clicking on dots
      testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          // Remove active from all
          testimonialDots.forEach(d => d.classList.remove('active'));
          testimonialCards.forEach(card => card.classList.remove('active'));
          
          // Add active to selected
          dot.classList.add('active');
          testimonialCards[index].classList.add('active');
        });
      });
      
      // Automatic rotation of testimonials
      let currentIndex = 0;
      
      setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonialCards.length;
        
        // Remove active from all
        testimonialDots.forEach(d => d.classList.remove('active'));
        testimonialCards.forEach(card => card.classList.remove('active'));
        
        // Add active to next
        testimonialDots[currentIndex].classList.add('active');
        testimonialCards[currentIndex].classList.add('active');
      }, 5000);
    }
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
        
        // Style flying element
        Object.assign(flyingElement.style, {
          position: 'fixed',
          zIndex: '9999',
          color: 'var(--primary-color)',
          fontSize: '1.5rem',
          transition: 'all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          filter: 'drop-shadow(0 0 8px rgba(255, 0, 102, 0.8))'
        });
        
        // Position flying element
        const btnRect = btn.getBoundingClientRect();
        const cartIconRect = document.querySelector('.cart-icon').getBoundingClientRect();
        
        flyingElement.style.top = `${btnRect.top}px`;
        flyingElement.style.left = `${btnRect.left}px`;
        
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
    const isAuthenticated = localStorage.getItem('token') !== null;
    
    if (!isAuthenticated) {
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
        { id: 1, nombre: 'THE GLUTTONY', cantidad: 1, precio: 13.95, imagen: 'gula.jpg' },
        { id: 2, nombre: 'THE LUST', cantidad: 1, precio: 14.95, imagen: 'lujuria.jpg' },
        { id: 3, nombre: 'THE WRATH', cantidad: 1, precio: 13.50, imagen: 'ira.jpg' }
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
            showNotification("Product removed from cart", "success");
            
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
    
    // Create 50 confetti pieces
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      
      // Style confetti
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
    
    // Remove confetti after animation
    setTimeout(() => {
      container.remove();
    }, 5000);
    
    // Add animation styles if they don't exist
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

  // Setup floating embers
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

  // Page transitions
  window.goToCategory = function(page) {
    // Create transition effect
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
    
    // Animate entry
    setTimeout(() => {
      transitionOverlay.style.opacity = '1';
      
      // Navigate after animation
      setTimeout(() => {
        window.location.href = page;
      }, 600);
    }, 50);
  };
});