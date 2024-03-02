const express = require("express")
const router = express.Router()
const UserModel = require("../dao/models/user.model.js")
const { createHash } = require("../utils/hashBcrypt.js")
const passport = require("passport")

//Post para generar un usuario y almacenarlo en MongoDB

// router.post("/", async (req, res) => {
//     const {first_name, last_name, email, password, age} = req.body; 

//     try {
//         await UserModel.create({first_name, last_name, email, password, age, rol:"user"});

//         res.redirect("/products");

//     } catch (error) {
//         res.status(400).send({error: "Error al crear el usuario", error});
//     }

// })

//PASSPORT

router.post("/", passport.authenticate("register", {
    failureRedirect: "/failedregister"
}), async (req, res) => {
    if(!req.user) return res.status(400).send({status: "error", message: "Credenciales invalidas"});

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true;

    res.redirect("/profile");
})

router.get("/failedregister", (req, res) => {
    res.send({error: "Registro fallido"});
})


module.exports = router; 