export function renderProductos(container, productos) {
  if (!productos.length) {
    container.innerHTML = `<p class="empty">No se encontraron productos con esos filtros.</p>`;
    return;
  }

  container.innerHTML = productos.map(p => `
    <div class="card producto" data-id="${p.id}">
      <div class="img-wrap">
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" />
      </div>
      <h3>${p.nombre}</h3>
      <p class="marca">${p.marca}</p>
      <p class="talla-color">Talla ${p.talla} · ${p.color}</p>
      <p class="precio">${p.precioFormateado}</p>
      <div class="acciones">
        <button class="btn-detalle" data-id="${p.id}">Ver detalle</button>
        <button class="btn-agregar" data-id="${p.id}">🛒 Agregar</button>
      </div>
    </div>
  `).join("");
}

export function renderCategoriasSelect(select, categorias) {
  categorias.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = `${c.icono} ${c.nombre}`;
    select.appendChild(opt);
  });
}