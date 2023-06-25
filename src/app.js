import express from 'express';
import handlebars from 'express-handlebars'; 
import __dirname from './utils.js'
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';

import products from "./database/products.json" assert { type: "json" };

const app = express();
const httpServer = app.listen(8080, () => console.log("It's alive!"));
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

    /* Chat comunitario */
    socket.on('message', data => {
        messages.push(data);
        io.emit('messageLogs', messages)
    })

    socket.on('authenticated', data => {
        socket.broadcast.emit('newUserConnected', data);
    })
    /* Chat comunitario */
});