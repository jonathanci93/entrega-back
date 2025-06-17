const express = require("express");
const { createCart, getCartById, addProductToCart } = require("../managers/CartManager");
const cartsRouter = express.Router();

//* POST: Ruta para crear un nuevo carrito
//* El carrito se crea vacío con un ID (con la función createCart)
cartsRouter.post("/", async (req, res) => {
    const newCart = await createCart();
    res.status(201).send(newCart);
});

//* GET: Ruta para obtener un carrito por su ID (cid)
//* Devuelve los productos que contiene el carrito
cartsRouter.get("/:cid", async (req, res) => {
    const cart = await getCartById(req.params.cid);
    res.send(cart || { error: "Carrito no encontrado" });
});

//* POST: Ruta para agregar un producto a un carrito existente
//* Si el producto ya está en el carrito, se incrementa la cantidad
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const updatedCart = await addProductToCart(cid, pid);
    res.send(updatedCart || { error: "Error al agregar producto" });
});

module.exports = cartsRouter;

