document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    const contenedor = document.getElementById("contenedor-hamburguesas");
  
    async function cargarHamburguesas() {
      try {
        const res = await fetch("http://localhost:3000/api/hamburguesas", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const hamburguesas = await res.json();
  
        contenedor.innerHTML = "";
  
        hamburguesas.forEach(h => {
          const card = document.createElement("div");
          card.className = "card-hamburguesa";
          card.innerHTML = `
            <img src="${h.imagen}" alt="${h.nombre}" class="menu-img" />
            <h3>${h.nombre}</h3>
            <p>${h.descripcion}</p>
            <div class="precio">${Number(h.precio).toFixed(2)} €</div>
            <button onclick="añadirAlCarrito(${h.id})">Añadir al carrito</button>
          `;
          contenedor.appendChild(card);
        });
      } catch (err) {
        console.error("❌ Error al cargar hamburguesas:", err);
        contenedor.innerHTML = "<p>No se pudieron cargar las hamburguesas.</p>";
      }
    }
  
    window.añadirAlCarrito = async function(hamburguesa_id) {
      try {
        const res = await fetch("http://localhost:3000/api/carrito/agregar", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ hamburguesa_id, cantidad: 1 })
        });
  
        const datos = await res.json();
  
        if (res.ok) {
          alert('✅ Añadido al carrito');
        } else {
          alert('❌ ' + (datos.mensaje || datos.error));
        }
      } catch (error) {
        console.error("Error al añadir al carrito:", error);
      }
    };
  
    cargarHamburguesas();
  });