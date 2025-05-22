document.addEventListener('DOMContentLoaded', () => {
  console.log("🔥 User form loaded - Infernal mode activated");
  
  // DOM element references
  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');
  const mensaje = document.getElementById('mensaje');
  const togglePassword = document.querySelectorAll('.toggle-password');
  const contrasenaInput = document.getElementById('contrasena');
  const confirmarContrasenaInput = document.getElementById('confirmar-contrasena');
  
  // Initialize visual effects
  initVisualEffects();
  
  // Toggle to show/hide password
  if (togglePassword.length > 0) {
    togglePassword.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const input = toggle.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        // Change icon
        const icon = toggle.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
      });
    });
  }
  
  // Password strength validation
  if (contrasenaInput) {
    contrasenaInput.addEventListener('input', validatePasswordStrength);
  }
  
  // Login form processing
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Show loading animation
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
        
        // Remove loading animation
        hideLoadingAnimation(formLogin.querySelector('.submit-btn'));
        
        if (res.ok) {
          // Save token
          localStorage.setItem('token', datos.token);
          
          // Show success message
          displayMessage('Welcome to hell! Redirecting...', 'success');
          
          // Decode token to get role
          const payload = JSON.parse(atob(datos.token.split('.')[1]));
          const rol = payload.rol;
          
          // Redirect based on role with animation
          setTimeout(() => {
            if (rol === 'admin') {
              animateRedirect('admin.html');
            } else {
              animateRedirect('index.html');
            }
          }, 1500);
          
        } else {
          shake(formLogin);
          displayMessage(datos.mensaje || 'The gates of hell remain closed', 'error');
        }
        
      } catch (error) {
        console.error('Request error:', error);
        shake(formLogin);
        hideLoadingAnimation(formLogin.querySelector('.submit-btn'));
        displayMessage('Connection error with the underworld server', 'error');
      }
    });
  }
  
  // Registration form processing
  if (formRegistro) {
    formRegistro.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const contrasena = document.getElementById('contrasena').value.trim();
      const confirmarContrasena = document.getElementById('confirmar-contrasena')?.value.trim();
      
      // Show loading animation
      showLoadingAnimation(formRegistro.querySelector('.submit-btn'));
      
      // Validations
      if (!nombre || !email || !contrasena) {
        shake(formRegistro);
        hideLoadingAnimation(formRegistro.querySelector('.submit-btn'));
        displayMessage('All fields are required to sell your soul', 'error');
        return;
      }
      
      if (contrasena.length < 6) {
        shake(formRegistro);
        hideLoadingAnimation(formRegistro.querySelector('.submit-btn'));
        displayMessage('Your password is too weak (minimum 6 characters)', 'error');
        return;
      }
      
      if (confirmarContrasena && contrasena !== confirmarContrasena) {
        shake(formRegistro);
        hideLoadingAnimation(formRegistro.querySelector('.submit-btn'));
        displayMessage('Passwords do not match', 'error');
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
        
        // Remove loading animation
        hideLoadingAnimation(formRegistro.querySelector('.submit-btn'));
        
        if (res.ok) {
          displayMessage('Your soul now belongs to us! Redirecting...', 'success');
          
          setTimeout(() => {
            animateRedirect('acceso.html');
          }, 2000);
        } else {
          shake(formRegistro);
          displayMessage(datos.mensaje || 'Error trying to sell your soul', 'error');
        }
        
      } catch (error) {
        console.error('Registration error:', error);
        shake(formRegistro);
        hideLoadingAnimation(formRegistro.querySelector('.submit-btn'));
        displayMessage('Connection error with the underworld server', 'error');
      }
    });
  }
  
  // 🔐 Functional logout for any page
  const botonLogout = document.getElementById('logout');
  if (botonLogout) {
    botonLogout.addEventListener('click', () => {
      localStorage.removeItem('token');
      animateRedirect('acceso.html');
    });
  }
  
  // Function to initialize visual effects
  function initVisualEffects() {
    // Create fire particles
    setInterval(() => {
      const particle = document.createElement('div');
      particle.className = 'floating-ember';
      
      // Random position at bottom of screen
      const posX = Math.random() * window.innerWidth;
      particle.style.left = `${posX}px`;
      particle.style.bottom = '0';
      
      // Random color between red and orange
      const hue = Math.floor(Math.random() * 30);
      const saturation = 90 + Math.floor(Math.random() * 10);
      const lightness = 50 + Math.floor(Math.random() * 10);
      particle.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      
      // Random size
      const size = 5 + Math.random() * 10;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Add to DOM
      document.querySelector('.floating-embers').appendChild(particle);
      
      // Remove after animation
      setTimeout(() => {
        particle.remove();
      }, 5000);
    }, 500);
  }
  
  // Function to validate password strength
  function validatePasswordStrength() {
    if (!contrasenaInput) return;
    
    const password = contrasenaInput.value;
    const strengthText = document.getElementById('strength-text');
    const progressBar = document.getElementById('strength-progress');
    
    if (!strengthText || !progressBar) return;
    
    let strength = 0;
    
    // Length
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    
    // Complexity
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Update UI based on strength
    if (strength <= 2) {
      strengthText.textContent = 'Weak';
      strengthText.className = '';
      progressBar.style.width = '30%';
      progressBar.className = 'strength-progress';
    } else if (strength <= 4) {
      strengthText.textContent = 'Medium';
      strengthText.className = 'medium';
      progressBar.style.width = '60%';
      progressBar.className = 'strength-progress medium';
    } else {
      strengthText.textContent = 'Strong';
      strengthText.className = 'strong';
      progressBar.style.width = '100%';
      progressBar.className = 'strength-progress strong';
    }
  }
  
  // Function to display messages
  function displayMessage(text, type = 'error') {
    if (!mensaje) return;
    
    mensaje.textContent = text;
    mensaje.className = `message ${type}`;
    
    // Appearance effect
    mensaje.style.opacity = '0';
    mensaje.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      mensaje.style.transition = 'all 0.3s ease';
      mensaje.style.opacity = '1';
      mensaje.style.transform = 'translateY(0)';
    }, 10);
  }
  
  // Function to animate form on error
  function shake(element) {
    element.classList.add('shake');
    
    setTimeout(() => {
      element.classList.remove('shake');
    }, 500);
  }
  
  // Show loading animation on button
  function showLoadingAnimation(button) {
    if (!button) return;
    
    const originalText = button.innerHTML;
    button.setAttribute('data-original-text', originalText);
    button.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> PROCESSING';
    button.disabled = true;
  }
  
  // Hide loading animation on button
  function hideLoadingAnimation(button) {
    if (!button) return;
    
    const originalText = button.getAttribute('data-original-text');
    if (originalText) {
      button.innerHTML = originalText;
    }
    button.disabled = false;
  }
  
  // Function to animate redirect
  function animateRedirect(url) {
    // Create transition overlay
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
    
    // Animate fade in
    setTimeout(() => {
      overlay.style.opacity = '1';
      
      // Redirect after fade in
      setTimeout(() => {
        window.location.href = url;
      }, 500);
    }, 10);
  }
  
  // Add CSS styles for additional animations
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