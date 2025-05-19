document.addEventListener('DOMContentLoaded', () => {
  console.log("🔥 Carrito cargado correctamente - Modo Infernal activado");
  
  // Referencias a elementos DOM
  const searchToggle = document.getElementById("search-toggle");
  const searchOverlay = document.querySelector(".search-overlay");
  const closeSearch = document.querySelector(".close-search");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const listaCarrito = document.getElementById('lista-carrito');
  const subtotalElement = document.getElementById('subtotal');
  const impuestosElement = document.getElementById('impuestos');
  const totalElement = document.getElementById('total');
  const clearCartBtn = document.getElementById('clear-cart');
  const checkoutBtn = document.getElementById('checkout-btn');
  const carritoVacio = document.getElementById('carrito-vacio');
  const carritoContenido = document.getElementById('carrito-contenido');
  const confirmModal = document.getElementById('confirm-modal');
  const modalMessage = document.getElementById('modal-message');
  const modalCancel = document.getElementById('modal-cancel');
  const modalConfirm = document.getElementById('modal-confirm');
  const closeModal = document.querySelector('.close-modal');
  const cartCountElement = document.querySelector('.cart-count');
  const notificationElement = document.getElementById('notification');
 
  
  // Inicializar efectos visuales
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
  
  // Menú móvil
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
  
  // Cargar datos del carrito
  cargarCarrito();
  
  // Event Listeners
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      showConfirmationModal(
        '¿Estás seguro de que quieres vaciar el carrito?',
        vaciarCarrito
      );
    });
  }
  
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      // En una implementación real, este botón llevaría a la página de checkout
      showNotification('Redirigiendo a la página de pago...', 'success');
      
      setTimeout(() => {
        showConfirmationModal(
          '¿Estás seguro de que quieres finalizar tu compra?',
          finalizarCompra
        );
      }, 1000);
    });
  }
  
  // Gestión del modal de confirmación
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
  
  // Botones de productos recomendados
  const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
  if (addToCartBtns) {
    addToCartBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const card = this.closest('.recommendation-card');
        const nombre = card.querySelector('h4').textContent;
        const precio = parseFloat(card.querySelector('p').textContent.replace('€', ''));
        
        // Simular añadir al carrito y mostrar notificación
        addToCart(nombre, precio);
      });
    });
  }
  
  // FUNCIONES PRINCIPALES
  
  // Función para cargar los productos del carrito
  async function cargarCarrito() {
    try {
      // Mostrar animación de carga
      showLoadingAnimation();
      
      // En un entorno real, esta sería la llamada a la API
      // const res = await fetch('http://localhost:3000/api/carrito', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const datos = await res.json();
      
      // Simular datos para demostración
      const datos = await simulateApiCall();
      
      // Ocultar animación de carga
      hideLoadingAnimation();
      
      // Mostrar carrito vacío si no hay productos
      if (datos.length === 0) {
        showEmptyCart();
        return;
      }
      
      // Mostrar carrito con productos
      showPopulatedCart();
      
      // Limpiar la lista actual
      listaCarrito.innerHTML = '';
      
      // Variables para cálculos
      let subtotal = 0;
      
      // Renderizar cada producto
      datos.forEach((item, index) => {
        const total = item.precio * item.cantidad;
        subtotal += total;
        
        // Crear la fila del producto
        const fila = document.createElement('tr');
        fila.dataset.id = item.id;
        fila.style.animationDelay = `${index * 0.1}s`;
        
        fila.innerHTML = `
          <td>
            <div class="product-info">
              <img src="${item.imagen}" alt="${item.nombre}" class="product-image">
              <div class="product-details">
                <h4>${item.nombre}</h4>
                <p>${item.descripcion || ''}</p>
              </div>
            </div>
          </td>
          <td>${item.precio.toFixed(2)} €</td>
          <td>
            <div class="quantity-controls">
              <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
              <input type="number" class="quantity-input" value="${item.cantidad}" min="1" data-id="${item.id}">
              <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
            </div>
          </td>
          <td class="product-total">${(item.precio * item.cantidad).toFixed(2)} €</td>
          <td>
            <button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
          </td>
        `;
        
        listaCarrito.appendChild(fila);
      });
      
      // Añadir event listeners a los nuevos botones
      addCartItemListeners();
      
      // Actualizar resumen y contador
      updateCartSummary(subtotal);
      updateCartCount(datos.length);
      
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      showNotification('Error al cargar el carrito', 'error');
      hideLoadingAnimation();
    }
  }
  
  // Función para añadir event listeners a los elementos del carrito
  function addCartItemListeners() {
    // Botones de disminuir cantidad
    const decreaseBtns = document.querySelectorAll('.decrease-btn');
    decreaseBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const input = this.parentElement.querySelector('.quantity-input');
        let value = parseInt(input.value);
        
        if (value > 1) {
          value--;
          input.value = value;
          modificarCantidad(id, value);
        }
      });
    });
    
    // Botones de aumentar cantidad
    const increaseBtns = document.querySelectorAll('.increase-btn');
    increaseBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const input = this.parentElement.querySelector('.quantity-input');
        let value = parseInt(input.value);
        
        value++;
        input.value = value;
        modificarCantidad(id, value);
      });
    });
    
    // Inputs de cantidad
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
      input.addEventListener('change', function() {
        const id = this.getAttribute('data-id');
        let value = parseInt(this.value);
        
        // Validar valor mínimo
        if (value < 1) {
          value = 1;
          this.value = value;
        }
        
        modificarCantidad(id, value);
      });
    });
    
    // Botones de eliminar
    const removeBtns = document.querySelectorAll('.remove-btn');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        showConfirmationModal(
          '¿Estás seguro de que quieres eliminar este producto?',
          () => eliminarDelCarrito(id)
        );
      });
    });
  }
  
  // Función para modificar la cantidad de un producto
  async function modificarCantidad(id, nuevaCantidad) {
    try {
      // Simular carga
      const row = document.querySelector(`tr[data-id="${id}"]`);
      row.classList.add('update-item');
      
      // En un entorno real, esta sería la llamada a la API
      // const res = await fetch('http://localhost:3000/api/carrito/cantidad', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({ id, cantidad: parseInt(nuevaCantidad) })
      // });
      // const datos = await res.json();
      
      // Simulación
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Actualizar la UI
      const producto = findProductById(id);
      if (producto) {
        producto.cantidad = nuevaCantidad;
        updateProductRow(id, producto);
        updateCartSummary(calculateSubtotal());
        showNotification('Cantidad actualizada', 'success');
      }
      
      // Quitar la clase de animación
      setTimeout(() => {
        row.classList.remove('update-item');
      }, 500);
      
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      showNotification('Error al actualizar la cantidad', 'error');
    }
  }
  
  // Función para eliminar un producto del carrito
  async function eliminarDelCarrito(id) {
    try {
      const row = document.querySelector(`tr[data-id="${id}"]`);
      row.classList.add('remove-item');
      
      // En un entorno real, esta sería la llamada a la API
      // const res = await fetch(`http://localhost:3000/api/carrito/${id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const datos = await res.json();
      
      // Simulación
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Eliminar fila de la tabla
      setTimeout(() => {
        row.remove();
        
        // Actualizar resumen
        const nuevoSubtotal = calculateSubtotal();
        updateCartSummary(nuevoSubtotal);
        
        // Actualizar contador
        const itemCount = document.querySelectorAll('#lista-carrito tr').length;
        updateCartCount(itemCount);
        
        // Mostrar carrito vacío si no hay productos
        if (itemCount === 0) {
          showEmptyCart();
        }
        
        // Mostrar notificación
        showNotification('Producto eliminado del carrito', 'success');
      }, 500);
      
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      showNotification('Error al eliminar el producto', 'error');
    }
  }
  
  // Función para vaciar todo el carrito
  async function vaciarCarrito() {
    try {
      // En un entorno real, esta sería la llamada a la API
      // const res = await fetch('http://localhost:3000/api/carrito/vaciar', {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const datos = await res.json();
      
      // Simulación
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mostrar carrito vacío
      showEmptyCart();
      
      // Actualizar contador
      updateCartCount(0);
      
      // Mostrar notificación
      showNotification('Carrito vaciado correctamente', 'success');
      
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      showNotification('Error al vaciar el carrito', 'error');
    }
  }
  
  // Función para finalizar la compra
  async function finalizarCompra() {
    try {
      // En un entorno real, esta sería la llamada a la API
      // const res = await fetch('http://localhost:3000/api/pedidos', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const datos = await res.json();
      
      // Simulación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mostrar carrito vacío
      showEmptyCart();
      
      // Actualizar contador
      updateCartCount(0);
      
      // Mostrar notificación
      showNotification('¡Pedido realizado con éxito!', 'success');
      
      // Después de un momento, redirigir a una página de confirmación
      setTimeout(() => {
        // window.location.href = 'confirmacion.html';
        alert('En una implementación real, aquí redirigirías a una página de confirmación de pedido');
      }, 2000);
      
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      showNotification('Error al procesar el pedido', 'error');
    }
  }
  
  // Función para agregar un producto al carrito
  function addToCart(nombre, precio) {
    // En un entorno real, esta sería la llamada a la API
    // const res = await fetch('http://localhost:3000/api/carrito', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   },
    //   body: JSON.stringify({ productoId: id, cantidad: 1 })
    // });
    
    // Simular la adición al carrito
    const currentCount = parseInt(cartCountElement.textContent);
    updateCartCount(currentCount + 1);
    showNotification(`${nombre} añadido al carrito`, 'success');
    
    // En una implementación real, recargarías el carrito
    // cargarCarrito();
  }
  
  // FUNCIONES DE UTILIDAD
  
  // Simular una llamada a la API para obtener los productos del carrito
  function simulateApiCall() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            nombre: 'LA TENTACIÓN',
            descripcion: 'Doble carne, cheddar, bacon crujiente y salsa secreta',
            precio: 12.95,
            cantidad: 2,
            imagen: '../imagenes/burger-small1.jpg'
          },
          {
            id: 2,
            nombre: 'LA LUJURIA',
            descripcion: 'Carne madurada, queso brie fundido y cebolla caramelizada',
            precio: 13.95,
            cantidad: 1,
            imagen: '../imagenes/burger-small2.jpg'
          },
          {
            id: 3,
            nombre: 'LA IRA',
            descripcion: 'Carne, jalapeños, salsa picante casera y guacamole',
            precio: 13.50,
            cantidad: 1,
            imagen: '../imagenes/burger-small3.jpg'
          }
        ]);
      }, 800);
    });
  }
  
  // Encontrar un producto por ID
  function findProductById(id) {
    // Simulación - En una app real esto vendría de la API o del estado local
    const products = [
      {
        id: 1,
        nombre: 'LA TENTACIÓN',
        descripcion: 'Doble carne, cheddar, bacon crujiente y salsa secreta',
        precio: 12.95,
        cantidad: 2,
        imagen: '../imagenes/burger-small1.jpg'
      },
      {
        id: 2,
        nombre: 'LA LUJURIA',
        descripcion: 'Carne madurada, queso brie fundido y cebolla caramelizada',
        precio: 13.95,
        cantidad: 1,
        imagen: '../imagenes/burger-small2.jpg'
      },
      {
        id: 3,
        nombre: 'LA IRA',
        descripcion: 'Carne, jalapeños, salsa picante casera y guacamole',
        precio: 13.50,
        cantidad: 1,
        imagen: '../imagenes/burger-small3.jpg'
      }
    ];
    
    return products.find(p => p.id === parseInt(id));
  }
  
  // Actualizar una fila de producto
  function updateProductRow(id, producto) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
      const totalCell = row.querySelector('.product-total');
      totalCell.textContent = `${(producto.precio * producto.cantidad).toFixed(2)} €`;
    }
  }
  
  // Calcular subtotal
  function calculateSubtotal() {
    let subtotal = 0;
    const totalCells = document.querySelectorAll('.product-total');
    
    totalCells.forEach(cell => {
      subtotal += parseFloat(cell.textContent.replace('€', ''));
    });
    
    return subtotal;
  }
  
  // Actualizar el resumen del carrito
  function updateCartSummary(subtotal) {
    if (subtotalElement && impuestosElement && totalElement) {
      const impuestos = subtotal * 0.10; // 10% de IVA
      const total = subtotal + impuestos;
      
      subtotalElement.textContent = `${subtotal.toFixed(2)} €`;
      impuestosElement.textContent = `${impuestos.toFixed(2)} €`;
      totalElement.textContent = `${total.toFixed(2)} €`;
    }
  }
  
  // Actualizar el contador del carrito
  function updateCartCount(count) {
    if (cartCountElement) {
      cartCountElement.textContent = count;
      
      // Si hay productos, agregar la clase "highlighted"
      if (count > 0) {
        cartCountElement.classList.add('highlighted');
      } else {
        cartCountElement.classList.remove('highlighted');
      }
    }
  }
  
  // Mostrar carrito vacío
  function showEmptyCart() {
    if (carritoVacio && carritoContenido) {
      carritoVacio.style.display = 'block';
      carritoContenido.style.display = 'none';
    }
  }
  
  // Mostrar carrito con productos
  function showPopulatedCart() {
    if (carritoVacio && carritoContenido) {
      carritoVacio.style.display = 'none';
      carritoContenido.style.display = 'block';
    }
  }
  
  // Mostrar modal de confirmación
  function showConfirmationModal(message, confirmCallback) {
    if (confirmModal && modalMessage) {
      modalMessage.textContent = message;
      confirmModal.classList.add('active');
      
      // Configurar el callback para el botón de confirmar
      modalConfirm.onclick = () => {
        hideConfirmationModal();
        if (confirmCallback) confirmCallback();
      };
    }
  }
  
  // Ocultar modal de confirmación
  function hideConfirmationModal() {
    if (confirmModal) {
      confirmModal.classList.remove('active');
    }
  }
  
  // Mostrar notificación
  function showNotification(message, type = 'info') {
    if (notificationElement) {
      // Establecer el mensaje
      const messageElement = notificationElement.querySelector('.notification-message');
      if (messageElement) messageElement.textContent = message;
      
      // Establecer el icono según el tipo
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
      
      // Mostrar la notificación
      notificationElement.classList.add('active');
      
      // Ocultar después de 3 segundos
      setTimeout(() => {
        notificationElement.classList.remove('active');
      }, 3000);
    }
  }
  
  // Mostrar animación de carga
  function showLoadingAnimation() {
    // Crear y mostrar un indicador de carga (spinner)
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
      <div class="loading-spinner">
        <i class="fas fa-circle-notch fa-spin"></i>
        <p>Cargando tu carrito de pecados...</p>
      </div>
    `;
    
    document.body.appendChild(loadingOverlay);
    
    // Agregar estilos para el overlay
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
  
  // Ocultar animación de carga
  function hideLoadingAnimation() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.remove();
      }, 300);
    }
  }
  
  // Inicializar efectos visuales
  function initVisualEffects() {
    // Crear partículas de fuego
    setInterval(() => {
      const particle = document.createElement('div');
      particle.className = 'floating-ember';
      
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
      document.querySelector('.floating-embers').appendChild(particle);
      
      // Eliminar después de la animación
      setTimeout(() => {
        particle.remove();
      }, 5000);
    }, 500);
  }
});