import { calcularTotal, contarItems } from "../services/tiendaService.js";

export function renderCarrito(carrito) {
  const body = document.getElementById("carrito-body");
  const totalEl = document.getElementById("carrito-total");

  if (!carrito.length) {
    body.innerHTML = `<p class="empty">Tu bolsa está vacía.</p>`;
    totalEl.textContent = "0.00";
    return;
  }

  body.innerHTML = carrito.map(i => `
    <div class="carrito-item">
      <img src="${i.imagen}" alt="${i.nombre}" />
      <div class="info">
        <h4>${i.nombre}</h4>
        <p>S/ ${i.precio.toFixed(2)}</p>
        <div class="cantidad-control">
          <button class="btn-cantidad btn-menos" data-id="${i.id}">−</button>
          <span class="cantidad-valor">${i.cantidad}</span>
          <button class="btn-cantidad btn-mas" data-id="${i.id}">+</button>
        </div>
      </div>
      <div class="item-total">
        <span>S/ ${(i.precio * i.cantidad).toFixed(2)}</span>
        <button class="btn-quitar" data-id="${i.id}">✕</button>
      </div>
    </div>
  `).join("");

  totalEl.textContent = calcularTotal(carrito).toFixed(2);
}

export function actualizarBadge(carrito) {
  document.getElementById("badge-carrito").textContent = contarItems(carrito);
}

export function abrirModalCarrito() {
  document.getElementById("modal-carrito").classList.remove("hidden");
}

export function cerrarModalCarrito() {
  document.getElementById("modal-carrito").classList.add("hidden");
}