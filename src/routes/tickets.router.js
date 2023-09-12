import { Router } from "express";
import ticketsController from "../controllers/tickets.controller.js";

class ticketsRouter {
    constructor() {
        this.tickets = Router();
        this.tickets.get('/', ticketsController.getTickets);
        this.tickets.get('/:ticketId', ticketsController.getTicketById);
    }
}

export default new ticketsRouter().tickets;