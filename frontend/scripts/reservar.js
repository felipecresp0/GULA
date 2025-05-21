// Archivo para la funcionalidad del formulario de reserva por pasos
document.addEventListener('DOMContentLoaded', function() {
  // Referencias a elementos principales del formulario
  const reservaForm = document.getElementById('reserva-form');
  const formSteps = document.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const nextButtons = document.querySelectorAll('.next-btn');
  const prevButtons = document.querySelectorAll('.prev-btn');
  const menuOptions = document.querySelectorAll('.menu-option');
  const modal = document.getElementById('confirmation-modal');
  const closeModal = document.querySelector('.close-modal');
  const modalButton = document.querySelector('.modal-button');
  const faqItems = document.querySelectorAll('.faq-item');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots = document.querySelectorAll('.dot');
  
  // Variables para el seguimiento del paso actual
  let currentStep = 1;
  const totalSteps = formSteps.length;

  // ---------------------------------------------------------------------------
  // INICIALIZACIÓN DE ELEMENTOS Y CONFIGURACIÓN BÁSICA
  // ---------------------------------------------------------------------------
  
  // Establecer fechas mínimas para el campo de fecha
  const fechaInput = document.getElementById('fecha');
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

  // Activar la primera pregunta FAQ por defecto
  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
  }

  // ---------------------------------------------------------------------------
  // FUNCIONALIDAD: NAVEGACIÓN DEL FORMULARIO POR PASOS
  // ---------------------------------------------------------------------------
  
  // Función para mostrar el paso actual
  function showStep(stepNumber) {
    // Ocultar todos los pasos
    formSteps.forEach(step => {
      step.style.display = 'none';
    });
    
    // Mostrar el paso actual
    formSteps[stepNumber - 1].style.display = 'block';
    
    // Actualizar el indicador de progreso
    updateProgressIndicator(stepNumber);
    
    // Actualizar la variable de paso actual
    currentStep = stepNumber;
  }
  
  // Función para actualizar el indicador de progreso
  function updateProgressIndicator(stepNumber) {
    progressSteps.forEach((step, index) => {
      const stepNum = index + 1;
      
      if (stepNum < stepNumber) {
        // Paso completado
        step.classList.remove('active');
        step.classList.add('completed');
      } else if (stepNum === stepNumber) {
        // Paso actual
        step.classList.add('active');
        step.classList.remove('completed');
      } else {
        // Paso futuro
        step.classList.remove('active', 'completed');
      }
    });
  }
  
  // Evento para avanzar al siguiente paso
  nextButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Validar el paso actual antes de avanzar
      if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
          showStep(currentStep + 1);
          // Hacer scroll al principio del formulario
          reservaForm.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
  
  // Evento para retroceder al paso anterior
  prevButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (currentStep > 1) {
        showStep(currentStep - 1);
        // Hacer scroll al principio del formulario
        reservaForm.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // Función para validar campos del paso actual
  function validateStep(stepNumber) {
    const currentStepEl = formSteps[stepNumber - 1];
    const requiredFields = currentStepEl.querySelectorAll('[required]');
    let isValid = true;
    
    // Limpiar mensajes de error anteriores
    currentStepEl.querySelectorAll('.error-message').forEach(errorEl => {
      errorEl.textContent = '';
      errorEl.classList.remove('show');
    });
    
    // Validar cada campo requerido
    requiredFields.forEach(field => {
      const errorElement = document.getElementById(`error-${field.id}`);
      
      if (!field.value.trim()) {
        isValid = false;
        if (errorElement) {
          errorElement.textContent = 'Este campo es obligatorio';
          errorElement.classList.add('show');
        }
        field.classList.add('error');
      } else {
        field.classList.remove('error');
        
        // Validaciones específicas
        if (field.id === 'email' && !isValidEmail(field.value)) {
          isValid = false;
          if (errorElement) {
            errorElement.textContent = 'Por favor, introduce un email válido';
            errorElement.classList.add('show');
          }
        }
        
        if (field.id === 'telefono' && !isValidPhone(field.value)) {
          isValid = false;
          if (errorElement) {
            errorElement.textContent = 'Por favor, introduce un número de teléfono válido';
            errorElement.classList.add('show');
          }
        }
        
        if (field.id === 'codigo-postal' && !isValidPostalCode(field.value)) {
          isValid = false;
          if (errorElement) {
            errorElement.textContent = 'Por favor, introduce un código postal válido';
            errorElement.classList.add('show');
          }
        }
      }
    });
    
    return isValid;
  }

  // ---------------------------------------------------------------------------
  // FUNCIONALIDAD: SELECCIÓN DE MENÚS
  // ---------------------------------------------------------------------------
  menuOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Desactivar todas las opciones
      menuOptions.forEach(opt => opt.classList.remove('selected'));
      
      // Activar la opción seleccionada
      this.classList.add('selected');
      
      // Actualizar el valor del campo oculto
      const menuSeleccionadoInput = document.getElementById('menu-seleccionado');
      if (menuSeleccionadoInput) {
        menuSeleccionadoInput.value = this.getAttribute('data-menu');
      }
      
      // Calcular precio total estimado si hay invitados
      const invitadosInput = document.getElementById('invitados');
      if (invitadosInput && invitadosInput.value) {
        const menuPrecio = parseFloat(this.querySelector('.menu-price').textContent.match(/\d+/)[0]);
        const invitados = parseInt(invitadosInput.value);
        const precioTotal = menuPrecio * invitados;
        
        // Mostrar precio total en el formulario
        let precioInfo = document.querySelector('.precio-total-info');
        if (!precioInfo) {
          precioInfo = document.createElement('div');
          precioInfo.className = 'precio-total-info';
          document.querySelector('.custom-menu-container').appendChild(precioInfo);
        }
        
        precioInfo.innerHTML = `<p>Precio total estimado: <strong>${precioTotal.toFixed(2)}€</strong> (${menuPrecio}€ × ${invitados} personas)</p>`;
        precioInfo.style.color = 'var(--primary-color)';
        precioInfo.style.marginTop = '10px';
        precioInfo.style.fontWeight = 'bold';
        precioInfo.style.fontSize = '14px';
      }
    });
  });

  // Evento para calcular precio al cambiar número de invitados
  const invitadosInput = document.getElementById('invitados');
  if (invitadosInput) {
    invitadosInput.addEventListener('change', function() {
      const selectedMenu = document.querySelector('.menu-option.selected');
      if (selectedMenu) {
        // Simular clic para actualizar el precio
        selectedMenu.click();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // FUNCIONALIDAD: ENVÍO DEL FORMULARIO
  // ---------------------------------------------------------------------------
  if (reservaForm) {
    reservaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validar el último paso
      if (validateStep(currentStep)) {
        // Validar selección de menú
        const menuSeleccionado = document.getElementById('menu-seleccionado').value;
        if (!menuSeleccionado) {
          const menuSelectorSection = document.querySelector('.menu-selector-compact');
          let menuError = menuSelectorSection.querySelector('.error-message');
          
          if (!menuError) {
            menuError = document.createElement('div');
            menuError.className = 'error-message menu-error show';
            menuError.textContent = 'Por favor, selecciona un menú para el evento';
            menuError.style.marginTop = '10px';
            menuSelectorSection.appendChild(menuError);
          } else {
            menuError.classList.add('show');
          }
          
          return;
        }
        
        // Generar un número de referencia único
        const refNumber = generateReferenceNumber();
        document.getElementById('reference-id').textContent = refNumber;
        
        // Mostrar modal de confirmación
        modal.classList.add('show');
        
        // Resetear formulario
        setTimeout(() => {
          resetForm();
        }, 500);
      }
    });
  }
  
  // Función para resetear el formulario
  function resetForm() {
    // Limpiar todos los campos
    reservaForm.reset();
    
    // Desactivar opciones de menú
    menuOptions.forEach(opt => opt.classList.remove('selected'));
    
    // Eliminar mensajes de error
    document.querySelectorAll('.error-message').forEach(errorEl => {
      errorEl.textContent = '';
      errorEl.classList.remove('show');
    });
    
    // Eliminar información de precio total
    const precioInfo = document.querySelector('.precio-total-info');
    if (precioInfo) {
      precioInfo.remove();
    }
    
    // Volver al primer paso
    showStep(1);
  }

  // ---------------------------------------------------------------------------
  // FUNCIONALIDAD: CONTROL DEL MODAL
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
  
  // Cerrar modal al hacer clic fuera
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });

  // ---------------------------------------------------------------------------
  // FUNCIONALIDAD: ACORDEÓN DE PREGUNTAS FRECUENTES
  // ---------------------------------------------------------------------------
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
      // Cerrar las otras preguntas
      faqItems.forEach(faq => {
        if (faq !== item) {
          faq.classList.remove('active');
        }
      });
      
      // Alternar la pregunta actual
      item.classList.toggle('active');
    });
  });

  // ---------------------------------------------------------------------------
  // FUNCIONALIDAD: CARRUSEL DE TESTIMONIOS
  // ---------------------------------------------------------------------------
  if (testimonialCards.length > 0 && testimonialDots.length > 0) {
    let currentSlide = 0;
    const totalSlides = testimonialCards.length;
    let slideInterval;
    
    // Función para mostrar una diapositiva
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
    
    // Configurar el intervalo para el cambio automático
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
  // FUNCIONES AUXILIARES
  // ---------------------------------------------------------------------------
  
  // Validar email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Validar teléfono (formato español)
  function isValidPhone(phone) {
    const phoneRegex = /^(?:(?:\+|00)34|34)?[6789]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }
  
  // Validar código postal (formato español)
  function isValidPostalCode(postalCode) {
    const postalCodeRegex = /^[0-9]{5}$/;
    return postalCodeRegex.test(postalCode);
  }
  
  // Generar un número de referencia único
  function generateReferenceNumber() {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `GULA-FT-${timestamp}${random}`;
  }
  
  // Inicializar mostrando el primer paso
  showStep(1);
});