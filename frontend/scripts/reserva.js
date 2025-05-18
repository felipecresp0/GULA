document.addEventListener('DOMContentLoaded', function() {
  // Referencias a elementos del formulario
  const formPasos = document.querySelectorAll('.form-step');
  const botonesNext = document.querySelectorAll('.btn-next');
  const botonesPrev = document.querySelectorAll('.btn-prev');
  const stepIndicators = document.querySelectorAll('.step');
  const formulario = document.getElementById('reserva-form');
  
  // Referencias a campos del formulario
  const campoNombre = document.getElementById('nombre');
  const campoEmail = document.getElementById('email');
  const campoTelefono = document.getElementById('telefono');
  const campoPersonas = document.getElementById('personas');
  const campoLocal = document.getElementById('local');
  const campoFecha = document.getElementById('fecha');
  const campoHora = document.getElementById('hora');
  const campoComentarios = document.getElementById('comentarios');
  
  // Referencias a botones de cantidad
  const btnIncrease = document.getElementById('increase-personas');
  const btnDecrease = document.getElementById('decrease-personas');
  
  // Referencias a elementos de resumen
  const resumenNombre = document.getElementById('resumen-nombre');
  const resumenEmail = document.getElementById('resumen-email');
  const resumenTelefono = document.getElementById('resumen-telefono');
  const resumenPersonas = document.getElementById('resumen-personas');
  const resumenLocal = document.getElementById('resumen-local');
  const resumenFecha = document.getElementById('resumen-fecha');
  const resumenHora = document.getElementById('resumen-hora');
  
  // Contenedor de horas disponibles
  const horasContainer = document.getElementById('horas-disponibles');
  
  // Notificación
  const notificacion = document.getElementById('notification');
  const mensajeNotificacion = document.querySelector('.notification-message');
  
  // Establecer fecha mínima (hoy)
  const hoy = new Date();
  const fechaMin = hoy.toISOString().split('T')[0];
  campoFecha.min = fechaMin;
  
  // ===== Funciones para navegar entre pasos =====
  function irAlPaso(pasoActual, pasoSiguiente) {
    // Validar el paso actual antes de continuar
    if (pasoSiguiente > pasoActual && !validarPaso(pasoActual)) {
      mostrarNotificacion('Por favor, completa todos los campos obligatorios', 'error');
      return false;
    }
    
    // Ocultar paso actual
    formPasos[pasoActual - 1].classList.remove('active');
    
    // Mostrar paso siguiente
    formPasos[pasoSiguiente - 1].classList.add('active');
    
    // Actualizar indicadores de paso
    stepIndicators.forEach((step, index) => {
      if (index + 1 <= pasoSiguiente) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
    
    // Si vamos al paso 3 (resumen), actualizar los datos
    if (pasoSiguiente === 3) {
      actualizarResumen();
    }
    
    return true;
  }
  
  // ===== Validación de pasos =====
  function validarPaso(paso) {
    switch (paso) {
      case 1:
        return (
          campoNombre.value.trim() !== '' &&
          campoEmail.value.trim() !== '' &&
          campoTelefono.value.trim() !== '' &&
          campoLocal.value !== null &&
          campoLocal.value !== ''
        );
      case 2:
        return (
          campoFecha.value !== '' &&
          campoHora.value !== ''
        );
      default:
        return true;
    }
  }
  
  // ===== Actualizar resumen =====
  function actualizarResumen() {
    resumenNombre.textContent = campoNombre.value;
    resumenEmail.textContent = campoEmail.value;
    resumenTelefono.textContent = campoTelefono.value;
    resumenPersonas.textContent = campoPersonas.value;
    
    // Obtener nombre del local a partir del value
    const localIndex = campoLocal.selectedIndex;
    const localText = localIndex > 0 ? campoLocal.options[localIndex].text : '';
    resumenLocal.textContent = localText;
    
    // Formatear fecha
    const fecha = new Date(campoFecha.value);
    const formatoFecha = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(fecha);
    resumenFecha.textContent = formatoFecha.charAt(0).toUpperCase() + formatoFecha.slice(1);
    
    resumenHora.textContent = campoHora.value;
  }
  
  // ===== Generar horas disponibles =====
  function generarHorasDisponibles(fecha) {
    // Limpiar horas anteriores
    horasContainer.innerHTML = '';
    
    // Si es un fin de semana (5 = viernes, 6 = sábado), mostrar horario extendido
    const esFindeSemana = [5, 6].includes(new Date(fecha).getDay());
    
    // Generar slots de hora (simulación)
    const horaInicio = 13; // 13:00
    const horaFin = esFindeSemana ? 23 : 22; // 23:00 o 22:00
    
    for (let hora = horaInicio; hora <= horaFin; hora++) {
      // Para cada hora, crear dos slots (XX:00 y XX:30)
      for (let minutos of ['00', '30']) {
        const horaCompleta = `${hora}:${minutos}`;
        
        // Simular disponibilidad aleatoria
        const disponible = Math.random() > 0.3; // 70% de disponibilidad
        
        const horaElement = document.createElement('div');
        horaElement.className = `hora-slot ${disponible ? '' : 'disabled'}`;
        horaElement.textContent = horaCompleta;
        
        if (disponible) {
          horaElement.addEventListener('click', () => {
            // Deseleccionar hora anterior
            document.querySelectorAll('.hora-slot.selected').forEach(slot => {
              slot.classList.remove('selected');
            });
            
            // Seleccionar esta hora
            horaElement.classList.add('selected');
            
            // Guardar hora en campo oculto
            campoHora.value = horaCompleta;
          });
        }
        
        horasContainer.appendChild(horaElement);
      }
    }
  }
  
  // ===== Mostrar notificación =====
  function mostrarNotificacion(mensaje, tipo = 'success') {
    mensajeNotificacion.textContent = mensaje;
    
    // Cambiar icono según tipo
    const notificationIcon = document.querySelector('.notification-icon');
    
    if (tipo === 'success') {
      notificationIcon.className = 'notification-icon fas fa-check-circle';
    } else if (tipo === 'error') {
      notificationIcon.className = 'notification-icon fas fa-exclamation-circle';
    } else {
      notificationIcon.className = 'notification-icon fas fa-info-circle';
    }
    
    // Mostrar notificación
    notificacion.classList.add('show');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
      notificacion.classList.remove('show');
    }, 3000);
  }
  
  // ===== Event Listeners =====
  
  // Navegación entre pasos
  botonesNext.forEach(btn => {
    btn.addEventListener('click', function() {
      const pasoActual = parseInt(this.closest('.form-step').id.split('-')[1]);
      const pasoSiguiente = parseInt(this.dataset.next.split('-')[1]);
      irAlPaso(pasoActual, pasoSiguiente);
    });
  });
  
  botonesPrev.forEach(btn => {
    btn.addEventListener('click', function() {
      const pasoActual = parseInt(this.closest('.form-step').id.split('-')[1]);
      const pasoAnterior = parseInt(this.dataset.prev.split('-')[1]);
      irAlPaso(pasoActual, pasoAnterior);
    });
  });
  
  // Control de cantidad de personas
  btnIncrease.addEventListener('click', () => {
    const valorActual = parseInt(campoPersonas.value);
    if (valorActual < 10) {
      campoPersonas.value = valorActual + 1;
    }
  });
  
  btnDecrease.addEventListener('click', () => {
    const valorActual = parseInt(campoPersonas.value);
    if (valorActual > 1) {
      campoPersonas.value = valorActual - 1;
    }
  });
  
  // Cuando cambia la fecha, generar horas disponibles
  campoFecha.addEventListener('change', () => {
    if (campoFecha.value) {
      generarHorasDisponibles(campoFecha.value);
    }
  });
  
  // Envío del formulario
  formulario.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Validar términos
    const terminosAceptados = document.getElementById('terminos').checked;
    if (!terminosAceptados) {
      mostrarNotificacion('Debes aceptar los términos y condiciones', 'error');
      return;
    }
    
    // Simular envío de formulario
    // En un caso real, aquí enviarías los datos mediante fetch o similar
    
    // Mostrar notificación de éxito
    mostrarNotificacion('¡Reserva confirmada correctamente! Recibirás un email con los detalles.');
    
    // Reset del formulario después de 2 segundos
    setTimeout(() => {
      formulario.reset();
      
      // Volver al primer paso
      irAlPaso(3, 1);
      
      // Limpiar selección de horas
      document.querySelectorAll('.hora-slot.selected').forEach(slot => {
        slot.classList.remove('selected');
      });
      
      // Resetear número de personas a 2
      campoPersonas.value = 2;
    }, 2000);
  });
  
  // Generar horas disponibles por defecto para hoy
  generarHorasDisponibles(fechaMin);
  
  // Cambiar color de las brasas flotantes para que combinen con el tema
  const brasas = document.querySelectorAll('.floating-ember');
  brasas.forEach(brasa => {
    // Colores en tema con la hamburguesería
    const colores = ['#ff0066', '#00ffcc', '#ffcc00', '#ff3300', '#cc9900'];
    const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
    
    brasa.style.backgroundColor = colorAleatorio;
    brasa.style.boxShadow = `0 0 10px ${colorAleatorio}`;
  });
});