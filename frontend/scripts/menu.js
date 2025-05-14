document.addEventListener('DOMContentLoaded', () => {
  console.log("🍔 Página de menú cargada");

  const token = localStorage.getItem('token');
  const btnCarrito = document.getElementById('carrito-btn');
  const desplegable = document.getElementById('carrito-desplegable');
  const listaCarrito = document.getElementById('lista-carrito');
  const contadorCarrito = document.getElementById('contador-carrito');
  const totalCarrito = document.getElementById('carrito-total');

  initAnimations();
  if (btnCarrito && desplegable) setupCarrito();

  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.menu-hero');
    if (hero) hero.style.backgroundPositionY = `${window.scrollY * 0.5}px`;
  });

  setupCategorias();
  setupNewsletter();

  function initAnimations() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.categoria-card, .menu-intro, .newsletter').forEach(el => {
      el.classList.add('animate-ready');
      observer.observe(el);
    });
  }

  function setupCarrito() {
    btnCarrito.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCarrito();
      if (desplegable.classList.contains('mostrar')) cargarResumenCarrito();
    });

    document.addEventListener('click', (e) => {
      if (desplegable.classList.contains('mostrar') && !desplegable.contains(e.target) && e.target !== btnCarrito) {
        desplegable.classList.remove('mostrar');
      }
    });

    desplegable.addEventListener('click', (e) => e.stopPropagation());
    actualizarContadorCarrito();
  }

  function toggleCarrito() {
    desplegable.classList.toggle('mostrar');
  }

  function cargarResumenCarrito() {
    if (!token) {
      listaCarrito.innerHTML = '<li class="carrito-empty">Inicia sesión para ver tu carrito</li>';
      if (totalCarrito) totalCarrito.textContent = '0.00';
      return;
    }

    listaCarrito.innerHTML = '<li class="carrito-loading"><i class="fas fa-spinner fa-spin"></i> Cargando...</li>';

    fetch('http://localhost:3000/api/carrito', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => {
      if (!data.length) {
        listaCarrito.innerHTML = '<li class="carrito-empty">Tu carrito está vacío</li>';
        if (totalCarrito) totalCarrito.textContent = '0.00';
        return;
      }

      listaCarrito.innerHTML = '';
      let total = 0;

      data.forEach(item => {
        const precio = parseFloat(item.precio);
        total += precio * item.cantidad;

        const li = document.createElement('li');
        li.className = 'carrito-item';
        li.innerHTML = `
          <div class="item-info">
            <span class="item-nombre">${item.nombre}</span>
            <span class="item-cantidad">x${item.cantidad}</span>
          </div>
          <span class="item-precio">${precio.toFixed(2)} €</span>
          <button class="btn-eliminar" data-id="${item.id}"><i class="fas fa-times"></i></button>
        `;

        li.querySelector('.btn-eliminar')?.addEventListener('click', e => {
          e.preventDefault();
          eliminarDelCarrito(item.id);
        });

        listaCarrito.appendChild(li);
      });

      if (totalCarrito) totalCarrito.textContent = total.toFixed(2);
    })
    .catch(() => {
      listaCarrito.innerHTML = '<li class="carrito-error">Error al cargar tu carrito</li>';
    });
  }

  function eliminarDelCarrito(id) {
    if (!token) return;

    fetch('http://localhost:3000/api/carrito/eliminar', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id })
    })
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(() => {
      cargarResumenCarrito();
      actualizarContadorCarrito();
      mostrarNotificacion('Producto eliminado del carrito', 'success');
    })
    .catch(() => mostrarNotificacion('No se pudo eliminar el producto', 'error'));
  }

  function actualizarContadorCarrito() {
    if (!token || !contadorCarrito) return;

    fetch('http://localhost:3000/api/carrito/contador', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => {
      contadorCarrito.textContent = data.cantidad || 0;
      contadorCarrito.style.display = data.cantidad > 0 ? 'flex' : 'none';
    })
    .catch(() => contadorCarrito.style.display = 'none');
  }

  function setupCategorias() {
    document.querySelectorAll('.categoria-card').forEach(card => {
      const icon = card.querySelector('.card-icon');
      if (icon) {
        card.addEventListener('mouseenter', () => {
          icon.classList.add('pulse');
          setTimeout(() => icon.classList.remove('pulse'), 500);
        });
      }

      const img = card.querySelector('img');
      if (img) img.addEventListener('load', () => img.classList.add('loaded'));

      card.addEventListener('click', () => {
        const link = card.querySelector('a.btn-ver');
        if (link) {
          card.classList.add('clicked');
          setTimeout(() => window.location.href = link.href, 300);
        }
      });
    });
  }

  function setupNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      if (!email || !validateEmail(email)) {
        mostrarNotificacion('Por favor, introduce un email válido', 'error');
        return;
      }

      const btnSubmit = form.querySelector('button[type="submit"]');
      const originalText = btnSubmit.textContent;
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

      setTimeout(() => {
        btnSubmit.disabled = false;
        btnSubmit.textContent = originalText;
        form.reset();
        mostrarNotificacion('¡Te has suscrito correctamente!', 'success');
      }, 1500);
    });
  }

  function validateEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
  }

  function mostrarNotificacion(mensaje, tipo = 'info') {
    let notificacion = document.querySelector('.notificacion');
    if (!notificacion) {
      notificacion = document.createElement('div');
      notificacion.className = 'notificacion';
      document.body.appendChild(notificacion);
    }

    const icon = tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle';
    notificacion.className = `notificacion ${tipo}`;
    notificacion.innerHTML = `<i class="fas fa-${icon}"></i> ${mensaje}`;

    setTimeout(() => notificacion.classList.add('mostrar'), 100);
    setTimeout(() => {
      notificacion.classList.remove('mostrar');
      setTimeout(() => notificacion.remove(), 500);
    }, 3000);
  }
});

function irACategoria(pagina) {
  document.body.classList.add('page-transition');
  setTimeout(() => {
    window.location.href = pagina;
  }, 300);
}
