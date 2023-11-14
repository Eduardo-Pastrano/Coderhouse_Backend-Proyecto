import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import config from './config.js';
import UserDao from "../dao/mongo/users.dao.js";
import { cartModel } from "../dao/models/carts.model.js";
import { createHash, isValidPassword } from "../utils.js";
import { logger } from "../utils/logger.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, userPassword, done) => {
            try {
                let user = await UserDao.getUserByEmail(username);
                if (user) {
                    logger.warning('User already exists.')
                    return done(null, false, { message: 'User already exits.' });
                }
                const { first_name, last_name, email, age } = req.body;

                const newCart = await cartModel.create({ products: [] });

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(userPassword),
                    cart: newCart._id,
                    role: 'user',
                    documents: {
                        name: '',
                        references: ''
                    },
                    last_connection: new Date(),
                }

                let result = await UserDao.createUser(newUser);
                return done(null, result);
            } catch (error) {
                return done('There was an error trying to get the user: ' + error);
            }
        }
    ));

    passport.use('github', new GitHubStrategy({
        clientID: config.github_client_id,
        clientSecret: config.github_client_secret,
        callbackURL: config.github_callback_url,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserDao.getUserByEmail(profile._json.email);
            const newCart = await cartModel.create({ products: [] });
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    age: '',
                    password: '',
                    cart: newCart._id,
                    role: 'user',
                    documents: {
                        name: '',
                        references: '',
                    },
                    last_connection: new Date(),
                }
                let result = await UserDao.createUser(newUser);
                return done(null, result);
            } else {
                return done(null, user);
            }
        } catch (error) {
            return done('There was an error trying to get the user: ' + error);
        }
    }))

    passport.use('login', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        try {
            const user = await UserDao.getUserByEmail(username)
            if (!user) {
                logger.warning("User doesn't exist.");
                return done(null, false);
            }
            if (!isValidPassword(user, password)) {
                logger.warning("Invalid email and/or password.");
                user.role = role;
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserDao.getUserById(id);
        done(null, user);
    });
}

export default initializePassport;