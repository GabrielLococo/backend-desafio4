const express = require("express");
const router = express.Router();
const CartManager = require("../dao/db/cartManager-db.js");
const cartManager = new CartManager();
const CartModel = require("../dao/models/carts.model.js");



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
        const cart = await CartModel.findById(cartId)
            
        if (!cart) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        return res.json(carrito.products);
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

        const updateCart = await cartManager.addProductToCart(cartId, productId, quantity)
        res.json(updateCart.products)
    } catch (error) {
        console.error('Error agregando el producto al carrito ', error)
        res.status(500).json({ error: 'Error en el servidor' })
    }
})

// DELETE PRODUCT BY ID 
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await cartManager.deleteProductFromCart(cartId, productId);

        res.json({
            status: 'success',
            message: 'Producto eliminado del carrito correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
})


//UPDATE CART PRODUCTS

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;

    try {
        const updatedCart = await cartManager.updateCart(cartId, updatedProducts);
        res.json(updatedCart);
    } catch (error) {
        console.error('Error al actualizar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

//UPDATE PRODUCTS QUANTITY 
router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        const updatedCart = await cartManager.updateProductQuantityInCart(cartId, productId, newQuantity);

        res.json({
            status: 'success',
            message: 'Cantidad del producto actualizada correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
})

//CLEAR CART
router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        
        const updatedCart = await cartManager.clearCart(cartId);

        res.json({
            status: 'success',
            message: 'Todos los productos del carrito fueron eliminados correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al vaciar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});


module.exports = router;
