const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://gabriellococosi:coderhouse@cluster0.6guqc3j.mongodb.net/ecommerce?retryWrites=true&w=majority')
.then(() => console.log('conexion exitosa a mongoose '))
.catch(() => console.log('error al conectar con mongoose '))