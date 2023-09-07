import mongoose from "mongoose";

const ticketCollection = 'tickets';
const ticketSchema = new mongoose.Schema({
    code: String,
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users'
    },
    total: Number
})

export const ticketModel =  mongoose.model(ticketCollection, ticketSchema);