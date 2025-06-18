const express = require("express");
const { getAll, getById, add, deleteById, update } = require("../managers/ProductManager");
const productsRouter = express.Router();

//* Ruta GET para obtener todos los productos
//* Si se pasa el parámetro limit, devuelve solo esa cantidad
productsRouter.get("/", async (req, res) => {
    //* Parseamos el parámetro limit para mayor verificación
    const limit = parseInt(req.query.limit);
    const products = await getAll(limit);
    res.send(products);
});

//* Ruta GET para obtener un producto por su ID
productsRouter.get("/:pid", async (req, res) => {
    //* Parseamos el parámetro pid para mayor verificación
    const pid = parseInt(req.params.pid);
    const product = await getById(pid);

    if (product) {
        res.status(200).send(product);
    } else {
        res.status(404).send({ error: "Producto no encontrado" });
    }
});

//* Ruta POST para agregar un nuevo producto
//* El cuerpo del request debe contener los datos del producto
productsRouter.post("/", async (req, res) => {
    const { title, price, description, category } = req.body;
    //* Verificamos que los campos obligatorios existan, sino devolvemos un error 400
    if (!title || !price || !description || !category) {
        res.status(400).send({ error: "Faltan campos obligatorios" });
    } else {
        const newProduct = await add(req.body);
        res.status(201).send(newProduct);
    }
});

//* Ruta PUT para actualizar un producto por  ID
productsRouter.put("/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);
    //* Verificamos que el ID sea un número antes de continuar, si no lo es devolvemos un error 400
    if (isNaN(pid)) {
        return res.status(400).send({ error: "ID inválido" });
    }
    //* Pedimos los campos que se quieren actualizar al body
    const { title, price, description, category } = req.body;

    //* Validar que al menos uno de los campos se esté enviando
    if (!title && !price && !description && !category) {
        return res.status(400).send({ error: "Debe enviar al menos un campo para actualizar" });
    }

    //* Actualizamos el producto con los datos del body
    const updatedProduct = await update(pid, req.body);

    if (updatedProduct) {
        res.status(200).send(updatedProduct);
    } else {
        res.status(404).send({ error: "Producto no encontrado para actualizar" });
    }
});

//* Ruta DELETE para eliminar un producto por su ID (pid)
productsRouter.delete("/:pid", async (req, res) => {
    //* Parseamos el parámetro pid para mayor verificación
    const pid = parseInt(req.params.pid);
    //* Si el parámetro no es un número devolvemos un error 400
    if (isNaN(pid)) {
        return res.status(400).send({ error: "ID inválido" });
    }
    const deleted = await deleteById(pid);

    if (deleted) {
        res.status(200).send({ status: "Producto eliminado correctamente" });
    } else {
        res.status(404).send({ error: "Producto no encontrado" });
    }
    
});

module.exports = productsRouter;

