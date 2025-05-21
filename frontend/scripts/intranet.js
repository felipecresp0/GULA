// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar reloj
    initializeClock();
    
    // Inicializar navegación
    initializeNavigation();
    
    // Inicializar fichaje
    initializeFichaje();
    
    // Inicializar formularios
    initializeForms();
    
    // Inicializar dropdowns en móvil
    initializeMobileDropdowns();
    
    // Mostrar último fichaje
    showLastFichaje();
});

// Función para inicializar el reloj
function initializeClock() {
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-ES');
        const dateString = now.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const horaElement = document.getElementById('hora-actual');
        const fechaElement = document.getElementById('fecha-actual');
        
        if (horaElement) horaElement.textContent = timeString;
        if (fechaElement) fechaElement.textContent = dateString;
    }
    
    // Actualizar inmediatamente y luego cada segundo
    updateClock();
    setInterval(updateClock, 1000);
}

// Función para inicializar la navegación
function initializeNavigation() {
    // Manejar clicks en enlaces de navegación
    const navLinks = document.querySelectorAll('[data-section]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionName = this.getAttribute('data-section');
            showSection(sectionName);
            
            // Actualizar enlaces activos solo para el menú principal
            if (this.closest('.nav-menu')) {
                updateActiveNavLink(this);
            }
        });
    });
    
    // Manejar clicks en botones de acceso rápido
    const quickActionButtons = document.querySelectorAll('.quick-actions .btn[data-section]');
    quickActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionName = this.getAttribute('data-section');
            showSection(sectionName);
            
            // Actualizar el enlace correspondiente en la navegación
            const navLink = document.querySelector(`.nav-menu [data-section="${sectionName}"]`);
            if (navLink) {
                updateActiveNavLink(navLink);
            }
        });
    });
}

// Función para mostrar una sección específica
function showSection(sectionName) {
    // Ocultar todas las secciones
    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    } else {
        console.warn(`Sección "${sectionName}" no encontrada`);
    }
}

// Función para actualizar el enlace activo en la navegación
function updateActiveNavLink(clickedLink) {
    // Remover clase active de todos los enlaces principales
    const mainNavLinks = document.querySelectorAll('.nav-menu > .nav-item > .nav-link');
    mainNavLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Agregar clase active al enlace clickeado o su padre si es un dropdown
    if (clickedLink.closest('.dropdown-menu')) {
        // Si es un enlace del dropdown, activar el enlace padre
        const parentDropdown = clickedLink.closest('.dropdown');
        const parentLink = parentDropdown.querySelector('.dropdown-toggle');
        if (parentLink) {
            parentLink.classList.add('active');
        }
    } else {
        // Si es un enlace principal, activarlo directamente
        clickedLink.classList.add('active');
    }
}

// Función para inicializar el sistema de fichaje
function initializeFichaje() {
    const btnEntrada = document.getElementById('btn-entrada');
    const btnSalida = document.getElementById('btn-salida');
    
    if (btnEntrada) {
        btnEntrada.addEventListener('click', function() {
            realizarFichaje('entrada');
        });
    }
    
    if (btnSalida) {
        btnSalida.addEventListener('click', function() {
            realizarFichaje('salida');
        });
    }
}

// Función para realizar fichaje
function realizarFichaje(tipo) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES');
    const dateString = now.toLocaleDateString('es-ES');
    
    // Guardar en localStorage
    const fichajeData = {
        tipo: tipo,
        fecha: dateString,
        hora: timeString,
        timestamp: now.getTime()
    };
    
    localStorage.setItem('ultimoFichaje', JSON.stringify(fichajeData));
    
    // Mostrar confirmación
    showNotification(`Fichaje de ${tipo} registrado a las ${timeString}`, 'success');
    
    // Actualizar display del último fichaje
    showLastFichaje();
}

