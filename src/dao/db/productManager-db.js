const ProductModel = require('../models/products.model.js')

class ProductManager {
    async addProduct({ title, description, category, price, thumbnail, code, stock, status, thumbnails }) {
        try {

            if (!title || !description || !category || !price ||!thumbnail || !code || !stock || status == undefined || status == null) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            const ProductExist = await ProductModel.findOne({ code: code })

            if (ProductExist) {
                console.log('error: codigo preexistente, el codigo debe ser unico')
                return
            }

            const newProduct = new ProductModel({
                title,
                description,
                category,
                price,
                thumbnail,
                code,
                stock,
                status,
                thumbnails: thumbnails || []
            })

            await newProduct.save()


        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }

    async getProducts() {
        try {
            const productos = await ProductModel.find()
            return productos
        } catch (error) {
            console.log('error al obtener los productos', error)
        }
    }

    async getProductById(id) {
        try {
            const foundProduct = await ProductModel.findById(id)

            if (!foundProduct) {
                console.log('error: producto no encontrado. ')
                return null
            }
            console.log('producto encontrado!')
            return foundProduct
        } catch (error) {
            console.log('error: no se pudo traer un producto por ir')
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const updatingProduct = await ProductModel.findByIdAndUpdate(id, updatedProduct)
            if (!updatingProduct) {
                console.log('error: no se encuentra el producto')
                return null
            }
            console.log('producto actualizado con exito!')
            return updatingProduct

        } catch (error) {
            console.log("Error al actualizar el producto", error);
        }
    }

    async deleteProduct (id) {
        try {
            const deletingProduct = await ProductModel.findByIdAndDelete(id)

            if(!deletingProduct) {
                console.log('error: no se encontro el producto para ser borrado')
                return null
            }
            console.log('producto eliminado correctamente')
             
        } catch (error) {
            console.log('error al eliminar el producto', error)
        }
    }

    async getProductsLimit(limit) {
        const products = await ProductModel.find()
        if (limit) {
            return products.slice(0, limit)
        }
        return products
    }

}

module.exports = ProductManager