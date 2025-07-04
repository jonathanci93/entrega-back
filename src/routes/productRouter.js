import { Router } from "express";
import { socketServer } from "../../app.js";
import productos from "../productos.js";

const router = Router();

let ultimoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;

//* Crear producto
router.post("/productos", (req, res) => {
    const producto = { id: ultimoId++, ...req.body };
    productos.push(producto);

    socketServer.emit("productosActualizados", productos);
    res.status(201).json({ status: "ok", producto });
});

//* Eliminar producto
router.delete("/productos/:id", (req, res) => {
    const id = req.params.id;
    const index = productos.findIndex(item => item.id == id); //* Usamos == para evitar error de tipo de dato

    if (index === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    productos.splice(index, 1);
    socketServer.emit("productosActualizados", productos);

    res.json({ message: "Producto eliminado correctamente" });
});

export default router;

