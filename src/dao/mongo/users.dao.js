import { userModel } from "../models/users.model.js";
import MailController from "../../controllers/mail.controller.js";

class UserDao {
    async createUser(user) {
        try {
            const newUser = await userModel.create(user);
            return newUser;
        } catch (error) {
            throw new Error('There was an unexpected error while trying to create the user: ' + error);
        }
    }

    async getUsers() {
        let users = await userModel.find();
        return users
    }

    async getUserByEmail(email) {
        try {
            const user = await userModel.findOne({ email });
            return user;
        } catch (error) {
            throw new Error('There was an unexpected error while trying to get the user by email: ' + error);
        }
    }

    async updateUser(id, update) {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(id, update, { new: true });
            return updatedUser;
        } catch (error) {
            throw new Error('There was an unexpected error while trying to update the user: ' + error);
        }
    }

    async getUserById(id) {
        try {
            const user = await userModel.findById(id);
            return user;
        } catch (error) {
            throw new Error('There was an unexpected error while trying to get the user by id: ' + error);
        }
    }

    async deleteUser(email) {
        await userModel.deleteOne({ email });
    }

    async deleteInactiveUsers() {
        const awayTime = 2;
        const date = new Date();
        date.setDate(date.getDate() - awayTime);

        const usersToDelete = await userModel.find({
            last_connection: { $lt: date },
            role: { $ne: 'admin' }
        });

        for (let user of usersToDelete) {
            const subject = 'Your account has been deleted';
            const html = `
                        <div> <h1>Your account has been delete</h1> </div>
                        <div> <h2>We apologize, but your account has been deleted due to inactivity.</h2> </div>
                        `;
            await MailController.sendMail(user.email, subject, html);
        }

        await userModel.deleteMany({
            last_connection: { $lt: date },
            role: { $ne: 'admin' }
        });
    }
}

export default new UserDao();