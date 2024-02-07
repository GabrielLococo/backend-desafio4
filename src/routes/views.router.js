const express = require("express");
const router = express.Router(); 
const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();

//------------------------------

router.get("/", async (req, res) => {
    try {
        const productos = await productManager.getProducts();
        res.render("index", {
            productos: productos
        });
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realtimeproducts");
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

router.get("/chat", async (req, res) => {
    try {
        res.render("chat");
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})


module.exports = router; 