import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from "passport";
import config from './config/config.js';

import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from "mongoose";

import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import sessionsRouter from './routes/sessions.router.js';
import initializePassport from './config/passport.config.js';

const app = express();

// Capitalize
const hbs = handlebars.create({
    helpers: { 
        capitalize: (string) => string.charAt(0).toUpperCase() + string.slice(1)
    }
});
// Capitalize

const environment = async () => {
    mongoose.set('strictQuery', false)
    await mongoose.connect(`mongodb+srv://${config.mongo_user}:${config.mongo_pass}@ecommerce.ycqslwp.mongodb.net/${config.db_name}?retryWrites=true&w=majority`);
}
environment();
initializePassport();

app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${config.mongo_user}:${config.mongo_pass}@ecommerce.ycqslwp.mongodb.net/${config.db_name}?retryWrites=true&w=majority`,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: config.secret_key,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const httpServer = app.listen(8080, () => console.log("It's alive!"));
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

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

