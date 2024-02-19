const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/db/productManager-db.js");
const productManager = new ProductManager();


router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const productos = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: productos,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.hasPrevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: productos.hasNextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
        });

    } catch (error) {
        console.error("Error al obtener productos", error)
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
});
//---------------------------------------------------------------

// GET
router.get('/:pid', async (req, res) => {
    const id = req.params.pid
    try {
        const product = await productManager.getProductById(id)
        if (!product) {
            return res.json({
                error: "Producto no encontrado"
            });
        }

        res.json(product)
    } catch (error) {
        console.error("Error al obtener producto", error)
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }
})

// POST
router.post('/', async (req, res) => {
    const newProduct = req.body

    try {
        await productManager.addProduct(newProduct)
        res.status(201).json({
            message: "Producto agregado exitosamente"
        });
    } catch (error) {
        console.error("Error al agregar producto", error)
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }
})

// PUT
router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const updatedProduct = req.body;

    try {
        await productManager.updateProduct(id, updatedProduct)
        res.json({
            message: "Producto actualizado exitosamente"
        });
    } catch (error) {
        console.error("Error al actualizar producto", error)
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }
})

// DELETE
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid

    try {
        await productManager.deleteProduct(id)
        res.json({
            message: "Producto eliminado exitosamente"
        });
    } catch (error) {
        console.error("Error al eliminar producto", error)
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});


module.exports = router