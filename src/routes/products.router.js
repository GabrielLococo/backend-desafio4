const express = require('express')
const router = express.Router()
const ProductModel = require("../dao/models/products.model.js")

module.exports = (productManager) => {
    router.get('/', async (req, res) => {
        try {
            let { limit, page, sort, query: filterQuery } = req.query
            limit = parseInt(limit) || 10 
            page = parseInt(page) || 1 

            let sortOptions = {}
            if (sort) {
                sortOptions.price = (sort === 'asc') ? 1 : -1
            }

            const filterOptions = {}
            if (filterQuery) {
                filterOptions.category = filterQuery 
            }

            const productsList = await ProductModel.paginate(filterOptions, { limit, page, sort: sortOptions })

            const productsFinalResult = productsList.docs.map(product => {
                const { id, ...rest } = product.toObject()
                return rest
            })

            // ----
            const prevLink = productsList.hasPrevPage ? `/api/products?limit=${limit}&page=${productsList.prevPage}&sort=${sort}&query=${filterQuery}` : null
            const nextLink = productsList.hasNextPage ? `/api/products?limit=${limit}&page=${productsList.nextPage}&sort=${sort}&query=${filterQuery}` : null
            // -----

            const response = {
                status: 'success',
                payload: productsFinalResult,
                totalDocs: productsList.totalDocs,
                totalPages: productsList.totalPages,
                prevPage: productsList.prevPage,
                nextPage: productsList.nextPage,
                page: productsList.page,
                hasPrevPage: productsList.hasPrevPage,
                hasNextPage: productsList.hasNextPage,
                prevLink,
                nextLink
            }
            res.json(response)

        } catch (error) {
            console.error('Error recibiendo productos', error)
            res.status(500).json({ error: 'Error en el servidor' })
        }
    })
    //---------------------------------------------------------------
    
    // GET
    router.get('/:pid', async (req, res) => {
        try {
            const productId = req.params.pid
            const product = await productManager.getProductById(productId)

            if (!product) {
                res.status(400).json({ error: "El producto con ese ID no fue encontrado" })
            } else {
                res.json({ message: "Producto encontrado: ", product })
            }

        } catch (error) {
            console.error('Error recibiendo productos', error)
            res.status(500).json({ error: 'Error en el servidor' })
        }
    })

    // POST
    router.post('/', async (req, res) => {
        try {
            const newProduct = req.body
            const requiredFields = ["title", "description", "category", "price", "thumbnail", "code", "stock", "status"]
            const missingFields = requiredFields.filter(field => !(field in newProduct) || (typeof newProduct[field] === "string" && newProduct[field].trim() === ""))

            if (missingFields.length > 0) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' })
            }

            const products = await productManager.getProducts()
            const existingProduct = products.find(product => product.code === newProduct.code)

            if (existingProduct) {
                return res.status(400).json({ message: 'Un producto con ese code ya existe' })
            }

            await productManager.addProduct(newProduct)
            res.json({ message: 'Producto agregado con exito' })
        } catch (error) {
            console.error('Error recibiendo productos', error)
            res.status(500).json({ error: 'Error en el servidor' })
        }
    })

    // PUT
    router.put('/:pid', async (req, res) => {
        try {
            const productId = req.params.pid
            const updatedProduct = req.body
            const productIdToVerify = await productManager.getProductById(productId)

            if (productIdToVerify) {
                await productManager.updateProduct(productId, updatedProduct)
                return res.json({ message: 'Producto actualizado con exito' })
            } else {
                return res.status(400).json({ error: 'El producto con ese ID no fue encontrado' })
            }

        } catch (error) {
            console.error('Error cargando el producto', error)
            res.status(500).json({ error: 'Error en el servidor' })
        }
    })

    // DELETE
    router.delete('/:pid', async (req, res) => {
        try {
            const productId = req.params.pid
            const productIdToVerify = await productManager.getProductById(productId)

            if (productIdToVerify) {
                const productToDelete = await productManager.deleteProduct(productId)
                return res.json({ message: 'Producto eliminado con exito', productToDelete })
            } else {
                return res.status(400).json({ error: 'El producto con ese ID no fue encontrado' })
            }

        } catch (error) {
            console.error('Error liminado el producto', error)
            res.status(500).json({ error: 'Error en el servidor' })
        }
    })

    return router
}