import passport from "passport";
import UserDao from "../dao/mongo/users.dao.js";
import UserDto from "../dao/dto/users.dto.js";
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

    failedRegister(req, res) {
        logger.fatal('Failed register strategy.');
        res.send({ error: 'failed' })
    }

    login(req, res, next) {
        passport.authenticate('login', { failureRedirect: '/failedlogin' }, (err, user) => {
            if (err) {
                logger.fatal(err);
                res.status(500).send(err);
            }
            if (!user) {
                return res.status(400).send({ status: 'Error', message: 'Invalid email and/or password.' });
            }
            req.login(user, err => {
                if (err) {
                    logger.error(err);
                    return res.status(500).send(err);
                }
                req.session.user = {
                    name: `${req.user.first_name} ${req.user.last_name}`,
                    email: req.user.email,
                    age: req.user.age,
                    role: req.user.role,
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
            scope: ['user: email']
        }, () => {
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
                    role: 'user'
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

            req.login(user, error => {
                if (error) {
                    logger.error(error);
                    res.status(500).send(error);
                }
                res.json({ message: `User role has been updated to: ${newRole}.` });
            });
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

    async autoToggle(req, res) {
        try {
            if (!req.isAuthenticated()) {
                return res.status(401).send({ message: 'You must be logged in to perform this action.' });
            }

            const userId = req.user._id;
            const user = await UserDao.getUserById(userId);

            if (!user) {
                return res.status(404).send({ message: 'User not found' })
            }

            const newRole = user.role == 'user' ? 'premium' : 'user';
            await UserDao.updateUser(userId, { role: newRole });

            req.login(user, error => {
                if (error) {
                    logger.error(error);
                    res.status(500).send(error);
                }
                res.json({ message: `User role updated to: ${newRole}. Was completed successfully.` });
            });
        } catch (error) {
            logger.error(error);
            res.status(500).send({ status: 'Error', message: error.message });
        }
    }
}

export default new UsersController();