import {validateProduct, setId, validateAllowedFields} from './helpers/dataHelpers.js'
import {promises as fs} from 'fs'

class ProductManager {
    requiredProductFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock']

    constructor(path) {
        this.path = path
    }

    // Method to get all products from the file
    async getProducts() {
        try {
            // Reading the file containing the products
            const products = await fs.readFile(this.path, 'utf8')
            // Parsing the contents of the file and returning it
            return {payload: JSON.parse(products)}
        } catch (error) {
            // If the file doesn't exist, returning an empty array
            if (error.code === 'ENOENT') {
                return {payload: []}
            }

            throw new Error(`Error getting products: ${error.message}`)
        }
    }

    // Method to add a product to the file
    async addProduct(product) {
        try {
            // Getting all products
            const {payload: products} = await this.getProducts()

            // Validating the product's fields using the validateProduct helper function
            const {error: validationResult} = validateProduct(product, this.requiredProductFields, products)

            // If validation fails, returning an error
            if (validationResult) {
                return {error: validationResult}
            }

            // Setting the product's ID using the setId helper function
            product.id = await setId(products)

            // If the products don't exist, returning an error
            if (!products) {
                return {error: 'Error getting products'}
            }

            product = {...product, status: true}

            // Adding the new product to the products array and writing to the file
            products.push(product)
            await fs.writeFile(this.path, JSON.stringify(products))

            // Returning the product's ID as a success message
            return {payload: `Product added successfully with id ${product.id}`}
        } catch (error) {
            throw new Error(`Error adding product: ${error.message}`)
        }
    }

    // Method to get a product by its ID
    async getProductById(id) {
        // If no ID is provided, returning an error
        if (!id) {
            return {error: 'Id is required'}
        }
        try {
            // Getting all products
            const {payload: products} = await this.getProducts()

            // If the products don't exist, returning an error
            if (!products) {
                return {error: 'Error getting products'}
            }

            // Finding the product with the specified ID and returning it or an error if it doesn't exist
            const product = products.find(product => product.id === id)
            return product ? {payload: product} : {error: 'Product not found'}

        } catch (error) {
            throw new Error(`Error getting product by id: ${error.message}`)
        }
    }

    // Define a method to update a product by id
    async updateById(id, data) {
        // If no ID is provided, returning an object with an error message
        if (!id) {
            return {error: 'Id is required'}
        }

        // If the ID is provided in the data, returning an error message
        if (data.id) {
            return {error: 'Id cannot be updated'}
        }

        // Validating the product's fields using the validateProduct helper function
        const {error: allowedFieldsResult} = validateAllowedFields(data, this.requiredProductFields)

        // If validation fails, returning an error message
        if (allowedFieldsResult) {
            return {error: allowedFieldsResult}
        }

        try {
            // Getting all products
            const {payload: products} = await this.getProducts()

            // If the products don't exist, returning an error message
            if (!products) {
                return {error: 'Error getting products'}
            }

            // Finding the product with the specified ID
            const index = products.findIndex(product => product.id === id)

            // If the product is not found, returning an error message
            if (index === -1) {
                return {error: 'Product not found'}
            }

            // Updating the product and writing to the file
            const product = products[index]
            products[index] = {...product, ...data}
            await fs.writeFile(this.path, JSON.stringify(products))
            // Returning a success message
            return {payload: 'Product updated successfully'}


        } catch (error) {
            throw new Error(`Product update error: ${error.message}`)
        }
    }

    // Define a method to delete a product by its id
    async deleteById(id) {
        // If no ID is provided, returning an error message
        if (!id) {
            return {error: 'Id is required'}
        }
        try {
            // Call getProducts method
            const {payload: products} = await this.getProducts()

            // If the products don't exist, returning an error message
            if (!products) {
                return {error: 'Error getting products'}
            }

            // Find the product with the specified ID
            const index = products.findIndex(product => product.id === id)

            // If the product is not found, returning an object with a status 500 and a message
            if (index === -1) {
                return {error: 'Product not found'}
            }

            // Deleting the product and writing to the file
            products.splice(index, 1)

            await fs.writeFile(this.path, JSON.stringify(products))
            return {payload: 'Product deleted successfully'}

        } catch (error) {
            throw new Error(`Product delete error: ${error.message}`)
        }
    }

    async deleteAll (){
        try {
            await fs.unlink(this.path)
            return {status: 'success', payload: 'File deleted successfully'}
        } catch (e) {
            return {status: 'error', error: e}
        }
    }
}

export default ProductManager