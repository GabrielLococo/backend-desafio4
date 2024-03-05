const express = require("express")
const router = express.Router()
const UserModel = require("../dao/models/user.model.js")
const { isValidPassword } = require("../utils/hashBcrypt.js");
const passport = require("passport");

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

router.get("/logout", (req,res)=>{
    try {
        if(req.session.login){
        req.session.destroy();
    }
    res.redirect("/login");
    }catch (error) {
        res.status(500).json ({message: error});
    }
});

//version con PASSPORT

router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin"}), async (req, res) => {
    if(!req.user) 
    return res.status(400).send({status: "error", message: "Credenciales invalidas"})

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true

    res.redirect("/profile")
})

router.get("/faillogin", async (req, res ) => {
    res.send({error: "Error en el login"})
})

//version con GITHUB 

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {})
router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
    req.session.user = req.user; 
    req.session.login = true; 
    res.redirect("/products");
})

module.exports = router