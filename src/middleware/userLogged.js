export const userLogged = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        req.user = req.session.user;
        next();
    }
};