const ProductModel = require('../models/products.model.js')

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

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const productos = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: productos,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log("Error al obtener los productos", error);
            throw error;
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
            console.log('error: no se pudo traer un producto por id')
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
            const deletedProduct = await ProductModel.findByIdAndDelete(id)

            if(!deletedProduct) {
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