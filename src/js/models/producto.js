export class Producto {
  constructor({ id, nombre, categoriaId, talla, color, precio, stock, descripcion, marca, imagen }) {
    this.id = id;
    this.nombre = nombre;
    this.categoriaId = categoriaId;
    this.talla = talla;
    this.color = color;
    this.precio = precio;
    this.stock = stock;
    this.descripcion = descripcion;
    this.marca = marca;
    this.imagen = imagen;
  }

  get precioFormateado() {
    return `S/ ${this.precio.toFixed(2)}`;
  }

  get disponible() {
    return this.stock > 0;
  }
}