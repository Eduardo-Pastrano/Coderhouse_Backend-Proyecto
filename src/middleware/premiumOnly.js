export const premiumOnly = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'premium') {
        return res.status(403).send({ error: 'This action is only allowed to be done by premium users. '});
    }
    next();
};