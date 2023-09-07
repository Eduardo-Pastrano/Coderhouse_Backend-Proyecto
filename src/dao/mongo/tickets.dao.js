import { ticketModel } from "../models/ticket.model.js";

export default class TicketsDao {
    constructor() {
        console.log("Connected: DAO - Tickets")
    }

    async createTicket(ticket) {
        try {
            let newTicket = await ticketModel.create(ticket);
            return newTicket;
        } catch (error) {
            throw new Error('There was an unexpected error while creating the ticket of purchase.')
        }
    }
}