import passport from "passport";
import UserDao from "../dao/mongo/users.dao.js";
import UserDto from "../dao/dto/users.dto.js";
import MailController from './mail.controller.js';
import crypto from 'crypto';
import { createHash } from "../utils.js";
import { logger } from "../utils/logger.js";
import { isValidPassword } from "../utils.js";
import path from 'path';
import __dirname from "../utils.js";

class UsersController {
    register(req, res, next) {
        passport.authenticate('register', { failureRedirect: '/failedregister' }, (err, user, info) => {
            if (err) {
                logger.fatal('Failed register strategy.');
                res.status(500).send(err);
            }
            if (!user) {
                return res.status(400).send(info);
            }
            req.login(user, err => {
                if (err) {
                    logger.error(err);
                    return res.status(500).send(err);
                }
                return res.send({ status: 'Success', message: 'User registered successfully.' });
            })
        })(req, res, next);
    }

    async getUsers(req, res) {
        try {
            let users = await UserDao.getUsers();

            let userData = users.map(user => ({
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                role: user.role,
            }));

            res.status(200).send({ status: 'Ok', payload: userData });
        } catch (error) {
            res.status(404).send({ status: 'error', error: 'Users not found.' });
        }
    }

    failedRegister(req, res) {
        logger.fatal('Failed register strategy.');
        res.send({ error: 'failed' })
    }

    login(req, res, next) {
        passport.authenticate('login', { failureRedirect: '/failedlogin' }, async (err, user) => {
            try {
                if (err) {
                    logger.fatal(err);
                    throw err;
                }
                if (!user) {
                    return res.status(400).send({ status: 'Error', message: 'Invalid email and/or password.' });
                }

                user.last_connection = new Date();
                await user.save();

                req.login(user, async (err) => {
                    try {
                        if (err) {
                            logger.error(err);
                            throw err;
                        }

                        req.session.user = {
                            name: `${req.user.first_name} ${req.user.last_name}`,
                            email: req.user.email,
                            age: req.user.age,
                            role: req.user.role,
                            cart: req.user.cart._id,
                            id: req.user._id,
                        }

                        res.send({ status: 'Success', payload: req.session.user, message: 'User logged in successfully.' });
                    } catch (error) {
                        logger.error(error);
                        res.status(500).send(error);
                    }
                });
            } catch (error) {
                logger.error(error);
                res.status(500).send(error);
            }
        })(req, res, next);
    }

    failedLogin(req, res) {
        res.send({
            status: 'Error',
            Error: 'Failed login strategy.'
        });
    }

    github(req, res) {
        passport.authenticate('github', {
            scope: ['user: email']
        })(req, res);
    }

    githubCallback(req, res) {
        passport.authenticate('github', { failureRedirect: '/login' }, (err, user) => {
            if (err) {
                logger.fatal(err);
                res.status(500).send(err);
            }
            if (!user) {
                return res.status(400).send({ status: 'Error', message: 'Failed GitHub authentication.' });
            }
            req.login(user, err => {
                if (err) {
                    logger.error(err);
                    res.status(500).send(err);
                }
                req.session.user = {
                    name: `${req.user.first_name} ${req.user.last_name}`,
                    email: req.user.email,
                    age: req.user.age,
                    role: 'user',
                    cart: req.user.cart,
                    id: req.user._id,
                };
                res.redirect('/');
            })
        })(req, res);
    }

    async resetPassword(req, res) {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send({ status: 'Error', message: 'Incomplete values.' });

        try {
            const user = await UserDao.getUserByEmail(email);
            if (!user) return res.status(404).send({ status: 'Error', message: 'User not found' });

            const newPassword = createHash(password);
            if (isValidPassword(user, password)) {
                return res.status(400).send({ status: 'Error', message: 'New password must be different from the old password.' });
            }

            await UserDao.updateUser(user._id, { password: newPassword });
            res.status(200).send({ status: 'Success', message: 'Password has been reset successfully.', redirectTo: '/login' });
        } catch (error) {
            logger.error(error);
            res.status(500).send({ status: 'Error', message: error.message });
        }
    }

    async sendLink(req, res) {
        try {
            const { email } = req.body;
            const user = await UserDao.getUserByEmail(email);
            if (!user) return res.status(404).send({ status: 'Error', message: 'User not found' });

            const token = crypto.randomBytes(20).toString('hex');

            req.session.resetPassword = {
                token: token,
                expires: Date.now() + 1200000
            };

            const link = `http://localhost:8080/resetpassword/${token}`;

            const subject = 'Password reset link';
            const html = `
            <div> <h1>Forgot your password?</h1> </div>
            <div> <h2>CLick or copy the following link:</h2> </div>
            <div> <p>${link}</p> </div>
            `;
            await MailController.sendMail(email, subject, html);
            res.render('checkEmail');
        } catch (error) {
            res.status(500).send({ status: 'Error', message: 'Internal server error.', details: error });
        }
    }

