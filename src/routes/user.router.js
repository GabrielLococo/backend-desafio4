const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");

//Post para generar un usuario y almacenarlo en MongoDB

router.post("/", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body; 

    try {
        await UserModel.create({first_name, last_name, email, password, age, rol:"user"});

        res.redirect("/products");

    } catch (error) {
        res.status(400).send({error: "Error al crear el usuario", error});
    }

})


module.exports = router; 