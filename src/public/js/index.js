const socket = io();
console.log("index.js cargado correctamente");

const form = document.getElementById("productForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const imagen = document.getElementById("imagen").value;

    const nuevoProducto = { nombre, descripcion, precio, imagen };
    socket.emit("nuevoProducto", nuevoProducto);

    form.reset();
});

// Renderizar productos actualizados
socket.on("productosActualizados", (productos) => {
    const contenedor = document.getElementById("productList");
    contenedor.innerHTML = ""; // Limpiar antes de renderizar

    productos.forEach(prod => {
        const card = `
        <div class="card m-2" style="width: 18rem;">
            <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
            <div class="card-body">
                <h5 class="card-title">${prod.nombre}</h5>
                <p class="card-text">${prod.descripcion}</p>
                <p class="card-text fw-bold">$${prod.precio}</p>
                <button class="btn btn-primary mb-2">Pedir precio</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct('${prod.id}')">Eliminar</button>
            </div>
        </div>
        `;
        contenedor.innerHTML += card;
    });
});

// Eliminar producto por socket
function deleteProduct(id) {
    socket.emit("eliminarProducto", id);
}




