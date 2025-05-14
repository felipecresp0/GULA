document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("paradas-foodtruck");
  
    const eventos = [
      {
        ciudad: "Madrid",
        fecha: "12 de mayo",
        img: "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/madrid_foodtruck.jpg"
      },
      {
        ciudad: "Valencia",
        fecha: "20 de mayo",
        img: "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/valencia_foodtruck.jpg"
      },
      {
        ciudad: "Sevilla",
        fecha: "5 de junio",
        img: "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/sevilla_foodtruck.jpg"
      },
      {
        ciudad: "Barcelona",
        fecha: "15 de junio",
        img: "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/barcelona_foodtruck.jpg"
      }
    ];
  
    eventos.forEach(evento => {
      const card = document.createElement("div");
      card.className = "carousel-item purple-bg";
      card.innerHTML = `
        <img src="${evento.img}" alt="${evento.ciudad}" class="item-image" />
        <h3 class="item-title">${evento.ciudad}</h3>
        <p class="item-price">${evento.fecha}</p>
        <button class="order-btn" onclick="alert('¡Reserva en ${evento.ciudad} próximamente!')">Reservar</button>
      `;
      contenedor.appendChild(card);
    });
  });
// foodtruck.js — preparado para futuras funcionalidades dinámicas
document.addEventListener("DOMContentLoaded", () => {
    console.log("🔧 Página FoodTruck cargada correctamente.");
  });
    
  document.addEventListener("DOMContentLoaded", () => {
    console.log("🚚 Página FoodTruck cargada correctamente");
  });
  