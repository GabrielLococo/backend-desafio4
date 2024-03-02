const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const PORT = 8080;
require("./database.js");
//--
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store");
const fileStore = FileStore(session);
const MongoStore = require("connect-mongo");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

//PASSPORT
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
//loguin Middleware
app.use(cookieParser())
app.use(session({
    secret:"secretCoder",
    resave: true,
    saveUninitialized:true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://gabriellococosi:coderhouse@cluster0.6guqc3j.mongodb.net/ecommerce?retryWrites=true&w=majority", ttl: 100
    })
}))
//PASSPORT
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas: 
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);





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


//COOKIES

// app.get("/createCookie", (req, res) => {
//     res.cookie("cookie", "Esto es una cookie").send("Cookie creada con exito");
// })


// app.get("/deleteCookie", (req, res) => {
//     res.clearCookie("cookie").send("Cookie borrada con exito");
// })

//Login de usuario con Session: 

app.get("/login", (req, res) => {
    let user = req.query.user; 

    req.session.user = user; 
    res.send("Usuario guardado por medio de query");
})

//Verificamos el usuario:

app.get("/user", (req, res) => {
    if(req.session.user) {
        return res.send(`El usuario registrado es el siguiente: ${req.session.user} `);
    }
    res.send("No tenemos un usuario registrado");
})

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})