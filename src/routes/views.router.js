import { Router } from "express";
import { productModel } from "../dao/models/products.model.js";
import { userLogged } from "../middleware/userLogged.js";
import { userOnly } from "../middleware/userOnly.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { fetchUsers } from "../middleware/fetchUsers.js";
import TicketsDao from "../dao/mongo/tickets.dao.js";
import { logger } from "../utils/logger.js";

const ticketsDao = new TicketsDao();
const views = Router();

views.get('/', userLogged, async (req, res) => {
    let { page, sort, category, limit } = req.query;
    let sortDirection;

    if (!page) {
        page = 1
    };

    if (!limit) {
        limit = 6
    };

    if (sort === 'asc') {
        sortDirection = 1;
    } else if (sort === 'desc') {
        sortDirection = -1;
    } else {
        sortDirection = 0;
    }

    const queryObject = {};
    if (category) {
        category = category.toLowerCase();
        queryObject.category = category;
    }

    const sortOptions = sortDirection ? { price: sortDirection } : {};

    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } = await productModel.paginate(queryObject, { page, limit, sort: sortOptions, lean: true });

    const products = docs;
    res.status(200).render('home', {
        status: 'success',
        payload: {
            products: products,
            cart: req.user.cart.toString(),
        },
        page: page,
        limit,
        category,
        sort,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        style: 'styles.css',
        title: 'Products🛒',
        user: req.session.user,
    });
});

views.get('/register', async (req, res) => {
    res.render('register', {
        style: 'styles.css',
        title: 'Registration',
    });
});

views.get('/login', async (req, res) => {
    res.render('login', {
        style: 'styles.css',
        title: 'Welcome!',
    });
});

views.get('/profile', userLogged, async (req, res) => {
    res.render('profile', {
        user: req.session.user,
        style: 'styles.css',
        title: 'Your profile',
    });
});

views.get('/current', userLogged, async (req, res) => {
    res.render('current', {
        user: req.session.user,
        role: req.user.role,
        name: req.user.name,
        email: req.user.email,
        style: 'styles.css',
        title: 'Current user!',
    });
});

views.get('/logout', async (req, res) => {
    req.session.destroy(error => {
        if (!error) res.render('login', {
            style: 'styles.css',
            title: 'Welcome!',
        });
        else res.send({ status: 'Logout ERROR', body: error });
    })
});

views.get('/resetpassword', async (req, res) => {
    res.render('resetPassword');
});

views.get('/resetpassword/:token', async (req, res) => {
    const { token } = req.params;

    if (req.session.resetPassword && req.session.resetPassword.token === token && req.session.resetPassword.expires > Date.now()) {
        res.render('resetPassword');
    } else {
        res.render('linkExpired');
    }
});

views.get('/realtimeproducts', userLogged, async (req, res) => {
    res.render('realTimeProducts', {
        style: 'index.css',
        title: 'Real Time Products',
    })
});

views.get('/chat', userOnly, (req, res) => {
    res.render('chat', {
        style: 'index.css',
        title: 'Community Chat'
    })
});

/* TO-DO Ruta para mostrar todos los tickets asociados a un usuario */
// views.get('/tickets', userLogged, async (req, res) => {
//     try {
//         const { userId } = req.session.user;
//         const tickets = await ticketsDao.getTicketsByUserId(userId);
//         res.render('tickets', {
//             status: 'success',
//             user: req.session.user,
//             cart: req.user.cart,
//             tickets: tickets,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({ status: 'error', result: 'An error ocurred while rendering the tickets view.'})
//     }
// });
/* TO-DO Ruta para mostrar todos los tickets asociados a un usuario */

views.get('/purchase/:ticketId', userLogged, async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticketInfo = await ticketsDao.getTicketById(ticketId);

        res.render('purchase', {
            status: 'success',
            user: req.session.user,
            cart: req.user.cart,
            order: ticketInfo.code,
            date: ticketInfo.purchase_datetime,
            total: ticketInfo.total,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send({ status: 'error', result: 'An error ocurred while rendering the purchase view.' })
    }
});

views.get('/admin', fetchUsers, adminOnly, (req, res) => {
    res.render('admin', {
        style: 'styles.css',
        title: 'Users👥',
        users: req.users,
    });
})

export default views;