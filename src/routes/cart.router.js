const express = require('express')
const router = express.Router()

module.exports = (cartManager, productManager) => {

    // POST
    router.post('/', async (req, res) => {
        try {
            const newCart = await cartManager.createCart()
            res.json({ newCart })
        } catch (error) {
            console.error('Error creando un nuevo carrito', error)
            res.status(500).json({ error: 'Error en el servidor' })
        }
    })

    // GET
    router.get('/:cid', async (req, res) => {
        const cartId = req.params.cid
        try {
            const cart = await cartManager.getCartById(cartId)
            if (!cart) {
                res.status(400).json({ error: 'No existe un carrito con ese ID' })
            } else {
                res.json(cart.products)
            }
        } catch (error) {
            console.error('Error recuperando el carrito', error)
            res.status(500).json({ error: 'Error en el servidor' })
        }
    })

    // POST
    router.post('/:cid/product/:pid', async (req, res) => {
        const cartId = req.params.cid
        const productId = req.params.pid
        const quantity = req.body.quantity || 1

        try {
            const verifyCartId = await cartManager.getCartById(cartId)
            if (!verifyCartId) {
                res.status(400).json({ error: 'No existe un carrito con ese ID' })
                return cartId
            }

            const verifyProductId = await productManager.getProductById(productId)
            if (!verifyProductId) {
                res.status(400).json({ error: 'No se encontro un carrito con ese ID' })
                return productId
            }

            const updateCart = await cartManager.addProductToCart(cartId, productId, quantity, productManager)
            res.json(updateCart.products)
        } catch (error) {
            console.error('Error agregando el producto al carrito ', error)
            res.status(500).json({ error: 'Error en el servidor' })
        }
    })

    // DELETE
    router.delete('/:cid', async (req, res) => {
        const cartId = req.params.cid
        try {
            await cartManager.clearCart(cartId)
            res.status(200).json({ message: 'Productos eliminados del carrito exitosamente' })
        } catch (error) {
            console.error('Error eliminando productos del carrito ', error)
            res.status(500).json({ error: 'Error en el servidor' })
        }
    })

    // DELETE BY PRODUCT ID
    router.delete('/:cid/product/:pid', async (req, res) => {
        const cartId = req.params.cid
        const productId = req.params.pid

        try {
            const cart = await cartManager.getCartById(cartId)
            if (!cart) {
                return res.status(404).json({ error: 'Carrito con ese ID no encontrado' })
            }

            await cartManager.deleteProductFromCart(cartId, productId)
            res.json({ message: 'Producto eliminado con exito por ID' })
        } catch (error) {
            console.error('Error eliminando producto del carrito ', error)
            res.status(500).json({ error: 'Error en el servidor' })
        }
    })

     // PUT
     router.put('/:cid', async (req, res) => {
        const cartId = req.params.cid;
        const newProducts = req.body.products;

        try {
            const cart = await cartManager.getCartById(cartId)
            if (!cart) {
                return res.status(404).json('Carrito con ID no encontrado')
            }

            const updatedCart = await cartManager.updateCart(cartId, newProducts)
            res.json(updatedCart)

        } catch (error) {
            console.error('Error actualizando carrito', error)
            res.status(500).json({ error: 'Error en el servidor' })
        }
    })

    // PUT (UPDATING CART PRODUCT QUANTITY )
    router.put('/:cid/product/:pid', async (req, res) => {
        try {
            const cartId = req.params.cid
            const productId = req.params.pid
            const { quantity } = req.body
            const updatedCart = await cartManager.updateProductQuantityInCart(cartId, productId, quantity)

            res.json(updatedCart)
        } catch (error) {
            console.error('Error actualizando cantidad de producto en el carrito', error)
            res.status(500).json({ error: 'Error en el servidor' })
        }
    })

   
    return router
}