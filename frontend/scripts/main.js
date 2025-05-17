/**
 * Gula Hamburguesas - Main JavaScript
 * Este script controla la funcionalidad interactiva del sitio web
 */

// Encapsulamiento para evitar conflictos con otros scripts
(function() {
  // Función que se ejecuta cuando el DOM está completamente cargado
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
    const carousel = document.getElementById("gula-carousel");
    const prevBtn = document.querySelector(".gula-prev-arrow");
    const nextBtn = document.querySelector(".gula-next-arrow");
    const menuToggle = document.querySelector(".gula-menu-toggle");
    const navLinks = document.querySelector(".gula-nav-links");
    const cookieBanner = document.querySelector(".gula-cookie-banner");
    const cookieAccept = document.querySelector(".gula-cookie-accept");
    const cookieSettings = document.querySelector(".gula-cookie-settings");
    const header = document.querySelector(".gula-header");
    const testimonialDots = document.querySelectorAll(".gula-testimonial-dots .gula-dot");
    const testimonialCards = document.querySelectorAll(".gula-testimonial-card");

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
      if (!localStorage.getItem("gulaHamburguesas_cookiesAccepted")) {
        // Show after 2 seconds
        setTimeout(() => {
          cookieBanner.style.display = "flex";
          cookieBanner.style.animation = "fadeInUp 0.5s ease-out forwards";
        }, 2000);
      }

      cookieAccept.addEventListener("click", () => {
        localStorage.setItem("gulaHamburguesas_cookiesAccepted", "true");
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
    const hoursElement = document.getElementById("gula-hours");
    const minutesElement = document.getElementById("gula-minutes");
    const secondsElement = document.getElementById("gula-seconds");

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
    const playVideoBtn = document.querySelector(".gula-play-video-btn");
    
    if (playVideoBtn) {
      playVideoBtn.addEventListener("click", () => {
        // Crear modal de video
        const videoModal = document.createElement("div");
        videoModal.className = "gula-video-modal";
        
        videoModal.innerHTML = `
          <div class="gula-video-modal-content">
            <span class="gula-close-modal">&times;</span>
            <div class="gula-video-container">
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

        Object.assign(videoModal.querySelector(".gula-video-modal-content").style, {
          backgroundColor: "#000",
          borderRadius: "10px",
          width: "90%",
          maxWidth: "800px",
          position: "relative"
        });

        Object.assign(videoModal.querySelector(".gula-close-modal").style, {
          position: "absolute",
          top: "-40px",
          right: "0",
          color: "#fff",
          fontSize: "2rem",
          cursor: "pointer"
        });

        Object.assign(videoModal.querySelector(".gula-video-container").style, {
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
        const closeModal = videoModal.querySelector(".gula-close-modal");
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
      const parallaxBg = document.querySelector(".gula-parallax-bg");
      
      if (parallaxBg) {
        parallaxBg.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
    });

    // Cargar hamburguesas destacadas (con backup local)
    if (carousel) {
      // Intentar cargar datos desde la API
      fetch("http://localhost:3000/api/hamburguesas/destacadas")
        .then((res) => res.json())
        .then((data) => {
          loadBurgers(data);
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
          
          loadBurgers(fallbackData);
        });

      // Función para cargar hamburguesas en el carrusel
      function loadBurgers(burgers) {
        carousel.innerHTML = ""; // Limpiar contenido anterior
        
        const colores = ["gula-orange-bg", "gula-green-bg", "gula-purple-bg", "gula-blue-bg"];
        
        burgers.forEach((burger, i) => {
          const color = colores[i % colores.length];

          const item = document.createElement("div");
          item.className = `gula-carousel-item ${color}`;
          item.innerHTML = `
            <img src="${burger.imagen}" alt="${burger.nombre}" class="gula-item-image">
            <h3 class="gula-item-title">${burger.nombre}</h3>
            <p class="gula-item-price">$${Number(burger.precio).toFixed(2)}</p>
            <button class="gula-order-btn">Pedir Ahora</button>
          `;
          carousel.appendChild(item);
          
          // Añadir evento a los botones
          item.querySelector(".gula-order-btn").addEventListener("click", () => {
            addToCart(burger);
          });
        });
      }
    }

    // Función para añadir productos al carrito
    function addToCart(product) {
      let cart = JSON.parse(localStorage.getItem("gulaHamburguesas_cart")) || [];
      
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
      localStorage.setItem("gulaHamburguesas_cart", JSON.stringify(cart));
      
      // Mostrar notificación
      showNotification(`${product.nombre} añadido al carrito`);
      
      // Actualizar contador del carrito
      updateCartCount();
    }

    // Mostrar notificación
    function showNotification(message) {
      // Crear elemento de notificación
      const notification = document.createElement("div");
      notification.className = "gula-notification";
      notification.textContent = message;
      
      // Estilos de la notificación
      Object.assign(notification.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "10px 20px",
        backgroundColor: "var(--gula-color-primary)",
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
      const cart = JSON.parse(localStorage.getItem("gulaHamburguesas_cart")) || [];
      const cartIcon = document.querySelector(".gula-cart-icon");
      
      // Eliminar contador existente si hay
      const existingBadge = document.querySelector(".gula-cart-badge");
      if (existingBadge) {
        existingBadge.remove();
      }
      
      // Calcular cantidad total de productos
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      
      // Crear y añadir el badge solo si hay items
      if (totalItems > 0 && cartIcon) {
        const badge = document.createElement("span");
        badge.className = "gula-cart-badge";
        badge.textContent = totalItems;
        
        // Estilos del badge
        Object.assign(badge.style, {
          position: "absolute",
          top: "-8px",
          right: "-8px",
          backgroundColor: "var(--gula-color-primary)",
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
    const addToCartButtons = document.querySelectorAll(".gula-add-to-cart-btn");
    
    addToCartButtons.forEach(button => {
      button.addEventListener("click", () => {
        // Obtener datos del producto desde el card más cercano
        const card = button.closest(".gula-especialidad-card");
        const productName = card.querySelector("h3").textContent;
        const productPrice = parseFloat(card.querySelector(".gula-especialidad-price span").textContent.replace("€", ""));
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
      const elements = document.querySelectorAll('.gula-feature-card, .gula-especialidad-card');
      elements.forEach(element => {
        if (isElementInViewport(element) && !element.classList.contains('gula-animated')) {
          element.classList.add('gula-animated');
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
  });
})();/**
 * Gula Hamburguesas - Main JavaScript
 * Este script controla la funcionalidad interactiva del sitio web
 */

// Encapsulamiento para evitar conflictos con otros scripts
(function() {
  // Función que se ejecuta cuando el DOM está completamente cargado
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
    const carousel = document.getElementById("gula-carousel");
    const prevBtn = document.querySelector(".gula-prev-arrow");
    const nextBtn = document.querySelector(".gula-next-arrow");
    const menuToggle = document.querySelector(".gula-menu-toggle");
    const navLinks = document.querySelector(".gula-nav-links");
    const cookieBanner = document.querySelector(".gula-cookie-banner");
    const cookieAccept = document.querySelector(".gula-cookie-accept");
    const cookieSettings = document.querySelector(".gula-cookie-settings");
    const header = document.querySelector(".gula-header");
    const testimonialDots = document.querySelectorAll(".gula-testimonial-dots .gula-dot");
    const testimonialCards = document.querySelectorAll(".gula-testimonial-card");

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
      if (!localStorage.getItem("gulaHamburguesas_cookiesAccepted")) {
        // Show after 2 seconds
        setTimeout(() => {
          cookieBanner.style.display = "flex";
          cookieBanner.style.animation = "fadeInUp 0.5s ease-out forwards";
        }, 2000);
      }

      cookieAccept.addEventListener("click", () => {
        localStorage.setItem("gulaHamburguesas_cookiesAccepted", "true");
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
    const hoursElement = document.getElementById("gula-hours");
    const minutesElement = document.getElementById("gula-minutes");
    const secondsElement = document.getElementById("gula-seconds");

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
    const playVideoBtn = document.querySelector(".gula-play-video-btn");
    
    if (playVideoBtn) {
      playVideoBtn.addEventListener("click", () => {
        // Crear modal de video
        const videoModal = document.createElement("div");
        videoModal.className = "gula-video-modal";
        
        videoModal.innerHTML = `
          <div class="gula-video-modal-content">
            <span class="gula-close-modal">&times;</span>
            <div class="gula-video-container">
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

        Object.assign(videoModal.querySelector(".gula-video-modal-content").style, {
          backgroundColor: "#000",
          borderRadius: "10px",
          width: "90%",
          maxWidth: "800px",
          position: "relative"
        });

        Object.assign(videoModal.querySelector(".gula-close-modal").style, {
          position: "absolute",
          top: "-40px",
          right: "0",
          color: "#fff",
          fontSize: "2rem",
          cursor: "pointer"
        });

        Object.assign(videoModal.querySelector(".gula-video-container").style, {
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
        const closeModal = videoModal.querySelector(".gula-close-modal");
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
      const parallaxBg = document.querySelector(".gula-parallax-bg");
      
      if (parallaxBg) {
        parallaxBg.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
    });

    // Cargar hamburguesas destacadas desde archivos JSON
    if (carousel) {
      // Cargar los datos de los diferentes productos
      Promise.all([
        fetch("../data/hamburguesas.json").then(res => res.json()).catch(() => []),
        fetch("../data/bebidas.json").then(res => res.json()).catch(() => []),
        fetch("../data/postres.json").then(res => res.json()).catch(() => [])
      ])
      .then(([hamburguesas, bebidas, postres]) => {
        // Combinar y mostrar solo los productos destacados
        const destacados = [
          ...hamburguesas.filter(item => item.destacado).slice(0, 3),
          ...bebidas.filter(item => item.destacado).slice(0, 2),
          ...postres.filter(item => item.destacado).slice(0, 2)
        ];
        
        if (destacados.length > 0) {
          loadProducts(destacados);
        } else {
          // Si no hay destacados o falló la carga, usar datos de fallback
          loadFallbackProducts();
        }
      })
      .catch(error => {
        console.error("Error al cargar los productos destacados:", error);
        loadFallbackProducts();
      });

      // Función para cargar productos en el carrusel
      function loadProducts(products) {
        carousel.innerHTML = ""; // Limpiar contenido anterior
        
        const colores = ["gula-orange-bg", "gula-green-bg", "gula-purple-bg", "gula-blue-bg"];
        
        products.forEach((product, i) => {
          const color = colores[i % colores.length];

          const item = document.createElement("div");
          item.className = `gula-carousel-item ${color}`;
          item.innerHTML = `
            <img src="${product.imagen}" alt="${product.nombre}" class="gula-item-image">
            <h3 class="gula-item-title">${product.nombre}</h3>
            <p class="gula-item-price">€${Number(product.precio).toFixed(2)}</p>
            <button class="gula-order-btn">Pedir Ahora</button>
          `;
          carousel.appendChild(item);
          
          // Añadir evento a los botones
          item.querySelector(".gula-order-btn").addEventListener("click", () => {
            addToCart(product);
          });
        });
      }

      // Datos de fallback en caso de error
      function loadFallbackProducts() {
        const fallbackData = [
          {
            id: 1,
            nombre: "Lucifer's Feast",
            precio: 12.95,
            imagen: "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/20250420_2222_Lucifers+Feast+Hamburguesa_sharp_01jsacrfvs0z9zqnhz4q2vemyr.png",
            categoria: "hamburguesas"
          },
          {
            id: 2,
            nombre: "Eden's Temptation",
            precio: 11.50,
            imagen: "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/20250420_2224_Eden+Temptation+Hamburguesa_sharp_01jsad8rvcq8crjt5hngd0taq8.png",
            categoria: "hamburguesas"
          },
          {
            id: 3,
            nombre: "Seven Deadly Sins",
            precio: 14.95,
            imagen: "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/20250420_2225_Seven+Deadly+Sins+Hamburguesa_sharp_01jsadkq1h1w1h5qdyxsttgqcs.png",
            categoria: "hamburguesas"
          },
          {
            id: 4,
            nombre: "Bloody Mary",
            precio: 5.95,
            imagen: "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/bloody-mary.jpg",
            categoria: "bebidas"
          },
          {
            id: 5,
            nombre: "Death by Chocolate",
            precio: 6.50,
            imagen: "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/death-by-chocolate.jpg",
            categoria: "postres"
          },
          {
            id: 6,
            nombre: "Inferno Wings",
            precio: 8.95,
            imagen: "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/inferno-wings.jpg",
            categoria: "acompañantes"
          }
        ];
        
        loadProducts(fallbackData);
      }
    }

    // Función para añadir productos al carrito
    function addToCart(product) {
      let cart = JSON.parse(localStorage.getItem("gulaHamburguesas_cart")) || [];
      
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
      localStorage.setItem("gulaHamburguesas_cart", JSON.stringify(cart));
      
      // Mostrar notificación
      showNotification(`${product.nombre} añadido al carrito`);
      
      // Actualizar contador del carrito
      updateCartCount();
    }

    // Mostrar notificación
    function showNotification(message) {
      // Crear elemento de notificación
      const notification = document.createElement("div");
      notification.className = "gula-notification";
      notification.textContent = message;
      
      // Estilos de la notificación
      Object.assign(notification.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "10px 20px",
        backgroundColor: "var(--gula-color-primary)",
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
      const cart = JSON.parse(localStorage.getItem("gulaHamburguesas_cart")) || [];
      const cartIcon = document.querySelector(".gula-cart-icon");
      
      // Eliminar contador existente si hay
      const existingBadge = document.querySelector(".gula-cart-badge");
      if (existingBadge) {
        existingBadge.remove();
      }
      
      // Calcular cantidad total de productos
      const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      
      // Crear y añadir el badge solo si hay items
      if (totalItems > 0 && cartIcon) {
        const badge = document.createElement("span");
        badge.className = "gula-cart-badge";
        badge.textContent = totalItems;
        
        // Estilos del badge
        Object.assign(badge.style, {
          position: "absolute",
          top: "-8px",
          right: "-8px",
          backgroundColor: "var(--gula-color-primary)",
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
    const addToCartButtons = document.querySelectorAll(".gula-add-to-cart-btn");
    
    addToCartButtons.forEach(button => {
      button.addEventListener("click", () => {
        // Obtener datos del producto desde el card más cercano
        const card = button.closest(".gula-especialidad-card");
        const productName = card.querySelector("h3").textContent;
        const productPrice = parseFloat(card.querySelector(".gula-especialidad-price span").textContent.replace("€", ""));
        const productImage = card.querySelector("img").src;
        
        // Crear objeto de producto
        const product = {
          id: productName.toLowerCase().replace(/\s+/g, "-"), // Crear un ID simple basado en el nombre
          nombre: productName,
          precio: productPrice,
          imagen: productImage,
          categoria: "hamburguesas"
        };
        
        // Añadir al carrito
        addToCart(product);
      });
    });

    // Inicializar animaciones adicionales
    const animateElements = () => {
      // Efecto de desplazamiento para los elementos que están en el viewport
      const elements = document.querySelectorAll('.gula-feature-card, .gula-especialidad-card, .gula-category-card');
      elements.forEach(element => {
        if (isElementInViewport(element) && !element.classList.contains('gula-animated')) {
          element.classList.add('gula-animated');
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
  });
})();