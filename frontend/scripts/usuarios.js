document.addEventListener('DOMContentLoaded', () => {
  console.log("🔥 Formulario de usuarios cargado - Modo Infernal activado");
  
  // Referencias a elementos del DOM
  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');
  const mensaje = document.getElementById('mensaje');
  const togglePassword = document.querySelectorAll('.toggle-password');
  const contrasenaInput = document.getElementById('contrasena');
  const confirmarContrasenaInput = document.getElementById('confirmar-contrasena');
  
  // Inicializar efectos visuales
  initVisualEffects();
  
  // Toggle para mostrar/ocultar contraseña
  if (togglePassword.length > 0) {
    togglePassword.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const input = toggle.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        // Cambiar icono
        const icon = toggle.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
      });
    });
  }
  
  // Validación de fuerza de contraseña
  if (contrasenaInput) {
    contrasenaInput.addEventListener('input', validatePasswordStrength);
  }
  
  // Procesamiento del formulario de login
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Mostrar animación de carga
      showLoadingAnimation(formLogin.querySelector('.submit-btn'));
      
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
        
        const datos = await res.json();
        
        // Quitar animación de carga
        hideLoadingAnimation(formLogin.querySelector('.submit-btn'));
        
        if (res.ok) {
          // Guardar token
          localStorage.setItem('token', datos.token);
          
          // Mostrar mensaje de éxito
          displayMessage('¡Bienvenido al infierno! Redirigiendo...', 'success');
          
          // Decodificar el token para obtener el rol
          const payload = JSON.parse(atob(datos.token.split('.')[1]));
          const rol = payload.rol;
          
          // Redirección según el rol con animación
          setTimeout(() => {
            if (rol === 'admin') {
              animateRedirect('admin.html');
            } else {
              animateRedirect('index.html');
            }
          }, 1500);
          
        } else {
          shake(formLogin);
          displayMessage(datos.mensaje || 'Las puertas del infierno permanecen cerradas', 'error');
        }
        
      } catch (error) {
        console.error('Error en la petición:', error);
        shake(formLogin);
        hideLoadingAnimation(formLogin.querySelector('.submit-btn'));
        displayMessage('Error de conexión con el servidor del inframundo', 'error');
      }
    });
  }
  
  // Procesamiento del formulario de registro
  if (formRegistro) {
    formRegistro.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const contrasena = document.getElementById('contrasena').value.trim();
      const confirmarContrasena = document.getElementById('confirmar-contrasena')?.value.trim();
      
      // Mostrar animación de carga
      showLoadingAnimation(formRegistro.querySelector('.submit-btn'));
      
      // Validaciones
      if (!nombre || !email || !contrasena) {
        shake(formRegistro);
        hideLoadingAnimation(formRegistro.querySelector('.submit-btn'));
        displayMessage('Todos los campos son obligatorios para vender tu alma', 'error');
        return;
      }
      
      if (contrasena.length < 6) {
        shake(formRegistro);
        hideLoadingAnimation(formRegistro.querySelector('.submit-btn'));
        displayMessage('Tu contraseña es demasiado débil (mínimo 6 caracteres)', 'error');
        return;
      }
      
      if (confirmarContrasena && contrasena !== confirmarContrasena) {
        shake(formRegistro);
        hideLoadingAnimation(formRegistro.querySelector('.submit-btn'));
        displayMessage('Las contraseñas no coinciden', 'error');
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
        
        // Quitar animación de carga
        hideLoadingAnimation(formRegistro.querySelector('.submit-btn'));
        
        if (res.ok) {
          displayMessage('¡Tu alma ahora nos pertenece! Redirigiendo...', 'success');
          
          setTimeout(() => {
            animateRedirect('acceso.html');
          }, 2000);
        } else {
          shake(formRegistro);
          displayMessage(datos.mensaje || 'Error al intentar vender tu alma', 'error');
        }
        
      } catch (error) {
        console.error('Error en el registro:', error);
        shake(formRegistro);
        hideLoadingAnimation(formRegistro.querySelector('.submit-btn'));
        displayMessage('Error de conexión con el servidor del inframundo', 'error');
      }
    });
  }
  
  // 🔐 Logout funcional para cualquier página
  const botonLogout = document.getElementById('logout');
  if (botonLogout) {
    botonLogout.addEventListener('click', () => {
      localStorage.removeItem('token');
      animateRedirect('acceso.html');
    });
  }
  
  // Función para inicializar efectos visuales
  function initVisualEffects() {
    // Crear partículas de fuego
    setInterval(() => {
      const particle = document.createElement('div');
      particle.className = 'floating-ember';
      
      // Posición random en la parte inferior de la pantalla
      const posX = Math.random() * window.innerWidth;
      particle.style.left = `${posX}px`;
      particle.style.bottom = '0';
      
      // Color random entre rojo y naranja
      const hue = Math.floor(Math.random() * 30);
      const saturation = 90 + Math.floor(Math.random() * 10);
      const lightness = 50 + Math.floor(Math.random() * 10);
      particle.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      
      // Tamaño random
      const size = 5 + Math.random() * 10;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Añadir al DOM
      document.querySelector('.floating-embers').appendChild(particle);
      
      // Eliminar después de la animación
      setTimeout(() => {
        particle.remove();
      }, 5000);
    }, 500);
  }
  
  // Función para validar la fuerza de la contraseña
  function validatePasswordStrength() {
    if (!contrasenaInput) return;
    
    const password = contrasenaInput.value;
    const strengthText = document.getElementById('strength-text');
    const progressBar = document.getElementById('strength-progress');
    
    if (!strengthText || !progressBar) return;
    
    let strength = 0;
    
    // Longitud
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    
    // Complejidad
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Actualizar UI según la fuerza
    if (strength <= 2) {
      strengthText.textContent = 'Débil';
      strengthText.className = '';
      progressBar.style.width = '30%';
      progressBar.className = 'strength-progress';
    } else if (strength <= 4) {
      strengthText.textContent = 'Media';
      strengthText.className = 'medium';
      progressBar.style.width = '60%';
      progressBar.className = 'strength-progress medium';
    } else {
      strengthText.textContent = 'Fuerte';
      strengthText.className = 'strong';
      progressBar.style.width = '100%';
      progressBar.className = 'strength-progress strong';
    }
  }
  
  // Función para mostrar mensajes
  function displayMessage(text, type = 'error') {
    if (!mensaje) return;
    
    mensaje.textContent = text;
    mensaje.className = `message ${type}`;
    
    // Efecto de aparición
    mensaje.style.opacity = '0';
    mensaje.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      mensaje.style.transition = 'all 0.3s ease';
      mensaje.style.opacity = '1';
      mensaje.style.transform = 'translateY(0)';
    }, 10);
  }
  
  // Función para animar el formulario al tener un error
  function shake(element) {
    element.classList.add('shake');
    
    setTimeout(() => {
      element.classList.remove('shake');
    }, 500);
  }
  
  // Mostrar animación de carga en botón
  function showLoadingAnimation(button) {
    if (!button) return;
    
    const originalText = button.innerHTML;
    button.setAttribute('data-original-text', originalText);
    button.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> PROCESANDO';
    button.disabled = true;
  }
  
  // Ocultar animación de carga en botón
  function hideLoadingAnimation(button) {
    if (!button) return;
    
    const originalText = button.getAttribute('data-original-text');
    if (originalText) {
      button.innerHTML = originalText;
    }
    button.disabled = false;
  }
  
  // Función para animar la redirección
  function animateRedirect(url) {
    // Crear overlay de transición
    const overlay = document.createElement('div');
    overlay.className = 'redirect-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'black';
    overlay.style.zIndex = '9999';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.5s ease';
    
    document.body.appendChild(overlay);
    
    // Animar fade in
    setTimeout(() => {
      overlay.style.opacity = '1';
      
      // Redireccionar después del fade in
      setTimeout(() => {
        window.location.href = url;
      }, 500);
    }, 10);
  }
  
  // Añadir estilos CSS para animaciones adicionales
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
  `;
  document.head.appendChild(style);
});