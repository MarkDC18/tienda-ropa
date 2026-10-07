import { listarProductos, listarCategorias, listarPromociones,
         agregarAlCarrito, eliminarDelCarrito, obtenerCarrito,
         vaciarCarrito, calcularTotal,
         aumentarCantidad, disminuirCantidad } from "./js/services/tiendaService.js";
import { renderProductos, renderCategoriasSelect } from "./js/ui/renderProductos.js";
import { abrirDetalle, cerrarDetalle } from "./js/ui/renderDetalle.js";
import { renderCarrito, actualizarBadge, abrirModalCarrito, cerrarModalCarrito } from "./js/ui/renderCarrito.js";

let productosGlobal = [];

async function init() {
  try {
    const contenedor = document.getElementById("lista-productos");
    contenedor.innerHTML = `<p class="loading">Cargando colección...</p>`;

    const [productos, categorias, promos] = await Promise.all([
      listarProductos(),
      listarCategorias(),
      listarPromociones(),
    ]);

    productosGlobal = productos;
    renderProductos(contenedor, productos);
    renderCategoriasSelect(document.getElementById("filtro-categoria"), categorias);
    renderPromociones(promos);
    renderStats(productos, categorias, promos);
    renderCarrito(obtenerCarrito());
    actualizarBadge(obtenerCarrito());
    conectarEventos();
  } catch (err) {
    console.error(err);
    document.getElementById("lista-productos").innerHTML =
      `<p class="error">Error al cargar: ${err.message}</p>`;
  }
}

function renderStats(productos, categorias, promos) {
  document.getElementById("stats").innerHTML = `
    <div class="stat"><span>${productos.length}</span><p>Piezas</p></div>
    <div class="stat"><span>${categorias.length}</span><p>Categorías</p></div>
    <div class="stat"><span>${promos.length}</span><p>Promociones</p></div>
  `;
}

function renderPromociones(promos) {
  document.getElementById("lista-promociones").innerHTML = promos.map(p => `
    <div class="card promo">
      <h3>${p.titulo}</h3>
      <p>${p.descripcion}</p>
      ${p.descuentoPct > 0 ? `<p class="descuento">-${p.descuentoPct}%</p>` : ""}
      <p class="vigencia">Válido hasta ${p.validoHasta}</p>
    </div>
  `).join("");
}

async function aplicarFiltros() {
  const filtros = {};
  const buscar = document.getElementById("filtro-buscar").value.trim();
  const categoriaId = document.getElementById("filtro-categoria").value;
  const precioMax = document.getElementById("filtro-precio").value;

  if (buscar) filtros.buscar = buscar;
  if (categoriaId) filtros.categoriaId = categoriaId;
  if (precioMax) filtros.precioMax = precioMax;

  const contenedor = document.getElementById("lista-productos");
  contenedor.innerHTML = `<p class="loading">Filtrando...</p>`;

  try {
    const productos = await listarProductos(filtros);
    productosGlobal = productos;
    renderProductos(contenedor, productos);
    conectarBotonesProductos();
  } catch (err) {
    contenedor.innerHTML = `<p class="error">Error: ${err.message}</p>`;
  }
}

function conectarEventos() {
  document.getElementById("btn-filtrar").addEventListener("click", aplicarFiltros);
  document.getElementById("filtro-buscar").addEventListener("keypress", e => {
    if (e.key === "Enter") aplicarFiltros();
  });

  document.getElementById("btn-carrito").addEventListener("click", () => {
    renderCarrito(obtenerCarrito());
    abrirModalCarrito();
    conectarBotonesCarrito();
  });

  document.getElementById("cerrar-carrito").addEventListener("click", cerrarModalCarrito);
  document.getElementById("cerrar-modal").addEventListener("click", cerrarDetalle);
  document.getElementById("cerrar-checkout").addEventListener("click", cerrarCheckout);

  document.getElementById("btn-vaciar").addEventListener("click", () => {
    const c = vaciarCarrito();
    renderCarrito(c);
    actualizarBadge(c);
    conectarBotonesCarrito();
  });

  document.getElementById("btn-checkout").addEventListener("click", () => {
    const c = obtenerCarrito();
    if (!c.length) return alert("Tu bolsa está vacía");
    cerrarModalCarrito();
    document.getElementById("checkout-total").textContent = calcularTotal(c).toFixed(2);
    document.getElementById("modal-checkout").classList.remove("hidden");
  });

  document.getElementById("form-checkout").addEventListener("submit", e => {
    e.preventDefault();
    const nombre = document.getElementById("co-nombre").value;
    alert(`¡Gracias por tu compra, ${nombre}! Tu pedido será enviado en 2-3 días hábiles.`);
    vaciarCarrito();
    renderCarrito([]);
    actualizarBadge([]);
    cerrarCheckout();
    e.target.reset();
  });

  ["modal", "modal-carrito", "modal-checkout"].forEach(id => {
    document.getElementById(id).addEventListener("click", e => {
      if (e.target.id === id) document.getElementById(id).classList.add("hidden");
    });
  });

  conectarBotonesProductos();
}

function cerrarCheckout() {
  document.getElementById("modal-checkout").classList.add("hidden");
}

function conectarBotonesProductos() {
  document.querySelectorAll(".btn-detalle").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = Number(e.target.dataset.id);
      const producto = productosGlobal.find(p => p.id === id);
      if (producto) abrirDetalle(producto);
    });
  });

  document.querySelectorAll(".btn-agregar").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = Number(e.target.dataset.id);
      const producto = productosGlobal.find(p => p.id === id);
      if (producto) {
        const carrito = agregarAlCarrito(producto);
        actualizarBadge(carrito);
      }
    });
  });

  const btnDetalle = document.querySelector(".btn-agregar-detalle");
  if (btnDetalle) {
    btnDetalle.addEventListener("click", e => {
      const id = Number(e.target.dataset.id);
      const producto = productosGlobal.find(p => p.id === id);
      if (producto) {
        const carrito = agregarAlCarrito(producto);
        actualizarBadge(carrito);
        cerrarDetalle();
      }
    });
  }
}

function conectarBotonesCarrito() {
  document.querySelectorAll(".btn-quitar").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = Number(e.target.dataset.id);
      const carrito = eliminarDelCarrito(id);
      renderCarrito(carrito);
      actualizarBadge(carrito);
      conectarBotonesCarrito();
    });
  });

  document.querySelectorAll(".btn-mas").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = Number(e.target.dataset.id);
      const carrito = aumentarCantidad(id);
      renderCarrito(carrito);
      actualizarBadge(carrito);
      conectarBotonesCarrito();
    });
  });

  document.querySelectorAll(".btn-menos").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = Number(e.target.dataset.id);
      const carrito = disminuirCantidad(id);
      renderCarrito(carrito);
      actualizarBadge(carrito);
      conectarBotonesCarrito();
    });
  });
}

init();