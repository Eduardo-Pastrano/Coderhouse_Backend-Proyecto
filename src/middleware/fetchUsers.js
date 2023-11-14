import UserDao from "../dao/mongo/users.dao.js";

export async function fetchUsers(req, res, next) {
    try {
        let users = await UserDao.getUsers();

        let userData = users.map(user => ({
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role,
        }));

        req.users = userData;
        next();
    } catch (error) {
        next('Users not found');
    }
}