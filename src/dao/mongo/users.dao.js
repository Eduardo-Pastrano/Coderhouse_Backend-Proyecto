import { userModel } from "../models/users.model.js";
import { logger } from "../../utils/logger.js";

class UserDao {
    async createUser(user) {
        try {
            const newUser = await userModel.create(user);
            return newUser;
        } catch (error) {
            throw new Error('There was an unexpected error while trying to create the user: ' + error);
        }
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
}

export default new UserDao();