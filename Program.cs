var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseCors();

// ==================== DATOS ====================

var categorias = new List<Categoria> {
    new(1, "Polos",       "Polos casuales y deportivos",           "👕"),
    new(2, "Pantalones",  "Jeans, joggers y formales",             "👖"),
    new(3, "Zapatillas",  "Urbanas y deportivas",                  "👟"),
    new(4, "Casacas",     "Abrigos y chaquetas",                   "🧥"),
    new(5, "Accesorios",  "Gorras, correas y mochilas",            "🎒"),
};

var productos = new List<Producto> {
    new(1,  "Polo Oversize Negro",  1, "M",  "Negro",   45.90m,  25, "Polo oversize de algodón premium",       "Nike",         "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"),
    new(2,  "Polo Básico Blanco",   1, "L",  "Blanco",  39.90m,  40, "Polo clásico de algodón pima",           "Adidas",       "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600"),
    new(3,  "Jean Slim Azul",       2, "32", "Azul",   119.90m,  15, "Jean slim fit de mezclilla elástica",    "Levi's",       "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"),
    new(4,  "Jogger Gris",          2, "M",  "Gris",    89.90m,  22, "Jogger cómodo para uso diario",           "Puma",         "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600"),
    new(5,  "Zapatillas Urbanas",   3, "42", "Blanco", 189.90m,  10, "Zapatillas urbanas casuales",             "New Balance",  "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600"),
    new(6,  "Zapatillas Running",   3, "41", "Negro",  249.90m,   8, "Zapatillas para correr con amortiguación","Nike",         "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600"),
    new(7,  "Casaca Cuero Negro",   4, "L",  "Negro",  329.90m,   5, "Casaca de cuero sintético premium",       "Zara",         "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"),
    new(8,  "Casaca Bomber Verde",  4, "M",  "Verde",  219.90m,   7, "Casaca bomber estilo militar",            "H&M",          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600"),
    new(9,  "Gorra Negra",          5, "U",  "Negro",   59.90m,  30, "Gorra ajustable unisex",                  "New Era",      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600"),
    new(10, "Mochila Urbana",       5, "U",  "Gris",   149.90m,  12, "Mochila con compartimento para laptop",   "Totto",        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"),
};

var clientes = new List<Cliente> {
    new(1, "Carlos Ramírez",  "carlos@mail.com",  "987654321", "Av. Lima 123"),
    new(2, "Lucía Torres",    "lucia@mail.com",   "912345678", "Jr. Arequipa 456"),
    new(3, "Diego Fernández", "diego@mail.com",   "998877665", "Calle Huancayo 789"),
};

var pedidos = new List<Pedido> {
    new(1, 1, "2026-10-01", 235.80m, "Entregado",  new List<int> { 1, 5 }),
    new(2, 2, "2026-10-03", 119.90m, "Pendiente",  new List<int> { 3 }),
    new(3, 3, "2026-10-05", 439.80m, "En camino",  new List<int> { 7, 9 }),
};

var promociones = new List<Promocion> {
    new(1, "Semana del Jean",    "20% en todos los jeans",            20, "2026-10-31"),
    new(2, "2x1 en Polos",       "Lleva 2 polos y paga 1",            50, "2026-11-15"),
    new(3, "Envío gratis",       "En compras mayores a S/ 150",        0, "2026-12-31"),
};

// ==================== ENDPOINTS ====================

app.MapGet("/", () => "API Tienda de Ropa funcionando");

// Productos (recurso principal)
app.MapGet("/api/productos", (int? categoriaId, string? buscar, decimal? precioMax) => {
    var q = productos.AsQueryable();
    if (categoriaId.HasValue) q = q.Where(p => p.CategoriaId == categoriaId);
    if (!string.IsNullOrEmpty(buscar)) q = q.Where(p => p.Nombre.ToLower().Contains(buscar.ToLower()));
    if (precioMax.HasValue) q = q.Where(p => p.Precio <= precioMax);
    return Results.Ok(q.ToList());
});

app.MapGet("/api/productos/{id:int}", (int id) =>
    productos.FirstOrDefault(p => p.Id == id) is { } p ? Results.Ok(p) : Results.NotFound());

// Categorías
app.MapGet("/api/categorias", () => categorias);
app.MapGet("/api/categorias/{id:int}", (int id) =>
    categorias.FirstOrDefault(c => c.Id == id) is { } c ? Results.Ok(c) : Results.NotFound());

// Clientes
app.MapGet("/api/clientes", () => clientes);
app.MapGet("/api/clientes/{id:int}", (int id) =>
    clientes.FirstOrDefault(c => c.Id == id) is { } c ? Results.Ok(c) : Results.NotFound());

// Pedidos
app.MapGet("/api/pedidos", (int? clienteId) => {
    var q = pedidos.AsQueryable();
    if (clienteId.HasValue) q = q.Where(p => p.ClienteId == clienteId);
    return Results.Ok(q.ToList());
});

// Promociones
app.MapGet("/api/promociones", () => promociones);

// Puerto dinámico para Render
var port = Environment.GetEnvironmentVariable("PORT") ?? "10000";
app.Run($"http://0.0.0.0:{port}");

// ==================== MODELOS ====================
record Producto(int Id, string Nombre, int CategoriaId, string Talla, string Color,
                decimal Precio, int Stock, string Descripcion, string Marca, string Imagen);
record Categoria(int Id, string Nombre, string Descripcion, string Icono);
record Cliente(int Id, string Nombre, string Correo, string Telefono, string Direccion);
record Pedido(int Id, int ClienteId, string Fecha, decimal Total, string Estado, List<int> ProductosIds);
record Promocion(int Id, string Titulo, string Descripcion, int DescuentoPct, string ValidoHasta);