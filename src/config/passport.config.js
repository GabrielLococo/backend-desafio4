const passport = require("passport")
const local = require("passport-local")
const UserModel = require("../dao/models/user.model.js")
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js")
const LocalStrategy = local.Strategy

const initializePassport = () => {

    //registro
    passport.use("register", new LocalStrategy({
        passReqToCallback: true, 
        usernameField: "email"
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body
        try {
            //Verifico si el email ya fue registrado
            let user = await UserModel.findOne({ email })
            if( user ) return done(null, false)
            //Si no existe, creo registro de usuario nuevo
            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let result = await UserModel.create(newUser)
            return done(null, result)
        } catch (error) {
            return done(error)
        }
    }))

    //login
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            //Verifico si existe un usuario con ese mail
            const user = await UserModel.findOne({ email })
            if(!user) {
                console.log("Este usuario no existeeee ahhh")
                return done(null, false)
            }
            //Si existe verifico la contraseña: 
            if(!isValidPassword(password, user)) return done(null, false)
            return done(null, user)

        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser( async (id, done) => {
        let user = await UserModel.findById({_id: id})
        done(null, user)
    })
}


module.exports = initializePassport