import mongoose from "mongoose";

const userCollection = 'users';
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    cart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        enum: ['user', 'premium'],
        default: 'user'
    },
    documents: {
        name: String,
        reference: String,
    },
    last_connection: {
        type: Date,
    }
});

export const userModel = mongoose.model(userCollection, userSchema);
