export const adminOnly = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send({ error: 'This action is only allowed to be done by admins. '});
    }
    next();
}