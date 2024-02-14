const express = require('express')
const router = express.Router()
const ProductModel = require("../dao/models/products.model.js")

//------------------------------

module.exports = (productManager, cartManager) => {

//INDEX
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts()
        res.render('index', { title: 'Index', products })
    } catch (error) {
        console.error('Error obteniendo los productos')
        res.status(500).json({ error: 'Error en el servidor' })
    }
})

//REAL TIME PRODUCTS
router.get('/realtimeproducts', async (req, res) => {
    try {
        res.render('realTimeProducts', { title: 'Real Time Products' })
    } catch (error) {
        console.error('Error obteniendo productos', error)
        res.status(500).json({ error: 'Error en el servidor' })
    }
})

//CHAT
router.get('/chat', async (req, res) => {
    try {
        res.render('chat', { title: 'Chat' })
    } catch (error) {
        console.error('Error en el chat', error)
        res.status(500).json({ error: 'Error en el servidor' })
    }
})

//PRODUCTS
router.get('/products', async (req, res) => {
    const page = req.query.page || 1
    const limit = 5

    try {
        const productsList = await ProductModel.paginate({}, { limit, page })

        const productsFinalResult = productsList.docs.map(product => {
            const { id, ...rest } = product.toObject()
            return rest
        })

        res.render('products', {
            title: 'Products List',
            products: productsFinalResult,
            hasPrevPage: productsList.hasPrevPage,
            hasNextPage: productsList.hasNextPage,
            prevPage: productsList.prevPage,
            nextPage: productsList.nextPage,
            currentPage: productsList.page,
            totalPages: productsList.totalPages
        })
    } catch (error) {
        console.log("Error en la paginacion ", error)
        res.status(500).send('Error en el servidor' )
    }
})


//CART
router.get('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid
    try {
        const cart = await cartManager.getCartById(cartId)
        if (!cart) {
            console.error('No existe carrito con ese ID')
            return cart
        }
        res.render('cart', { cartId, products: cart.products, title: 'Cart' })

    } catch (error) {
        console.error('Error recuperando carrito', error)
        res.status(500).json({ error: 'Error en el servidor' })
    }
})

return router
}