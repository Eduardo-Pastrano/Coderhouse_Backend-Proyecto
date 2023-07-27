import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import __dirname from './utils.js';

import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from "mongoose";

import viewsRouter from './routes/views.router.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import sessionsRouter from './routes/sessions.router.js';

const app = express();
const PORT = 8080;

const environment = async () => {
    mongoose.set('strictQuery', false)
    await mongoose.connect('mongodb+srv://epastranom:coder123456@ecommerce.ycqslwp.mongodb.net/ecommerceVzla?retryWrites=true&w=majority');
}
environment();

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://epastranom:150996@pruebacoderhouse.0kezqsj.mongodb.net/Clase-19?retryWrites=true&w=majority',
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: '3DV4RD0#P4$TR4N0',
    resave: false,
    saveUninitialized: false
}));

const httpServer = app.listen(PORT, () => console.log("It's alive!"));
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Capitalize
const hbs = handlebars.create({
    helpers: { 
        capitalize: (string) => string.charAt(0).toUpperCase() + string.slice(1)
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use('/', viewsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/api/sessions', sessionsRouter);

import { messageModel } from "./dao/models/messages.model.js"
let messages = [];

io.on('connection', async socket => {
    console.log('New client found.');

    socket.on('message', data => {
        messages.push(data);
        io.emit('messagesLogs', messages);
        messageModel.create({
            user: data.user,
            message: data.message
        });
    });

    socket.on('authenticated', data => {
        socket.broadcast.emit('newUserConnected', data);
    });
});