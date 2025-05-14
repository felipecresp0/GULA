const formLogin = document.getElementById('form-login');

if (formLogin) {
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const contrasena = document.getElementById('contrasena').value;

    try {
      const res = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, contrasena })
      });

      const datos = await res.json(); // ✅ aquí se define correctamente

      if (res.ok) {
        // Guardar token
        localStorage.setItem('token', datos.token);

        // Decodificar el token para obtener el rol
        const payload = JSON.parse(atob(datos.token.split('.')[1]));
        const rol = payload.rol;

        // Redirección según el rol
        if (rol === 'admin') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'index.html';
        }

      } else {
        document.getElementById('mensaje').textContent = datos.mensaje || 'Error en el login';
      }

    } catch (error) {
      console.error('Error en la petición:', error);
      document.getElementById('mensaje').textContent = 'Error de conexión con el servidor';
    }
  });
}

// 🔐 Logout funcional para cualquier página
const botonLogout = document.getElementById('logout');
if (botonLogout) {
  botonLogout.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'acceso.html';
  });
}
const formRegistro = document.getElementById('form-registro');

if (formRegistro) {
    formRegistro.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const contrasena = document.getElementById('contrasena').value.trim();
      const mensaje = document.getElementById('mensaje');
  
      // 🔒 Validaciones
      if (!nombre || !email || !contrasena) {
        mensaje.textContent = 'Todos los campos son obligatorios.';
        return;
      }
  
      if (contrasena.length < 6) {
        mensaje.textContent = 'La contraseña debe tener al menos 6 caracteres.';
        return;
      }
  
      try {
        const res = await fetch('http://localhost:3000/api/usuarios/registro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nombre, email, contrasena })
        });
  
        const datos = await res.json();
  
        if (res.ok) {
          mensaje.textContent = '✅ Registro exitoso. Redirigiendo al login...';
          setTimeout(() => {
            window.location.href = 'acceso.html';
          }, 2000);
        } else {
          mensaje.textContent = datos.mensaje || '❌ Error al registrar.';
        }
  
      } catch (error) {
        console.error('Error en el registro:', error);
        mensaje.textContent = '❌ Error de conexión.';
      }
    });
  }
  
