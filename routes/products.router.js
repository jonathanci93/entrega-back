const express = require("express");
const { getAll, getById, add, deleteById } = require("../managers/ProductManager");
const productsRouter = express.Router();

//* Ruta GET para obtener todos los productos
//* Si se pasa el parámetro limit, devuelve solo esa cantidad
productsRouter.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = await getAll(limit);
    res.send(products);
});

//* Ruta GET para obtener un producto por su ID
productsRouter.get("/:pid", async (req, res) => {
    const product = await getById(req.params.pid);
    res.send(product || { error: "Producto no encontrado" });
});

//* Ruta POST para agregar un nuevo producto
//* El cuerpo del request debe contener los datos del producto
productsRouter.post("/", async (req, res) => {
    const newProduct = await add(req.body);
    res.status(201).send(newProduct);
});

//* Ruta DELETE para eliminar un producto por su ID (pid)
productsRouter.delete("/:pid", async (req, res) => {
    const deleted = await deleteById(req.params.pid);
    res.send(deleted ? { status: "Eliminado" } : { error: "No encontrado" });
});

module.exports = productsRouter;

