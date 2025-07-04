import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./src/routes/views.router.js";
import productRouter from "./src/routes/productRouter.js";
import { Server } from "socket.io";
import productos from "./src/productos.js";

const app = express();
const PORT = 8080;

//** Crear el servidor en el puerto 8080 con websocket y http
const httpServer = app.listen(PORT, () => {
    console.log("Servidor activo en puerto " + PORT);
});
const socketServer = new Server(httpServer);

//** Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/src/public"));

//** Handlebars
app.engine("handlebars", handlebars.engine());
//* Esta es la direccion donde estan nuestros archivos a renderizar de HB
app.set("views", __dirname + "/src/views");
app.set("view engine", "handlebars");

//** Rutas
app.use("/", viewsRouter);
app.use("/api", productRouter);



//* WebSocket

//* Esta linea es muy importante no tocar, al haber productos cargados con un ID ya creado tenemos que calcular el maimo para crear uno nuevo
let ultimoId = productos.length > 0 ? Math.max(...productos.map(item => item.id)) + 1 : 1;


socketServer.on("connection", socket => {
    console.log("Nuevo cliente conectado");

    //** Emitir lista de productos al conectarse
    socket.emit("productosActualizados", productos);

    //* Agregar producto
    socket.on("nuevoProducto", (producto) => {
        const nuevoProducto = {
            id: ultimoId++,
            ...producto
        };
        //* Pusheamos el nuevo producto y lo volvemos a emitir a todos
        productos.push(nuevoProducto);
        socketServer.emit("productosActualizados", productos);
    });

    //* Eliminar producto
    socket.on("eliminarProducto", (id) => {
        const index = productos.findIndex(item => item.id == id);
        if (index !== -1) {
            productos.splice(index, 1);
            socketServer.emit("productosActualizados", productos);
        }
    });
});

export { socketServer };


