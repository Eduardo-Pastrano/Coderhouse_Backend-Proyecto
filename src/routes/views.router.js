import express from 'express';
const router = express.Router();

import products from "../database/products.json" assert { type: "json" };

router.get('/', (req, res) => {
    res.render('index', {
        style: 'index.css',
        title: 'Products',
        products
    });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        style: 'index.css',
        title: 'Real Time Products',
    })
});

/* Chat comunitario */

router.get('/chatcomunitario', (req, res) => {
    res.render('chatComunitario', {})
});

/* Chat comunitario */

export default router;