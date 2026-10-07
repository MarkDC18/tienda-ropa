const BASE_URL = "https://tienda-ropa-api-tp0w.onrender.com";

export async function getProductos(filtros = {}) {
  const params = new URLSearchParams(filtros).toString();
  const res = await fetch(`${BASE_URL}/api/productos?${params}`);
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}

export async function getProductoPorId(id) {
  const res = await fetch(`${BASE_URL}/api/productos/${id}`);
  if (!res.ok) throw new Error("Producto no encontrado");
  return res.json();
}

export async function getCategorias() {
  const res = await fetch(`${BASE_URL}/api/categorias`);
  if (!res.ok) throw new Error("Error al obtener categorías");
  return res.json();
}

export async function getPromociones() {
  const res = await fetch(`${BASE_URL}/api/promociones`);
  if (!res.ok) throw new Error("Error al obtener promociones");
  return res.json();
}