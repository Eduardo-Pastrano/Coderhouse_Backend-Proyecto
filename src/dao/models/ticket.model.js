import mongoose from "mongoose";

const ticketCollection = 'tickets';
const ticketSchema = new mongoose.Schema({
    code: String,
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    userEmail: {
        type: String,
    },
    total: Number,
})

export const ticketModel =  mongoose.model(ticketCollection, ticketSchema);