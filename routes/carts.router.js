const express = require("express");
const { createCart, getCartById, addProductToCart } = require("../managers/CartManager");
const cartsRouter = express.Router();

//* POST: Ruta para crear un nuevo carrito
//* El carrito se crea vacío con un ID (con la función createCart)
cartsRouter.post("/", async (req, res) => {
    const newCart = await createCart();
    if (newCart) {
        res.status(201).send(newCart);
    } else {
        res.status(500).send({ error: "Error al crear el carrito" });
    }
});

//* GET: Ruta para obtener un carrito por su ID (cid)
//* Devuelve los productos que contiene el carrito
cartsRouter.get("/:cid", async (req, res) => {
    const cart = await getCartById(req.params.cid);
    if (cart) {
        res.send(cart.products);
    } else {
        res.status(404).send({ status: "Error", message: "Carrito no encontrado" });
    }
});

//* POST: Ruta para agregar un producto a un carrito existente
//* Si el producto ya está en el carrito, se incrementa la cantidad
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const updatedCart = await addProductToCart(cid, pid);
    if (updatedCart) {
        res.status(200).send(updatedCart);
    } else {
        res.status(404).send({ status: "Error", message: "Carrito no encontrado o producto no agregado" });
    }
});

module.exports = cartsRouter;

