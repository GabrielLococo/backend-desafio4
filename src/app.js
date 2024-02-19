const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const PORT = 8080;
require("./database.js");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/cart.router.js");
const viewsRouter = require("./routes/views.router.js");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas: 
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);


app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})


// io.on("connection",  async (socket) => {
//     console.log("New user ON");

    // socket.emit("productos", await productManager.getProducts());    

    //agregar producto

    // socket.on("addProduct", async (newproducto) => {
    //     await productManager.addProduct(newproducto);
        
    //     io.sockets.emit("productos", await productManager.getProducts());
    // });

    //actualizar producto

    // socket.on("updateProduct", async ({ id, updatedProduct }) => {
    //     await productManager.updateProduct(id, updatedProduct)
    //     io.sockets.emit("products", await productManager.getProducts())
    // })
    
    //eliminar producto

    // socket.on("deleteProduct", async (id) => {
    //     await productManager.deleteProduct(id);
       
    //     io.sockets.emit("productos", await productManager.getProducts());
    // });


    // Chat
//     socket.on("message", async data => {

//         await MessageModel.create(data);

//         const messages = await MessageModel.find();
//         console.log(messages);
//         io.sockets.emit("message", messages);
     
//     })
    
// })
