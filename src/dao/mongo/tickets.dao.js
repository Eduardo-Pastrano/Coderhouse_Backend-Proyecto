import { ticketModel } from "../models/ticket.model.js";

export default class TicketsDao {
    constructor() {
        console.log("Connected: DAO - Tickets")
    }

    async createTicket(ticket) {
        try {
            const newTicket = await ticketModel.create(ticket);
            return newTicket;
        } catch (error) {
            console.log('There was an error creating the ticket: ', error);
            throw error;
        }
    }

    async getTickets() {
        try {
            let tickets = await ticketModel.find();
            return tickets
        } catch (error) {
            console.log('There was an error trying to get the tickets:', error);
            throw error;
        }
    }

    async getTicketById(id) {
        try {
            let ticket = await ticketModel.findById({ _id: id });
            return ticket
        } catch (error) {
            console.log('There was an error trying to get the ticket with the specified id:', error)
            throw error;
        }
    }

    async getTicketsByUserId(userId) {
        try {
            const tickets = await ticketModel.find({ user: userId });
            return tickets;
        } catch (error) {
            onsole.log('There was an error trying to get the ticket for the specified user:', error)
            throw error;
        }
    }
}