export const userOnly = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'user') {
        return res.status(403).send({ error: 'This action can only be done by users. '});
    }
    next();
}