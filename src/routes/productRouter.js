import { Router } from "express";
import { socketServer } from "../../app.js";

const router = Router();
const productos = [];

// Crear producto
router.post("/productos", (req, res) => {
    const producto = { id: Date.now().toString(), ...req.body };
    productos.push(producto);

    socketServer.emit("productosActualizados", productos); // nombre coherente con app.js

    res.status(201).json({ status: "ok", producto });
});

// Eliminar producto
router.delete("/productos/:id", (req, res) => {
    const id = req.params.id;
    const index = productos.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    productos.splice(index, 1);
    socketServer.emit("productosActualizados", productos); // Emitimos lista actualizada

    res.json({ message: "Producto eliminado correctamente" });
});

export default router;
