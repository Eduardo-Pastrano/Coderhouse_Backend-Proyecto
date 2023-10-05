export const allUsers = (req, res, next) => {
    const user = req.session.user;
    if (!user || (user.role !== 'user' && user.role !== 'premium' && user.role !== 'admin')) {
        return res.status(403).send({ error: 'This action can only be done by registered users. '});
    }
    next();
};