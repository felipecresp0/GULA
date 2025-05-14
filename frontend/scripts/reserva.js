// Variables globales para elementos DOM
const nombreRestaurante = document.getElementById('nombre-restaurante');
const direccionRestaurante = document.getElementById('direccion-restaurante');
const valoracionMedia = document.getElementById('valoracion-media');
const totalResenas = document.getElementById('total-resenas');
const fotosContainer = document.getElementById('fotos-container');
const formularioReserva = document.getElementById('form-reserva');
const campoFecha = document.getElementById('fecha');
const campoHora = document.getElementById('hora');
const campoPersonas = document.getElementById('personas');
const campoRestauranteId = document.getElementById('restaurante_id');
const horasContainer = document.getElementById('horas-disponibles');
const mensajeReserva = document.getElementById('mensaje-reserva');
const estrellasValoracion = document.querySelectorAll('.estrellas .estrella');
const listaResenas = document.getElementById('lista-resenas');
const estrellasInput = document.querySelectorAll('.estrella-input');

// Obtener el ID del restaurante de la URL
function obtenerRestauranteId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('restaurante');
}

// Cargar datos del restaurante
async function cargarDatosRestaurante(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/restaurantes/${id}`);
    const data = await res.json();
    
    if (res.ok) {
      // Mostrar información básica
      nombreRestaurante.textContent = data.nombre || 'Restaurante Gula';
      
      // Si no tenemos dirección, mostrar solo el código postal
      direccionRestaurante.textContent = `Código Postal: ${data.codigo_postal || 'No disponible'}`;
      
      // Mostrar valoración
      if (data.valoracion) {
        valoracionMedia.textContent = data.valoracion;
        totalResenas.textContent = `(${data.total_resenas} reseñas)`;
        
        // Colorear estrellas según valoración
        const valoracion = parseFloat(data.valoracion);
        estrellasValoracion.forEach((estrella, i) => {
          if (i < Math.floor(valoracion)) {
            estrella.classList.add('active');
          } else if (i < valoracion) {
            // Media estrella (usando clases de Font Awesome)
            estrella.classList.remove('fa-star');
            estrella.classList.add('fa-star-half-alt');
            estrella.classList.add('active');
          }
        });
      }
      
      // Mostrar fotos
      if (data.fotos && data.fotos.length > 0) {
        console.log("Fotos disponibles:", data.fotos); // Para depuración
        fotosContainer.innerHTML = '';
        data.fotos.forEach(url => {
          console.log("Cargando imagen:", url); // Para depuración
          const img = document.createElement('img');
          img.src = url;
          img.alt = `Foto de ${data.nombre}`;
          img.className = 'foto-restaurante';
          img.onerror = function() {
            console.error("Error al cargar la imagen:", url);
            this.src = "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/20250421_0130_Restaurante+Gula+de+Noche_remix_01jsarfghxeka8mrs5f6pqhmhr.png";
          };
          fotosContainer.appendChild(img);
        });
      } else {
        console.log("No hay fotos disponibles, usando imagen por defecto"); // Para depuración
        fotosContainer.innerHTML = `
          <img src="https://gula-hamburguesas.s3.us-east-1.amazonaws.com/20250421_0130_Restaurante+Gula+de+Noche_remix_01jsarfghxeka8mrs5f6pqhmhr.png" 
              alt="Imagen por defecto" 
              class="foto-restaurante">
        `;
      }
    } else {
      mensajeReserva.textContent = '❌ No se pudo cargar la información del restaurante';
    }
  } catch (err) {
    console.error('Error al cargar datos del restaurante:', err);
    mensajeReserva.textContent = '❌ Error al conectar con el servidor';
  }
}

// Cargar disponibilidad para un día
async function cargarDisponibilidad(restauranteId, fecha) {
  try {
    console.log("Cargando disponibilidad para:", restauranteId, fecha); // Para depuración
    
    const res = await fetch(`http://localhost:3000/api/disponibilidad?restaurante_id=${restauranteId}&fecha=${fecha}`);
    const slots = await res.json();
    
    console.log("Slots de disponibilidad recibidos:", slots); // Para depuración
    
    horasContainer.innerHTML = '';
    
    if (!Array.isArray(slots) || slots.length === 0) {
      horasContainer.innerHTML = '<p>No hay horarios disponibles para esta fecha</p>';
      return;
    }
    
    slots.forEach(slot => {
      const disponible = slot.mesas_disponibles > 0;
      const horaFormateada = slot.hora.substring(0, 5); // Formato HH:MM
      
      const botonHora = document.createElement('div');
      botonHora.className = `slot ${disponible ? '' : 'disabled'}`;
      botonHora.textContent = horaFormateada;
      
      if (disponible) {
        botonHora.addEventListener('click', () => {
          // Deseleccionar todos los slots
          document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
          // Seleccionar este slot
          botonHora.classList.add('selected');
          // Guardar la hora en el campo oculto
          campoHora.value = horaFormateada;
        });
      }
      
      horasContainer.appendChild(botonHora);
    });
  } catch (err) {
    console.error('Error al cargar disponibilidad:', err);
    horasContainer.innerHTML = '<p>Error al cargar los horarios disponibles</p>';
  }
}

