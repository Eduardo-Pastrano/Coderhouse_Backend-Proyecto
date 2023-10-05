import mongoose from "mongoose";

const cartCollection = "carts"

const cartSchema = mongoose.Schema({
    products: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        },
        title: String,
        price: Number,
        quantity: Number,
    }]
});

export const cartModel = mongoose.model(cartCollection, cartSchema)