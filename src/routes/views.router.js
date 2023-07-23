import { Router } from "express";
import { productModel } from "../dao/models/products.model.js";

const router = Router();

router.get('/', async (req, res) => {
    let { page, sort, category, limit } = req.query;
    let sortDirection;

    if (!page) {
        page = 1
    };

    if (!limit) {
        limit = 10
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
    res.status(200).render('index', {
        status: 'success',
        payload: products,
        page: page,
        limit,
        category,
        sort,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        style: 'index.css',
        title: 'Products🛒'
    });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        style: 'index.css',
        title: 'Real Time Products',
    })
});

router.get('/chat', (req, res) => {
    res.render('chat', {
        style: 'index.css',
        title: 'Community Chat'
    })
});

export default router;
