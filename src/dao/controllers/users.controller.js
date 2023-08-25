import passport from "passport";
import { userModel } from "../models/users.model.js";
import { createHash } from "../../utils.js";

class UsersController {
    register(req, res, next) {
        passport.authenticate('register', { failureRedirect: '/failedregister' }, (err, user, info) => {
            if (err) {
                console.error('Failed register strategy.');
                res.status(500).send(err);
            }
            if (!user) {
                return res.status(400).send(info);
            }
            req.login(user, err => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                return res.send({ status: 'Success', message: 'User registered successfully.' });
            })
        })(req, res, next);
    }

    failedRegister(req, res) {
        console.log('Failed register strategy.');
        res.send({ error: 'failed' })
    }

    login(req, res, next) {
        passport.authenticate('login', { failureRedirect: '/failedlogin' }, (err, user) => {
            if (err) {
                console.error(err);
                res.status(500).send(err);
            }
            if (!user) {
                return res.status(400).send({ status: 'Error', Error: 'Invalid email and/or password.' });
            }
            req.login(user, err => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                req.session.user = {
                    name: `${req.user.first_name} ${req.user.last_name}`,
                    email: req.user.email,
                    age: req.user.age,
                    role: req.user.role
                }
                res.send({ status: 'Success', payload: req.session.user, message: 'User logged in successfully.' });
            })
        })(req, res, next);
    }

    failedLogin(req, res) {
        res.send({ 
            status: 'Error', 
            Error: 'Failed login strategy.' 
        })(req, res);
    }

    github(req, res) {
        passport.authenticate('github', { 
            scope: ['user: email'] }, () => { 
            })(req, res);
    }

    githubCallback(req, res) {
        passport.authenticate('github', { failureRedirect: '/login' }, (err, user) => {
            if (err) {
                console.error(err);
                res.status(500).send(err);
            }
            if (!user) {
                return res.status(400).send({ status: 'Error', Error: 'Failed GitHub authentication.' });
            }
            req.login(user, err => {
                if (err) {
                    console.error(err);
                    res.status(500).send(err);
                }
                req.session.user = {
                    name: `${req.user.first_name} ${req.user.last_name}`,
                    email: req.user.email,
                    age: req.user.age,
                    role: 'user'
                };
                res.redirect('/');
            })
        })(req, res);
    }

    async resetPassword(req, res) {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send({ status: 'Error', Error: 'Incomplete values.' });
        const user = await userModel.findOne({ email });

        if (!user) return res.status({ status: 'Error', Error: 'User not found' });
        const newPassword = createHash(password);
        await userModel.updateOne({ _id: user._id }, { $set: { password: newPassword } });
        res.send({ status: 'Success', payload: user, message: 'Password restored successfully.' })
    }

    currentUser(req, res) {
        if (req.isAuthenticated()) {
            res.json(req.user);
        } else {
            res.status(401).json({ error: 'There is no user authenticated.' });
        }
    }
}

export default new UsersController();