    currentUser(req, res) {
        if (req.isAuthenticated()) {
            const userDto = new UserDto(req.user);
            res.json(userDto)
        } else {
            res.status(401).json({ message: 'There is no user authenticated.' });
        }
    }

    async toggleRole(req, res) {
        try {
            const userId = req.params.userId;
            const user = await UserDao.getUserById(userId);

            if (!user) {
                return res.status(404).send({ message: 'User not found.' });
            }

            const hasId = user.documents.some(doc => doc.name.includes('identification'));
            const hasAddress = user.documents.some(doc => doc.name.includes('address'));
            const hasBankStatement = user.documents.some(doc => doc.name.includes('bank-statement'));

            const hasAllDocuments = hasId && hasAddress && hasBankStatement;

            if (!hasAllDocuments) {
                return res.status(400).send({ message: "Unable to complete the verification process. Please upload all the required documents." })
            }

            const newRole = user.role == 'user' ? 'premium' : 'user';
            await UserDao.updateUser(userId, { role: newRole });

            res.json({ message: `User role has been updated to: ${newRole}.`, newRole: newRole });

        } catch (error) {
            logger.error(error);
            res.status(500).send({ status: 'Error', message: error.message });
        }
    }

    async fileUpload(req, res) {
        try {
            const userId = req.params.userId;
            const user = await UserDao.getUserById(userId);

            if (!user) {
                return res.status(404).send({ message: 'User not found.' });
            }

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send({ message: "No file(s) provided" })
            }

            const documents = user.documents || [];
            const uploadPath = path.join(__dirname, 'public', 'uploads');

            for (const fileKey in req.files) {
                const file = req.files[fileKey][0];
                const filePath = path.join(uploadPath, file.fieldname, file.originalname);

                const document = {
                    name: file.originalname,
                    reference: filePath
                };

                documents.push(document);
            }

            await UserDao.updateUser(userId, { documents });

            res.status(200).send({ message: 'File(s) uploaded successfully.' })
        } catch (error) {
            logger.error(error);
            res.status(500).send({ status: 'Error', message: error.message });
        }
    }

    async verifyDocs(req, res, next) {
        try {
            const userId = req.params.userId;
            const user = await UserDao.getUserById(userId);
            if (!user) {
                return res.status(404).send({ message: 'User not found.' });
            }

            const hasId = user.documents.some(doc => doc.name.includes('identification'));
            const hasAddress = user.documents.some(doc => doc.name.includes('address'));
            const hasBankStatement = user.documents.some(doc => doc.name.includes('bank-statement'));

            const hasAllDocuments = hasId && hasAddress && hasBankStatement;

            if (!hasAllDocuments) {
                return res.status(400).send({ message: "Unable to complete the verification process. Please upload all the required documents." })
            }

            next();
        } catch (error) {
            logger.error(error);
            res.status(500).send({ status: 'Error', message: error.message });
        }
    }

    /* To-do */
    // async autoToggle(req, res) {
    //     try {
    //         if (!req.isAuthenticated()) {
    //             return res.status(401).send({ message: 'You must be logged in to perform this action.' });
    //         }

    //         const userId = req.user._id;
    //         const user = await UserDao.getUserById(userId);

    //         if (!user) {
    //             return res.status(404).send({ message: 'User not found' })
    //         }

    //         const newRole = user.role == 'user' ? 'premium' : 'user';
    //         await UserDao.updateUser(userId, { role: newRole });

    //         req.login(user, error => {
    //             if (error) {
    //                 logger.error(error);
    //                 res.status(500).send(error);
    //             }
    //             res.json({ message: `User role updated to: ${newRole}. Was completed successfully.` });
    //         });
    //     } catch (error) {
    //         logger.error(error);
    //         res.status(500).send({ status: 'Error', message: error.message });
    //     }
    // }
    /* To-do */

    async deleteUser(req, res) {
        try {
            const { userEmail } = req.params;
            const user = await UserDao.getUserByEmail(userEmail);

            if (user && user.role === 'admin') {
                return res.status(400).send({ status: 'error', error: 'Admin users cannot be deleted.' });
            } else if (!user) {
                return res.status(404).send({ status: 'error', error: 'User not found.' });
            }

            await UserDao.deleteUser(userEmail);
            res.status(200).send({ status: 'Success', payload: `User with email: ${userEmail}, has been deleted succesfully.` });
        } catch (error) {
            res.status(400).send({ status: 'error', error: `An error occurred while deleting the user with email: ${userEmail}.`, details: error.message })
        }
    }

    async deleteInactiveUsers(req, res) {
        try {
            await UserDao.deleteInactiveUsers();
            res.status(200).send({ status: 'Ok', message: 'Inactive users have been deleted.' });
        } catch (error) {
            res.status(500).send({ status: 'error', error: 'An error occurred while deleting inactive users:', error })
        }
    }
}

export default new UsersController();