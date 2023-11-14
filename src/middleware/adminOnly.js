export const adminOnly = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send({ error: "Sorry but you don't have enough permissions to access this page, you have to be an admin to gain access."});
    }
    next();
};