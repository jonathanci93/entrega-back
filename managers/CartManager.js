const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../data/carrito.json");

//* Función para leer el archivo de carritos y devolver un array
//* Si no existe o da error, devuelve un array vacío
const readCarts = async () => {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
};

//* Función para escribir el array de carritos en el archivo JSON
const writeCarts = async (carts) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(carts, null, 2));
    } catch (error) {
        console.error("Error writing carts:", error);
    }
};

//* Crea un nuevo carrito vacío y le asigna un ID único al sumarle uno siempre al ultimo ID existente
//* Devuelve el carrito creado
const createCart = async () => {
    try {
        const carts = await readCarts();
        const newCart = {
            cid: (carts.length + 1),
            products: []
        };
        carts.push(newCart);
        await writeCarts(carts);
        return newCart;
    } catch (error) {
        console.error("Error creating cart:", error);
    }
};

//* Busca y devuelve un carrito existente por su ID (cid)
//* Si no lo encuentra, devuelve error
const getCartById = async (cid) => {
    try {
        const carts = await readCarts();
        return carts.find(cart => cart.cid == cid);
    } catch (error) {
        console.error("Error getting cart by ID:", error);
    }
};

//* Agrega un producto al carrito por ID (cid y pid)
//* Si ya está en el carrito, le suma a quantity 1
//* Si no está, lo crea con quantity 1
const addProductToCart = async (cid, pid) => {
    try {
        const carts = await readCarts();
        const cart = carts.find(item => item.cid == cid);
        if (!cart) return null;

        const existingProduct = cart.products.find(item => item.pid == pid);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ pid, quantity: 1 });
        }

        await writeCarts(carts);
        return cart;
    } catch (error) {
        console.error("Error adding product to cart:", error);
    }
};

module.exports = {
    createCart,
    getCartById,
    addProductToCart
};

