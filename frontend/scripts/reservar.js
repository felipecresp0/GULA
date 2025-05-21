// Archivo unificado para la funcionalidad del formulario de reserva de GULA FoodTruck
document.addEventListener('DOMContentLoaded', function() {
  // Referencias a elementos principales del formulario
  const reservaForm = document.getElementById('reserva-form');
  const formInputs = reservaForm ? reservaForm.querySelectorAll('input, select, textarea') : [];
  const modal = document.getElementById('confirmation-modal');
  const closeModal = document.querySelector('.close-modal');
  const modalButton = document.querySelector('.modal-button');
  const faqItems = document.querySelectorAll('.faq-item');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots = document.querySelectorAll('.dot');
  
  // Elementos específicos
  const fechaInput = document.getElementById('fecha');
  const direccionInput = document.getElementById('direccion');
  const ciudadInput = document.getElementById('ciudad');
  const codigoPostalInput = document.getElementById('codigo-postal');
  const tipoEventoSelect = document.getElementById('tipo-evento');

  // ---------------------------------------------------------------------------
  // INICIALIZACIÓN DE ELEMENTOS Y CONFIGURACIÓN BÁSICA
  // ---------------------------------------------------------------------------
  
  // Establecer la fecha mínima (hoy) para el campo de fecha
  if (fechaInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const minDate = `${year}-${month}-${day}`;
    fechaInput.setAttribute('min', minDate);
  }
  
  // Inicializar AOS para animaciones de scroll si está disponible
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      delay: 100,
      easing: 'ease-out'
    });
  }

  // ---------------------------------------------------------------------------
  // FUNCIONALIDAD 1: INDICADOR DE PROGRESO DEL FORMULARIO
  // ---------------------------------------------------------------------------
  if (reservaForm && document.querySelector('.form-header')) {
    // Crear el indicador de progreso
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'form-progress';
    progressIndicator.innerHTML = `
      <div class="progress-step active" data-step="1">
        <div class="step-number">1</div>
        <div class="step-label">DATOS DE CONTACTO</div>
      </div>
      <div class="progress-step" data-step="2">
        <div class="step-number">2</div>
        <div class="step-label">DATOS DEL EVENTO</div>
      </div>
      <div class="progress-step" data-step="3">
        <div class="step-number">3</div>
        <div class="step-label">MENÚ Y UBICACIÓN</div>
      </div>
    `;
    
    // Insertar el indicador de progreso después del encabezado del formulario
    const formHeader = document.querySelector('.form-header');
    formHeader.parentNode.insertBefore(progressIndicator, formHeader.nextSibling);
    
    // Función para actualizar el progreso basado en la posición de scroll
    function updateProgressIndicator() {
      const scrollPosition = window.scrollY;
      const formTop = reservaForm.getBoundingClientRect().top + window.scrollY;
      const formHeight = reservaForm.offsetHeight;
      
      // Calcular en qué tercio del formulario estamos
      const formProgress = (scrollPosition - formTop + 300) / formHeight;
      
      const progressSteps = document.querySelectorAll('.progress-step');
      
      if (formProgress < 0.3) {
        // Primer paso activo
        progressSteps[0].classList.add('active');
        progressSteps[0].classList.remove('completed');
        progressSteps[1].classList.remove('active', 'completed');
        progressSteps[2].classList.remove('active', 'completed');
      } else if (formProgress < 0.6) {
        // Segundo paso activo, primero completado
        progressSteps[0].classList.remove('active');
        progressSteps[0].classList.add('completed');
        progressSteps[1].classList.add('active');
        progressSteps[1].classList.remove('completed');
        progressSteps[2].classList.remove('active', 'completed');
      } else {
        // Tercer paso activo, primero y segundo completados
        progressSteps[0].classList.remove('active');
        progressSteps[0].classList.add('completed');
        progressSteps[1].classList.remove('active');
        progressSteps[1].classList.add('completed');
        progressSteps[2].classList.add('active');
      }
    }
    
    // Actualizar el progreso al hacer scroll
    window.addEventListener('scroll', updateProgressIndicator);
    
    // Actualizar el progreso inicialmente
    updateProgressIndicator();
  }

  // ---------------------------------------------------------------------------
  // FUNCIONALIDAD 2: SELECTOR DE MENÚS
  // ---------------------------------------------------------------------------
  if (reservaForm && document.getElementById('invitados')) {
    // Crear el contenedor del selector de menús
    const menuSelector = document.createElement('div');
    menuSelector.className = 'menu-selector-section';
    menuSelector.innerHTML = `
      <div class="menu-selector-header">
        <i class="fas fa-utensils"></i>
        <h3>SELECCIONA UN MENÚ</h3>
      </div>
      <div class="menu-options">
        <div class="menu-option" data-menu="basico">
          <div class="menu-name">MENÚ BÁSICO</div>
          <div class="menu-price">14€/persona</div>
          <div class="menu-description">Perfecto para eventos pequeños y reuniones informales.</div>
          <ul class="menu-items">
            <li><i class="fas fa-circle"></i> 1 hamburguesa a elegir por persona</li>
            <li><i class="fas fa-circle"></i> Patatas fritas</li>
            <li><i class="fas fa-circle"></i> 1 bebida por persona</li>
          </ul>
        </div>
        <div class="menu-option" data-menu="tentacion">
          <div class="menu-badge">POPULAR</div>
          <div class="menu-name">TENTACIÓN</div>
          <div class="menu-price">19€/persona</div>
          <div class="menu-description">Nuestra opción más popular para todo tipo de eventos.</div>
          <ul class="menu-items">
            <li><i class="fas fa-circle"></i> 1 hamburguesa a elegir por persona</li>
            <li><i class="fas fa-circle"></i> Patatas fritas deluxe</li>
            <li><i class="fas fa-circle"></i> 1 entrante a compartir (4 pers.)</li>
            <li><i class="fas fa-circle"></i> 1 bebida por persona</li>
            <li><i class="fas fa-circle"></i> 1 postre por persona</li>
          </ul>
        </div>
        <div class="menu-option" data-menu="pecado">
          <div class="menu-name">PECADO CAPITAL</div>
          <div class="menu-price">25€/persona</div>
          <div class="menu-description">La experiencia completa para eventos especiales.</div>
          <ul class="menu-items">
            <li><i class="fas fa-circle"></i> 1 hamburguesa a elegir por persona</li>
            <li><i class="fas fa-circle"></i> Patatas fritas deluxe o aros de cebolla</li>
            <li><i class="fas fa-circle"></i> 2 entrantes a compartir (4 pers.)</li>
            <li><i class="fas fa-circle"></i> Barra libre de bebidas (2h)</li>
            <li><i class="fas fa-circle"></i> 1 postre premium por persona</li>
            <li><i class="fas fa-circle"></i> Café</li>
          </ul>
        </div>
      </div>
      <div class="custom-menu-container">
        <label for="custom-menu" class="custom-menu-label">Especificaciones o requisitos del menú:</label>
        <textarea id="custom-menu" name="custom-menu" class="custom-menu-textarea" placeholder="Indica cualquier personalización del menú, alergias, intolerancias o necesidades dietéticas especiales..."></textarea>
      </div>
      <input type="hidden" id="menu-seleccionado" name="menu-seleccionado" value="">
    `;
    
    // Insertar el selector de menús después del campo de número de invitados
    const invitadosGroup = document.getElementById('invitados').closest('.form-group');
    invitadosGroup.parentNode.insertBefore(menuSelector, invitadosGroup.nextSibling);
    
    // Activar la selección de menús
    const menuOptions = document.querySelectorAll('.menu-option');
    const customMenuContainer = document.querySelector('.custom-menu-container');
    const menuSeleccionadoInput = document.getElementById('menu-seleccionado');
    
    menuOptions.forEach(option => {
      option.addEventListener('click', function() {
        // Desactivar todas las opciones
        menuOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Activar la opción seleccionada
        this.classList.add('selected');
        
        // Mostrar el contenedor de menú personalizado
        customMenuContainer.classList.add('active');
        
        // Actualizar el valor del campo oculto
        menuSeleccionadoInput.value = this.getAttribute('data-menu');
        
        // Calcular precio total estimado
        const menuPrecio = parseFloat(this.querySelector('.menu-price').textContent.match(/\d+/)[0]);
        const invitados = parseInt(document.getElementById('invitados').value) || 0;
        const precioTotal = menuPrecio * invitados;
        
        // Mostrar precio total si tenemos ambos datos
        if (invitados > 0) {
          // Si ya existe, actualizarlo, si no, crearlo
          let precioInfo = document.querySelector('.precio-total-info');
          if (!precioInfo) {
            precioInfo = document.createElement('div');
            precioInfo.className = 'precio-total-info';
            customMenuContainer.appendChild(precioInfo);
          }
          
          precioInfo.innerHTML = `<p>Precio total estimado: <strong>${precioTotal.toFixed(2)}€</strong> (${menuPrecio}€ × ${invitados} personas)</p>`;
          precioInfo.style.color = '#ff8c00';
          precioInfo.style.marginTop = '10px';
          precioInfo.style.fontFamily = "'Montserrat', sans-serif";
          precioInfo.style.fontWeight = 'bold';
        }
      });
    });
    
    // Actualizar precio total cuando cambia el número de invitados
    document.getElementById('invitados').addEventListener('change', function() {
      const selectedMenu = document.querySelector('.menu-option.selected');
      if (selectedMenu) {
        // Simular click para actualizar el precio
        selectedMenu.click();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // FUNCIONALIDAD 3: VISTA PREVIA DE DISPONIBILIDAD DE FECHA
  // ---------------------------------------------------------------------------
  if (fechaInput) {
    // Crear el contenedor de vista previa de fecha
    const datePreview = document.createElement('div');
    datePreview.className = 'date-preview';
    datePreview.innerHTML = `
      <div class="date-preview-header">
        <i class="fas fa-calendar-check"></i>
        <span>Disponibilidad para la fecha seleccionada</span>
      </div>
      <div class="date-preview-content">
        Cargando disponibilidad...
      </div>
    `;
    
    // Insertar después del campo de fecha
    const fechaGroup = fechaInput.closest('.form-group');
    fechaGroup.appendChild(datePreview);
    
    // Función para simular la comprobación de disponibilidad
    function checkDateAvailability(date) {
      // Simulación de datos de disponibilidad (en un entorno real, esto sería una llamada a la API)
      const dateObj = new Date(date);
      const day = dateObj.getDay(); // 0 = domingo, 6 = sábado
      const month = dateObj.getMonth(); // 0 = enero
      
      let status = '';
      let message = '';
      
      // Lógica de disponibilidad basada en día de la semana y temporada
      if (day === 5 || day === 6) { // Viernes y sábados
        if (month >= 5 && month <= 8) { // Temporada alta (junio a septiembre)
          status = 'limited';
          message = 'Disponibilidad limitada para esta fecha. ¡Fin de semana en temporada alta! Recomendamos confirmar cuanto antes.';
        } else {
          status = 'available';
          message = 'Fecha disponible. Los fines de semana son populares, recomendamos reservar con antelación.';
        }
      } else if (day === 0) { // Domingos
        status = 'available';
        message = 'Fecha disponible. Los domingos tenemos disponibilidad limitada de horas (12:00 - 20:00).';
      } else if (month >= 5 && month <= 8) { // Días de semana en temporada alta
        status = 'available';
        message = 'Fecha disponible. Estás reservando en temporada alta, asegúrate de confirmar con antelación.';
      } else {
        status = 'available';
        message = 'Fecha disponible. Excelente elección, tenemos completa disponibilidad para esta fecha.';
      }
      
      // Fechas no disponibles (simuladas) - En un entorno real se obtendrían de la base de datos
      const unavailableDates = [
        '2025-05-01', // Día del Trabajador
        '2025-05-15', // Día festivo local
        '2025-06-24', // San Juan
        '2025-07-25', // Santiago Apóstol
        '2025-08-15'  // Asunción
      ];
      
      if (unavailableDates.includes(date)) {
        status = 'unavailable';
        message = 'Lo sentimos, esta fecha no está disponible. Por favor, selecciona otra fecha.';
      }
      
      return { status, message };
    }
    
    // Evento para mostrar la disponibilidad al cambiar la fecha
    fechaInput.addEventListener('change', function() {
      if (this.value) {
        const { status, message } = checkDateAvailability(this.value);
        
        // Actualizar el contenido
        const previewContent = datePreview.querySelector('.date-preview-content');
        previewContent.innerHTML = `
          ${message}
          <div class="date-status ${status}">${status === 'available' ? 'Disponible' : status === 'limited' ? 'Disponibilidad limitada' : 'No disponible'}</div>
        `;
        
        // Mostrar la vista previa
        datePreview.classList.add('active');
        
        // Si no está disponible, destacar el campo
        if (status === 'unavailable') {
          fechaInput.style.borderColor = 'var(--error-color)';
          fechaInput.style.boxShadow = '0 0 0 2px rgba(255, 59, 48, 0.2)';
        } else {
          fechaInput.style.borderColor = '';
          fechaInput.style.boxShadow = '';
        }
      } else {
        datePreview.classList.remove('active');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // FUNCIONALIDAD 4: VISTA PREVIA DE MAPA DE UBICACIÓN
  // ---------------------------------------------------------------------------
  if (direccionInput && ciudadInput && codigoPostalInput) {
    // Crear el contenedor del mapa
    const mapContainer = document.createElement('div');
    mapContainer.className = 'location-map-container';
    mapContainer.innerHTML = `
      <div class="location-map-placeholder">
        <i class="fas fa-map-marker-alt"></i>
        <p>Introduce una dirección completa para ver la ubicación en el mapa</p>
      </div>
      <iframe class="location-map" style="display: none;" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
    `;
    
    // Insertar después del campo de código postal
    const ubicacionGroup = codigoPostalInput.closest('.form-group');
    ubicacionGroup.parentNode.appendChild(mapContainer);
    
    // Función para comprobar si todos los campos de ubicación están completos
    function checkLocationFields() {
      if (direccionInput.value && ciudadInput.value && codigoPostalInput.value) {
        const direccionCompleta = `${direccionInput.value}, ${ciudadInput.value}, ${codigoPostalInput.value}, España`;
        
        // Actualizar el mapa (usando OpenStreetMap para visualización simple)
        const mapIframe = mapContainer.querySelector('.location-map');
        
        // Codificar la dirección para la URL
        const encodedAddress = encodeURIComponent(direccionCompleta);
        
        // En un entorno real, se usaría una API de geocodificación como Google Maps, Mapbox o Nominatim
        // Esto es un placeholder que usa OpenStreetMap con una región estimada de España
        const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=-8.0%2C36.0%2C5.0%2C44.0&layer=mapnik&marker=41.5%2C2.0`;
        
        mapIframe.src = mapUrl;
        mapIframe.style.display = 'block';
        mapContainer.querySelector('.location-map-placeholder').style.display = 'none';
        
        // Mostrar el contenedor del mapa
        mapContainer.classList.add('active');
      }
    }
    
    // Eventos para comprobar los campos de ubicación cuando cambian
    [direccionInput, ciudadInput, codigoPostalInput].forEach(input => {
      input.addEventListener('change', checkLocationFields);
      input.addEventListener('blur', checkLocationFields);
    });
  }

  // ---------------------------------------------------------------------------
  // FUNCIONALIDAD 5: CAMBIO DE CAMPOS SEGÚN TIPO DE EVENTO
  // ---------------------------------------------------------------------------
  if (tipoEventoSelect) {
    tipoEventoSelect.addEventListener('change', function() {
      const eventType = this.value;
      
      // Ejemplo: Mostrar campos adicionales según el tipo de evento
      if (eventType === 'boda') {
        // Si no existe ya, crear campos adicionales para bodas
        if (!document.getElementById('nombre-pareja')) {
          const additionalFields = document.createElement('div');
          additionalFields.className = 'form-group wedding-fields';
          additionalFields.innerHTML = `
            <label for="nombre-pareja">Nombre de la pareja</label>
            <input type="text" id="nombre-pareja" name="nombre-pareja" placeholder="Nombres de los novios">
            <div class="wedding-info" style="margin-top: 10px; font-size: 14px; color: #ff8c00;">
              <i class="fas fa-info-circle"></i> ¡Tenemos propuestas especiales para bodas! Podemos personalizar las hamburguesas con los nombres de los novios.
            </div>
          `;
          
          // Insertar después del selector de tipo de evento
          const tipoEventoGroup = tipoEventoSelect.closest('.form-group');
          tipoEventoGroup.parentNode.insertBefore(additionalFields, tipoEventoGroup.nextSibling);
          
          // Animar la entrada
          setTimeout(() => {
            additionalFields.classList.add('active');
          }, 10);
        }
      } else if (eventType === 'corporativo') {
        // Si no existe ya, crear campos adicionales para eventos corporativos
        if (!document.getElementById('nombre-empresa')) {
          const additionalFields = document.createElement('div');
          additionalFields.className = 'form-group corporate-fields';
          additionalFields.style.maxHeight = '0';
          additionalFields.style.overflow = 'hidden';
          additionalFields.style.opacity = '0';
          additionalFields.style.transition = 'all 0.3s ease';
          additionalFields.innerHTML = `
            <label for="nombre-empresa">Nombre de la empresa</label>
            <input type="text" id="nombre-empresa" name="nombre-empresa" placeholder="Nombre de tu empresa">
            <div class="corporate-info" style="margin-top: 10px; font-size: 14px; color: #ff8c00;">
              <i class="fas fa-info-circle"></i> Ofrecemos un 10% de descuento para pedidos corporativos de más de 50 personas.
            </div>
          `;
          
          // Insertar después del selector de tipo de evento
          const tipoEventoGroup = tipoEventoSelect.closest('.form-group');
          tipoEventoGroup.parentNode.insertBefore(additionalFields, tipoEventoGroup.nextSibling);
          
          // Animar la entrada
          setTimeout(() => {
            additionalFields.style.maxHeight = '100px';
            additionalFields.style.opacity = '1';
            additionalFields.style.marginTop = '20px';
          }, 10);
        }
      } else {
        // Eliminar campos específicos de boda y corporativos si existen
        const weddingFields = document.querySelector('.wedding-fields');
        if (weddingFields) {
          weddingFields.classList.remove('active');
          setTimeout(() => {
            weddingFields.remove();
          }, 300);
        }
        
        const corporateFields = document.querySelector('.corporate-fields');
        if (corporateFields) {
          corporateFields.style.maxHeight = '0';
          corporateFields.style.opacity = '0';
          corporateFields.style.marginTop = '0';
          setTimeout(() => {
            corporateFields.remove();
          }, 300);
        }
      }
    });
  }

  // ---------------------------------------------------------------------------
  // FUNCIONALIDAD 6: VALIDACIÓN DEL FORMULARIO
  // ---------------------------------------------------------------------------
  if (reservaForm) {
    reservaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      let firstInvalidField = null;
      
      // Validar cada campo requerido
      formInputs.forEach(input => {
        if (input.hasAttribute('required')) {
          const errorElement = document.getElementById('error-' + input.id);
          
          // Limpiar error previo
          if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
          }
          
          // Verificar campos vacíos
          if (!input.value.trim()) {
            isValid = false;
            if (errorElement) {
              errorElement.textContent = 'Este campo es obligatorio';
              errorElement.classList.add('show');
            }
            
            if (!firstInvalidField) {
              firstInvalidField = input;
            }
            return;
          }
          
          // Validaciones específicas
          if (input.id === 'email' && !isValidEmail(input.value)) {
            isValid = false;
            if (errorElement) {
              errorElement.textContent = 'Por favor, introduce un email válido';
              errorElement.classList.add('show');
            }
            
            if (!firstInvalidField) {
              firstInvalidField = input;
            }
          }
          
          if (input.id === 'telefono' && !isValidPhone(input.value)) {
            isValid = false;
            if (errorElement) {
              errorElement.textContent = 'Por favor, introduce un número de teléfono válido';
              errorElement.classList.add('show');
            }
            
            if (!firstInvalidField) {
              firstInvalidField = input;
            }
          }
          
          if (input.id === 'codigo-postal' && !isValidPostalCode(input.value)) {
            isValid = false;
            if (errorElement) {
              errorElement.textContent = 'Por favor, introduce un código postal válido';
              errorElement.classList.add('show');
            }
            
            if (!firstInvalidField) {
              firstInvalidField = input;
            }
          }
          
          if (input.id === 'terminos' && !input.checked) {
            isValid = false;
            if (errorElement) {
              errorElement.textContent = 'Debes aceptar los términos y condiciones';
              errorElement.classList.add('show');
            }
            
            if (!firstInvalidField) {
              firstInvalidField = input;
            }
          }
        }
      });
      
      // Validar que se haya seleccionado un menú
      const menuSeleccionadoInput = document.getElementById('menu-seleccionado');
      if (menuSeleccionadoInput && !menuSeleccionadoInput.value) {
        isValid = false;
        // Crear mensaje de error para el menú si no existe
        let menuError = document.querySelector('.menu-error');
        if (!menuError) {
          menuError = document.createElement('div');
          menuError.className = 'error-message menu-error show';
          menuError.textContent = 'Por favor, selecciona un menú para el evento';
          menuError.style.marginTop = '15px';
          
          const menuSelector = document.querySelector('.menu-selector-section');
          if (menuSelector) {
            menuSelector.appendChild(menuError);
          }
        } else {
          menuError.classList.add('show');
        }
        
        // Si no hay otro campo inválido, poner foco en la sección de menús
        if (!firstInvalidField) {
          const menuOptions = document.querySelector('.menu-options');
          if (menuOptions) {
            menuOptions.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
      
      // Ir al primer campo inválido
      if (firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // Si el formulario es válido, mostrar confirmación y enviar
      if (isValid) {
        // Generar un número de referencia único
        const refNumber = generateReferenceNumber();
        document.getElementById('reference-id').textContent = refNumber;
        
        // Mostrar modal de confirmación
        modal.classList.add('show');
        
        // Resetear formulario
        reservaForm.reset();
        
        // Limpiar menú seleccionado
        const menuOptions = document.querySelectorAll('.menu-option');
        menuOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Ocultar contenedores adicionales
        const customMenuContainer = document.querySelector('.custom-menu-container');
        if (customMenuContainer) {
          customMenuContainer.classList.remove('active');
        }
        
        const datePreview = document.querySelector('.date-preview');
        if (datePreview) {
          datePreview.classList.remove('active');
        }
        
        const mapContainer = document.querySelector('.location-map-container');
        if (mapContainer) {
          mapContainer.classList.remove('active');
        }
        
        // Eliminar campos condicionales según evento
        const weddingFields = document.querySelector('.wedding-fields');
        if (weddingFields) {
          weddingFields.remove();
        }
        
        const corporateFields = document.querySelector('.corporate-fields');
        if (corporateFields) {
          corporateFields.remove();
        }
      }
    });
  }

  // ---------------------------------------------------------------------------
  // FUNCIONALIDAD 7: CONTROLES DEL MODAL
  // ---------------------------------------------------------------------------
  if (closeModal) {
    closeModal.addEventListener('click', function() {
      modal.classList.remove('show');
    });
  }
  
  if (modalButton) {
    modalButton.addEventListener('click', function() {
      modal.classList.remove('show');
    });
  }
  
  // Cerrar modal si se hace clic fuera
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });

  // ---------------------------------------------------------------------------
  // FUNCIONALIDAD 8: ACORDEÓN DE PREGUNTAS FRECUENTES
  // ---------------------------------------------------------------------------
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', function() {
        // Cerrar todas las otras preguntas
        faqItems.forEach(faq => {
          if (faq !== item) {
            faq.classList.remove('active');
          }
        });
        
        // Alternar la pregunta actual
        item.classList.toggle('active');
      });
    });
  }

  // ---------------------------------------------------------------------------
  // FUNCIONALIDAD 9: CARRUSEL DE TESTIMONIOS
  // ---------------------------------------------------------------------------
  if (testimonialCards.length > 0 && testimonialDots.length > 0) {
    let currentSlide = 0;
    const totalSlides = testimonialCards.length;
    let slideInterval;
    
    // Función para mostrar una diapositiva específica
    function showSlide(index) {
      // Ocultar todas las diapositivas
      testimonialCards.forEach(card => {
        card.classList.remove('active');
      });
      
      // Quitar la clase activa de todos los puntos
      testimonialDots.forEach(dot => {
        dot.classList.remove('active');
      });
      
      // Mostrar la diapositiva actual
      testimonialCards[index].classList.add('active');
      testimonialDots[index].classList.add('active');
      
      currentSlide = index;
    }
    
    // Configurar eventos de clic para los puntos
    testimonialDots.forEach((dot, index) => {
      dot.addEventListener('click', function() {
        showSlide(index);
        resetSlideInterval();
      });
    });
    
    // Función para mostrar la siguiente diapositiva
    function nextSlide() {
      showSlide((currentSlide + 1) % totalSlides);
    }
    
    // Configurar el intervalo para el cambio automático de diapositivas
    function startSlideInterval() {
      slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Reiniciar el intervalo
    function resetSlideInterval() {
      clearInterval(slideInterval);
      startSlideInterval();
    }
    
    // Iniciar el carrusel
    startSlideInterval();
  }

  // ---------------------------------------------------------------------------
  // FUNCIONALIDAD 10: ANIMACIONES DE CAMPOS DEL FORMULARIO
  // ---------------------------------------------------------------------------
  if (formInputs.length > 0) {
    formInputs.forEach(input => {
      input.addEventListener('focus', function() {
        input.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', function() {
        input.parentElement.classList.remove('focused');
      });
    });
  }

  // ---------------------------------------------------------------------------
  // FUNCIONALIDAD 11: AUTOCOMPLETADO DE CIUDADES
  // ---------------------------------------------------------------------------
  if (ciudadInput) {
    const popularCities = [
      'Barcelona', 'Madrid', 'Valencia', 'Sevilla', 'Zaragoza', 
      'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao',
      'Terrassa', 'Sabadell', 'Hospitalet', 'Tarragona', 'Girona',
      'Badalona', 'Alicante', 'Córdoba', 'Valladolid', 'Vigo'
    ];
    
    ciudadInput.addEventListener('input', function() {
      const value = this.value.toLowerCase();
      if (value.length > 2) {
        const match = popularCities.find(city => 
          city.toLowerCase().startsWith(value)
        );
        
        if (match && match.toLowerCase() !== value) {
          const currentVal = this.value;
          this.value = currentVal + match.substring(value.length);
          
          // Seleccionar la parte sugerida del texto
          this.setSelectionRange(currentVal.length, this.value.length);
        }
      }
    });
  }

  // ---------------------------------------------------------------------------
  // FUNCIONALIDAD 12: EFECTOS DE FUEGO EN ELEMENTOS INTERACTIVOS
  // ---------------------------------------------------------------------------
  function addFireEffect(elements) {
    elements.forEach(el => {
      if (el) {
        el.addEventListener('mouseenter', function() {
          this.classList.add('fire-effect');
        });
        
        el.addEventListener('mouseleave', function() {
          this.classList.remove('fire-effect');
        });
      }
    });
  }
  
  // Añadir efecto a botones y elementos interactivos
  addFireEffect([
    document.querySelector('.submit-btn'),
    document.querySelector('.modal-button'),
    ...document.querySelectorAll('.faq-question')
  ]);
  
  // ---------------------------------------------------------------------------
  // FUNCIONES AUXILIARES
  // ---------------------------------------------------------------------------
  
  // Validar email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Validar teléfono (formato español)
  function isValidPhone(phone) {
    // Permitir formatos de teléfono español
    const phoneRegex = /^(?:(?:\+|00)34|34)?[6789]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }
  
  // Validar código postal (formato español)
  function isValidPostalCode(postalCode) {
    // Formato de código postal español (5 dígitos)
    const postalCodeRegex = /^[0-9]{5}$/;
    return postalCodeRegex.test(postalCode);
  }
  
  // Generar un número de referencia único
  function generateReferenceNumber() {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `GULA-FT-${timestamp}${random}`;
  }
  
  // Mensaje de bienvenida en la consola
  console.log('%c🔥 GULA - Los 7 Pecados Capitales del Sabor 🔥', 'font-weight: bold; font-size: 14px; color: #ff4500;');
});