// Función para mostrar el último fichaje
function showLastFichaje() {
    const ultimoFichajeElement = document.getElementById('ultimo-fichaje');
    if (!ultimoFichajeElement) return;
    
    const ultimoFichaje = localStorage.getItem('ultimoFichaje');
    
    if (ultimoFichaje) {
        const data = JSON.parse(ultimoFichaje);
        ultimoFichajeElement.innerHTML = `
            <h4>Último fichaje:</h4>
            <p><strong>${data.tipo.charAt(0).toUpperCase() + data.tipo.slice(1)}</strong></p>
            <p>${data.fecha} a las ${data.hora}</p>
        `;
    } else {
        ultimoFichajeElement.innerHTML = '<p>No hay fichajes registrados</p>';
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    // Agregar al body
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Agregar estilos de animación para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Función para inicializar formularios
function initializeForms() {
    // Formulario de vacaciones
    const vacationForm = document.querySelector('.vacation-form');
    if (vacationForm) {
        vacationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleVacationSubmit(this);
        });
    }
    
    // Formulario de contacto
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmit(this);
        });
    }
    
    // Formulario de comunicación
    const communicationForm = document.querySelector('.communication-form');
    if (communicationForm) {
        communicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCommunicationSubmit(this);
        });
    }
    
    // Validación de fechas en formulario de vacaciones
    const fechaInicio = document.getElementById('fecha-inicio');
    const fechaFin = document.getElementById('fecha-fin');
    
    if (fechaInicio && fechaFin) {
        fechaInicio.addEventListener('change', function() {
            fechaFin.min = this.value;
            if (fechaFin.value && fechaFin.value < this.value) {
                fechaFin.value = this.value;
            }
        });
    }
}

// Función para manejar envío de solicitud de vacaciones
function handleVacationSubmit(form) {
    const formData = new FormData(form);
    const fechaInicio = formData.get('fecha-inicio');
    const fechaFin = formData.get('fecha-fin');
    const motivo = formData.get('motivo');
    
    // Validaciones
    if (!fechaInicio || !fechaFin) {
        showNotification('Por favor, completa todas las fechas requeridas', 'error');
        return;
    }
    
    if (new Date(fechaInicio) > new Date(fechaFin)) {
        showNotification('La fecha de inicio no puede ser posterior a la fecha de fin', 'error');
        return;
    }
    
    // Simular envío
    showNotification('Solicitud de vacaciones enviada correctamente', 'success');
    form.reset();
}

// Función para manejar envío de formulario de contacto
function handleContactSubmit(form) {
    const formData = new FormData(form);
    const category = formData.get('category');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    if (!category || !subject || !message) {
        showNotification('Por favor, completa todos los campos requeridos', 'error');
        return;
    }
    
    // Simular envío
    showNotification('Mensaje enviado correctamente', 'success');
    form.reset();
}

// Función para manejar envío de formulario de comunicación
function handleCommunicationSubmit(form) {
    const formData = new FormData(form);
    const asunto = formData.get('asunto');
    const categoria = formData.get('categoria');
    const mensaje = formData.get('mensaje');
    
    if (!asunto || !categoria || !mensaje) {
        showNotification('Por favor, completa todos los campos requeridos', 'error');
        return;
    }
    
    // Simular envío
    showNotification('Comunicación enviada correctamente', 'success');
    form.reset();
}

// Función para inicializar dropdowns en móvil
function initializeMobileDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdown = this.closest('.dropdown');
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // Cerrar dropdowns al hacer click fuera en móvil
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
        }
    });
}

// Función para filtrar documentos
function filterDocuments() {
    const yearFilter = document.getElementById('filter-year');
    const typeFilter = document.getElementById('filter-type');
    
    if (yearFilter) {
        yearFilter.addEventListener('change', function() {
            // Aquí se implementaría la lógica de filtrado
            console.log('Filtrar por año:', this.value);
        });
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', function() {
            // Aquí se implementaría la lógica de filtrado
            console.log('Filtrar por tipo:', this.value);
        });
    }
}

// Función para manejar descargas de documentos
function initializeDownloads() {
    const downloadButtons = document.querySelectorAll('.btn[href], .btn:not([type="submit"])');
    
    downloadButtons.forEach(button => {
        if (button.textContent.includes('Descargar') || button.textContent.includes('Ver')) {
            button.addEventListener('click', function(e) {
                if (!this.href) {
                    e.preventDefault();
                    showNotification('Descarga iniciada...', 'info');
                }
            });
        }
    });
}

