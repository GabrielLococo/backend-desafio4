const jwt = require("jsonwebtoken");

const private_key = "palabrasecretaparatoken";

const generateToken = (user) => {
    const token = jwt.sign(user, private_key, {expiresIn: "12h"});
    return token; 
}

module.exports = generateToken;