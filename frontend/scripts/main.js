document.addEventListener("DOMContentLoaded", () => {
  // Inicializar animaciones AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: false,
      mirror: false
    });
  }

  // Elementos del DOM
  const carousel = document.getElementById("carousel");
  const prevBtn = document.querySelector(".prev-arrow");
  const nextBtn = document.querySelector(".next-arrow");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const cookieBanner = document.querySelector(".cookie-banner");
  const cookieAccept = document.querySelector(".cookie-accept");
  const cookieSettings = document.querySelector(".cookie-settings");
  const header = document.querySelector("header");
  const testimonialDots = document.querySelectorAll(".testimonial-dots .dot");
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  const burgerImage = document.querySelector(".burger-image");
  const burgerSlogan = document.querySelector(".burger-slogan");

  // Animación adicional para la hamburguesa principal
  if (burgerImage) {
    // Aplicar animación de pulso además de la animación de float
    burgerImage.style.animation = "float 6s ease-in-out infinite, pulse 4s ease-in-out infinite";
  }

  // Animación para el slogan
  if (burgerSlogan) {
    burgerSlogan.style.opacity = "0";
    setTimeout(() => {
      burgerSlogan.style.transition = "opacity 1s ease, transform 1s ease";
      burgerSlogan.style.opacity = "1";
      burgerSlogan.style.transform = "translateY(0) rotate(-5deg)";
    }, 1000);
  }

  // Control del carrusel
  if (carousel && nextBtn && prevBtn) {
    nextBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: 300, behavior: "smooth" });
    });

    prevBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: -300, behavior: "smooth" });
    });
  }

  // Header scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Menu móvil toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });
  }

  // Cookie banner
  if (cookieBanner && cookieAccept) {
    // Check if cookies are already accepted
    if (!localStorage.getItem("cookiesAccepted")) {
      // Show after 2 seconds
      setTimeout(() => {
        cookieBanner.style.display = "flex";
        cookieBanner.style.animation = "fadeInUp 0.5s ease-out forwards";
      }, 2000);
    } else {
      cookieBanner.style.display = "none";
    }

    cookieAccept.addEventListener("click", () => {
      localStorage.setItem("cookiesAccepted", "true");
      cookieBanner.style.animation = "fadeOutDown 0.5s ease-out forwards";
      setTimeout(() => {
        cookieBanner.style.display = "none";
      }, 500);
    });

    if (cookieSettings) {
      cookieSettings.addEventListener("click", () => {
        // Aquí podrías mostrar un modal de configuración de cookies
        alert("Configuración de cookies - Funcionalidad pendiente de implementar");
      });
    }
  }

  // Contador de tiempo para la promoción
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  if (hoursElement && minutesElement && secondsElement) {
    function updateCountdown() {
      let hours = parseInt(hoursElement.textContent);
      let minutes = parseInt(minutesElement.textContent);
      let seconds = parseInt(secondsElement.textContent);

      seconds--;

      if (seconds < 0) {
        seconds = 59;
        minutes--;
      }

      if (minutes < 0) {
        minutes = 59;
        hours--;
      }

      if (hours < 0) {
        // Reset the countdown when it reaches zero
        hours = 24;
        minutes = 0;
        seconds = 0;
      }

      hoursElement.textContent = hours.toString().padStart(2, "0");
      minutesElement.textContent = minutes.toString().padStart(2, "0");
      secondsElement.textContent = seconds.toString().padStart(2, "0");
    }

    // Actualizar el contador cada segundo
    setInterval(updateCountdown, 1000);
  }

  // Testimonial carrusel
  if (testimonialDots.length > 0 && testimonialCards.length > 0) {
    testimonialDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        // Remover la clase active de todos los dots y cards
        testimonialDots.forEach(d => d.classList.remove("active"));
        testimonialCards.forEach(card => card.classList.remove("active"));
        
        // Añadir clase active al dot y card seleccionados
        dot.classList.add("active");
        testimonialCards[index].classList.add("active");
      });
    });

    // Auto-rotación de testimonios cada 5 segundos
    let currentTestimonial = 1; // Comenzamos con el segundo (índice 1) que ya está activo

    function rotateTestimonials() {
      testimonialDots.forEach(d => d.classList.remove("active"));
      testimonialCards.forEach(card => card.classList.remove("active"));
      
      currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
      
      testimonialDots[currentTestimonial].classList.add("active");
      testimonialCards[currentTestimonial].classList.add("active");
    }

    // Iniciar la rotación automática
    const autoRotate = setInterval(rotateTestimonials, 5000);

    // Detener la rotación cuando el usuario interactúa
    testimonialDots.forEach(dot => {
      dot.addEventListener("click", () => {
        clearInterval(autoRotate);
      });
    });
  }

  // Video modal para el botón de "Ver Video"
  const playVideoBtn = document.querySelector(".play-video-btn");
  
  if (playVideoBtn) {
    playVideoBtn.addEventListener("click", () => {
      // Crear modal de video
      const videoModal = document.createElement("div");
      videoModal.className = "video-modal";
      
      videoModal.innerHTML = `
        <div class="video-modal-content">
          <span class="close-modal">&times;</span>
          <div class="video-container">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameborder="0" allowfullscreen></iframe>
          </div>
        </div>
      `;
      
      document.body.appendChild(videoModal);
      
      // Aplicar estilos al modal
      Object.assign(videoModal.style, {
        display: "flex",
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.9)",
        zIndex: "1001",
        justifyContent: "center",
        alignItems: "center",
        animation: "fadeIn 0.3s ease-out"
      });

      Object.assign(videoModal.querySelector(".video-modal-content").style, {
        backgroundColor: "#000",
        borderRadius: "10px",
        width: "90%",
        maxWidth: "800px",
        position: "relative"
      });

      Object.assign(videoModal.querySelector(".close-modal").style, {
        position: "absolute",
        top: "-40px",
        right: "0",
        color: "#fff",
        fontSize: "2rem",
        cursor: "pointer"
      });

      Object.assign(videoModal.querySelector(".video-container").style, {
        position: "relative",
        paddingBottom: "56.25%",
        height: "0",
        overflow: "hidden"
      });

      Object.assign(videoModal.querySelector("iframe").style, {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%"
      });
      
      // Cerrar el modal
      const closeModal = videoModal.querySelector(".close-modal");
      closeModal.addEventListener("click", () => {
        videoModal.style.animation = "fadeOut 0.3s ease-out";
        setTimeout(() => {
          document.body.removeChild(videoModal);
        }, 300);
      });
      
      // Cerrar modal al hacer clic fuera del contenido
      videoModal.addEventListener("click", (e) => {
        if (e.target === videoModal) {
          videoModal.style.animation = "fadeOut 0.3s ease-out";
          setTimeout(() => {
            document.body.removeChild(videoModal);
          }, 300);
        }
      });
    });
  }

  // Efecto parallax para el fondo
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const parallaxBg = document.querySelector(".parallax-bg");
    
    if (parallaxBg) {
      parallaxBg.style.transform = `translateY(${scrollY * 0.2}px)`;
    }
  });

  // Cargar hamburguesas destacadas desde el backend
  if (carousel) {
    fetch("http://localhost:3000/api/hamburguesas/destacadas")
      .then((res) => res.json())
      .then((data) => {
        carousel.innerHTML = ""; // Limpiar contenido anterior

        const colores = ["orange-bg", "green-bg", "purple-bg", "blue-bg"];

        data.forEach((burger, i) => {
          const color = colores[i % colores.length];

          const item = document.createElement("div");
          item.className = `carousel-item ${color}`;
          item.innerHTML = `
            <img src="${burger.imagen}" alt="${burger.nombre}" class="item-image">
            <h3 class="item-title">${burger.nombre}</h3>
            <p class="item-price">$${Number(burger.precio).toFixed(2)}</p>
            <button class="order-btn">Pedir Ahora</button>
          `;
          carousel.appendChild(item);

          // Añadir evento a los botones
          item.querySelector(".order-btn").addEventListener("click", () => {
            addToCart(burger);
          });
        });
      })
      .catch((err) => {
        console.error("Error al cargar hamburguesas destacadas:", err);
        
        // Datos fallback en caso de error en la API
        const fallbackData = [
          {
            id: 1,
            nombre: "Burger Gula",
            precio: 9.95,
            imagen: "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/burger-1.jpg"
          },
          {
            id: 2,
            nombre: "Tentación Doble",
            precio: 12.50,
            imagen: "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/burger-2.jpg"
          },
          {
            id: 3,
            nombre: "Pecado Original",
            precio: 10.95,
            imagen: "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/burger-3.jpg"
          },
          {
            id: 4,
            nombre: "Hell's Kitchen",
            precio: 11.95,
            imagen: "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/burger-4.jpg"
          }
        ];
        
        carousel.innerHTML = "";
        
        const colores = ["orange-bg", "green-bg", "purple-bg", "blue-bg"];
        
        fallbackData.forEach((burger, i) => {
          const color = colores[i % colores.length];

          const item = document.createElement("div");
          item.className = `carousel-item ${color}`;
          item.innerHTML = `
            <img src="${burger.imagen}" alt="${burger.nombre}" class="item-image">
            <h3 class="item-title">${burger.nombre}</h3>
            <p class="item-price">$${Number(burger.precio).toFixed(2)}</p>
            <button class="order-btn">Pedir Ahora</button>
          `;
          carousel.appendChild(item);
          
          // Añadir evento a los botones
          item.querySelector(".order-btn").addEventListener("click", () => {
            addToCart(burger);
          });
        });
      });
  }

  // Función para añadir productos al carrito
  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Comprobar si el producto ya está en el carrito
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
      // Incrementar cantidad si ya existe
      cart[existingProductIndex].quantity += 1;
    } else {
      // Añadir nuevo producto al carrito
      cart.push({
        ...product,
        quantity: 1
      });
    }
    
    // Guardar carrito en localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Mostrar notificación
    showNotification(`${product.nombre} añadido al carrito`);
    
    // Actualizar contador del carrito
    updateCartCount();
  }

  // Mostrar notificación
  function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    
    // Estilos de la notificación
    Object.assign(notification.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      padding: "10px 20px",
      backgroundColor: "var(--color-primary)",
      color: "white",
      borderRadius: "5px",
      boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
      zIndex: "1000",
      opacity: "0",
      transform: "translateY(20px)",
      transition: "all 0.3s ease"
    });
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateY(0)";
    }, 10);
    
    // Animar salida y eliminar
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(20px)";
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Actualizar contador del carrito
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartIcon = document.querySelector(".cart-icon");
    
    // Eliminar contador existente si hay
    const existingBadge = document.querySelector(".cart-badge");
    if (existingBadge) {
      existingBadge.remove();
    }
    
    // Calcular cantidad total de productos
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Crear y añadir el badge solo si hay items
    if (totalItems > 0 && cartIcon) {
      const badge = document.createElement("span");
      badge.className = "cart-badge";
      badge.textContent = totalItems;
      
      // Estilos del badge
      Object.assign(badge.style, {
        position: "absolute",
        top: "-8px",
        right: "-8px",
        backgroundColor: "var(--color-primary)",
        color: "white",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "12px",
        fontWeight: "bold"
      });
      
      // Posicionar relativamente el contenedor del icono
      cartIcon.style.position = "relative";
      
      // Añadir badge al icono del carrito
      cartIcon.appendChild(badge);
    }
  }

  // Inicializar contador del carrito al cargar la página
  updateCartCount();

  // Añadir eventos a todos los botones de añadir al carrito
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  
  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Obtener datos del producto desde el card más cercano
      const card = button.closest(".especialidad-card");
      const productName = card.querySelector("h3").textContent;
      const productPrice = parseFloat(card.querySelector(".especialidad-price span").textContent.replace("€", ""));
      const productImage = card.querySelector("img").src;
      
      // Crear objeto de producto
      const product = {
        id: productName.toLowerCase().replace(/\s+/g, "-"), // Crear un ID simple basado en el nombre
        nombre: productName,
        precio: productPrice,
        imagen: productImage
      };
      
      // Añadir al carrito
      addToCart(product);
    });
  });

  // Inicializar animaciones adicionales
  const animateElements = () => {
    // Efecto de desplazamiento para los elementos que están en el viewport
    const elements = document.querySelectorAll('.feature-card, .especialidad-card');
    elements.forEach(element => {
      if (isElementInViewport(element) && !element.classList.contains('animated')) {
        element.classList.add('animated');
        element.style.animation = 'fadeInUp 0.5s ease-out forwards';
      }
    });
  };

  // Comprobar si un elemento está en el viewport
  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  };

  // Ejecutar al cargar y al hacer scroll
  window.addEventListener('scroll', animateElements);
  animateElements();

  // Inicializar keyframe animations
  document.body.insertAdjacentHTML('beforeend', `
    <style>
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeOutDown {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(20px);
        }
      }
      
      .cart-badge {
        animation: pulse 2s infinite;
      }
    </style>
  `);
});