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

    async clearCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId).lean().exec()

            if (!cart) {
                console.error(`No existe el carrito con ese ID`)
                return cartId
            }

            cart.products = []
            await CartModel.findByIdAndUpdate(cartId, { products: cart.products }).exec()
        } catch (error) {
            console.error("Error limpiando el carrito", error)
            throw error
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const updatedCart = await CartModel.findByIdAndUpdate(
                cartId,
                { $pull: { products: { product: productId } } }, 
                { new: true } 
            )

            if (!updatedCart) {
                console.error(`No existe carrito con ese ID`)
                return null
            }

            return updatedCart
        } catch (error) {
            console.error("Error borrando el producto del carrito", error)
            throw error
        }
    }

    async updateProductQuantityInCart(cartId, productId, newQuantity) {
        try {
            const cart = await this.getCartById(cartId)
            if (!cart) {
                console.error(`No existe un carrito con ese ID`)
                return null
            }

            const productToUpdate = cart.products.find(p => p.product.equals(productId))
            if (!productToUpdate) {
                console.error(`No se encontro un producto con ese ID en el carrito`)
                return null
            }

            productToUpdate.quantity = newQuantity

            await cart.save()
            return cart

        } catch (error) {
            console.error("Error modificando la cantidad de productos en el carrito", error)
            throw error
        }
    }

    async updateCart(cartId, newProducts) {
        try {
            const updatedCart = await CartModel.findByIdAndUpdate(cartId, { products: newProducts }, { new: true })
            return updatedCart
        } catch (error) {
            console.error("Error actualizando carrito", error)
            throw error;
        }
    }

}

module.exports = CartManager