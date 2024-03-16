const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    first_name: {
        type: String, 
        required: true
    },

    last_name : {
        type: String, 
        // required: true
    },

    email : {
        type: String, 
        required: true,
        index: true, 
        unique: true
    }, 

    password: {
        type: String,
        role:{
            type: String,
            default: "user"
        },
        unique: true
    },

    age : {
        type: Number, 
        // required: true
    },
    
    rol: {
        type: String, 
        default: "user"
        // required: true
    }
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