// Cargar reseñas del restaurante
async function cargarResenas(restauranteId) {
  try {
    const res = await fetch(`http://localhost:3000/api/resenas/restaurante/${restauranteId}`);
    const data = await res.json();
    
    if (res.ok && data.resenas) {
      listaResenas.innerHTML = '';
      
      if (data.resenas.length === 0) {
        listaResenas.innerHTML = '<p>No hay reseñas para este restaurante</p>';
        return;
      }
      
      data.resenas.forEach(resena => {
        const fechaFormateada = new Date(resena.fecha_creacion).toLocaleDateString();
        
        const resenaElement = document.createElement('div');
        resenaElement.className = 'resena';
        resenaElement.innerHTML = `
          <div class="resena-header">
            <span class="resena-usuario">${resena.usuario_nombre}</span>
            <span class="resena-fecha">${fechaFormateada}</span>
          </div>
          <div class="resena-valoracion">
            ${'★'.repeat(resena.puntuacion)}${'☆'.repeat(5 - resena.puntuacion)}
          </div>
          <p class="resena-comentario">${resena.comentario || 'Sin comentario'}</p>
        `;
        
        listaResenas.appendChild(resenaElement);
      });
    } else {
      listaResenas.innerHTML = '<p>Error al cargar las reseñas</p>';
    }
  } catch (err) {
    console.error('Error al cargar reseñas:', err);
    listaResenas.innerHTML = '<p>Error al conectar con el servidor</p>';
  }
}

// Enviar una nueva reseña
async function enviarResena(restauranteId, puntuacion, comentario) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    alert('Debes iniciar sesión para dejar una reseña');
    return;
  }
  
  try {
    const res = await fetch('http://localhost:3000/api/resenas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        restaurante_id: restauranteId,
        puntuacion,
        comentario
      })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      alert('¡Reseña enviada con éxito!');
      // Recargar las reseñas
      cargarResenas(restauranteId);
      // Limpiar el formulario
      document.getElementById('comentario-resena').value = '';
      estrellasInput.forEach(estrella => estrella.classList.remove('active'));
    } else {
      alert(`Error: ${data.error || 'No se pudo enviar la reseña'}`);
    }
  } catch (err) {
    console.error('Error al enviar reseña:', err);
    alert('Error al conectar con el servidor');
  }
}

// Hacer reserva
async function hacerReserva(datosReserva) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    mensajeReserva.textContent = '❌ Debes iniciar sesión para hacer una reserva';
    return;
  }
  
  try {
    const res = await fetch('http://localhost:3000/api/reservas/nueva', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(datosReserva)
    });
    
    const data = await res.json();
    
    if (res.ok) {
      mensajeReserva.textContent = '✅ ' + data.mensaje;
      formularioReserva.reset();
      document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
    } else {
      mensajeReserva.textContent = '❌ ' + (data.error || 'No se pudo realizar la reserva');
    }
  } catch (err) {
    console.error('Error al hacer reserva:', err);
    mensajeReserva.textContent = '❌ Error al conectar con el servidor';
  }
}

// Al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  const restauranteId = obtenerRestauranteId();
  
  if (!restauranteId) {
    alert('No se ha especificado un restaurante');
    window.location.href = 'restaurantes.html';
    return;
  }
  
  // Establecer el ID del restaurante en el formulario
  campoRestauranteId.value = restauranteId;
  
  // Cargar datos iniciales
  cargarDatosRestaurante(restauranteId);
  cargarResenas(restauranteId);
  
  // Establecer fecha mínima (hoy)
  const hoy = new Date().toISOString().split('T')[0];
  campoFecha.min = hoy;
  
  // Cuando cambia la fecha, cargar disponibilidad
  campoFecha.addEventListener('change', () => {
    if (campoFecha.value) {
      cargarDisponibilidad(restauranteId, campoFecha.value);
    }
  });
  
  // Manejar envío del formulario de reserva
  formularioReserva.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!campoHora.value) {
      mensajeReserva.textContent = '❌ Debes seleccionar una hora';
      return;
    }
    
    const datosReserva = {
      restaurante_id: restauranteId,
      fecha: campoFecha.value,
      hora: campoHora.value,
      personas: campoPersonas.value
    };
    
    hacerReserva(datosReserva);
  });
  
  // Manejar click en estrellas para reseña
  estrellasInput.forEach(estrella => {
    estrella.addEventListener('click', () => {
      const valor = parseInt(estrella.getAttribute('data-valor'));
      
      // Actualizar visual
      estrellasInput.forEach((e, i) => {
        if (i < valor) {
          e.classList.add('active');
        } else {
          e.classList.remove('active');
        }
      });
    });
  });
  
  // Manejar envío de reseña
  document.getElementById('enviar-resena').addEventListener('click', () => {
    const puntuacion = document.querySelectorAll('.estrella-input.active').length;
    const comentario = document.getElementById('comentario-resena').value;
    
    if (puntuacion === 0) {
      alert('Debes seleccionar al menos una estrella');
      return;
    }
    
    enviarResena(restauranteId, puntuacion, comentario);
  });
});