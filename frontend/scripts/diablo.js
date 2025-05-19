/**
 * GULA Hamburguesas - Script del Diablo
 * Este script controla la aparición aleatoria del diablo y el sistema de descuento
 */

document.addEventListener("DOMContentLoaded", () => {
  const devil = document.getElementById("floating-devil");
  const modal = document.getElementById("discount-modal");
  const closeBtn = document.getElementById("close-modal");
  const copyBtn = document.getElementById("copy-code");
  const discountCode = document.getElementById("discount-code");
  const goToMenuBtn = document.getElementById("go-to-menu");

  const CODES = ["GULA5", "PECADO10", "INFIERNO15"];
  const randomCode = CODES[Math.floor(Math.random() * CODES.length)];
  discountCode.textContent = randomCode;
  
  // Configuración del diablo
  const devilConfig = {
    minDelay: 10000,    // Tiempo mínimo entre apariciones (10 segundos) - Reducido para testing
    maxDelay: 30000,    // Tiempo máximo entre apariciones (30 segundos) - Reducido para testing
    minDuration: 5000,  // Duración mínima de aparición (5 segundos)
    maxDuration: 10000, // Duración máxima de aparición (10 segundos)
    margin: 50,         // Margen desde los bordes de la ventana
    devilCaught: false, // Controlar si ya se ha capturado al diablo
    appearCount: 0,     // Contador de apariciones del diablo
    maxAppearances: 5   // Máximo de apariciones antes de parar
  };
  
  // Códigos de descuento posibles
  const discountCodes = [
    'DIABLOGULA25',
    'PECADOR666',
    'TENTACION25',
    'INFIERNO25OFF',
    'CAPTURA25DIABLO'
  ];
  // ⏱️ Mostrar el diablo automáticamente después de unos segundos
  setTimeout(() => {
    devil.classList.remove("hidden");
    devil.classList.add("show");
  }, 3000); // cambia el tiempo si quieres
  // 😈 Clic en el diablo
  devil.addEventListener("click", () => {
    devil.classList.add("hidden");
    modal.classList.add("show");
  });
   // ❌ Cerrar el modal
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
  });
   // 📋 Copiar código al portapapeles
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(randomCode);
    copyBtn.textContent = "¡Copiado!";
    setTimeout(() => {
      copyBtn.textContent = "Copiar código";
    }, 2000);
  });
  // 🍔 Ir al menú
  goToMenuBtn.addEventListener("click", () => {
    window.location.href = "menu.html";
  });


  
  // Verificar si el usuario ya ha capturado al diablo (almacenado en localStorage)
  if (localStorage.getItem('gulaDevilCaught')) {
    devilConfig.devilCaught = true;
  } else {
    // Programar la primera aparición del diablo
    scheduleDevilAppearance();
  }
  
  // Event listeners
  if (floatingDevil) {
    floatingDevil.addEventListener('click', catchDevil);
  }
  
  if (closeDiscountBtn) {
    closeDiscountBtn.addEventListener('click', closeDiscountModal);
  }
  
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', copyDiscountCode);
  }
  
  if (discountBtn) {
    discountBtn.addEventListener('click', goToMenu);
  }
  
  // Cerrar modal al hacer clic fuera o con ESC
  if (discountModal) {
    discountModal.addEventListener('click', function(e) {
      if (e.target === discountModal) {
        closeDiscountModal();
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && discountModal.style.display === 'flex') {
        closeDiscountModal();
      }
    });
  }

  /**
   * Programa la próxima aparición del diablo
   */
  function scheduleDevilAppearance() {
    // Si ya se ha capturado o se alcanzó el máximo de apariciones, no continuar
    if (devilConfig.devilCaught || devilConfig.appearCount >= devilConfig.maxAppearances) {
      return;
    }
    
    // Calcular tiempo aleatorio para la próxima aparición
    const delay = Math.floor(Math.random() * (devilConfig.maxDelay - devilConfig.minDelay + 1)) + devilConfig.minDelay;
    
    // En desarrollo, usar un delay más corto para testing
    // const delay = 5000; // 5 segundos para testing
    
    setTimeout(showDevil, delay);
    
    console.log(`🔥 Diablo programado para aparecer en ${delay/1000} segundos`);
  }

  /**
   * Muestra el diablo en una posición aleatoria
   */
  function showDevil() {
    // Si ya se ha capturado o el elemento no existe, no continuar
    if (devilConfig.devilCaught || !floatingDevil) {
      return;
    }
    
    // Incrementar contador de apariciones
    devilConfig.appearCount++;
    
    // Calcular posición aleatoria
    const maxWidth = window.innerWidth - (devilConfig.margin * 2);
    const maxHeight = window.innerHeight - (devilConfig.margin * 2);
    
    const randomX = Math.floor(Math.random() * maxWidth) + devilConfig.margin;
    const randomY = Math.floor(Math.random() * maxHeight) + devilConfig.margin;
    
    // Posicionar el diablo
    floatingDevil.style.left = `${randomX}px`;
    floatingDevil.style.top = `${randomY}px`;
    
    // Mostrar el diablo con animación
    floatingDevil.classList.remove('hidden');
    floatingDevil.style.animation = 'devilAppear 0.5s ease-out, devilFloat 3s ease-in-out infinite';
    
    // Calcular duración aleatoria de aparición
    const duration = Math.floor(Math.random() * (devilConfig.maxDuration - devilConfig.minDuration + 1)) + devilConfig.minDuration;
    
    // Programar desaparición
    setTimeout(hideDevil, duration);
    
    console.log(`🔥 Diablo apareció (#${devilConfig.appearCount}). Desaparecerá en ${duration/1000} segundos`);
  }

  /**
   * Oculta el diablo y programa la siguiente aparición
   */
  function hideDevil() {
    // Si ya se ha capturado o el elemento no existe, no continuar
    if (devilConfig.devilCaught || !floatingDevil) {
      return;
    }
    
    // Animar desaparición
    floatingDevil.style.animation = 'devilDisappear 0.5s ease-out forwards';
    
    // Ocultar después de la animación
    setTimeout(() => {
      floatingDevil.classList.add('hidden');
      
      // Programar siguiente aparición
      scheduleDevilAppearance();
      
      console.log('🔥 Diablo desapareció. Programando nueva aparición...');
    }, 500);
  }

  /**
   * Captura al diablo y muestra el modal de descuento
   */
  function catchDevil() {
    // Marcar como capturado
    devilConfig.devilCaught = true;
    
    // Almacenar en localStorage
    localStorage.setItem('gulaDevilCaught', 'true');
    
    // Ocultar el diablo con animación
    floatingDevil.style.animation = 'devilDisappear 0.5s ease-out forwards';
    
    // Seleccionar un código de descuento aleatorio
    const randomCode = discountCodes[Math.floor(Math.random() * discountCodes.length)];
    if (discountCode) {
      discountCode.textContent = randomCode;
    }
    
    // Mostrar modal con pequeño retraso
    setTimeout(() => {
      floatingDevil.classList.add('hidden');
      if (discountModal) {
        discountModal.style.display = 'flex';
        
        // Reproducir sonido (si está disponible y permitido)
        try {
          const audio = new Audio('https://assets.mixkit.co/sfx/download/mixkit-winning-chimes-2015.wav');
          audio.volume = 0.5;
          audio.play().catch(e => {
            // Silenciar error si el navegador bloquea la reproducción
            console.log('Audio no disponible');
          });
        } catch (e) {
          // Silenciar error si el navegador bloquea la reproducción
          console.log('Audio no disponible');
        }
      }
      
      console.log('🔥 ¡Diablo capturado! Modal de descuento mostrado');
    }, 500);
  }

  /**
   * Cierra el modal de descuento
   */
  function closeDiscountModal() {
    if (!discountModal) return;
    
    // Añadir animación de salida
    discountModal.style.opacity = '0';
    discountModal.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
      discountModal.style.display = 'none';
      discountModal.style.opacity = '1';
      discountModal.style.transform = 'scale(1)';
      
      console.log('🔥 Modal de descuento cerrado');
    }, 300);
  }

  /**
   * Copia el código de descuento al portapapeles
   */
  function copyDiscountCode() {
    if (!discountCode || !copyCodeBtn) return;
    
    const code = discountCode.textContent;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code)
        .then(showCopySuccess)
        .catch(fallbackCopy);
    } else {
      fallbackCopy();
    }

    // Método alternativo para copiar al portapapeles
    function fallbackCopy() {
      const textArea = document.createElement('textarea');
      textArea.value = code;
      textArea.style.position = 'fixed';
      textArea.style.opacity = 0;
      
      document.body.appendChild(textArea);
      textArea.select();
      
      let success = false;
      try {
        success = document.execCommand('copy');
      } catch (err) {
        console.error('Error al copiar el texto:', err);
      }
      
      document.body.removeChild(textArea);
      
      if (success) {
        showCopySuccess();
      }
    }
  }

  /**
   * Muestra una notificación de éxito al copiar
   */
  function showCopySuccess() {
    if (!copyCodeBtn) return;
    
    // Guardar texto original
    const originalIcon = copyCodeBtn.innerHTML;
    
    // Cambiar a ícono de éxito
    copyCodeBtn.innerHTML = '<i class="fas fa-check"></i>';
    
    // Crear notificación
    const notification = document.createElement('div');
    notification.textContent = '¡Código copiado!';
    notification.style.position = 'absolute';
    notification.style.top = '-40px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
    notification.style.color = '#00ff00';
    notification.style.padding = '5px 10px';
    notification.style.borderRadius = '5px';
    notification.style.fontSize = '0.9rem';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    
    // Añadir al DOM
    const codeContainer = document.querySelector('.discount-code');
    if (codeContainer) {
      codeContainer.appendChild(notification);
      
      // Animar entrada
      setTimeout(() => {
        notification.style.opacity = '1';
      }, 10);
      
      // Restaurar botón después de un tiempo
      setTimeout(() => {
        copyCodeBtn.innerHTML = originalIcon;
        notification.style.opacity = '0';
        
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 2000);
      
      console.log('🔥 Código de descuento copiado al portapapeles');
    }
  }

  /**
   * Redirige a la página del menú con el código de descuento
   */
  function goToMenu() {
    if (!discountCode) return;
    
    const code = discountCode.textContent;
    window.location.href = 'menu.html?discount=' + encodeURIComponent(code);
    
    console.log(`🔥 Redirigiendo a menú con código de descuento: ${code}`);
  }

  // Para testing y desarrollo - permite reiniciar el estado del diablo
  window.resetDevilState = function() {
    localStorage.removeItem('gulaDevilCaught');
    devilConfig.devilCaught = false;
    devilConfig.appearCount = 0;
    scheduleDevilAppearance();
    console.log('🔥 Estado del diablo reiniciado. Aparecerá nuevamente.');
  };
});
