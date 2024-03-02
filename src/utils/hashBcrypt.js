const bcrypt = require("bcrypt")

//aplicar el hash al password
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

//validacion
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password)

module.exports = {
    createHash,
    isValidPassword
}
