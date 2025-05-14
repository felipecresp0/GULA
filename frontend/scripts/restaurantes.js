document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('busqueda-form');
    const mapa = L.map('mapa').setView([40.4168, -3.7038], 5); // España
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapa);
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const cp = document.getElementById('codigo-postal').value;
  
      try {
        const res = await fetch(`http://localhost:3000/api/restaurantes?cp=${cp}`);
        const data = await res.json();
  
        if (!Array.isArray(data) || data.length === 0) {
          alert("No se encontraron restaurantes.");
          return;
        }
  
        mapa.eachLayer((layer) => {
          if (layer instanceof L.Marker) mapa.removeLayer(layer);
        });
  
        data.forEach((r) => {
          const marker = L.marker([r.latitud, r.longitud]).addTo(mapa);
          marker.bindPopup(`<b>${r.nombre}</b><br><button onclick="window.location.href='reservas.html?restaurante=${r.id}'">Reservar aquí</button>`);
        });
  
        mapa.setView([data[0].latitud, data[0].longitud], 13);
  
      } catch (error) {
        console.error('Error al buscar restaurantes:', error);
        alert('Hubo un error al buscar los restaurantes.');
      }
    });
  });
  