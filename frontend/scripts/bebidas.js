document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid-bebidas');
  const filtroBtns = document.querySelectorAll('.filtro-btn');

  const modal = document.getElementById('producto-modal');
  const modalImg = document.getElementById('modal-img');
  const modalNombre = document.getElementById('modal-nombre');
  const modalDescripcion = document.getElementById('modal-descripcion');
  const modalPrecio = document.getElementById('modal-precio');
  const cantidadSpan = document.getElementById('cantidad');
  const cerrarModalBtn = document.querySelector('.cerrar-modal');
  const btnAgregar = document.getElementById('agregar-carrito');
  let cantidad = 1;
  let bebidaSeleccionada = null;

  const token = localStorage.getItem('token');

  // ✅ Cargar bebidas desde backend
  async function cargarBebidas() {
    try {
      const res = await fetch('http://localhost:3000/api/bebidas');
      const bebidas = await res.json();
      renderBebidas(bebidas);
    } catch (err) {
      console.error('❌ Error al cargar bebidas:', err);
    }
  }

  // ✅ Renderizar tarjetas de bebidas
  function renderBebidas(bebidas) {
  grid.innerHTML = '';
  bebidas.forEach(b => {
    const card = document.createElement('div');
    card.classList.add('bebida-card');
    card.innerHTML = `
      <div class="bebida-imagen">
        <img src="${b.imagen}" alt="${b.nombre}" />
        ${b.destacada ? `<span class="bebida-etiqueta">Destacada</span>` : ''}
      </div>
      <div class="bebida-info">
        <h3>${b.nombre}</h3>
        <p>${b.descripcion}</p>
        <div class="bebida-footer">
          <span class="bebida-precio">${Number(b.precio).toFixed(2)} €</span>
          <div>
            <button onclick="abrirEditar(${b.id})" class="btn-editar"><i class="fas fa-pen"></i></button>
            <button onclick="eliminarBebida(${b.id})" class="btn-eliminar"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}
window.eliminarBebida = async (id) => {
  if (!confirm('¿Eliminar esta bebida?')) return;
  try {
    const res = await fetch(`http://localhost:3000/api/bebidas/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    alert(data.mensaje);
    cargarBebidas();
  } catch (err) {
    console.error(err);
  }
};

window.abrirEditar = (id) => {
  // Puedes reutilizar el modal y rellenarlo con datos desde fetch
  // para editar, muy similar al agregar
};

  

  // ✅ Filtros por categoría
  filtroBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filtroBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const categoria = btn.dataset.categoria;

      document.querySelectorAll('.bebida-card').forEach(card => {
        const cat = card.dataset.categoria;
        card.style.display = (categoria === 'todos' || categoria === cat) ? 'flex' : 'none';
      });
    });
  });

  // ✅ Mostrar modal de producto
  function mostrarModal(bebida) {
    modalImg.src = bebida.imagen;
    modalNombre.textContent = bebida.nombre;
    modalDescripcion.textContent = bebida.descripcion;
    modalPrecio.textContent = parseFloat(bebida.precio).toFixed(2) + ' €';
    cantidadSpan.textContent = cantidad;
    modal.classList.add('mostrar');
  }

  // ✅ Cerrar modal
  cerrarModalBtn.addEventListener('click', () => {
    modal.classList.remove('mostrar');
  });

  // ✅ Control de cantidad
  document.getElementById('sumar-cantidad').addEventListener('click', () => {
    cantidad++;
    cantidadSpan.textContent = cantidad;
  });

  document.getElementById('restar-cantidad').addEventListener('click', () => {
    if (cantidad > 1) {
      cantidad--;
      cantidadSpan.textContent = cantidad;
    }
  });

  // ✅ Añadir al carrito
  btnAgregar.addEventListener('click', async () => {
    if (!token) {
      mostrarNotificacion('Debes iniciar sesión para añadir al carrito', 'error');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/carrito/agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bebida_id: bebidaSeleccionada.id,
          cantidad
        })
      });

      if (res.ok) {
        mostrarNotificacion('✅ Bebida añadida al carrito', 'success');
        modal.classList.remove('mostrar');
      } else {
        const data = await res.json();
        mostrarNotificacion(data?.mensaje || 'Error al añadir al carrito', 'error');
      }
    } catch (err) {
      console.error(err);
      mostrarNotificacion('Error de conexión con el servidor', 'error');
    }
  });

  // ✅ Mostrar notificación
  function mostrarNotificacion(msg, tipo = 'info') {
    const noti = document.getElementById('notificacion');
    const mensaje = document.getElementById('notificacion-mensaje');
    mensaje.textContent = msg;
    noti.className = `notificacion mostrar ${tipo}`;
    setTimeout(() => noti.classList.remove('mostrar'), 3000);
  }

  cargarBebidas();
});

document.getElementById('formBebida').addEventListener('submit', async e => {
  e.preventDefault();
  const nueva = {
    nombre: document.getElementById('nuevo-nombre').value,
    descripcion: document.getElementById('nuevo-descripcion').value,
    precio: document.getElementById('nuevo-precio').value,
    imagen: document.getElementById('nuevo-imagen').value,
    destacada: document.getElementById('nuevo-destacada').checked
  };
  try {
    const res = await fetch('http://localhost:3000/api/bebidas/nueva', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(nueva)
    });
    const data = await res.json();
    alert(data.mensaje);
    cargarBebidas();
  } catch (err) {
    console.error(err);
  }
});
