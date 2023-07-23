import mongoose from "mongoose";

const cartCollection = "carts"

const cartSchema = mongoose.Schema({
    products: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        },
        quantity: Number
    }]
});

export const cartModel = mongoose.model(cartCollection, cartSchema)