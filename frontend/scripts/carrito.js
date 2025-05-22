document.addEventListener('DOMContentLoaded', () => {
  console.log("🔥 Cart loaded successfully - Infernal mode activated");
  
  // DOM element references
  const searchToggle = document.getElementById("search-toggle");
  const searchOverlay = document.querySelector(".search-overlay");
  const closeSearch = document.querySelector(".close-search");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const cartList = document.getElementById('cart-list');
  const mobileCartList = document.getElementById('mobile-cart-list');
  const subtotalElement = document.getElementById('subtotal');
  const taxesElement = document.getElementById('taxes');
  const totalElement = document.getElementById('total');
  const clearCartBtn = document.getElementById('clear-cart');
  const checkoutBtn = document.getElementById('checkout-btn');
  const emptyCart = document.getElementById('empty-cart');
  const cartContent = document.getElementById('cart-content');
  const confirmModal = document.getElementById('confirm-modal');
  const modalMessage = document.getElementById('modal-message');
  const modalCancel = document.getElementById('modal-cancel');
  const modalConfirm = document.getElementById('modal-confirm');
  const closeModal = document.querySelector('.close-modal');
  const cartCountElement = document.querySelector('.cart-count');
  const notificationElement = document.getElementById('notification');
 
  // Check if we're on mobile
  const isMobile = () => window.innerWidth <= 768;
  
  // Initialize visual effects
  initVisualEffects();
  
  // Search Overlay
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
  
  // Mobile menu
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
  
  // Load cart data
  loadCart();
  
  // Event Listeners
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      showConfirmationModal(
        'Are you sure you want to clear your cart?',
        clearCart
      );
    });
  }
  
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      // In a real implementation, this button would lead to the checkout page
      showNotification('Redirecting to payment page...', 'success');
      
      setTimeout(() => {
        showConfirmationModal(
          'Are you sure you want to complete your purchase?',
          finishPurchase
        );
      }, 1000);
    });
  }
  
  // Confirmation modal management
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      hideConfirmationModal();
    });
  }
  
  if (modalCancel) {
    modalCancel.addEventListener('click', () => {
      hideConfirmationModal();
    });
  }
  
  // Recommended product buttons
  const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
  if (addToCartBtns) {
    addToCartBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const card = this.closest('.recommendation-card');
        const name = card.querySelector('h4').textContent;
        const price = parseFloat(card.querySelector('p').textContent.replace('$', ''));
        
        // Simulate adding to cart and show notification
        addToCart(name, price);
      });
    });
  }
  
  // Handle window resize for responsive behavior
  window.addEventListener('resize', () => {
    if (cartList && mobileCartList) {
      // Re-render cart items when switching between mobile and desktop
      const currentItems = getCurrentCartItems();
      if (currentItems.length > 0) {
        renderCartItems(currentItems);
      }
    }
  });
  
  // MAIN FUNCTIONS
  
  // Function to load cart products
  async function loadCart() {
    try {
      // Show loading animation
      showLoadingAnimation();
      
      // In a real environment, this would be the API call
      // const res = await fetch('http://localhost:3000/api/cart', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const data = await res.json();
      
      // Simulate data for demonstration
      const data = await simulateApiCall();
      
      // Hide loading animation
      hideLoadingAnimation();
      
      // Show empty cart if no products
      if (data.length === 0) {
        showEmptyCart();
        return;
      }
      
      // Show cart with products
      showPopulatedCart();
      
      // Render cart items
      renderCartItems(data);
      
      // Update summary and counter
      const subtotal = calculateSubtotalFromData(data);
      updateCartSummary(subtotal);
      updateCartCount(data.length);
      
    } catch (error) {
      console.error('Error loading cart:', error);
      showNotification('Error loading cart', 'error');
      hideLoadingAnimation();
    }
  }
  
  // Function to render cart items (responsive)
  function renderCartItems(data) {
    if (isMobile()) {
      renderMobileCartItems(data);
    } else {
      renderDesktopCartItems(data);
    }
  }
  
  // Render cart items for mobile
  function renderMobileCartItems(data) {
    if (!mobileCartList) return;
    
    // Clear current list
    mobileCartList.innerHTML = '';
    
    // Render each product
    data.forEach((item, index) => {
      const total = item.price * item.quantity;
      
      // Create mobile card
      const card = document.createElement('div');
      card.className = 'mobile-cart-item';
      card.dataset.id = item.id;
      card.style.animationDelay = `${index * 0.1}s`;
      
      card.innerHTML = `
        <div class="mobile-item-image">
          <img src="${item.image}" alt="${item.name}" class="product-image">
          <button class="mobile-remove-btn" data-id="${item.id}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
        <div class="mobile-item-details">
          <div class="mobile-item-info">
            <h4>${item.name}</h4>
            <p class="mobile-item-description">${item.description || ''}</p>
            <div class="mobile-item-price">$${item.price.toFixed(2)} each</div>
          </div>
          <div class="mobile-item-controls">
            <div class="mobile-quantity-controls">
              <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
              <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
              <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
            </div>
            <div class="mobile-item-total">
              <span class="total-label">Total:</span>
              <span class="product-total">$${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      `;
      
      mobileCartList.appendChild(card);
    });
    
    // Add event listeners to new buttons
    addCartItemListeners();
  }
  
  // Render cart items for desktop
  function renderDesktopCartItems(data) {
    if (!cartList) return;
    
    // Clear current list
    cartList.innerHTML = '';
    
    // Render each product
    data.forEach((item, index) => {
      const total = item.price * item.quantity;
      
      // Create table row
      const row = document.createElement('tr');
      row.dataset.id = item.id;
      row.style.animationDelay = `${index * 0.1}s`;
      
      row.innerHTML = `
        <td>
          <div class="product-info">
            <img src="${item.image}" alt="${item.name}" class="product-image">
            <div class="product-details">
              <h4>${item.name}</h4>
              <p>${item.description || ''}</p>
            </div>
          </div>
        </td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <div class="quantity-controls">
            <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
            <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
          </div>
        </td>
        <td class="product-total">$${total.toFixed(2)}</td>
        <td>
          <button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
        </td>
      `;
      
      cartList.appendChild(row);
    });
    
    // Add event listeners to new buttons
    addCartItemListeners();
  }
  
  // Function to add event listeners to cart elements
  function addCartItemListeners() {
    // Decrease quantity buttons
    const decreaseBtns = document.querySelectorAll('.decrease-btn');
    decreaseBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const input = this.parentElement.querySelector('.quantity-input') || 
                     this.closest('.mobile-cart-item').querySelector('.quantity-input');
        let value = parseInt(input.value);
        
        if (value > 1) {
          value--;
          input.value = value;
          modifyQuantity(id, value);
        }
      });
    });
    
    // Increase quantity buttons
    const increaseBtns = document.querySelectorAll('.increase-btn');
    increaseBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const input = this.parentElement.querySelector('.quantity-input') || 
                     this.closest('.mobile-cart-item').querySelector('.quantity-input');
        let value = parseInt(input.value);
        
        value++;
        input.value = value;
        modifyQuantity(id, value);
      });
    });
    
    // Quantity inputs
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
      input.addEventListener('change', function() {
        const id = this.getAttribute('data-id');
        let value = parseInt(this.value);
        
        // Validate minimum value
        if (value < 1) {
          value = 1;
          this.value = value;
        }
        
        modifyQuantity(id, value);
      });
    });
    
    // Remove buttons (both desktop and mobile)
    const removeBtns = document.querySelectorAll('.remove-btn, .mobile-remove-btn');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        showConfirmationModal(
          'Are you sure you want to remove this product?',
          () => removeFromCart(id)
        );
      });
    });
  }
  
  // Function to modify product quantity
  async function modifyQuantity(id, newQuantity) {
    try {
      // Simulate loading
      const element = document.querySelector(`[data-id="${id}"]`);
      element.classList.add('update-item');
      
      // In a real environment, this would be the API call
      // const res = await fetch('http://localhost:3000/api/cart/quantity', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({ id, quantity: parseInt(newQuantity) })
      // });
      // const data = await res.json();
      
      // Simulation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update the UI
      const product = findProductById(id);
      if (product) {
        product.quantity = newQuantity;
        updateProductElement(id, product);
        updateCartSummary(calculateSubtotal());
        showNotification('Quantity updated', 'success');
      }
      
      // Remove animation class
      setTimeout(() => {
        element.classList.remove('update-item');
      }, 500);
      
    } catch (error) {
      console.error('Error updating quantity:', error);
      showNotification('Error updating quantity', 'error');
    }
  }
  
  // Function to remove a product from cart
  async function removeFromCart(id) {
    try {
      const element = document.querySelector(`[data-id="${id}"]`);
      element.classList.add('remove-item');
      
      // In a real environment, this would be the API call
      // const res = await fetch(`http://localhost:3000/api/cart/${id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const data = await res.json();
      
      // Simulation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove element from DOM
      setTimeout(() => {
        element.remove();
        
        // Update summary
        const newSubtotal = calculateSubtotal();
        updateCartSummary(newSubtotal);
        
        // Update counter
        const itemCount = document.querySelectorAll('[data-id]').length;
        updateCartCount(itemCount);
        
        // Show empty cart if no products
        if (itemCount === 0) {
          showEmptyCart();
        }
        
        // Show notification
        showNotification('Product removed from cart', 'success');
      }, 500);
      
    } catch (error) {
      console.error('Error removing product:', error);
      showNotification('Error removing product', 'error');
    }
  }
  
  // Function to clear entire cart
  async function clearCart() {
    try {
      // In a real environment, this would be the API call
      // const res = await fetch('http://localhost:3000/api/cart/clear', {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const data = await res.json();
      
      // Simulation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show empty cart
      showEmptyCart();
      
      // Update counter
      updateCartCount(0);
      
      // Show notification
      showNotification('Cart cleared successfully', 'success');
      
    } catch (error) {
      console.error('Error clearing cart:', error);
      showNotification('Error clearing cart', 'error');
    }
  }
  
  // Function to finish purchase
  async function finishPurchase() {
    try {
      // In a real environment, this would be the API call
      // const res = await fetch('http://localhost:3000/api/orders', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const data = await res.json();
      
      // Simulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show empty cart
      showEmptyCart();
      
      // Update counter
      updateCartCount(0);
      
      // Show notification
      showNotification('Order placed successfully!', 'success');
      
      // After a moment, redirect to confirmation page
      setTimeout(() => {
        // window.location.href = 'confirmation.html';
        alert('In a real implementation, you would redirect to an order confirmation page here');
      }, 2000);
      
    } catch (error) {
      console.error('Error completing purchase:', error);
      showNotification('Error processing order', 'error');
    }
  }
  
  // Function to add a product to cart
  function addToCart(name, price) {
    // In a real environment, this would be the API call
    // const res = await fetch('http://localhost:3000/api/cart', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   },
    //   body: JSON.stringify({ productId: id, quantity: 1 })
    // });
    
    // Simulate adding to cart
    const currentCount = parseInt(cartCountElement.textContent);
    updateCartCount(currentCount + 1);
    showNotification(`${name} added to cart`, 'success');
    
    // In a real implementation, you would reload the cart
    // loadCart();
  }
  
  // UTILITY FUNCTIONS
  
  // Get current cart items from DOM
  function getCurrentCartItems() {
    const items = [];
    const elements = document.querySelectorAll('[data-id]');
    
    elements.forEach(element => {
      const id = element.dataset.id;
      const product = findProductById(id);
      if (product) {
        items.push(product);
      }
    });
    
    return items;
  }
  
  // Simulate API call to get cart products
  function simulateApiCall() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: 'THE TEMPTATION',
            description: 'Double meat, cheddar, crispy bacon and secret sauce',
            price: 12.95,
            quantity: 2,
            image: '../imagenes/burger-small1.jpg'
          },
          {
            id: 2,
            name: 'THE LUST',
            description: 'Aged meat, melted brie cheese and caramelized onion',
            price: 13.95,
            quantity: 1,
            image: '../imagenes/burger-small2.jpg'
          },
          {
            id: 3,
            name: 'THE WRATH',
            description: 'Meat, jalapeños, homemade hot sauce and guacamole',
            price: 13.50,
            quantity: 1,
            image: '../imagenes/burger-small3.jpg'
          }
        ]);
      }, 800);
    });
  }
  
  // Find product by ID
  function findProductById(id) {
    // Simulation - In a real app this would come from API or local state
    const products = [
      {
        id: 1,
        name: 'THE TEMPTATION',
        description: 'Double meat, cheddar, crispy bacon and secret sauce',
        price: 12.95,
        quantity: 2,
        image: '../imagenes/burger-small1.jpg'
      },
      {
        id: 2,
        name: 'THE LUST',
        description: 'Aged meat, melted brie cheese and caramelized onion',
        price: 13.95,
        quantity: 1,
        image: '../imagenes/burger-small2.jpg'
      },
      {
        id: 3,
        name: 'THE WRATH',
        description: 'Meat, jalapeños, homemade hot sauce and guacamole',
        price: 13.50,
        quantity: 1,
        image: '../imagenes/burger-small3.jpg'
      }
    ];
    
    return products.find(p => p.id === parseInt(id));
  }
  
  // Update product element
  function updateProductElement(id, product) {
    const element = document.querySelector(`[data-id="${id}"]`);
    if (element) {
      const totalElement = element.querySelector('.product-total');
      if (totalElement) {
        totalElement.textContent = `$${(product.price * product.quantity).toFixed(2)}`;
      }
    }
  }
  
  // Calculate subtotal from data
  function calculateSubtotalFromData(data) {
    return data.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  // Calculate subtotal from DOM
  function calculateSubtotal() {
    let subtotal = 0;
    const totalElements = document.querySelectorAll('.product-total');
    
    totalElements.forEach(element => {
      subtotal += parseFloat(element.textContent.replace('$', ''));
    });
    
    return subtotal;
  }
  
  // Update cart summary
  function updateCartSummary(subtotal) {
    if (subtotalElement && taxesElement && totalElement) {
      const taxes = subtotal * 0.10; // 10% tax
      const total = subtotal + taxes;
      
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
      taxesElement.textContent = `$${taxes.toFixed(2)}`;
      totalElement.textContent = `$${total.toFixed(2)}`;
    }
  }
  
  // Update cart counter
  function updateCartCount(count) {
    if (cartCountElement) {
      cartCountElement.textContent = count;
      
      // If there are products, add highlighted class
      if (count > 0) {
        cartCountElement.classList.add('highlighted');
      } else {
        cartCountElement.classList.remove('highlighted');
      }
    }
  }
  
  // Show empty cart
  function showEmptyCart() {
    if (emptyCart && cartContent) {
      emptyCart.style.display = 'block';
      cartContent.style.display = 'none';
    }
  }
  
  // Show populated cart
  function showPopulatedCart() {
    if (emptyCart && cartContent) {
      emptyCart.style.display = 'none';
      cartContent.style.display = 'block';
    }
  }
  
  // Show confirmation modal
  function showConfirmationModal(message, confirmCallback) {
    if (confirmModal && modalMessage) {
      modalMessage.textContent = message;
      confirmModal.classList.add('active');
      
      // Configure callback for confirm button
      modalConfirm.onclick = () => {
        hideConfirmationModal();
        if (confirmCallback) confirmCallback();
      };
    }
  }
  
  // Hide confirmation modal
  function hideConfirmationModal() {
    if (confirmModal) {
      confirmModal.classList.remove('active');
    }
  }
  
  // Show notification
  function showNotification(message, type = 'info') {
    if (notificationElement) {
      // Set message
      const messageElement = notificationElement.querySelector('.notification-message');
      if (messageElement) messageElement.textContent = message;
      
      // Set icon based on type
      const iconElement = notificationElement.querySelector('.notification-icon');
      if (iconElement) {
        iconElement.className = 'notification-icon fas';
        
        if (type === 'success') {
          iconElement.classList.add('fa-check-circle');
          notificationElement.classList.add('success');
        } else if (type === 'error') {
          iconElement.classList.add('fa-exclamation-circle');
          notificationElement.classList.remove('success');
        } else {
          iconElement.classList.add('fa-info-circle');
          notificationElement.classList.remove('success');
        }
      }
      
      // Show notification
      notificationElement.classList.add('active');
      
      // Hide after 3 seconds
      setTimeout(() => {
        notificationElement.classList.remove('active');
      }, 3000);
    }
  }
  
  // Show loading animation
  function showLoadingAnimation() {
    // Create and show loading indicator (spinner)
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
      <div class="loading-spinner">
        <i class="fas fa-circle-notch fa-spin"></i>
        <p>Loading your cart of sins...</p>
      </div>
    `;
    
    document.body.appendChild(loadingOverlay);
    
    // Add styles for overlay
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease-out;
      }
      
      .loading-spinner {
        text-align: center;
        color: var(--primary-color);
      }
      
      .loading-spinner i {
        font-size: 3rem;
        margin-bottom: 15px;
      }
      
      .loading-spinner p {
        font-size: 1.2rem;
        font-family: 'Bebas Neue', sans-serif;
        letter-spacing: 1px;
      }
    `;
    
    document.head.appendChild(styleElement);
  }
  
  // Hide loading animation
  function hideLoadingAnimation() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.remove();
      }, 300);
    }
  }
  
  // Initialize visual effects
  function initVisualEffects() {
    // Create fire particles
    setInterval(() => {
      const particle = document.createElement('div');
      particle.className = 'floating-ember';
      
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
      document.querySelector('.floating-embers').appendChild(particle);
      
      // Remove after animation
      setTimeout(() => {
        particle.remove();
      }, 5000);
    }, 500);
  }
});