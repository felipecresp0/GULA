/* JavaScript para la Intranet de Empleados */

// Función para cambiar entre páginas
function changePage(pageId) {
    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Mostrar la página seleccionada
    document.getElementById(pageId).classList.add('active');

    // Actualizar menú lateral
    document.querySelectorAll('.sidebar li').forEach(item => {
        item.classList.remove('active');
    });

    // Seleccionar el elemento del menú correspondiente
    document.querySelector(`.sidebar li[onclick="changePage('${pageId}')"]`).classList.add('active');
}

// Actualizar hora actual
function updateTime() {
    const now = new Date();
    const timeDisplay = document.getElementById('current-time');
    const dateDisplay = document.getElementById('current-date');

    if (timeDisplay) {
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }

    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = now.toLocaleDateString('es-ES', options);
    }
}

// Funciones para el fichaje
function clockIn() {
    const statusElement = document.querySelector('.status');
    if (statusElement) {
        statusElement.textContent = "Trabajando";
        statusElement.classList.remove('off');
        statusElement.classList.add('working');
        alert('Has fichado correctamente tu entrada a las ' + document.getElementById('current-time').textContent);
    }
}

function clockOut() {
    const statusElement = document.querySelector('.status');
    if (statusElement) {
        statusElement.textContent = "No has fichado";
        statusElement.classList.remove('working');
        statusElement.classList.add('off');
        alert('Has fichado correctamente tu salida a las ' + document.getElementById('current-time').textContent);
    }
}

function editTimeEntry() {
    changePage('tiempo');
    document.getElementById('modificacion-form').scrollIntoView({ behavior: 'smooth' });
}

function showExcedenciaForm() {
    document.getElementById('excedencia-form').scrollIntoView({ behavior: 'smooth' });
}

function showModificacionForm() {
    document.getElementById('modificacion-form').scrollIntoView({ behavior: 'smooth' });
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar hora cada segundo
    updateTime();
    setInterval(updateTime, 1000);

    // Configurar eventos de formularios
    const vacationForm = document.getElementById('vacation-form');
    if (vacationForm) {
        vacationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Solicitud de vacaciones enviada correctamente');
            this.reset();
        });
    }

    const modForm = document.getElementById('modificacion-form');
    if (modForm) {
        modForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Solicitud de modificación enviada correctamente');
            this.reset();
        });
    }

    const excForm = document.getElementById('excedencia-form');
    if (excForm) {
        excForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Solicitud de excedencia enviada correctamente');
            this.reset();
        });
    }
});