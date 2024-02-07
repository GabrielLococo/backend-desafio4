const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const PORT = 8080;
require('./database.js')
const ProductManager = require('./dao/db/product-manager-db.js')
const productManager = new ProductManager('./src/models/products.model.js')

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");


//MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

//Configuracion motor y vistas HANDLEBARS
const hbs = exphbs.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
})
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
//---------------------------------------------------------

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});

const MessageModel = require("./dao/models/message.model.js");
const io = new socket.Server(httpServer);


io.on("connection",  async (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("message", async data => {

        await MessageModel.create(data);

        const messages = await MessageModel.find();
        console.log(messages);
        io.sockets.emit("message", messages);
     
    })

    socket.emit("productos", await productManager.getProducts());    
    

    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
       
        io.sockets.emit("productos", await productManager.getProducts());
    });

    
    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);
        
        io.sockets.emit("productos", await productManager.getProducts());
    });
})