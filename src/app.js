import express from 'express';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';

const app = express();
const server = app.listen(8080, () => console.log("It's alive!"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)