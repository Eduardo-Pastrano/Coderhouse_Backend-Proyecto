import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import config from './config.js';
import { userModel } from '../dao/models/users.model.js';
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, userPassword, done) => {
            try {
                let user = await userModel.findOne({ email: username });
                if (user) {
                    console.log('User already exists.')
                    return done(null, false, { message: 'User already exits.' });
                }
                const { first_name, last_name, email, age } = req.body;
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(userPassword),
                    cart: null,
                    role: 'user'
                }
                let result = await userModel.create(newUser);
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
            let user = await userModel.findOne({ email: profile._json.email });
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    age: 26,
                    password: '',
                    cart: null,
                    role: 'user'
                }
                let result = await userModel.create(newUser);
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
            let role = 'user';
            if (username === `${config.admin_email}` && password === `${config.admin_password}`) {
                role = 'admin'
            }
            const user = await userModel.findOne({ email: username })
            if (!user) {
                console.log("User doesn't exist.")
                return done(null, false);
            }
            if (!isValidPassword(user, password)) return done(null, false);
            user.role = role;
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });
}

export default initializePassport;