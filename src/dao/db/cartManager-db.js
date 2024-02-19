const CartModel = require('../models/carts.model.js')

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
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error('Carrito no encontrado')
            }

            return cart;
        } catch (error) {
            console.error('Error al vaciar el carrito', error)
            throw error
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId)

            if (!cart) {
                throw new Error('Carrito no encontrado')
            }

            cart.products = cart.products.filter(item => item.product._id.toString() !== productId)

            await cart.save()
            return cart
        } catch (error) {
            console.error('Error al eliminar el producto del carrito ', error)
            throw error
        }
    }

    async updateProductQuantityInCart(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId)

            if (!cart) {
               console.log('no existe un carrito con ese ID')
            }

            const productToUpdate = cart.products.findIndex(item => item.product._id.toString() === productId)

            if (productToUpdate !== -1) {
                cart.products[productToUpdate].quantity = newQuantity


                cart.markModified('products')

                await cart.save()
                return cart
            } else {
                console.log('Producto no encontrado en el carrito')
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito', error);
            throw error;
        }
    }

    async updateCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                console.log('Carrito no encontrado');
            }

            cart.products = updatedProducts;

            cart.markModified('products');

            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error al actualizar el carrito', error);
            throw error;
        }
    }

}

module.exports = CartManager