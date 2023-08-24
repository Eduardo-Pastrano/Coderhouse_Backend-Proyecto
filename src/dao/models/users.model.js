import mongoose from "mongoose";

const { Schema } = mongoose;

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
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        default: 'user'
    }
});

export const userModel = mongoose.model(userCollection, userSchema);
