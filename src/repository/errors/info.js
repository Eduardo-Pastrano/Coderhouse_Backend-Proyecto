export const addProductErrorInfo = (product) => {
    return `One or more properties were incomplete.
    List of required properties:
    * title       : needs to be a String, received ${product.title}
    * description : needs to be a String, received ${product.description}
    * code        : needs to be a String, received ${product.code}
    * price       : needs to be a Number, received ${product.price}
    * status      : needs to be a Boolean, received ${product.status}
    * stock       : needs to be a Number, received ${product.stock}
    * category    : needs to be a String, received ${product.category}`
}