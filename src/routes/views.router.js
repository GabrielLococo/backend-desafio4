const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/db/productManager-db.js");
const CartManager = require("../dao/db/cartManager-db.js");
const productManager = new ProductManager();
const cartManager = new CartManager();

//------------------------------
router.get('/', async (req, res) => {
   try {
       res.render('index', { title: 'Inicio' })
   } catch (error) {
       console.error('Error obteniendo el index', error)
       res.status(500).json({ error: 'Error en el servidor' })
   }
})

//PRODUCTS
router.get("/products", async (req, res) => {
    try {
       const { page = 1, limit = 2 } = req.query;
       const productos = await productManager.getProducts({
          page: parseInt(page),
          limit: parseInt(limit)
       });
 
       const newArray = productos.docs.map(producto => {
          const { _id, ...rest } = producto.toObject();
          return rest;
       });
 
       res.render("products", {
          productos: newArray,
          hasPrevPage: productos.hasPrevPage,
          hasNextPage: productos.hasNextPage,
          prevPage: productos.prevPage,
          nextPage: productos.nextPage,
          currentPage: productos.page,
          totalPages: productos.totalPages
       });
 
    } catch (error) {
       console.error("Error al obtener productos", error);
       res.status(500).json({
          status: 'error',
          error: "Error interno del servidor"
       });
    }
 });

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



//CART
router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;
 
    try {
       const cart = await cartManager.getCartById(cartId);
 
       if (!cart) {
          console.log("No existe ese carrito con el id");
          return res.status(404).json({ error: "Carrito no encontrado" });
       }
 
       const productsInCart = cart.products.map(item => ({
          product: item.product.toObject(),
          quantity: item.quantity
       }));
 
 
       res.render("carts", { productos: productsInCart });
    } catch (error) {
       console.error("Error al obtener el carrito", error);
       res.status(500).json({ error: "Error interno del servidor" });
    }
 });


module.exports = router