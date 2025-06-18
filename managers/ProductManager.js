const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../data/productos.json");

//* Función para leer el archivo de productos y devolver un array
//* Si el archivo no existe o hay error, devuelve array vacío
const readProducts = async () => {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

//* Función para guardar el array de productos en el archivo JSON
const writeProducts = async (products) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(products));
    } catch (error) {
        console.error("Error writing products:", error);
    }
};

//* Devuelve todos los productos 
//* Se puede limitar la cantidad con el parametro limit
const getAll = async (limit) => {
    try {
        const products = await readProducts();
        //* Si el párametro limit existe devolvemos solo esa cantidad del array products y sino si totalidad
        return limit ? products.slice(0, limit) : products;
    } catch (error) {
        console.error("Error getting all products:", error);
        return [];
    }
};

//* Busca y devuelve un producto según su ID (pid)
const getById = async (pid) => {
    try {
        const products = await readProducts();
        return products.find(item => item.pid == pid);
    } catch (error) {
        console.error("Error getting product by ID:", error);
    }
};

//* Agrega un nuevo producto 
//* Se le asigna un ID nuevo y unico al sumarle uno al último ID siempre
const add = async (data) => {
    try {
        //* Leo el archivo json con la función readProducts
        const products = await readProducts();
        //* Parseamos el ID del producto para asegurar que sea un número
        //* Si el array esta vacio se le asigna el ID 1, sino se le suma 1 al último ID existente
        const pid = products.length ? parseInt(products[products.length - 1].pid) + 1 : 1;
        const newProduct = { pid, ...data };
        products.push(newProduct);
        await writeProducts(products);
        return newProduct;
    } catch (error) {
        console.error("Error adding product:", error);
    }
};

//* Actualiza un producto existente por su ID
//* Devuelve el producto actualizado o error si no existe
const update = async (pid, data) => {
    try {
        const products = await readProducts();
        const index = products.findIndex(item => item.pid == pid);
        if (index === -1) return null;
        //* Parseamos nuevamente el ID para asegurar que sea un número
        products[index] = { ...products[index], ...data, pid: parseInt(pid) };
        await writeProducts(products);
        return products[index];
    } catch (error) {
        console.error("Error updating product:", error);
    }
};

//* Elimina un producto del array por ID
const deleteById = async (pid) => {
    try {
        const products = await readProducts();
        const updated = products.filter(item => item.pid != pid);
        await writeProducts(updated);
        return updated.length !== products.length;
    } catch (error) {
        console.error("Error deleting product:", error);
    }
};
//* Exportación de todas las funciones para ser reutilizadas
module.exports = {
    getAll,
    getById,
    add,
    update,
    deleteById
};
