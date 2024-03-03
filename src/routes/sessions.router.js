const express = require("express")
const router = express.Router()
const UserModel = require("../dao/models/user.model.js")
const { isValidPassword } = require("../utils/hashBcrypt.js")
const passport = require("passport")
const generateToken = require("../utils/jsonwebtoken.js")




//Login con JSON Web Token 
router.post("/login", async (req, res) => {
    const {email, password} = req.body; 
    try {
        const usuario = await UserModel.findOne({email:email});

        if(!usuario) {
            return res.status(400).send({status:"error", message: "Usuario no encontrado"});
        }

        if(!isValidPassword(password, usuario)){
            return res.status(400).send({status: "error", message: "Credenciales invalidas"});
        }

        //contraseña correcta > genero el token. 
        const token = generateToken({
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            email: usuario.email,
            id: usuario._id
        });

        res.send({status:"success", token});
        
    } catch (error) {
        console.log("Error en al autenticación", error);
        res.status(500).send({status: "error", message: "Error interno del servidor"});
    }
})




//Login

// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await UserModel.findOne({ email: email });

//         if (user) {
//             //Login
//             if (user.password === password) {
//                 req.session.login = true;
//                 req.session.user = {
//                     email: user.email,
//                     age: user.age,
//                     first_name: user.first_name,
//                     last_name: user.last_name
//                 }
//                 res.redirect('/products')
//             } else {
//                 res.status(401).send({ error: "Contraseña no valida" })
//             }
//         } else {
//             res.status(404).send({ error: "Usuario no encontrado" })
//         }

//     } catch (error) {
//         res.status(400).send({ error: "Error en el login" })
//     }
// })


//Logout

// router.get("/logout", (req, res) => {
//     if(req.session.login) {
//         req.session.destroy()
//     }
//     res.redirect("/login")

// })


// //version con PASSPORT

// router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin"}), async (req, res) => {
//     if(!req.user) 
//     return res.status(400).send({status: "error", message: "Credenciales invalidas"})

//     req.session.user = {
//         first_name: req.user.first_name,
//         last_name: req.user.last_name,
//         age: req.user.age,
//         email: req.user.email
//     };

//     req.session.login = true

//     res.redirect("/profile")
// })

// router.get("/faillogin", async (req, res ) => {
//     res.send({error: "Error en el login"})
// })


module.exports = router