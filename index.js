const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor() {
        this.path = "./products.json";
        this.products = [];
        this.initialize();
    }
    async initialize() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.products = JSON.parse(data);
            console.log("Products", this.products);
        } catch (error) {
        }
    }
    async addProduct({ title, description, price, thumbnail, code, stock }) {
        try {
            // Validar campos obligatorios
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                throw new Error('Complete the required fields.');
            }
            // Encontrar repeticiones de n° de código
            if (this.products.some(product => product.code === code)) {
                throw new Error(' invalid code ');
            }
            //ID
            const id = this.products.length + 1;
            // Agregar el producto a la lista
            const newProduct = { id, title, description, price, thumbnail, code, stock };
            this.products.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
            console.log(`Product "${newProduct.title}"successfully added`);
        } catch (error) {
            console.error('ERROR', error);
        }
    };
    async getProducts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error("ERROR", error);
            return [];
        }
    }
    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            throw new Error("Product not found.");
        }
    }
    async updateProduct(id, updatedProductData) {
        try {
            let products = await this.getProducts();

            // Buscar el producto por ID
            const index = products.findIndex(product => product.id === id);
            if (index === -1) {
                throw new Error(`No product found with ID ${id}`);
            }

            // Actualizar el producto
            products[index] = { ...products[index], ...updatedProductData };

            // Escribir la lista actualizada de productos de vuelta al archivo
            await fs.writeFile(this.path, JSON.stringify(products, null, '\t'));
            console.log(`Product ID ${id} Updated successfully`);
        } catch (error) {
            console.error(' ERROR updating ', error);
        }
    }
    async deleteProduct(id) {
        try {
            let products = await this.getProducts();

            // Buscar el producto por ID
            const index = products.findIndex(product => product.id === id);
            if (index === -1) {
                throw new Error(`No product found with ID ${id}`);
            }

            // Eliminar el producto
            products.splice(index, 1);

            // Escribir la lista actualizada de productos de vuelta al archivo
            await fs.writeFile(this.path, JSON.stringify(products, null, '\t'));
            console.log(`Product ID ${id} removed successfully`);
        } catch (error) {
            console.error('ERROR when deleting', error);
        }
    }
}
// Uso
const manager = new ProductManager();

(async () => {
    const productData = {
        title: "cup nike",
        description: "Cup Nike Legacy",
        price: 20000,
        thumbnail: "cup.1jpg",
        code: "C001",
        stock: 100,
    };

    await manager.addProduct(productData);

    const productData2 = {
        title: "Cup Nike",
        description: "Cup Nike Dri-Fit",
        price: 18000,
        thumbnail: "cup2.jpg",
        code: "C002",
        stock: 50,
    };

    await manager.addProduct(productData2);

    const productData3 = {
        title: "Cup Nike",
        description: "Cup Nike Kaddygolf",
        price: 22000,
        thumbnail: "cup3.jpg",
        code: "C003",
        stock: 25,
    };

    await manager.addProduct(productData3);

    const productList = await manager.getProducts();
    console.log("List", productList);

    const getById = manager.getProductById(1);
    console.log("Product ID 1:", getById);
//cambio producto
    const updatedData = {
        title: "Cup Nike ",
        price: 23000,
        stock: 10,
    };
    await manager.updateProduct(1, updatedData);
// borro producto
    await manager.deleteProduct(2);

    const productData4 = {
        title: "cup nike",
        description: "Cup Nike Future True",
        price: 37.99,
        thumbnail: "cup4.jpg",
        code: "C004",
        stock: 30,
    }

    await manager.addProduct(productData4);
    
    const updatedProductList = await manager.getProducts();
    console.log("Updated product list", updatedProductList);
})();
