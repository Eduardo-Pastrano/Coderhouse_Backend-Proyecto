export const normalAndPremium = (req, res, next) => {
    const user = req.session.user;
    if (!user || (user.role !== 'user' && user.role !== 'premium')) {
        return res.status(403).send({ error: 'This action can only be done by normal users or premium users. '});
    }
    next();
};