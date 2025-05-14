const token = localStorage.getItem('token');
const urlBase = 'http://localhost:3000/api/hamburguesas';

document.getElementById('form-hamburguesa').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;
  const precio = document.getElementById('precio').value;

  if (!token) return alert('Token no encontrado. Inicia sesión.');

  try {
    const respuesta = await fetch(`${urlBase}/nueva`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nombre, descripcion, precio })
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {
      document.getElementById('mensaje').textContent = '✅ Hamburguesa creada.';
      e.target.reset();
      cargarHamburguesas(); // ← Recargar tabla
    } else {
      document.getElementById('mensaje').textContent = `❌ ${datos.mensaje || datos.error}`;
    }
  } catch (error) {
    console.error(error);
    document.getElementById('mensaje').textContent = '❌ Error al crear hamburguesa.';
  }
});

async function cargarHamburguesas() {
  if (!token) return;

  try {
    const res = await fetch(urlBase, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const hamburguesas = await res.json();
    const tbody = document.getElementById('lista-hamburguesas');
    tbody.innerHTML = '';

    hamburguesas.forEach(h => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${h.nombre}</td>
        <td>${h.descripcion}</td>
        <td>${h.precio} €</td>
        <td><button onclick="eliminarHamburguesa(${h.id})">🗑️ Eliminar</button></td>
      `;
      tbody.appendChild(fila);
    });
  } catch (err) {
    console.error('Error al cargar hamburguesas:', err);
  }
}

async function eliminarHamburguesa(id) {
  if (!confirm('¿Seguro que deseas eliminar esta hamburguesa?')) return;

  try {
    const res = await fetch(`${urlBase}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const datos = await res.json();

    if (res.ok) {
      alert('Hamburguesa eliminada correctamente');
      cargarHamburguesas();
    } else {
      alert('Error: ' + datos.mensaje);
    }
  } catch (err) {
    console.error('Error al eliminar:', err);
  }
}
async function cargarReservas() {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch('http://localhost:3000/api/reservas/admin', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const reservas = await res.json();
    const tbody = document.getElementById('tabla-reservas-body');
    tbody.innerHTML = '';

    reservas.forEach(r => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
      <td>${r.id}</td>
      <td>${r.usuario}</td>
      <td>${r.fecha}</td>
      <td>${r.hora}</td>
      <td>${r.personas}</td>
      <td><button onclick="eliminarReserva(${r.id})">❌ Eliminar</button></td>
    `;
    
      tbody.appendChild(fila);
    });

  } catch (error) {
    console.error('❌ Error al cargar reservas:', error);
  }
}
async function eliminarReserva(id) {
  if (!confirm('¿Estás seguro de eliminar esta reserva?')) return;

  try {
    const res = await fetch(`http://localhost:3000/api/reservas/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const datos = await res.json();

    if (res.ok) {
      alert(datos.mensaje);
      cargarReservas();
    } else {
      alert('Error: ' + datos.mensaje);
    }
  } catch (error) {
    console.error('❌ Error al eliminar reserva:', error);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('selector-restaurante');
  const tabla = document.getElementById('tabla-reservas');
  const token = localStorage.getItem('token');

  fetch('http://localhost:3000/api/restaurantes')
    .then(res => res.json())
    .then(data => {
      data.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r.id;
        opt.textContent = r.nombre;
        selector.appendChild(opt);
      });
    });

  selector.addEventListener('change', () => {
    const id = selector.value;
    if (!id) return;

    fetch(`http://localhost:3000/api/reservas/restaurante/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      tabla.innerHTML = '';
      data.forEach(r => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${r.cliente}</td>
          <td>${r.fecha}</td>
          <td>${r.hora}</td>
          <td>${r.personas}</td>
        `;
        tabla.appendChild(fila);
      });
    });
  });
});


window.addEventListener('DOMContentLoaded', cargarHamburguesas);
