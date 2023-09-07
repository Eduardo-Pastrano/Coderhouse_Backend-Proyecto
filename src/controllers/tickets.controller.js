import CartsRepository from "../repository/carts.repository.js";
import TicketsDao from "../dao/mongo/tickets.dao.js";
import UsersDao from "../dao/mongo/users.dao.js";

const cartsService = new CartsRepository();
const ticketsService = new TicketsDao();
const usersService = new UsersDao();

class TicketsController {
    async createTicket(req, res) {

    }
}

export default new TicketsController();