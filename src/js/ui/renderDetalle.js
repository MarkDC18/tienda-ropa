export function abrirDetalle(producto) {
  const modal = document.getElementById("modal");
  const body = document.getElementById("modal-body");

  body.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}" />
    <h2>${producto.nombre}</h2>
    <p class="badge">${producto.marca}</p>
    <p><strong>Talla:</strong> ${producto.talla} · <strong>Color:</strong> ${producto.color}</p>
    <p><strong>Precio:</strong> ${producto.precioFormateado}</p>
    <p><strong>Stock:</strong> ${producto.stock} unidades</p>
    <p class="desc">${producto.descripcion}</p>
    <button class="btn-primary btn-agregar-detalle" data-id="${producto.id}">🛒 Agregar al carrito</button>
  `;

  modal.classList.remove("hidden");
}

export function cerrarDetalle() {
  document.getElementById("modal").classList.add("hidden");
}