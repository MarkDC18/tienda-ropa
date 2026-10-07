import { getProductos, getCategorias, getPromociones } from "../api/tiendaApi.js";
import { Producto } from "../models/producto.js";

export async function listarProductos(filtros = {}) {
  const data = await getProductos(filtros);
  return data.map(p => new Producto(p));
}

export async function listarCategorias() {
  return getCategorias();
}

export async function listarPromociones() {
  return getPromociones();
}

const KEY = "urbanstyle_carrito";

export function obtenerCarrito() {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export function guardarCarrito(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function agregarAlCarrito(producto, cantidad = 1) {
  const carrito = obtenerCarrito();
  const idx = carrito.findIndex(i => i.id === producto.id);
  if (idx >= 0) {
    carrito[idx].cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad,
    });
  }
  guardarCarrito(carrito);
  return carrito;
}

export function eliminarDelCarrito(id) {
  const carrito = obtenerCarrito().filter(i => i.id !== id);
  guardarCarrito(carrito);
  return carrito;
}

export function vaciarCarrito() {
  localStorage.removeItem(KEY);
  return [];
}

export function calcularTotal(carrito) {
  return carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
}

export function contarItems(carrito) {
  return carrito.reduce((sum, i) => sum + i.cantidad, 0);
}

export function aumentarCantidad(id) {
  const carrito = obtenerCarrito();
  const item = carrito.find(i => i.id === id);
  if (item) {
    item.cantidad += 1;
    guardarCarrito(carrito);
  }
  return carrito;
}

export function disminuirCantidad(id) {
  const carrito = obtenerCarrito();
  const item = carrito.find(i => i.id === id);
  if (item) {
    item.cantidad -= 1;
    if (item.cantidad <= 0) {
      return eliminarDelCarrito(id);
    }
    guardarCarrito(carrito);
  }
  return carrito;
}