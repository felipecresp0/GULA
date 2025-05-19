/**
 * GULA Hamburguesas - Juego de plataformas
 * Un juego de plataformas lateral en 2D con un pequeño diablito GULA como protagonista
 */

document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos del DOM
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('start-game');
  const restartBtn = document.getElementById('restart-game');
  const gameOverlay = document.querySelector('.game-overlay');
  const gameStart = document.querySelector('.game-start');
  const gameOver = document.querySelector('.game-over');
  const finalScore = document.getElementById('final-score');
  const scoreValue = document.getElementById('score-value');
  const couponContainer = document.getElementById('coupon-container');
  const copyBtn = document.getElementById('copy-coupon');
  
  // Botones de control móvil
  const btnLeft = document.getElementById('btn-left');
  const btnRight = document.getElementById('btn-right');
  const btnJump = document.getElementById('btn-jump');
  
  // Configuración del juego
  const gameConfig = {
    gravity: 0.5,
    playerSpeed: 5,
    jumpForce: 12,
    platformSpeed: 3,
    burgerPoints: 1,
    targetScore: 10,     // Score necesario para ganar cupón
    gameStarted: false,
    gameOver: false,
    bgColor: '#1a0808',  // Fondo oscuro rojizo
    platforms: [],
    collectibles: [],    // Hamburguesas para recolectar
    obstacles: [],       // Obstáculos a evitar
    score: 0,
    assetsLoaded: false
  };
  
  // Configuración del jugador
  const player = {
    x: 50,
    y: canvas.height - 70,
    width: 40,
    height: 50,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    facingRight: true,
    sprites: {
      right: null,
      left: null,
      jumpRight: null,
      jumpLeft: null,
      currentSprite: null
    }
  };
  
  // Estado de teclas - Cambiado a WASD y Espacio
  const keys = {
    KeyA: false,         // Izquierda (A)
    KeyD: false,         // Derecha (D)
    KeyW: false,         // Saltar (W)
    Space: false,        // Saltar (Espacio)
    ArrowLeft: false,    // Mantenemos flechas como alternativa
    ArrowRight: false,
    ArrowUp: false
  };
  
  // Cargar imágenes
  const images = {
    player: new Image(),
    playerLeft: new Image(),
    playerJump: new Image(),
    playerJumpLeft: new Image(),
    platform: new Image(),
    burger: new Image(),
    chili: new Image(),
    background: new Image()
  };
  
  let imagesLoaded = 0;
  const totalImages = Object.keys(images).length;
  
  // Cargar todas las imágenes
  function loadImages() {
    // Suponiendo que tengas estas imágenes en la carpeta imagenes
    images.player.src = '../Imagenes/diablo-right.png';
    images.playerLeft.src = '../Imagenes/diablo-left.png';
    images.playerJump.src = '../Imagenes/diablo-jump-right.png';
    images.playerJumpLeft.src = '../Imagenes/diablo-jump-left.png';
    images.platform.src = '../Imagenes/platform.png';
    images.burger.src = '../Imagenes/burger.png';
    images.chili.src = '../Imagenes/chili.png';
    images.background.src = '../Imagenes/game-bg.png';
    
    // Función para verificar cuando todas las imágenes están cargadas
    function imageLoaded() {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        gameConfig.assetsLoaded = true;
        
        // Asignar sprites al jugador
        player.sprites.right = images.player;
        player.sprites.left = images.playerLeft;
        player.sprites.jumpRight = images.playerJump;
        player.sprites.jumpLeft = images.playerJumpLeft;
        player.sprites.currentSprite = player.sprites.right;
        
        console.log("Todos los assets cargados");
      }
    }
    
    // Asignar event listeners a cada imagen
    Object.values(images).forEach(img => {
      img.onload = imageLoaded;
    });
    
    // Si alguna imagen falla en cargar, registrarla como cargada de todas formas
    Object.values(images).forEach(img => {
      img.onerror = () => {
        console.error("Error cargando imagen:", img.src);
        imageLoaded();
      };
    });
  }
  
  // Iniciar carga de imágenes
  loadImages();
  
  // Generar plataformas iniciales
  function createInitialPlatforms() {
    gameConfig.platforms = [
      { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 },  // Suelo
      { x: 200, y: canvas.height - 100, width: 100, height: 20 },
      { x: 400, y: canvas.height - 150, width: 80, height: 20 },
      { x: 600, y: canvas.height - 120, width: 120, height: 20 }
    ];
  }
  
  // Generar coleccionables (hamburguesas)
  function createCollectibles() {
    gameConfig.collectibles = [
      { x: 220, y: canvas.height - 130, width: 30, height: 30, active: true },
      { x: 420, y: canvas.height - 180, width: 30, height: 30, active: true },
      { x: 620, y: canvas.height - 150, width: 30, height: 30, active: true },
      { x: 300, y: canvas.height - 80, width: 30, height: 30, active: true },
      { x: 500, y: canvas.height - 50, width: 30, height: 30, active: true }
    ];
  }
  
  // Generar obstáculos (chilis)
  function createObstacles() {
    gameConfig.obstacles = [
      { x: 350, y: canvas.height - 40, width: 25, height: 25, active: true },
      { x: 550, y: canvas.height - 40, width: 25, height: 25, active: true },
      { x: 750, y: canvas.height - 40, width: 25, height: 25, active: true }
    ];
  }
  
  // Limpiar el canvas
  function clearCanvas() {
    ctx.fillStyle = gameConfig.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  // Dibujar fondo
  function drawBackground() {
    // Si la imagen de fondo está cargada, dibujarla con repetición
    if (images.background.complete) {
      // Crear un patrón con la imagen
      const pattern = ctx.createPattern(images.background, 'repeat');
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Capa de oscuridad para hacer el patrón más sutil
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // Si la imagen no está cargada, usar color de fondo
      ctx.fillStyle = gameConfig.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  // Dibujar al jugador
  function drawPlayer() {
    // Elegir el sprite adecuado según el estado del jugador
    if (player.isJumping) {
      player.sprites.currentSprite = player.facingRight ? player.sprites.jumpRight : player.sprites.jumpLeft;
    } else {
      player.sprites.currentSprite = player.facingRight ? player.sprites.right : player.sprites.left;
    }
    
    // Si el sprite está cargado, dibujarlo
    if (player.sprites.currentSprite && player.sprites.currentSprite.complete) {
      ctx.drawImage(player.sprites.currentSprite, player.x, player.y, player.width, player.height);
    } else {
      // Dibujo de respaldo si no se cargó la imagen
      ctx.fillStyle = '#ff0066'; // Color rosa neón GULA
      ctx.fillRect(player.x, player.y, player.width, player.height);
      
      // Dibujar cuernos
      ctx.fillStyle = '#ff3300';
      ctx.beginPath();
      ctx.moveTo(player.x + 5, player.y);
      ctx.lineTo(player.x + 10, player.y - 10);
      ctx.lineTo(player.x + 15, player.y);
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(player.x + player.width - 15, player.y);
      ctx.lineTo(player.x + player.width - 10, player.y - 10);
      ctx.lineTo(player.x + player.width - 5, player.y);
      ctx.fill();
    }
    
    // Efecto de brillo/fuego debajo del personaje
    ctx.fillStyle = 'rgba(255, 51, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(player.x + (player.width / 2), player.y + player.height - 5, 20, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Dibujar plataformas
  function drawPlatforms() {
    gameConfig.platforms.forEach(platform => {
      if (images.platform.complete) {
        // Dibujar la plataforma con repetición para que ajuste al ancho
        const patternWidth = 40; // Ancho de cada repetición
        const repetitions = Math.ceil(platform.width / patternWidth);
        
        for (let i = 0; i < repetitions; i++) {
          const drawWidth = Math.min(patternWidth, platform.width - (i * patternWidth));
          ctx.drawImage(
            images.platform,
            0, 0, drawWidth, platform.height,
            platform.x + (i * patternWidth), platform.y, drawWidth, platform.height
          );
        }
      } else {
        // Diseño de respaldo si no se cargó la imagen
        ctx.fillStyle = '#8B4513'; // Marrón (pan de hamburguesa)
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Detalles de textura para el pan
        ctx.fillStyle = '#A0522D';
        for (let i = 0; i < platform.width; i += 10) {
          ctx.fillRect(platform.x + i, platform.y, 5, 5);
        }
      }
    });
  }
  
  // Dibujar coleccionables
  function drawCollectibles() {
    gameConfig.collectibles.forEach(burger => {
      if (burger.active) {
        if (images.burger.complete) {
          ctx.drawImage(images.burger, burger.x, burger.y, burger.width, burger.height);
        } else {
          // Diseño de respaldo si no se cargó la imagen
          ctx.fillStyle = '#FFA500'; // Naranja (pan de hamburguesa)
          ctx.beginPath();
          ctx.arc(burger.x + burger.width/2, burger.y + burger.height/2, burger.width/2, 0, Math.PI * 2);
          ctx.fill();
          
          // Detalles de la hamburguesa
          ctx.fillStyle = '#8B0000'; // Rojo oscuro (carne)
          ctx.beginPath();
          ctx.arc(burger.x + burger.width/2, burger.y + burger.height/2, burger.width/3, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Efecto de brillo
        ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
        ctx.beginPath();
        ctx.arc(burger.x + burger.width/2, burger.y + burger.height/2, burger.width/1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
  
  // Dibujar obstáculos
  function drawObstacles() {
    gameConfig.obstacles.forEach(chili => {
      if (chili.active) {
        if (images.chili.complete) {
          ctx.drawImage(images.chili, chili.x, chili.y, chili.width, chili.height);
        } else {
          // Diseño de respaldo si no se cargó la imagen
          ctx.fillStyle = '#FF0000'; // Rojo (chili)
          ctx.beginPath();
          ctx.moveTo(chili.x, chili.y + chili.height);
          ctx.lineTo(chili.x + chili.width/2, chili.y);
          ctx.lineTo(chili.x + chili.width, chili.y + chili.height);
          ctx.fill();
        }
        
        // Efecto de brillo/fuego
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(chili.x + chili.width/2, chili.y + chili.height - 5, 15, 7, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
  
  // Dibujar puntaje
  function drawScore() {
    scoreValue.textContent = gameConfig.score;
  }
  
  // Actualizar la posición del jugador
  function updatePlayerPosition() {
    // Aplicar gravedad
    player.velocityY += gameConfig.gravity;
    
    // Mover horizontalmente - CAMBIADO para usar A y D
    if (keys.KeyA || keys.ArrowLeft) {
      player.velocityX = -gameConfig.playerSpeed;
      player.facingRight = false;
    } else if (keys.KeyD || keys.ArrowRight) {
      player.velocityX = gameConfig.playerSpeed;
      player.facingRight = true;
    } else {
      player.velocityX = 0;
    }
    
    // Saltar - CAMBIADO para usar W y Espacio
    if ((keys.KeyW || keys.Space || keys.ArrowUp) && !player.isJumping) {
      player.velocityY = -gameConfig.jumpForce;
      player.isJumping = true;
      playSound('jump');
    }
    
    // Actualizar posición
    player.x += player.velocityX;
    player.y += player.velocityY;
    
    // Límites de pantalla (izquierda y derecha)
    if (player.x < 0) {
      player.x = 0;
    } else if (player.x + player.width > canvas.width) {
      player.x = canvas.width - player.width;
    }
    
    // Si el jugador cae fuera de la pantalla, game over
    if (player.y > canvas.height) {
      endGame(false);
    }
  }
  
  // Verificar colisiones
  function checkCollisions() {
    // Colisión con plataformas
    let onPlatform = false;
    
    gameConfig.platforms.forEach(platform => {
      // Verificar si el jugador está sobre una plataforma
      if (player.velocityY >= 0 && // Está cayendo o en reposo
          player.y + player.height >= platform.y &&
          player.y + player.height <= platform.y + 15 && // Tolerancia vertical
          player.x + player.width > platform.x &&
          player.x < platform.x + platform.width) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.isJumping = false;
        onPlatform = true;
      }
    });
    
    // Si no está en ninguna plataforma, está saltando/cayendo
    if (!onPlatform && player.velocityY !== 0) {
      player.isJumping = true;
    }
    
    // Colisión con coleccionables
    gameConfig.collectibles.forEach(burger => {
      if (burger.active &&
          player.x < burger.x + burger.width &&
          player.x + player.width > burger.x &&
          player.y < burger.y + burger.height &&
          player.y + player.height > burger.y) {
        burger.active = false;
        gameConfig.score += gameConfig.burgerPoints;
        playSound('collect');
        
        // Crear un nuevo coleccionable fuera de la pantalla
        createNewCollectible();
      }
    });
    
    // Colisión con obstáculos
    gameConfig.obstacles.forEach(chili => {
      if (chili.active &&
          player.x < chili.x + chili.width &&
          player.x + player.width > chili.x &&
          player.y < chili.y + chili.height &&
          player.y + player.height > chili.y) {
        endGame(false);
        playSound('damage');
      }
    });
    
    // Verificar victoria
    if (gameConfig.score >= gameConfig.targetScore) {
      endGame(true);
    }
  }
  
  // Crear un nuevo coleccionable para mantener la dificultad
  function createNewCollectible() {
    // Posicionar fuera de la pantalla a la derecha
    const x = canvas.width + Math.random() * 200;
    const platformIndex = Math.floor(Math.random() * gameConfig.platforms.length);
    const platform = gameConfig.platforms[platformIndex];
    const y = platform.y - 40;
    
    gameConfig.collectibles.push({
      x: x,
      y: y,
      width: 30,
      height: 30,
      active: true
    });
  }
  
  // Crear un nuevo obstáculo
  function createNewObstacle() {
    // Posicionar fuera de la pantalla a la derecha
    const x = canvas.width + Math.random() * 300;
    
    gameConfig.obstacles.push({
      x: x,
      y: canvas.height - 40,
      width: 25,
      height: 25,
      active: true
    });
  }
  
  // Mover los elementos del juego (scroll)
  function moveGameElements() {
    // Mover coleccionables hacia la izquierda
    gameConfig.collectibles.forEach(burger => {
      burger.x -= gameConfig.platformSpeed;
      
      // Si está fuera de la pantalla y no está activo, eliminarlo
      if (burger.x + burger.width < 0 && !burger.active) {
        gameConfig.collectibles = gameConfig.collectibles.filter(b => b !== burger);
      }
    });
    
    // Mover obstáculos hacia la izquierda
    gameConfig.obstacles.forEach(chili => {
      chili.x -= gameConfig.platformSpeed;
      
      // Si está fuera de la pantalla, eliminarlo y crear uno nuevo
      if (chili.x + chili.width < 0) {
        gameConfig.obstacles = gameConfig.obstacles.filter(c => c !== chili);
        
        // 50% de probabilidad de crear un nuevo obstáculo
        if (Math.random() > 0.5) {
          createNewObstacle();
        }
      }
    });
    
    // Asegurarse de que siempre haya suficientes coleccionables
    if (gameConfig.collectibles.filter(b => b.active).length < 3) {
      createNewCollectible();
    }
    
    // Asegurarse de que haya un número adecuado de obstáculos
    if (gameConfig.obstacles.length < 3) {
      createNewObstacle();
    }
  }
  
  // Finalizar el juego
  function endGame(win) {
    gameConfig.gameOver = true;
    
    // Mostrar la pantalla de fin de juego
    finalScore.textContent = gameConfig.score;
    
    // Si el jugador ha ganado, mostrar el cupón
    if (win) {
      couponContainer.classList.remove('hidden');
      
      // Reproducir sonido de victoria
      playSound('win');
    } else {
      couponContainer.classList.add('hidden');
      
      // Reproducir sonido de derrota
      playSound('lose');
    }
    
    // Mostrar la pantalla de fin de juego
    gameOverlay.style.display = 'flex';
    gameStart.classList.add('hidden');
    gameOver.classList.remove('hidden');
  }
  
  // Función de sonido
  function playSound(type) {
    // Implementación básica de sonidos
    // En un juego real, se cargarían y reproducirían archivos de audio
    console.log(`Sonido: ${type}`);
  }
  
  // Loop principal del juego
  function gameLoop() {
    if (!gameConfig.gameOver && gameConfig.gameStarted) {
      clearCanvas();
      drawBackground();
      drawPlatforms();
      drawCollectibles();
      drawObstacles();
      updatePlayerPosition();
      checkCollisions();
      moveGameElements();
      drawPlayer();
      drawScore();
    }
    
    requestAnimationFrame(gameLoop);
  }
  
  // Inicializar el juego
  function initGame() {
    gameConfig.gameStarted = true;
    gameConfig.gameOver = false;
    gameConfig.score = 0;
    
    // Restaurar posición del jugador
    player.x = 50;
    player.y = canvas.height - 70;
    player.velocityX = 0;
    player.velocityY = 0;
    player.isJumping = false;
    
    // Generar elementos iniciales
    createInitialPlatforms();
    createCollectibles();
    createObstacles();
    
    // Ocultar el overlay
    gameOverlay.style.display = 'none';
    
    // Actualizar puntaje
    drawScore();
  }
  
  // Event listeners para controles de teclado - ACTUALIZADOS para incluir WASD y Espacio
  document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
      keys.Space = true;
      e.preventDefault(); // Prevenir scroll con espacio
    } else if (keys.hasOwnProperty(e.code)) {
      keys[e.code] = true;
    }
  });
  
  document.addEventListener('keyup', e => {
    if (e.code === 'Space') {
      keys.Space = false;
    } else if (keys.hasOwnProperty(e.code)) {
      keys[e.code] = false;
    }
  });
  
  // Event listeners para botones de control táctil - Actualizados para usar las nuevas teclas
  btnLeft.addEventListener('touchstart', () => { keys.KeyA = true; keys.ArrowLeft = true; });
  btnLeft.addEventListener('touchend', () => { keys.KeyA = false; keys.ArrowLeft = false; });
  btnRight.addEventListener('touchstart', () => { keys.KeyD = true; keys.ArrowRight = true; });
  btnRight.addEventListener('touchend', () => { keys.KeyD = false; keys.ArrowRight = false; });
  btnJump.addEventListener('touchstart', () => { keys.KeyW = true; keys.Space = true; keys.ArrowUp = true; });
  btnJump.addEventListener('touchend', () => { keys.KeyW = false; keys.Space = false; keys.ArrowUp = false; });
  
  // Event listeners para mouse (para los botones táctiles) - Actualizados para usar las nuevas teclas
  btnLeft.addEventListener('mousedown', () => { keys.KeyA = true; keys.ArrowLeft = true; });
  btnLeft.addEventListener('mouseup', () => { keys.KeyA = false; keys.ArrowLeft = false; });
  btnRight.addEventListener('mousedown', () => { keys.KeyD = true; keys.ArrowRight = true; });
  btnRight.addEventListener('mouseup', () => { keys.KeyD = false; keys.ArrowRight = false; });
  btnJump.addEventListener('mousedown', () => { keys.KeyW = true; keys.Space = true; keys.ArrowUp = true; });
  btnJump.addEventListener('mouseup', () => { keys.KeyW = false; keys.Space = false; keys.ArrowUp = false; });
  
  // Event listeners para botones de la interfaz
  startBtn.addEventListener('click', initGame);
  restartBtn.addEventListener('click', initGame);
  
  // Copiar cupón
  copyBtn.addEventListener('click', () => {
    const code = document.querySelector('.coupon-code').textContent;
    navigator.clipboard.writeText(code)
      .then(() => {
        copyBtn.textContent = '¡COPIADO!';
        copyBtn.style.animation = 'shake 0.5s';
        
        setTimeout(() => {
          copyBtn.textContent = 'COPIAR CÓDIGO';
          copyBtn.style.animation = '';
        }, 2000);
      })
      .catch(err => {
        console.error('Error al copiar el código:', err);
        
        // Fallback para copiar al portapapeles
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        copyBtn.textContent = '¡COPIADO!';
        copyBtn.style.animation = 'shake 0.5s';
        
        setTimeout(() => {
          copyBtn.textContent = 'COPIAR CÓDIGO';
          copyBtn.style.animation = '';
        }, 2000);
      });
  });
  
  // Ajustar tamaño del canvas al tamaño de la ventana
  function resizeCanvas() {
    const gameContainer = document.querySelector('.game-container');
    const containerWidth = gameContainer.clientWidth;
    
    // Mantener la proporción del canvas
    const aspectRatio = canvas.width / canvas.height;
    const newWidth = containerWidth;
    const newHeight = containerWidth / aspectRatio;
    
    canvas.style.width = newWidth + 'px';
    canvas.style.height = newHeight + 'px';
  }
  
  // Ajustar el canvas inicialmente y en resize
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  
  // Iniciar el loop del juego
  gameLoop();
  
  console.log("Juego GULA Runner inicializado");
});