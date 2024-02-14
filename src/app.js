require('./database.js')
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const expressHandlebars = require('express-handlebars')
const ProductManager = require('./dao/db/productManager-db.js')
const CartManager = require('./dao/db/cartManager-db.js')
const MessageModel = require('./dao/models/message.model.js') //
const app = express()
const server = http.createServer(app)
const io = socketIo(server)
const PORT = 8080
const productManager = new ProductManager()
const cartManager = new CartManager()

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Handlebars
const hbs = expressHandlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set("views", "./src/views")

app.use("/", require("./routes/views.router")(productManager, cartManager))
app.use('/api/products', require('./routes/products.router')(productManager))
app.use('/api/carts', require('./routes/cart.router.js')(cartManager, productManager))
app.use(express.static('./src/public'))


io.on("connection",  async (socket) => {
    console.log("Nuevo usuario conectado");

    socket.emit("productos", await productManager.getProducts());    

    //agregar producto

    socket.on("addProduct", async (newproducto) => {
        await productManager.addProduct(newproducto);
        
        io.sockets.emit("productos", await productManager.getProducts());
    });

    //actualizar producto

    socket.on("updateProduct", async ({ id, updatedProduct }) => {
        await productManager.updateProduct(id, updatedProduct)
        io.sockets.emit("products", await productManager.getProducts())
    })
    
    //eliminar producto
    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);
       
        io.sockets.emit("productos", await productManager.getProducts());
    });


    // Chat
    socket.on("message", async data => {

        await MessageModel.create(data);

        const messages = await MessageModel.find();
        console.log(messages);
        io.sockets.emit("message", messages);
     
    })
    
})

server.listen(PORT, () => {
    console.log(`Escuchando en el servidor http://localhost:${PORT}`)
})
