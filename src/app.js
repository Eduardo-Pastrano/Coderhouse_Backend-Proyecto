import express from 'express';
import __dirname from './utils.js';

import viewsRouter from './routes/views.router.js';
import handlebars from 'express-handlebars'; 
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import { Server } from 'socket.io';

import mongoose, { mongo } from "mongoose";

import products from "./database/products.json" assert { type: "json" };

const app = express();
const PORT = 8080;

mongoose.set('strictQuery', false)
const mongoConnect = mongoose.connect('mongodb+srv://epastranom:coder123456@ecommerce.ycqslwp.mongodb.net/?retryWrites=true&w=majority')

const httpServer = app.listen(PORT, () => console.log("It's alive!"));
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'));

app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)
app.use('/', viewsRouter);

io.on('connection', socket => {
    console.log('New client found.');

    socket.emit('products', products);
});