// Inicializar filtros y descargas cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    filterDocuments();
    initializeDownloads();
});

// Función para manejar el redimensionado de ventana
window.addEventListener('resize', function() {
    // Cerrar dropdowns móviles si se cambia a desktop
    if (window.innerWidth > 768) {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Función para simular carga de datos
function loadUserData() {
    // Simular carga de datos del usuario
    const userData = {
        name: 'Usuario Ejemplo',
        department: 'Recursos Humanos',
        position: 'Técnico RRHH'
    };
    
    return userData;
}

// Función para actualizar información del usuario
function updateUserInfo() {
    const userData = loadUserData();
    const userNameElement = document.querySelector('.user-name');
    
    if (userNameElement) {
        userNameElement.textContent = `Bienvenido, ${userData.name}`;
    }
}

// Función para manejar el estado de los cursos de formación
function initializeTrainingStatus() {
    const cursoItems = document.querySelectorAll('.curso-item');
    
    cursoItems.forEach(item => {
        const button = item.querySelector('.btn');
        if (button) {
            button.addEventListener('click', function() {
                const cursoTitle = item.querySelector('h4').textContent;
                
                if (this.textContent.includes('Acceder')) {
                    showNotification(`Iniciando curso: ${cursoTitle}`, 'info');
                } else if (this.textContent.includes('Continuar')) {
                    showNotification(`Continuando curso: ${cursoTitle}`, 'info');
                } else if (this.textContent.includes('Certificado')) {
                    showNotification(`Descargando certificado de: ${cursoTitle}`, 'success');
                }
            });
        }
    });
}

// Inicializar estado de formación
document.addEventListener('DOMContentLoaded', function() {
    initializeTrainingStatus();
    updateUserInfo();
});

// Función para buscar en la documentación
function initializeDocumentSearch() {
    // Crear campo de búsqueda si no existe
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.cssText = `
        margin-bottom: 2rem;
        text-align: center;
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar documentos...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        width: 100%;
        max-width: 400px;
        padding: 0.75rem;
        border: 2px solid #e9ecef;
        border-radius: 25px;
        font-size: 1rem;
    `;
    
    searchContainer.appendChild(searchInput);
    
    // Agregar a las secciones de documentación
    const docSection = document.getElementById('documentacion');
    if (docSection) {
        const sectionHeader = docSection.querySelector('.section-header');
        if (sectionHeader) {
            sectionHeader.after(searchContainer);
        }
    }
    
    // Funcionalidad de búsqueda
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const documentCards = document.querySelectorAll('.documentation-grid .card');
        
        documentCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('.card-content p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Función para inicializar tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.title;
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
            `;
            
            document.body.appendChild(tooltip);
            
            // Remover el title para evitar tooltip nativo
            this.setAttribute('data-original-title', this.title);
            this.removeAttribute('title');
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                document.body.removeChild(tooltip);
            }
            
            // Restaurar title
            const originalTitle = this.getAttribute('data-original-title');
            if (originalTitle) {
                this.title = originalTitle;
                this.removeAttribute('data-original-title');
            }
        });
    });
}

// Función para manejar el modo oscuro (feature adicional)
function initializeDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #3498db;
        color: white;
        border: none;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(darkModeToggle);
    
    // Verificar si hay preferencia guardada
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', isDark);
    });
}

// Inicializar todas las funcionalidades adicionales
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeDocumentSearch();
        initializeTooltips();
        initializeDarkMode();
    }, 1000);
});

// Función para debug - mostrar información del estado actual
function debugInfo() {
    console.log('Estado actual de la intranet:');
    console.log('- Sección activa:', document.querySelector('.content-section.active')?.id);
    console.log('- Último fichaje:', localStorage.getItem('ultimoFichaje'));
    console.log('- Ancho de ventana:', window.innerWidth);
    console.log('- Usuario:', loadUserData());
}

// Hacer debug disponible globalmente (solo para desarrollo)
window.debugIntranet = debugInfo;