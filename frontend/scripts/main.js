document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.getElementById("carousel");
    const prevBtn = document.querySelector(".prev-arrow");
    const nextBtn = document.querySelector(".next-arrow");
  
    // ✅ Carrusel: botones izquierda/derecha
    if (nextBtn && prevBtn && carousel) {
      nextBtn.addEventListener("click", () => {
        carousel.scrollBy({ left: 300, behavior: "smooth" });
      });
  
      prevBtn.addEventListener("click", () => {
        carousel.scrollBy({ left: -300, behavior: "smooth" });
      });
    }
  
    // ✅ Cargar hamburguesas destacadas desde el backend
    fetch("http://localhost:3000/api/hamburguesas/destacadas")
      .then((res) => res.json())
      .then((data) => {
        carousel.innerHTML = ""; // Limpiar contenido anterior
  
        const colores = ["orange-bg", "green-bg", "purple-bg", "blue-bg"];
  
        data.forEach((burger, i) => {
          const color = colores[i % colores.length];
  
          const item = document.createElement("div");
          item.className = `carousel-item ${color}`;
          item.innerHTML = `
            <img src="${burger.imagen}" alt="${burger.nombre}" class="item-image">
            <h3 class="item-title">${burger.nombre}</h3>
           <p class="item-price">$${Number(burger.precio).toFixed(2)}</p>
            <button class="order-btn">Pedir Ahora</button>
          `;
          carousel.appendChild(item);
        });
      })
      .catch((err) => {
        console.error("Error al cargar hamburguesas destacadas:", err);
        if (carousel) {
          carousel.innerHTML = "<p>Error al cargar las hamburguesas.</p>";
        }
      });
  });
  