import TicketsDao from "../dao/mongo/tickets.dao.js";
import CartsDao from "../dao/mongo/carts.dao.js";
import UsersDao from "../dao/mongo/users.dao.js";

const cartsDao = new CartsDao();
const ticketsDao = new TicketsDao();

class TicketsController {
    constructor() {
        console.log('Controller - Tickets');
    }

    async createTicket(req, res) {
        try {
            const { cartId } = req.params;
            const { id } = req.body;
            const cart = await cartsDao.getCartById(cartId);
            const user = await UsersDao.getUserById(id);

            if (!cart) {
                return res.status(400).send({ status: 'error', result: 'Cart not found.' });
            }

            const actualTicket = cart.products;

            const sum = actualTicket.reduce((acc, product) => {
                acc += product.price * product.quantity;
                return acc;
            }, 0);

            const userId = user._id;
            const ticketNumber = Date.now().toString(36) + Math.random().toString(36).substring(2, 10);

            const ticket = {
                code: ticketNumber,
                purchase_datetime: new Date(),
                user: userId,
                total: sum
            }
            let ticketCreated = await ticketsDao.createTicket(ticket);
            await cartsDao.emptyCart(cartId);

            res.status(200).send({ status: 'success', payload: ticketCreated, result: `The ticket with code: ${ticketNumber} was created successfully.` });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', result: 'An error ocurred while creating the ticket' });
        }
    }

    async getTickets(req, res) {
        try {
            const tickets = await ticketsDao.getTickets();
            res.status(200).send({ status: 'success', payload: tickets });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', result: 'An error occurred while retieving the tickets' });
        }
    }

    async getTicketById(req, res) {
        try {
            const { id } = req.params;
            const ticket = await ticketsDao.getTicketById(id);

            if (!ticket) {
                return res.status(400).send({ status: 'error', result: 'Ticket not found.' });
            }

            res.status(200).send({ status: 'success', payload: ticket });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', result: 'An error occurred while retrieving the ticket' });
        }
    }
}

export default new TicketsController();