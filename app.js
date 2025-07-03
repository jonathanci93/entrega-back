import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./src/routes/views.router.js";
import productRouter from "./src/routes/productRouter.js";
import { Server } from "socket.io";
import productos from "./src/productos.js";

const app = express();
const PORT = 8080;

// Inicializar servidor HTTP y WebSocket
const httpServer = app.listen(PORT, () => {
    console.log("Servidor activo en puerto " + PORT);
});
const socketServer = new Server(httpServer);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/src/public"));

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/src/views");
app.set("view engine", "handlebars");

// Rutas
app.use("/", viewsRouter);
app.use("/api", productRouter);



// WebSocket
socketServer.on("connection", socket => {
    console.log("Nuevo cliente conectado");

    // Enviar lista actual al conectarse
    socket.emit("productosActualizados", productos);

    // Agregar producto
    socket.on("nuevoProducto", (producto) => {
        const nuevoProducto = {
            id: Date.now().toString(),
            ...producto
        };
        productos.push(nuevoProducto);
        socketServer.emit("productosActualizados", productos);
    });

    // Eliminar producto
    socket.on("eliminarProducto", (id) => {
        const index = productos.findIndex(p => p.id === id);
        if (index !== -1) {
            productos.splice(index, 1);
            socketServer.emit("productosActualizados", productos);
        }
    });
});

export { socketServer };


