document.addEventListener('DOMContentLoaded', () => {
  // Variables globales
  const productosGrid = document.getElementById('productos-grid');
  const modal = document.getElementById('producto-modal');
  const closeModal = document.querySelector('.close-modal');
  const filtrosBtns = document.querySelectorAll('.filtro-btn');
  const categoriasItems = document.querySelectorAll('.categoria-item');
  
  // Datos de ejemplo - Acompañantes
  const acompanantes = [
    {
      id: 101,
      nombre: "PATATAS DEL INFIERNO",
      descripcion: "Patatas fritas crujientes con salsa picante, queso fundido y bacon crujiente",
      precio: 6.95,
      imagen: "../imagenes/patatas.jpg",
      rating: 4.7,
      badge: "bestseller",
      badgeText: "BESTSELLER",
      calorias: "520",
      tiempoPreparacion: "10 min",
      spicy: true,
      nuevo: false,
      vegetariano: false,
      ingredientes: ["Patatas frescas", "Salsa picante casera", "Queso cheddar fundido", "Bacon crujiente", "Cebollino"]
    },
    {
      id: 102,
      nombre: "ANILLOS DE CEBOLLA",
      descripcion: "Anillos de cebolla rebozados con nuestra mezcla especial y fritos hasta quedar crujientes",
      precio: 5.50,
      imagen: "../imagenes/aroscebolla.jpg",
      rating: 4.5,
      badge: "",
      badgeText: "",
      calorias: "450",
      tiempoPreparacion: "8 min",
      spicy: false,
      nuevo: false,
      vegetariano: true,
      ingredientes: ["Cebollas frescas", "Rebozado especial GULA", "Especias secretas", "Salsa GULA"]
    },
    {
      id: 103,
      nombre: "ALITAS PICANTES",
      descripcion: "Alitas de pollo marinadas, fritas y bañadas en nuestra salsa picante casera",
      precio: 8.95,
      imagen: "../imagenes/alitas.jpg",
      rating: 4.8,
      badge: "spicy",
      badgeText: "PICANTE",
      calorias: "680",
      tiempoPreparacion: "15 min",
      spicy: true,
      nuevo: false,
      vegetariano: false,
      ingredientes: ["Alitas de pollo", "Marinado especial", "Salsa picante casera", "Especias secretas", "Cilantro fresco"]
    },
    {
      id: 104,
      nombre: "NACHOS SUPREMOS",
      descripcion: "Nachos con queso fundido, guacamole, pico de gallo, jalapeños y crema agria",
      precio: 9.50,
      imagen: "../imagenes/nachos.jpg",
      rating: 4.6,
      badge: "bestseller",
      badgeText: "BESTSELLER",
      calorias: "720",
      tiempoPreparacion: "12 min",
      spicy: false,
      nuevo: false,
      vegetariano: true,
      ingredientes: ["Nachos caseros", "Queso cheddar fundido", "Guacamole fresco", "Pico de gallo", "Jalapeños", "Crema agria", "Cilantro"]
    },
    {
      id: 105,
      nombre: "DEDOS DE QUESO",
      descripcion: "Bastones de queso mozzarella rebozados y fritos con salsa marinara",
      precio: 7.25,
      imagen: "../imagenes/dedosqueso.jpg",
      rating: 4.4,
      badge: "",
      badgeText: "",
      calorias: "520",
      tiempoPreparacion: "10 min",
      spicy: false,
      nuevo: false,
      vegetariano: true,
      ingredientes: ["Queso mozzarella", "Rebozado crujiente", "Salsa marinara casera", "Hierbas italianas"]
    },
    {
      id: 106,
      nombre: "PATATAS TRUFADAS",
      descripcion: "Patatas fritas con aceite de trufa, queso parmesano rallado y perejil fresco",
      precio: 8.95,
      imagen: "../imagenes/patatastrufa.jpg",
      rating: 4.9,
      badge: "new",
      badgeText: "NUEVO",
      calorias: "480",
      tiempoPreparacion: "12 min",
      spicy: false,
      nuevo: true,
      vegetariano: true,
      ingredientes: ["Patatas frescas", "Aceite de trufa", "Queso parmesano", "Sal negra", "Perejil fresco", "Ajo confitado"]
    },
    {
      id: 107,
      nombre: "JALAPEÑOS RELLENOS",
      descripcion: "Jalapeños rellenos de queso crema, empanizados y fritos con salsa de chipotle",
      precio: 7.50,
      imagen: "../imagenes/jalapenos.jpg",
      rating: 4.5,
      badge: "spicy",
      badgeText: "PICANTE",
      calorias: "550",
      tiempoPreparacion: "15 min",
      spicy: true,
      nuevo: false,
      vegetariano: true,
      ingredientes: ["Jalapeños frescos", "Queso crema", "Queso cheddar", "Empanizado", "Salsa chipotle", "Cilantro fresco"]
    },
    {
      id: 108,
      nombre: "ENSALADA CÉSAR",
      descripcion: "Lechuga romana, crutones, queso parmesano y nuestra salsa César casera",
      precio: 6.95,
      imagen: "../imagenes/ensalada.jpg",
      rating: 4.3,
      badge: "vegan",
      badgeText: "VEGANO",
      calorias: "320",
      tiempoPreparacion: "8 min",
      spicy: false,
      nuevo: false,
      vegetariano: true,
      ingredientes: ["Lechuga romana", "Crutones caseros", "Queso parmesano", "Salsa César", "Limón", "Pimienta negra"]
    }
  ];

  // Cargar productos iniciales (acompañantes por defecto)
  cargarProductos(acompanantes);
  
  // Setup navegación entre categorías
  categoriasItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Obtener la URL de destino
      const destino = item.querySelector('.categoria-link').getAttribute('href');
      
      // Redirigir a la página correspondiente
      window.location.href = destino;
    });
  });
  
  // Setup filtros secundarios
  filtrosBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filtrosBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filtro = btn.getAttribute('data-filter');
      
      if (filtro === 'all') {
        cargarProductos(acompanantes);
      } else {
        const productosFiltrados = acompanantes.filter(p => {
          if (filtro === 'bestseller' && p.badge === 'bestseller') return true;
          if (filtro === 'new' && p.nuevo) return true;
          if (filtro === 'spicy' && p.spicy) return true;
          if (filtro === 'vegan' && p.vegetariano) return true;
          return false;
        });
        
        cargarProductos(productosFiltrados);
      }
    });
  });
  
  // Cerrar modal
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
  
  // Cerrar modal con Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
  
  // Cerrar modal al hacer clic fuera
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
  
  // Setup brasas flotantes
  setupFloatingEmbers();

  // Funciones principales
  function cargarProductos(productosArray) {
    productosGrid.innerHTML = '';
    
    // Mensaje si no hay productos
    if (productosArray.length === 0) {
      const noProductos = document.createElement('div');
      noProductos.className = 'no-productos';
      noProductos.innerHTML = `
        <i class="fas fa-search"></i>
        <h3>No hay productos disponibles</h3>
        <p>Prueba a cambiar los filtros o selecciona otra categoría</p>
      `;
      productosGrid.appendChild(noProductos);
      return;
    }
    
    productosArray.forEach(producto => {
      // Crear tarjeta de producto
      const card = document.createElement('div');
      card.className = 'producto-card';
      card.dataset.id = producto.id;
      
      // Determinar rating visual (estrellas)
      const estrellas = generarEstrellas(producto.rating);
      
      card.innerHTML = `
        ${producto.badge ? `<div class="producto-badge badge-${producto.badge}">${producto.badgeText}</div>` : ''}
        <div class="producto-img-container">
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <div class="producto-overlay"></div>
        </div>
        <div class="producto-content">
          <div>
            <h3 class="producto-nombre">${producto.nombre}</h3>
            <div class="estrellas-container">
              ${estrellas}
            </div>
          </div>
          <div class="producto-footer">
            <span class="producto-precio">${producto.precio.toFixed(2)}€</span>
            <button class="add-btn"><i class="fas fa-plus"></i></button>
          </div>
        </div>
      `;
      
      // Evento para abrir el modal con detalles
      card.addEventListener('click', () => {
        abrirModal(producto);
      });
      
      // Para el botón de añadir al carrito, evitar propagación
      const addBtn = card.querySelector('.add-btn');
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        añadirAlCarrito(producto, 1);
      });
      
      productosGrid.appendChild(card);
    });
    
    // Añadir animación de entrada
    setTimeout(() => {
      const productos = document.querySelectorAll('.producto-card');
      productos.forEach((producto, index) => {
        setTimeout(() => {
          producto.style.opacity = '0';
          producto.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            producto.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            producto.style.opacity = '1';
            producto.style.transform = 'translateY(0)';
          }, 50);
        }, index * 50);
      });
    }, 100);
  }
  
  function abrirModal(producto) {
    const modalBody = modal.querySelector('.modal-body');
    
    // Generar estrellas para rating
    const estrellas = generarEstrellasInteractivas(producto.rating);
    
    // Generar lista de ingredientes
    let ingredientesHTML = '';
    producto.ingredientes.forEach(ing => {
      ingredientesHTML += `
        <div class="ingredient-tag">
          <i class="fas fa-check"></i>
          <span>${ing}</span>
        </div>
      `;
    });
    
    // Determinar badge
    let badgeClass = producto.badge ? 'badge-' + producto.badge : '';
    
    modalBody.innerHTML = `
      <div class="modal-header">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="modal-header-overlay"></div>
        ${producto.badge ? `<div class="modal-badge ${badgeClass}">${producto.badgeText}</div>` : ''}
      </div>
      <div class="modal-detail">
        <h2 class="modal-title">${producto.nombre}</h2>
        <p class="modal-description">${producto.descripcion}</p>
        
        <div class="modal-info">
          <div class="info-group">
            <div class="info-label">Precio</div>
            <div class="info-value highlight">${producto.precio.toFixed(2)}€</div>
          </div>
          <div class="info-group">
            <div class="info-label">Calorías</div>
            <div class="info-value">${producto.calorias} kcal</div>
          </div>
          <div class="info-group">
            <div class="info-label">Tiempo</div>
            <div class="info-value">${producto.tiempoPreparacion}</div>
          </div>
          <div class="info-group">
            <div class="info-label">Tipo</div>
            <div class="info-value">${producto.vegetariano ? 'Vegetariano' : 'Normal'}</div>
          </div>
        </div>
        
        <div class="ingredients-title">Ingredientes</div>
        <div class="ingredients-list">
          ${ingredientesHTML}
        </div>
        
        <div class="rating-section">
          <div class="rating-title">¿Qué te ha parecido este producto?</div>
          <div class="rating-stars" data-product-id="${producto.id}">
            ${estrellas}
          </div>
        </div>
        
        <div class="modal-actions">
          <div class="quantity-selector">
            <div class="quantity-btn minus-btn">-</div>
            <input type="number" class="quantity-input" value="1" min="1" max="10">
            <div class="quantity-btn plus-btn">+</div>
          </div>
          <button class="add-to-cart-btn">
            <i class="fas fa-shopping-cart"></i>
            Añadir al carrito
          </button>
        </div>
      </div>
    `;
    
    // Configurar selector de cantidad
    const quantityInput = modalBody.querySelector('.quantity-input');
    const minusBtn = modalBody.querySelector('.minus-btn');
    const plusBtn = modalBody.querySelector('.plus-btn');
    
    minusBtn.addEventListener('click', () => {
      let value = parseInt(quantityInput.value);
      if (value > 1) {
        quantityInput.value = value - 1;
      }
    });
    
    plusBtn.addEventListener('click', () => {
      let value = parseInt(quantityInput.value);
      if (value < 10) {
        quantityInput.value = value + 1;
      }
    });
    
    // Configurar botón añadir al carrito
    const addToCartBtn = modalBody.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => {
      const cantidad = parseInt(quantityInput.value);
      añadirAlCarrito(producto, cantidad);
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
    
    // Configurar sistema de valoración
    const ratingStars = modalBody.querySelectorAll('.rating-star');
    ratingStars.forEach((star, index) => {
      star.addEventListener('click', () => {
        const rating = index + 1;
        valorarProducto(producto.id, rating);
        
        // Actualizar estrellas visuales
        ratingStars.forEach((s, i) => {
          if (i < rating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        
        // Mensaje de confirmación
        const ratingSection = modalBody.querySelector('.rating-section');
        const alreadyRated = document.createElement('div');
        alreadyRated.className = 'already-rated';
        alreadyRated.textContent = '¡Gracias por tu valoración!';
        ratingSection.appendChild(alreadyRated);
      });
    });
    
    // Mostrar modal con animación
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
  
  function generarEstrellas(rating) {
    let estrellas = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        estrellas += '<i class="fas fa-star estrella active"></i>';
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        estrellas += '<i class="fas fa-star-half-alt estrella active"></i>';
      } else {
        estrellas += '<i class="far fa-star estrella"></i>';
      }
    }
    return estrellas;
  }
  
  function generarEstrellasInteractivas(rating) {
    let estrellas = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        estrellas += `<i class="fas fa-star rating-star active" data-rating="${i}"></i>`;
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        estrellas += `<i class="fas fa-star-half-alt rating-star active" data-rating="${i}"></i>`;
      } else {
        estrellas += `<i class="far fa-star rating-star" data-rating="${i}"></i>`;
      }
    }
    return estrellas;
  }
  
  function añadirAlCarrito(producto, cantidad) {
    // Aquí iría la lógica de conexión con el backend
    // En este ejemplo, solo mostramos una notificación
    
    // Actualizar contador del carrito (simulación)
    const cartCount = document.querySelector('.cart-count');
    let currentCount = parseInt(cartCount.textContent);
    cartCount.textContent = currentCount + cantidad;
    cartCount.style.display = 'flex';
    
    // Mostrar notificación
    mostrarNotificacion(`${cantidad}x ${producto.nombre} añadido al carrito`, 'success');
    
    // Simular animación de "vuelo" al carrito
    const cartIcon = document.querySelector('.cart-icon');
    const cartRect = cartIcon.getBoundingClientRect();
    
    const flyingItem = document.createElement('div');
    flyingItem.className = 'flying-item';
    flyingItem.innerHTML = '<i class="fas fa-french-fries"></i>';
    flyingItem.style.position = 'fixed';
    flyingItem.style.zIndex = '9999';
    flyingItem.style.fontSize = '20px';
    flyingItem.style.color = 'var(--secondary-color)';
    flyingItem.style.transition = 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
    
    // Posición inicial
    flyingItem.style.top = `${window.innerHeight / 2}px`;
    flyingItem.style.left = `${window.innerWidth / 2}px`;
    
    document.body.appendChild(flyingItem);
    
    // Forzar reflow
    flyingItem.getBoundingClientRect();
    
    // Posición final (carrito)
    flyingItem.style.top = `${cartRect.top + 10}px`;
    flyingItem.style.left = `${cartRect.left + 10}px`;
    flyingItem.style.opacity = '0';
    flyingItem.style.transform = 'scale(0.3)';
    
    // Limpiar después de la animación
    setTimeout(() => {
      flyingItem.remove();
    }, 700);
  }
  
  function valorarProducto(productoId, rating) {
    // Simulación - aquí iría la lógica de conexión con el backend
    console.log(`Producto ${productoId} valorado con ${rating} estrellas`);
  }
  
  function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.getElementById('notification');
    const notificationMsg = notificacion.querySelector('.notification-message');
    const notificationIcon = notificacion.querySelector('.notification-icon');
    
    // Configurar icono según tipo
    if (tipo === 'success') {
      notificationIcon.className = 'notification-icon fas fa-check-circle';
    } else if (tipo === 'error') {
      notificationIcon.className = 'notification-icon fas fa-exclamation-circle';
    } else {
      notificationIcon.className = 'notification-icon fas fa-info-circle';
    }
    
    // Actualizar mensaje
    notificationMsg.textContent = mensaje;
    
    // Mostrar notificación
    notificacion.classList.add('show');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
      notificacion.classList.remove('show');
    }, 3000);
  }
  
  function setupFloatingEmbers() {
    const embersContainer = document.querySelector('.floating-embers');
    if (!embersContainer) return;
    
    // Limpiar brasas existentes
    embersContainer.innerHTML = '';
    
    // Crear brasas adicionales
    for (let i = 0; i < 20; i++) {
      const ember = document.createElement('div');
      ember.className = 'floating-ember';
      
      // Propiedades aleatorias
      const size = Math.random() * 6 + 4; // 4-10px
      ember.style.width = `${size}px`;
      ember.style.height = `${size}px`;
      
      // Posición horizontal aleatoria
      ember.style.left = `${Math.random() * 100}%`;
      
      // Colores aleatorios - para acompañantes usamos colores turquesa
      const colors = ['#00ffcc', '#00ccff', '#00ffaa', '#66ffcc'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      ember.style.backgroundColor = randomColor;
      ember.style.boxShadow = `0 0 10px ${randomColor}`;
      
      // Retraso y duración aleatorios
      ember.style.animationDelay = `${Math.random() * 5}s`;
      ember.style.animationDuration = `${Math.random() * 7 + 8}s`; // 8-15s
      
      embersContainer.appendChild(ember);
    }
  }
});