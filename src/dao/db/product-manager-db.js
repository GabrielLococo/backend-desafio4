const ProductModel = require('../models/product.model.js')

class ProductManager {
    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {

            if (!title || !description || !price || !code || !stock || !category) {
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
                price,
                img,
                code,
                stock,
                category,
                status: true,
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
            const producto = await ProductModel.findById(id)

            if (!producto) {
                console.log('error: producto no encontrado. ')
                return null
            }
            console.log('producto encontrado!')
            return producto
        } catch (error) {
            console.log('error: no se pudo traer un producto por ir')
        }
    }

    async updateProduct(id, productoActualizado) {
        try {
            const updatingProduct = await ProductModel.findByIdAndUpdate(id, productoActualizado)
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

    async deleteProduct () {

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

}

module.exports = ProductManager