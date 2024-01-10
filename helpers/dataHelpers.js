// Function to set ID of a product
const setId = (data) => {
    // If the data is empty, set ID to 1
    if (data.length === 0){
        return 1
    } else {
        // If the data is not empty, set ID to the last ID + 1
        const id = data[data.length - 1].id
        return id + 1
    }
}

// Function to validate a product
const validateProduct = (product, requiredProductFields, currentProducts) => {

    // Check if the product exists, if not, return error
    if (!product) {
        return {error: 'Product is required'}
    }

    if(product.id) {
        return {error: 'Id cannot be created manually or updated'}
    }

    // Check if all required fields of the product exist, if not, return error
    for (const field of requiredProductFields) {
        const {[field]: value} = product
        if(field === 'thumbnail') {
            continue
        }
        if (!value) {
            return {error: `Product ${field} is required`}
        }
    }

    // Check if all fields of the product are allowed, if not, return error
    const {error: allowedFieldsResult} = validateAllowedFields(product, requiredProductFields)

    if (allowedFieldsResult) {
        return {error: allowedFieldsResult}
    }

    // Check if a product with the same code exists, if so, return error
    const productFound = currentProducts.find(p => p.code === product.code)

    if (productFound) {
        return {error: `Product with code ${product.code} already exists`}
    }

    // If everything is successful, return payload
    return {payload: 'Product is valid'}
}

// Function to validate if all fields of a product are allowed
const validateAllowedFields = (data, requiredProductFields) => {
    const productKeys = Object.keys(data)

    // Check if any fields of the product are not allowed, if so, return error
    for (const key of productKeys) {
        if (!requiredProductFields.includes(key)) {
            return {error: `Product property ${key} is not allowed`}
        }
    }
    return {payload: 'Product is valid'}
}

export {setId, validateProduct, validateAllowedFields}