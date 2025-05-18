document.addEventListener('DOMContentLoaded', () => {
  // Variables globales
  const productosGrid = document.getElementById('productos-grid');
  const modal = document.getElementById('producto-modal');
  const closeModal = document.querySelector('.close-modal');
  const filtrosBtns = document.querySelectorAll('.filtro-btn');
  const categoriasItems = document.querySelectorAll('.categoria-item');
  
  // Datos de postres
  const postres = [
    {
      id: 301,
      nombre: "TARTA DEL PECADO",
      descripcion: "Tarta de chocolate intenso con centro líquido y helado de vainilla",
      precio: 7.50,
      imagen: "../imagenes/tarta.jpg",
      rating: 4.9,
      badge: "new",
      badgeText: "NUEVO",
      calorias: "750",
      tiempoPreparacion: "10 min",
      chocolate: true,
      nuevo: true,
      vegetariano: false,
      ingredientes: ["Chocolate negro 70%", "Mantequilla", "Huevos", "Azúcar", "Helado de vainilla", "Frutos rojos"]
    },
    {
      id: 302,
      nombre: "PECADO DE CHEESECAKE",
      descripcion: "Cheesecake cremoso con base de galleta y topping de frutos rojos",
      precio: 6.95,
      imagen: "../imagenes/tarta.jpg", // Placeholder
      rating: 4.8,
      badge: "bestseller",
      badgeText: "BESTSELLER",
      calorias: "580",
      tiempoPreparacion: "5 min",
      chocolate: false,
      nuevo: false,
      vegetariano: true,
      ingredientes: ["Queso crema", "Azúcar", "Galleta", "Mantequilla", "Frambuesas", "Arándanos", "Moras"]
    },
    {
      id: 303,
      nombre: "CREMA INFERNAL",
      descripcion: "Crema catalana flambeada con azúcar caramelizado y esencia de naranja",
      precio: 5.95,
      imagen: "../imagenes/tarta.jpg", // Placeholder
      rating: 4.6,
      badge: "",
      badgeText: "",
      calorias: "450",
      tiempoPreparacion: "15 min",
      chocolate: false,
      nuevo: false,
      vegetariano: true,
      ingredientes: ["Leche", "Yemas de huevo", "Azúcar", "Canela", "Ralladura de naranja", "Azúcar para caramelizar"]
    },
    {
      id: 304,
      nombre: "TENTACIÓN DE CHOCOLATE",
      descripcion: "Brownie tibio con nueces, salsa de chocolate caliente y helado de vainilla",
      precio: 7.95,
      imagen: "../imagenes/tarta.jpg", // Placeholder
      rating: 4.9,
      badge: "bestseller",
      badgeText: "BESTSELLER",
      calorias: "820",
      tiempoPreparacion: "8 min",
      chocolate: true,
      nuevo: false,
      vegetariano: true,
      ingredientes: ["Chocolate", "Mantequilla", "Huevos", "Azúcar", "Nueces", "Harina", "Helado de vainilla", "Salsa de chocolate"]
    },
    {
      id: 305,
      nombre: "LUJURIA TROPICAL",
      descripcion: "Sorbete de mango y maracuyá con crujiente de coco y salsa de fruta de la pasión",
      precio: 6.50,
      imagen: "../imagenes/tarta.jpg", // Placeholder
      rating: 4.7,
      badge: "vegan",
      badgeText: "VEGANO",
      calorias: "320",
      tiempoPreparacion: "5 min",
      chocolate: false,
      nuevo: true,
      vegetariano: true,
      ingredientes: ["Mango", "Maracuyá", "Azúcar", "Coco tostado", "Fruta de la pasión", "Hojas de menta"]
    },
    {
      id: 306,
      nombre: "VOLCÁN DE ORGULLO",
      descripcion: "Coulant de chocolate con interior fundido y tierra de chocolate amargo",
      precio: 8.50,
      imagen: "../imagenes/tarta.jpg", // Placeholder
      rating: 5.0,
      badge: "bestseller",
      badgeText: "DESTACADO",
      calorias: "680",
      tiempoPreparacion: "12 min",
      chocolate: true,
      nuevo: false,
      vegetariano: true,
      ingredientes: ["Chocolate negro 85%", "Mantequilla", "Huevos", "Azúcar", "Harina", "Cacao en polvo", "Sal de mar"]
    },
    {
      id: 307,
      nombre: "PECADO DE TIRAMISÚ",
      descripcion: "Tiramisú con café espresso, licor amaretto y cacao espolvoreado",
      precio: 7.25,
      imagen: "../imagenes/tarta.jpg", // Placeholder
      rating: 4.8,
      badge: "",
      badgeText: "",
      calorias: "520",
      tiempoPreparacion: "10 min",
      chocolate: true,
      nuevo: false,
      vegetariano: true,
      ingredientes: ["Mascarpone", "Huevos", "Azúcar", "Café espresso", "Licor Amaretto", "Bizcochos de soletilla", "Cacao en polvo"]
    },
    {
      id: 308,
      nombre: "FRUTA PROHIBIDA",
      descripcion: "Brocheta de frutas frescas con chocolate fundido y escamas de coco",
      precio: 5.95,
      imagen: "../imagenes/tarta.jpg", // Placeholder
      rating: 4.5,
      badge: "vegan",
      badgeText: "VEGANO",
      calorias: "280",
      tiempoPreparacion: "7 min",
      chocolate: true,
      nuevo: false,
      vegetariano: true,
      ingredientes: ["Fresas", "Piña", "Plátano", "Chocolate negro vegano", "Coco rallado", "Menta fresca"]
    }
  ];

  // Datos de hamburguesas (para navegación)
  const hamburguesas = [
    {
      id: 1,
      nombre: "LA GULA",
      descripcion: "Doble smash burger, queso ahumado, bacon crujiente y salsa especial",
      precio: 13.95,
      imagen: "../imagenes/la-gula.jpg",
      rating: 4.8,
      badge: "bestseller",
      badgeText: "BESTSELLER",
      calorias: "850",
      tiempoPreparacion: "15 min",
      spicy: false,
      nuevo: false,
      vegetariano: false,
      ingredientes: ["Carne de ternera 100%", "Queso cheddar ahumado", "Bacon crujiente", "Salsa GULA especial", "Pan brioche"]
    }
  ];
  
  // Datos de acompañantes (para la navegación)
  const acompanantes = [
    {
      id: 101,
      nombre: "PATATAS DEL INFIERNO",
      descripcion: "Patatas fritas crujientes con salsa picante, queso fundido y bacon",
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
    }
  ];
  
  // Datos de bebidas (para la navegación)
  const bebidas = [
    {
      id: 201,
      nombre: "BATIDO PECAMINOSO",
      descripcion: "Batido de chocolate, café y crema montada con sirope de caramelo",
      precio: 5.95,
      imagen: "../imagenes/batidochocolate.png",
      rating: 4.8,
      badge: "bestseller",
      badgeText: "BESTSELLER",
      calorias: "650",
      tiempoPreparacion: "5 min",
      alcoholic: false,
      nuevo: true,
      vegetariano: true,
      ingredientes: ["Helado de vainilla", "Chocolate belga", "Café espresso", "Crema montada", "Sirope de caramelo"]
    }
  ];

  // Cargar productos iniciales (postres por defecto)
  cargarProductos(postres);
  
  // Setup filtros de tipos de producto
  categoriasItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Obtener el href para determinar a qué página navegar
      const categoria = item.querySelector('.categoria-link').getAttribute('href');
      
      // Si es postres.html, actualizar vista actual sin recargar
      if (categoria.includes('postres')) {
        // Actualizar clase activa
        categoriasItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Restablecer filtros secundarios
        filtrosBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.filtro-btn[data-filter="all"]').classList.add('active');
        
        cargarProductos(postres);
        actualizarIconoHero('fa-ice-cream');
      } else {
        // Si es otra categoría, navegar a esa página
        window.location.href = categoria;
      }
    });
  });
  
  // Setup filtros secundarios
  filtrosBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filtrosBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filtro = btn.getAttribute('data-filter');
      
      if (filtro === 'all') {
        cargarProductos(postres);
      } else {
        const productosFiltrados = postres.filter(p => {
          if (filtro === 'bestseller' && p.badge === 'bestseller') return true;
          if (filtro === 'new' && p.nuevo) return true;
          if (filtro === 'chocolate' && p.chocolate) return true;
          if (filtro === 'vegan' && p.vegetariano) return true;
          return false;
        });
        
        cargarProductos(productosFiltrados);
      }
    });
  });
  
  // Función para actualizar el icono del héroe según la categoría
  function actualizarIconoHero(iconClass) {
    const heroIcon = document.querySelector('.sin-symbol i');
    heroIcon.className = '';
    heroIcon.classList.add('fas', iconClass);
    
    const dividerIcon = document.querySelector('.divider i');
    dividerIcon.className = '';
    dividerIcon.classList.add('fas', iconClass);
  }
  
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
            <div class="info-value">${producto.vegetariano ? 'Vegano' : 'Normal'}</div>
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
    flyingItem.innerHTML = '<i class="fas fa-ice-cream"></i>';
    flyingItem.style.position = 'fixed';
    flyingItem.style.zIndex = '9999';
    flyingItem.style.fontSize = '20px';
    flyingItem.style.color = 'var(--accent-color)';
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
      
      // Colores aleatorios (tonos amarillos y naranjas para postres)
      const colors = ['#ffcc00', '#ff9900', '#ffdd33', '#ffd700'];
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