const CartModel = require('../models/cart.model.js')

class CartManager {
    async createCart(){
        try {
            const newCart = new CartModel({products: []})
            await newCart.save()
            return newCart
        } catch (error) {
            console.log('error: error al crear nuevo carro de compras.')
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId)
            if(!cart) {
                console.log('error: no existe el carrito con ese ID')
                return null 
            }
            return cart
        } catch (error) {
            console.log('error: error al traer el carrito por ID', error)
        }
    }

    async addProductToCart(cartId, productId, quantity = 1){
        try {
            const cart = await this.getCartById(cartId)
            const existProduct = cart.products.find(item => item.product.toString() === productId)

            if(existProduct) {
                existProduct.quantity += quantity
            } else {
                cart.products.push({product: productId, quantity})
            }

            cart.markModified('products')
            await cart.save()
            return cart

        } catch (error) {
            console.log('error: no se pudo agregar un producto',error)
        }
    }
}

module.exports = CartManager